import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import salesOrder from "src/db/models/salesOrder";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    salesOrder: async (_, { where }, ctx, info) => {
      return await salesOrder.get(where.id, ctx, info);
    },
    salesOrders: async (_, args, ctx, info) => {
      const salesOrders = await ctx.db.query.salesOrdersConnection(
        {
          where: {
            ...args.where,
            company: {
              id: get(ctx, "auth.companyId"),
            },
            isDeleted: false,
          },
          orderBy: args.orderBy,
          skip: args.skip,
          after: args.after,
          before: args.before,
          first: args.first,
          last: args.last,
        },
        info,
      );
      return salesOrders;
    },
  },
  Mutation: {
    createSalesOrder: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createSalesOrder(
        {
          data: {
            customer: data.customer,
            transactionDate: data.transactionDate,
            currency: data.currency,
            company: {
              connect: {
                id: get(ctx, "auth.company.id"),
              },
            },
            isArchived: false,
          },
        },
        info,
      );
      return res;
    },
    updateSalesOrder: async (_, { where, data }, ctx, info) => {
      const salesOrderObj = await salesOrder.get(where.id, ctx, info);
      if (salesOrderObj) {
        return await ctx.db.mutation.updateSalesOrder(
          {
            data: {
              customer: data.customer,
              transactionDate: data.transactionDate,
              currency: data.currency,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("SalesOrder"));
      }
    },
    deleteSalesOrder: async (_, { where }, ctx, info) => {
      const salesOrderObj = await salesOrder.get(where.id, ctx, info);
      if (salesOrderObj) {
        return await ctx.db.mutation.updateSalesOrder(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("SalesOrder"));
      }
    },
  },
};
