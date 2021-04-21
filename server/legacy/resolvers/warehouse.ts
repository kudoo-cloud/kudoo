import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import warehouse from "src/db/models/warehouse";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    wareHouse: async (_, { where }, ctx, info) => {
      return await warehouse.get(where.id, ctx, info);
    },
    wareHouses: async (_, args, ctx, info) => {
      const wareHouses = await ctx.db.query.wareHousesConnection(
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
      return wareHouses;
    },
  },
  Mutation: {
    createWareHouse: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createWareHouse(
        {
          data: {
            name: data.name,
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
    updateWareHouse: async (_, { where, data }, ctx, info) => {
      const obj = await warehouse.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateWareHouse(
          {
            data: {
              name: data.name,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("WareHouse"));
      }
    },
    deleteWareHouse: async (_, { where }, ctx, info) => {
      const obj = await warehouse.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateWareHouse(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("WareHouse"));
      }
    },
  },
};
