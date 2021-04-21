import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import service from "src/db/models/service";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    service: async (_, { where }, ctx, info) => {
      return await service.get(where.id, ctx, info);
    },
    services: async (_, args, ctx, info) => {
      const services = await ctx.db.query.servicesConnection(
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
      return services;
    },
  },
  Mutation: {
    createService: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createService(
        {
          data: {
            billingType: data.billingType,
            includeConsTax: data.includeConsTax,
            isTemplate: data.isTemplate,
            name: data.name,
            timeBasedType: data.timeBasedType,
            totalAmount: data.totalAmount,
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
    updateService: async (_, { where, data }, ctx, info) => {
      const serviceObj = await service.get(where.id, ctx, info);
      if (serviceObj) {
        return await ctx.db.mutation.updateService(
          {
            data: {
              billingType: data.billingType,
              includeConsTax: data.includeConsTax,
              isTemplate: data.isTemplate,
              name: data.name,
              timeBasedType: data.timeBasedType,
              totalAmount: data.totalAmount,
              isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Service"));
      }
    },
    deleteService: async (_, { where }, ctx, info) => {
      const serviceObj = await service.get(where.id, ctx, info);
      if (serviceObj) {
        return await ctx.db.mutation.updateService(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Service"));
      }
    },
  },
};
