import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import pbsOrganisation from "src/db/models/pbsOrganisation";
import { IPgDb } from "src/db/pg";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    pbsOrganisation: async (_, { where }, ctx, info) => {
      const pgDb: IPgDb = ctx.pgDb;
      const templateQuery = `select * from pbs.organisation as org where org.id = '${
        where.id
      }'`;
      const res = await pgDb.any(templateQuery);
      return get(res, "0");
    },
    pbsOrganisations: async (_, args, ctx, info) => {
      const pgDb: IPgDb = ctx.pgDb;
      return pgDb.task(async (task) => {
        const templateQuery = `
					select
						*
					from
						pbs.organisation organisation
					{{ conditions }}
				`;

        let whereStr = "";
        if (args.where && args.where.title) {
          whereStr = ` organisation."title" ILIKE '%${args.where.title}%' `;
        }

        const res = task.preparePaginationQuery({
          ...args,
          templateQuery,
          tableRef: "organisation",
          cursorColumn: "id",
          where: whereStr,
        });
        const count = get(res, "data.length") || 0;
        const firstRecord = get(res, "data.0", {});
        const lastRecord = get(res, `data.${count - 1}`, {});
        return {
          pageInfo: {
            hasNextPage: res.hasNextPage,
            hasPreviousPage: res.hasPreviousPage,
            startCursor: firstRecord.id,
            endCursor: lastRecord.id,
          },
          edges: get(res, "data", []).map((item) => ({
            node: item,
            cursor: item.id,
          })),
          aggregate: {
            count,
          },
        };
      });
    },
  },
  Mutation: {
    createPbsOrganisation: async (_, { data }, ctx, info) => {
      const res = await ctx.db.mutation.createPbsOrganisation(
        {
          data: {
            code: data.code,
            title: data.title,
            street: data.street,
            city: data.city,
            stateAddress: data.stateAddress,
            postcode: data.postcode,
            phone: data.phone,
            effectiveFrom: data.effectiveFrom,
            effectiveTo: data.effectiveTo,
          },
        },
        info,
      );

      return res;
    },

    updatePbsOrganisation: async (_, { where, data }, ctx, info) => {
      const pbsOrganisationObj = await pbsOrganisation.get(where.id, ctx, info);
      if (pbsOrganisationObj) {
        return await ctx.db.mutation.updatePbsOrganisation(
          {
            data: {
              code: data.code,
              title: data.title,
              street: data.street,
              city: data.city,
              stateAddress: data.stateAddress,
              postcode: data.postcode,
              phone: data.phone,
              effectiveFrom: data.effectiveFrom,
              effectiveTo: data.effectiveTo,
            },
            where: {
              id: where.id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PBS Organisation"));
      }
    },
    deletePbsOrganisation: async (_, { id }, ctx, info) => {
      const pbsOrganisationObj = await pbsOrganisation.get(id, ctx, info);
      if (pbsOrganisationObj) {
        return await ctx.db.mutation.updatePbsOrganisation(
          {
            data: {
              isDeleted: true,
            },
            where: {
              id,
            },
          },
          info,
        );
      } else {
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PBS Organisation"));
      }
    },
  },
};
