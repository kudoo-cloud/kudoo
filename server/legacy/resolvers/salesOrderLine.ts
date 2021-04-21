import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import salesOrderLine from "src/db/models/salesOrderLine";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    salesOrderLine: async (_, { where }, ctx, info) => {
      return await salesOrderLine.get(where.id, ctx, info);
    },
    salesOrderLines: async (_, args, ctx, info) => {
      const salesOrderLines = await ctx.db.query.salesOrderLinesConnection(
        {
          where: {
            ...args.where,
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
      return salesOrderLines;
    },
  },
  Mutation: {
    createSalesOrderLine: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createSalesOrderLine(
        {
          data: {
            salesOrder: data.salesOrder,
            inventory: data.inventory,
            qty: data.qty,
            isArchived: false,
          },
        },
        info,
      );
      return res;
    },
    updateSalesOrderLine: async (_, { where, data }, ctx, info) => {
      const salesOrderLineObj = await salesOrderLine.get(where.id, ctx, info);
      if (salesOrderLineObj) {
        return await ctx.db.mutation.updateSalesOrderLine(
          {
            data: {
              salesOrder: data.salesOrder,
              inventory: data.inventory,
              qty: data.qty,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("salesOrderLine"));
      }
    },
    deleteSalesOrderLine: async (_, { where }, ctx, info) => {
      const salesOrderLineObj = await salesOrderLine.get(where.id, ctx, info);
      if (salesOrderLineObj) {
        return await ctx.db.mutation.updateSalesOrderLine(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("salesOrderLine"));
      }
    },
  },
};
