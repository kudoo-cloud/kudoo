import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import ledgerTransaction from "src/db/models/ledgerTransaction";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    ledgerTransaction: async (_, { where }, ctx, info) => {
      return await ledgerTransaction.get(where.id, ctx, info);
    },
    ledgerTransactions: async (_, args, ctx, info) => {
      return await ctx.db.query.ledgerTransactionsConnection(
        {
          where: {
            ...args.where,
            company: { id: get(ctx, "auth.company.id") },
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
    },
  },
  Mutation: {
    createLedgerTransaction: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const res = await ctx.db.mutation.createLedgerTransaction(
        {
          data: {
            mainAccount: {
              connect: {
                id: get(data, "mainAccount.connect.id"),
              },
            },
            ledgerJournal: {
              connect: {
                id: get(data, "ledgerJournal.connect.id"),
              },
            },
            drcr: data.drcr,
            amount: data.amount,
            currency: data.currency,
            date: data.date,
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
    updateLedgerTransaction: async (_, { where, data }, ctx, info) => {
      const ledgerTransactionObj = await ledgerTransaction.get(
        where.id,
        ctx,
        info,
      );
      if (ledgerTransactionObj) {
        return await ctx.db.mutation.updateLedgerTransaction(
          {
            data: {
              mainAccount: {
                connect: {
                  id: get(data, "mainAccount.connect.id"),
                },
              },
              ledgerJournal: {
                connect: {
                  id: get(data, "ledgerJournal.connect.id"),
                },
              },
              drcr: data.drcr,
              amount: data.amount,
              currency: data.currency,
              date: data.date,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Ledger Transaction"));
      }
    },
    deleteLedgerTransaction: async (_, { id }, ctx, info) => {
      const ledgerTransactionObj = await ledgerTransaction.get(id, ctx, info);
      if (ledgerTransactionObj) {
        return await ctx.db.mutation.updateLedgerTransaction(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Ledger Transaction"));
      }
    },
  },
};
