import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import poReceipt from "src/db/models/poReceipt";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    poReceipt: async (_, { where }, ctx, info) => {
      return await poReceipt.get(where.id, ctx, info);
    },
    poReceipts: async (_, args, ctx, info) => {
      const poReceipts = await ctx.db.query.poReceiptsConnection(
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
        info,
      );
      return poReceipts;
    },
  },
  Mutation: {
    createPoReceipt: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createPoReceipt(
        {
          data: {
            receiptNumber: data.receiptNumber,
            receiptDate: data.receiptDate,
            purchaseOrder: data.purchaseOrder,
            isArchived: false,
          },
        },
        info,
      );
      return res;
    },
    updatePoReceipt: async (_, { where, data }, ctx, info) => {
      const obj = await poReceipt.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updatePoReceipt(
          {
            data: {
              receiptNumber: data.receiptNumber,
              receiptDate: data.receiptDate,
              purchaseOrder: data.purchaseOrder,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PoReceipt"));
      }
    },
    deletePoReceipt: async (_, { where }, ctx, info) => {
      const obj = await poReceipt.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updatePoReceipt(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PoReceipt"));
      }
    },
  },
};
