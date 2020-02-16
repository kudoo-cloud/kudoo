import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import assetGroup from "src/db/models/assetGroup";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    assetGroup: async (_, { where }, ctx, info) => {
      return await assetGroup.get(where.id, ctx, info);
    },
    assetGroups: async (_, args, ctx, info) => {
      const wareHouses = await ctx.db.query.assetGroupsConnection(
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
    createAssetGroup: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createAssetGroup(
        {
          data: {
            name: data.name,
            depreciationType: data.depreciationType,
            usefulLife: data.usefulLife,
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
    updateAssetGroup: async (_, { where, data }, ctx, info) => {
      const obj = await assetGroup.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateAssetGroup(
          {
            data: {
              name: data.name,
              depreciationType: data.depreciationType,
              usefulLife: data.usefulLife,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("AssetGroup"));
      }
    },
    deleteAssetGroup: async (_, { where }, ctx, info) => {
      const obj = await assetGroup.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateAssetGroup(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("AssetGroup"));
      }
    },
  },
};
