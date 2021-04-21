import { Mail } from "@kudoo/email";
import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import attachment from "src/db/models/attachment";
import purchaseOrder from "src/db/models/purchaseOrder";
import { ERRORS, S3_ATTACHMENT } from "src/helpers/constants";

let poNumber = 0;

purchaseOrder.getLength().then((data) => {
  poNumber = data;
});

const uploadPreview = async ({ preview, purchaseOrderObj, companyId, ctx }) => {
  const extraData: any = {};
  // check for pdf preview
  if (preview) {
    // upload pdf
    const res = await attachment.upload(
      companyId,
      purchaseOrderObj.id,
      S3_ATTACHMENT.PURCHASE_ORDER_PREVIEW.type,
      preview,
      ctx,
    );
    extraData.preview = {
      connect: {
        id: res.id,
      },
    };
  }

  return extraData;
};

const modifyPreview = async ({
  preview,
  purchaseOrderObj,
  companyId,
  ctx,
  attachmentID,
}) => {
  const extraData: any = {};
  // check for pdf preview
  if (preview) {
    // upload pdf
    const res = await attachment.modifyAttachment(
      companyId,
      purchaseOrderObj.id,
      S3_ATTACHMENT.PURCHASE_ORDER_PREVIEW.type,
      preview,
      attachmentID,
      ctx,
    );
    extraData.preview = {
      connect: {
        id: res.id,
      },
    };
  }

  return extraData;
};

export default {
  Query: {
    purchaseOrder: async (_, { where }, ctx, info) => {
      return await purchaseOrder.get(where.id, ctx, info);
    },
    purchaseOrders: async (_, args, ctx, info) => {
      const purchaseOrders = await ctx.db.query.purchaseOrdersConnection(
        {
          where: {
            ...args.where,
            isDeleted: false,
            company: {
              id: get(ctx, "auth.companyId"),
            },
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
      return purchaseOrders;
    },
  },
  Mutation: {
    createPurchaseOrder: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      poNumber = poNumber + 1;
      let purchaseOrderObj = await ctx.db.mutation.createPurchaseOrder(
        {
          data: {
            pbsOrganisation: data.pbsOrganisation,
            date: data.date,
            status: data.status,
            orderer: data.orderer,
            isPbsPO: data.isPbsPO,
            poNumber,
            supplier: data.supplier,
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

      // upload attachments and preview pdf if any
      const extraData = await uploadPreview({
        preview: data.preview,
        ctx,
        companyId,
        purchaseOrderObj,
      });

      if (!isEmpty(extraData)) {
        // update purchase order if we attachments and preview pdf objects
        purchaseOrderObj = await ctx.db.mutation.updatePurchaseOrder(
          {
            data: extraData,
            where: {
              id: purchaseOrderObj.id,
            },
          },
          info,
        );
      }

      return purchaseOrderObj;
    },
    updatePurchaseOrder: async (_, { where, data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const purchaseOrderObj = await purchaseOrder.get(where.id, ctx, info);
      if (purchaseOrderObj) {
        // upload attachments and preview pdf if any
        const extraData = await modifyPreview({
          preview: data.preview,
          ctx,
          companyId,
          purchaseOrderObj,
          attachmentID: purchaseOrderObj.preview.id,
        });

        return await ctx.db.mutation.updatePurchaseOrder(
          {
            data: {
              pbsOrganisation: data.pbsOrganisation,
              date: data.date,
              status: data.status,
              orderer: data.orderer,
              isPbsPO: data.isPbsPO,
              supplier: data.supplier,
              isArchived: data.isArchived,
              preview: extraData.preview,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PurchaseOrder"));
      }
    },
    deletePurchaseOrder: async (_, { where }, ctx, info) => {
      const obj = await purchaseOrder.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updatePurchaseOrder(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PurchaseOrder"));
      }
    },
    sendPurchaseOrderMail: async (_, { data }, ctx) => {
      // Send Purchase Order
      Mail.send({
        templateName: Mail.TEMPLATES.purchase_order,
        templateData: {
          isMJML: true,
          poNumber: data.poNumber,
          name: data.name, // Supplier/organisation name
          preview: data.preview,
          companyName: data.companyName,
          user_token: get(ctx, "auth.token"),
          company_token: get(ctx, "auth.company.id"),
          type: "purchase_order",
          ...data.opts,
        },
        to: data.to,
        bcc: data.bcc || [],
        cc: data.cc || [],
      });
      return { success: true };
    },
  },
};
