import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import supplier from "src/db/models/supplier";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    supplier: async (_, { where }, ctx, info) => {
      return await supplier.get(where.id, ctx, info);
    },
    suppliers: async (_, args, ctx, info) => {
      const suppliers = await ctx.db.query.suppliersConnection(
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
      return suppliers;
    },
  },
  Mutation: {
    createSupplier: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createSupplier(
        {
          data: {
            name: data.name,
            termsOfPayment: data.termsOfPayment,
            bankAccount: data.bankAccount,
            emailAddressForRemittance: data.emailAddressForRemittance,
            address: data.address,
            isArchived: false,
            company: {
              connect: {
                id: get(ctx, "auth.company.id"),
              },
            },
          },
        },
        info,
      );
      return res;
    },
    updateSupplier: async (_, { where, data }, ctx, info) => {
      const obj = await supplier.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateSupplier(
          {
            data: {
              name: data.name,
              termsOfPayment: data.termsOfPayment,
              bankAccount: data.bankAccount,
              emailAddressForRemittance: data.emailAddressForRemittance,
              address: data.address,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Supplier"));
      }
    },
    deleteSupplier: async (_, { where }, ctx, info) => {
      const obj = await supplier.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateSupplier(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Supplier"));
      }
    },
  },
};
