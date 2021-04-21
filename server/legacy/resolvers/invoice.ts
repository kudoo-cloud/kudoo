import { Mail } from "@kudoo/email";
import { ForbiddenError } from "apollo-server-errors";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import attachment from "src/db/models/attachment";
import invoice from "src/db/models/invoice";
import project from "src/db/models/project";
import service from "src/db/models/service";
import timesheet from "src/db/models/timesheet";
import { S3_ATTACHMENT } from "src/helpers/constants";

const uploadAttachmentsAndPreview = async ({
  attachments = [],
  preview,
  invoiceObj,
  companyId,
  ctx,
}) => {
  const extraData: any = {};
  const attachRes = [];
  // check for attachments
  if (attachments.length > 0) {
    // iterate through all attachments
    for (const attach of attachments) {
      // upload attachment
      const res = await attachment.upload(
        companyId,
        invoiceObj.id,
        S3_ATTACHMENT.INVOICE_ATTACHMENT.type,
        attach,
        ctx,
      );
      attachRes.push({
        id: res.id,
      });
    }
    // create structure for connect uploaded attachment
    extraData.attachments = {
      connect: attachRes,
    };
  }

  // check for pdf preview
  if (preview) {
    // upload pdf
    const res = await attachment.upload(
      companyId,
      invoiceObj.id,
      S3_ATTACHMENT.INVOICE_PREVIEW.type,
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

const validateItems = async (items, ctx) => {
  // validationPassMap is mapping of id to true/false to reduce database call in next for-loop
  const validationPassMap = {
    projects: {},
    service: {},
    timesheet: {},
  };

  for (const item of items) {
    const projectId = get(item, "project.connect.id");
    const serviceId = get(item, "service.connect.id");
    const timesheetId = get(item, "timeSheet.connect.id");

    // if user want to connect entry with project
    if (projectId) {
      // if project id is not already checked
      if (!validationPassMap.projects[projectId]) {
        const projectObj = await project.get(projectId, ctx);
        if (!projectObj) {
          throw new ForbiddenError(
            `Not allowed to create invoice item with given project: ${projectId}`,
          );
        } else {
          // if project is there , then store it in map
          validationPassMap.projects[projectId] = true;
        }
      }
    }

    // if user want to connect entry with service
    if (serviceId) {
      // if service id is not already checked
      if (!validationPassMap.service[serviceId]) {
        const serviceObj = await service.get(serviceId, ctx);
        if (!serviceObj) {
          throw new ForbiddenError(
            `Not allowed to create invoice item with given service: ${serviceId}`,
          );
        } else {
          // if service is there then store it in map
          validationPassMap.service[serviceId] = true;
        }
      }
    }

    // if user want to connect entry with timesheet
    if (timesheetId) {
      // if timesheet id is not already checked
      if (!validationPassMap.timesheet[timesheetId]) {
        const timesheetObj = await timesheet.get(timesheetId, ctx);
        if (!timesheetObj) {
          throw new ForbiddenError(
            `Not allowed to create invoice item with given timesheet: ${timesheetId}`,
          );
        } else {
          // if timesheet is there then store it in map
          validationPassMap.timesheet[timesheetId] = true;
        }
      }
    }
  }
};

export default {
  Query: {
    invoice: async (_, { where }, ctx, info) => {
      return await invoice.get(where.id, ctx, info);
    },
    invoices: async (_, args, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const invoices = ctx.db.query.invoicesConnection(
        {
          where: {
            ...args.where,
            seller: {
              id: companyId,
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
      return invoices;
    },
  },
  Mutation: {
    createInvoice: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");

      // find next invoice number
      let lastInvoice = await ctx.db.query.invoices({
        where: {
          seller: {
            id: companyId,
          },
          buyer: {
            id: get(data, "buyer.connect.id"),
          },
        },
        orderBy: "number_ASC",
        last: 1,
      });
      lastInvoice = get(lastInvoice, "0", {}) || {};
      const nextNumber = (lastInvoice.number || 0) + 1;

      const items = get(data, "items.create", []);
      await validateItems(items, ctx);

      const total = items.reduce(
        (acc, item) => acc + (item.price * item.quantity + item.tax),
        0,
      );

      let invoiceObj = await ctx.db.mutation.createInvoice(
        {
          data: {
            title: data.title,
            description: data.description,
            invoiceDate: data.invoiceDate,
            dueDate: data.dueDate,
            status: data.status,
            type: data.type,
            number: Number(nextNumber),
            buyer: data.buyer,
            items: data.items,
            total,
            seller: {
              connect: {
                id: companyId,
              },
            },
          },
        },
        info,
      );

      // upload attachments and preview pdf if any
      const extraData = await uploadAttachmentsAndPreview({
        attachments: data.attachments,
        preview: data.preview,
        ctx,
        companyId,
        invoiceObj,
      });

      if (!isEmpty(extraData)) {
        // update invoice if we attachments and preview pdf objects
        invoiceObj = await ctx.db.mutation.updateInvoice(
          {
            data: extraData,
            where: {
              id: invoiceObj.id,
            },
          },
          info,
        );
      }
      return invoiceObj;
    },
    updateInvoiceStatus: async (_, { status, id }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");

      const res = await ctx.db.mutation.updateInvoice(
        {
          where: {
            id,
          },
          data: {
            status,
          },
        },
        info,
      );
      return res;
    },
    invoiceNotify: async (_, { data }, ctx) => {
      // Send Invoice Mail
      Mail.send({
        templateName: Mail.TEMPLATES.invoice_notify,
        templateData: {
          invoiceId: data.invoiceId,
          user_token: get(ctx, "auth.token"),
          company_token: get(ctx, "auth.company.id"),
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
