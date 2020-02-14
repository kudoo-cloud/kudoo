import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import bank from "src/db/models/bank";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    bank: async (_, { where }, ctx, info) => {
      return await bank.get(where.id, ctx, info);
    },
    banks: async (_, args, ctx, info) => {
      const banks = await ctx.db.query.banksConnection(
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
      return banks;
    },
  },
  Mutation: {
    createBank: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createBank(
        {
          data: {
            name: data.name,
            institution: data.institution,
            bsb: data.bsb,
            accountNumber: data.accountNumber,
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
    updateBank: async (_, { where, data }, ctx, info) => {
      const obj = await bank.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateBank(
          {
            data: {
              name: data.name,
              institution: data.institution,
              bsb: data.bsb,
              accountNumber: data.accountNumber, 
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Bank"));
      }
    },
    deleteBank: async (_, { where }, ctx, info) => {
      const obj = await bank.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateBank(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Bank"));
      }
    },
  },
};
