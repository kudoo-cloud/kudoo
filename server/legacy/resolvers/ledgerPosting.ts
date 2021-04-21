import { ValidationError } from 'apollo-server-errors';
import get from 'lodash/get';
import ledgerPosting from 'src/db/models/ledgerPosting';
import { ERRORS } from 'src/helpers/constants';

export default {
  Query: {
    ledgerPosting: async (_, { where }, ctx, info) => {
      return await ledgerPosting.get(where.id, ctx, info);
    },

    ledgerPostings: async (_, args, ctx, info) => {
      return await ctx.db.query.ledgerPostingsConnection(
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
        info
      );
    },
  },
  Mutation: {
    createLedgerPosting: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, 'auth.company.id');
      return await ctx.db.mutation.createLedgerPosting(
        {
          data: {
            mainAccount: {
              connect: {
                id: get(data, 'mainAccount.connect.id'),
              },
            },
            postingType: data.postingType,
            isArchived: false,
            company: {
              connect: {
                id: companyId,
              },
            },
          },
        },
        info
      );
    },
    updateLedgerPosting: async (_, { where, data }, ctx, info) => {
      const ledgerPostingObj = await ledgerPosting.get(where.id, ctx, info);
      if (ledgerPostingObj) {
        return await ctx.db.mutation.updateLedgerPosting(
          {
            data: {
              mainAccount: {
                connect: {
                  id: get(data, 'mainAccount.connect.id'),
                },
              },
              postingType: data.postingType,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND('Ledger Posting'));
      }
    },
    deleteLedgerPosting: async (_, { id }, ctx, info) => {
      const ledgerPostingObj = await ledgerPosting.get(id, ctx, info);
      if (ledgerPostingObj) {
        return await ctx.db.mutation.updateLedgerPosting(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id,
            },
          },
          info
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND('Ledger Posting'));
      }
    },
  },
};
