import { ValidationError } from 'apollo-server-errors';
import medicareService from 'src/db/models/medicareService';
import { ERRORS } from 'src/helpers/constants';

export default {
  Query: {
    medicareService: async (_, { where }, ctx, info) => {
      return await medicareService.get(where.id, ctx, info);
    },
    medicareServices: async (_, args, ctx, info) => {
      return await ctx.db.query.medicareServicesConnection(
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
        info
      );
    },
  },
  Mutation: {
    createMedicareService: async (_, { data }, ctx, info) => {
      return await ctx.db.mutation.createMedicareService({ data }, info);
    },
    updateMedicareService: async (_, { where, data }, ctx, info) => {
      const medicareServiceObj = await medicareService.get(where.id, ctx, info);
      if (medicareServiceObj) {
        return await ctx.db.mutation.updateMedicareService(
          {
            data,
            where: {
              id: where.id,
            },
          },
          info
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND('MediCare Service'));
      }
    },
    deleteMedicareService: async (_, { where }, ctx, info) => {
      const medicareServiceObj = await medicareService.get(where.id, ctx, info);
      if (medicareServiceObj) {
        return await ctx.db.mutation.deleteMedicareService(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id: where.id,
            },
          },
          info
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND('MediCare Service'));
      }
    },
  },
};
