import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import mainAccount from "src/db/models/mainAccount";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    mainAccount: async (_, { where }, ctx, info) => {
      return await mainAccount.get(where.id, ctx, info);
    },
    mainAccounts: async (_, args, ctx, info) => {
      return await ctx.db.query.mainAccountsConnection(
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
    createMainAccount: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");

      const res = await ctx.db.mutation.createMainAccount(
        {
          data: {
            code: data.code,
            name: data.name,
            type: data.type,
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

    updateMainAccount: async (_, { where, data }, ctx, info) => {
      const mainAccountObj = await mainAccount.get(where.id, ctx, info);
      if (mainAccountObj) {
        return await ctx.db.mutation.updateMainAccount(
          {
            data: {
              code: data.code,
              name: data.name,
              type: data.type,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Main Account"));
      }
    },
    deleteMainAccount: async (_, { id }, ctx, info) => {
      const mainAccountObj = await mainAccount.get(id, ctx, info);
      if (mainAccountObj) {
        return await ctx.db.mutation.updateMainAccount(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Main Account"));
      }
    },
  },
};
