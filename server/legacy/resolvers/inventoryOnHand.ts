import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import inventoryOnHand from "src/db/models/inventoryOnHand";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    inventoryOnHand: async (_, { where }, ctx, info) => {
      return await inventoryOnHand.get(where.id, ctx, info);
    },
    inventoryOnHands: async (_, args, ctx, info) => {
      const inventories = await ctx.db.query.inventoryOnHandsConnection(
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
      return inventories;
    },
  },
  Mutation: {
    createInventoryOnHand: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const res = await ctx.db.mutation.createInventoryOnHand(
        {
          data: {
            date: data.date,
            onHandQty: data.onHandQty,
            item: data.item,
            pbsDrug: data.pbsDrug,
            purchaseOrder: data.purchaseOrder,
            warehouse: data.warehouse,
            isArchived: false,
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
    updateInventoryOnHand: async (_, { where, data }, ctx, info) => {
      const obj = await inventoryOnHand.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateInventoryOnHand(
          {
            data: {
              date: data.date,
              onHandQty: data.onHandQty,
              item: data.item,
              pbsDrug: data.pbsDrug,
              purchaseOrder: data.purchaseOrder,
              warehouse: data.warehouse,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("InventoryOnHand"));
      }
    },
    deleteInventoryOnHand: async (_, { where }, ctx, info) => {
      const obj = await inventoryOnHand.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateInventoryOnHand(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("InventoryOnHand"));
      }
    },
  },
};
