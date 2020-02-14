import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import healthcareProvider from "src/db/models/healthcareProvider";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    healthcareProvider: async (_, { where }, ctx, info) => {
      return await healthcareProvider.get(where.id, ctx, info);
    },
    healthcareProviders: async (_, args, ctx, info) => {
      const healthcareProviders = await ctx.db.query.healthcareProvidersConnection(
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
      return healthcareProviders;
    },
  },
  Mutation: {
    createHealthcareProvider: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createHealthcareProvider(
        {
          data: {
            occupation: data.occupation,
            hpii: data.hpii,
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            emailAddress: data.emailAddress,
            gender: data.gender,
            address: data.address,
            ahpraNumber: data.ahpraNumber,
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
    updateHealthcareProvider: async (_, { where, data }, ctx, info) => {
      const obj = await healthcareProvider.get(where.id, ctx, info);
      if (obj) {
        let res = await ctx.db.mutation.updateHealthcareProvider(
          {
            data: {
                occupation: data.occupation,
                hpii: data.hpii,
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth,
                emailAddress: data.emailAddress,
                gender: data.gender,
                address: data.address,
                ahpraNumber: data.ahpraNumber,
                isArchived: data.isArchived,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
        return res;
      }  
      else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Healthcare Provider"));
      }
    },
    deleteHealthcareProvider: async (_, { where }, ctx, info) => {
      const obj = await healthcareProvider.get(where.id, ctx, info);
      if (obj) {
        return await ctx.db.mutation.updateHealthcareProvider(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Healthcare Provdider"));
      }
    },
  },
};
