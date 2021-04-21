import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import asset from "src/db/models/asset";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    asset: async (_, { where }, ctx, info) => {
      return await asset.get(where.id, ctx, info);
    },
    assets: async (_, args, ctx, info) => {
      const assets = await ctx.db.query.assetsConnection(
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
      return assets;
    },
  },
  Mutation: {
    createAsset: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createAsset(
        {
          data: {
            name: data.name,
            dateOfAquisition: data.dateOfAquisition,
            aquisitionPrice: data.aquisitionPrice,
            netBookValue: data.netBookValue,
            depreciation: data.depreciation,
            salvageValue: data.salvageValue,
            assetGroup: data.assetGroup,
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
    updateAsset: async (_, { where, data }, ctx, info) => {
      const obj = await asset.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateAsset(
          {
            data: {
              name: data.name,
              dateOfAquisition: data.dateOfAquisition,
              aquisitionPrice: data.aquisitionPrice,
              netBookValue: data.netBookValue,
              depreciation: data.depreciation,
              salvageValue: data.salvageValue,
              assetGroup: data.assetGroup,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Asset"));
      }
    },
    deleteAsset: async (_, { where }, ctx, info) => {
      const obj = await asset.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateAsset(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Asset"));
      }
    },
  },
};
