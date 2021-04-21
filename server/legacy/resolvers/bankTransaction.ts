import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import bankTransaction from "src/db/models/bankTransaction";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    bankTransaction: async (_, { where }, ctx, info) => {
      return await bankTransaction.get(where.id, ctx, info);
    },
    bankTransactions: async (_, args, ctx, info) => {
      const bankTransactions = await ctx.db.query.bankTransactionsConnection(
        {
          where: {
            ...args.where,
            company: { id: get(ctx, "auth.companyId") },
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
      return bankTransactions;
    },
  },
  Mutation: {
    createBankTransaction: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const res = await ctx.db.mutation.createBankTransaction(
        {
          data: {
            transactionDate: data.transactionDate,
            amount: data.amount,
            description: data.description,
            company: {
              connect: {
                id: companyId,
              },
            },
          },
        },
        info,
      );
      return res;
    },
    updateBankTransaction: async (_, { where, data }, ctx, info) => {
      const bankTransactionObj = await bankTransaction.get(where.id, ctx, info);
      if (bankTransactionObj) {
        return await ctx.db.mutation.updateBankTransaction(
          {
            data: {
              transactionDate: data.transactionDate,
              amount: data.amount,
              description: data.description,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Bank Transaction"));
      }
    },
    deleteBankTransaction: async (_, { id }, ctx, info) => {
      const bankTransactionObj = await bankTransaction.get(id, ctx, info);
      if (bankTransactionObj) {
        return await ctx.db.mutation.updateBankTransaction(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Bank Transaction"));
      }
    },
  },
};
