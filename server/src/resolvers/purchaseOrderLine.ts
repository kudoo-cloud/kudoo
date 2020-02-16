import { ValidationError } from "apollo-server-errors";
import purchaseOrderLine from "src/db/models/purchaseOrderLine";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    purchaseOrderLine: async (_, { where }, ctx, info) => {
      return await purchaseOrderLine.get(where.id, ctx, info);
    },
    purchaseOrderLines: async (_, args, ctx, info) => {
      const purchaseOrderLines = await ctx.db.query.purchaseOrderLinesConnection(
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
      return purchaseOrderLines;
    },
  },
  Mutation: {
    createPurchaseOrderLine: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createPurchaseOrderLine(
        {
          data: {
            item: data.item,
            pbsDrug: data.pbsDrug,
            site: data.site,
            qty: data.qty,
            unit: data.unit,
            unitPrice: data.unitPrice,
            purchaseOrder: data.purchaseOrder,
            poReceipt: data.poReceipt,
            isArchived: false,
          },
        },
        info,
      );
      return res;
    },
    updatePurchaseOrderLine: async (_, { where, data }, ctx, info) => {
      const obj = await purchaseOrderLine.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updatePurchaseOrderLine(
          {
            data: {
              item: data.item,
              pbsDrug: data.pbsDrug,
              site: data.site,
              qty: data.qty,
              unit: data.unit,
              unitPrice: data.unitPrice,
              purchaseOrder: data.purchaseOrder,
              poReceipt: data.poReceipt,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PurchaseOrderLine"));
      }
    },
    deletePurchaseOrderLine: async (_, { where }, ctx, info) => {
      const obj = await purchaseOrderLine.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updatePurchaseOrderLine(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PurchaseOrderLine"));
      }
    },
  },
};
