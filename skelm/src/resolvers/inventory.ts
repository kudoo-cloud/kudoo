import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import inventory from "src/db/models/inventory";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    inventory: async (_, { where }, ctx, info) => {
      return await inventory.get(where.id, ctx, info);
    },
    inventories: async (_, args, ctx, info) => {
      const inventories = await ctx.db.query.inventoriesConnection(
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
    createInventory: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createInventory(
        {
          data: {
            name: data.name,
            inventoryModel: data.inventoryModel,
            uom: data.uom,
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
    updateInventory: async (_, { where, data }, ctx, info) => {
      const inventoryObj = await inventory.get(where.id, ctx, info);
      if (inventoryObj) {
        return await ctx.db.mutation.updateInventory(
          {
            data: {
              name: data.name,
              inventoryModel: data.inventoryModel,
              uom: data.uom,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Inventory"));
      }
    },
    deleteInventory: async (_, { where }, ctx, info) => {
      const inventoryObj = await inventory.get(where.id, ctx, info);
      if (inventoryObj) {
        return await ctx.db.mutation.updateInventory(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Inventory"));
      }
    },
  },
};
