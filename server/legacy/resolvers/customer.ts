import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import customer from "src/db/models/customer";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    customer: async (_, { where }, ctx, info) => {
      return await customer.get(where.id, ctx, info);
    },
    customers: async (_, args, ctx, info) => {
      const customers = await ctx.db.query.customersConnection(
        {
          where: {
            ...args.where,
            company: { id: get(ctx, "auth.company.id") }, // add logged in user company to condition
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
      return customers;
    },
  },
  Mutation: {
    createCustomer: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");

      const res = await ctx.db.mutation.createCustomer(
        {
          data: {
            description: data.description,
            govNumber: data.govNumber,
            isArchived: false,
            name: data.name,
            addresses: data.addresses,
            contacts: data.contacts,
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
    updateCustomer: async (_, { where, data }, ctx, info) => {
      const customerObj = await customer.get(where.id, ctx, info);
      if (customerObj) {
        const res = await ctx.db.mutation.updateCustomer(
          {
            data: {
              description: data.description,
              govNumber: data.govNumber,
              isArchived: data.isArchived,
              name: data.name,
              contacts: data.contacts,
              addresses: data.addresses,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
        return res;
      }
    },
    deleteCustomer: async (_, { where }, ctx, info) => {
      const customerObj = await customer.get(where.id, ctx, info);
      if (customerObj) {
        return await ctx.db.mutation.updateCustomer(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("Customer"));
      }
    },
  },
};
