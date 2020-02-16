import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import apInvoice from "src/db/models/apInvoice";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    apInvoice: async (_, { where }, ctx, info) => {
      return await apInvoice.get(where.id, ctx, info);
    },
    apInvoices: async (_, args, ctx, info) => {
      const apInvoices = await ctx.db.query.apInvoicesConnection(
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
      return apInvoices;
    },
  },
  Mutation: {
    createApInvoice: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");
      const res = await ctx.db.mutation.createApInvoice(
        {
          data: {
            purchaseOrder: data.purchaseOrder,
            invoiceNumber: data.invoiceNumber,
            status: data.status,
            company: {
              connect: {
                id: companyId,
              },
            },
            isArchived: false,
          },
        },
        info,
      );
      return res;
    },
    updateApInvoice: async (_, { where, data }, ctx, info) => {
      const apInvoiceObj = await apInvoice.get(where.id, ctx, info);
      if (apInvoiceObj) {
        return await ctx.db.mutation.updateApInvoice(
          {
            data: {
              supplier: data.supplier,
              status: data.status,
              isArchived: data.isArchived,
              pbsOrganisation: data.pbsOrganisation,
              invoiceNumber: data.invoiceNumber,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("ApInvoice"));
      }
    },
    deleteApInvoice: async (_, { where }, ctx, info) => {
      const apInvoiceObj = await apInvoice.get(where.id, ctx, info);
      if (apInvoiceObj) {
        return await ctx.db.mutation.updateApInvoice(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("ApInvoice"));
      }
    },
  },
};
