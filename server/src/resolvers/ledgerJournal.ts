import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import ledgerJournal from "src/db/models/ledgerJournal";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    ledgerJournal: async (_, { where }, ctx, info) => {
      return await ledgerJournal.get(where.id, ctx, info);
    },
    ledgerJournals: async (_, args, ctx, info) => {
      return await ctx.db.query.ledgerJournalsConnection(
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
    createLedgerJournal: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const res = await ctx.db.mutation.createLedgerJournal(
        {
          data: {
            total: data.total,
            currency: data.currency,
            includeConsTax: data.includeConsTax,
            posted: data.posted,
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
    updateLedgerJournal: async (_, { where, data }, ctx, info) => {
      const obj = await ledgerJournal.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateLedgerJournal(
          {
            data: {
              total: data.total,
              currency: data.currency,
              includeConsTax: data.includeConsTax,
              posted: data.posted,
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Ledger Journal"));
      }
    },
    deleteLedgerJournal: async (_, { where }, ctx, info) => {
      const obj = await ledgerJournal.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateLedgerJournal(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Ledger Journal"));
      }
    },
  },
};
