import { ValidationError } from "apollo-server-errors";
import get from "lodash/get";
import pbsTPP from "src/db/models/pbsTPP";
import { IPgDb } from "src/db/pg";
import { ERRORS } from "src/helpers/constants";

export default {
  Query: {
    pbsTPP: async (_, { where }, ctx, info) => {
      const pgDb: IPgDb = ctx.pgDb;
      const templateQuery = `
				select
						row_to_json(row)
				from
					(
						select
							t.id,
							t."snomedCode",
							t."clinicalPreferredTerm",
							t."packSize",
							t."brandName",
							t."exManufacturerPrice",
							t.mpp_id,
							t."effectiveFrom",
							t."effectiveTo",
							o as organisation_id
						from
							pbs.tpp t
						inner join pbs.organisation o on
							o.id = t.organisation_id
						where t.id = '${where.id}'
					) row;
				`;
      const res = await pgDb.any(templateQuery);
      return get(res, "0.row_to_json", {});
    },
    pbsTPPs: async (_, args, ctx, info) => {
      const pgDb: IPgDb = ctx.pgDb;
      return pgDb.task(async (task) => {
        const templateQuery = `
				select
						row_to_json(row)
				from
					(
						select
							tpp.id,
							tpp."snomedCode",
							tpp."clinicalPreferredTerm",
							tpp."packSize",
							tpp."brandName",
							tpp."exManufacturerPrice",
							tpp.mpp_id,
							tpp."effectiveFrom",
							tpp."effectiveTo",
							o as organisation_id
						from
							pbs.tpp tpp
						inner join pbs.organisation o on
							o.id = tpp.organisation_id
						{{ conditions }}
					) row;
				`;

        let whereStr = "";
        if (args.where && args.where.brandName && args.where.organisation_id) {
          whereStr = ` tpp."brandName" ILIKE '%${
            args.where.brandName
          }%' AND o.id = '${args.where.organisation_id}'`;
        } else if (args.where && args.where.brandName) {
          whereStr = ` tpp."brandName" ILIKE '%${args.where.brandName}%' `;
        }
        const res = task.preparePaginationQuery({
          ...args,
          templateQuery,
          cursorColumn: "id",
          tableRef: "tpp",
          where: whereStr,
        });
        const count = get(res, "data.length") || 0;
        const firstRecord = get(res, "data.0.row_to_json", {});
        const lastRecord = get(res, `data.${count - 1}.row_to_json`, {});
        return {
          pageInfo: {
            hasNextPage: res.hasNextPage,
            hasPreviousPage: res.hasPreviousPage,
            startCursor: firstRecord.id,
            endCursor: lastRecord.id,
          },
          edges: get(res, "data", []).map(({ row_to_json: item }) => ({
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
    createPbsTPP: async (_, { data }, ctx, info) => {
      const companyId = get(ctx, "auth.company.id");

      const res = await ctx.db.mutation.createPbsTPP(
        {
          data: {
            snomedCode: data.snomedCode,
            clinicalPreferredTerm: data.clinicalPreferredTerm,
            packSize: data.packSize,
            brandName: data.brandName,
            exManufacturerPrice: data.exManufacturerPrice,
            pricingModel: data.pricingModel,
            mpp_id: data.mpp_id,
            organisation_id: data.organisation_id,
            effectiveFrom: data.effectiveFrom,
            effectiveTo: data.effectiveTo,
          },
        },
        info,
      );

      return res;
    },

    updatePbsTPP: async (_, { where, data }, ctx, info) => {
      const pbsTPPObj = await pbsTPP.get(where.id, ctx, info);
      if (pbsTPPObj) {
        return await ctx.db.mutation.updatePbsTPP(
          {
            data: {
              snomedCode: data.snomedCode,
              clinicalPreferredTerm: data.clinicalPreferredTerm,
              packSize: data.packSize,
              brandName: data.brandName,
              exManufacturerPrice: data.exManufacturerPrice,
              pricingModel: data.pricingModel,
              mpp_id: data.mpp_id,
              organisation_id: data.organisation_id,
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PbsTPP"));
      }
    },
    deletePbsTPP: async (_, { id }, ctx, info) => {
      const pbsTPPObj = await pbsTPP.get(id, ctx, info);
      if (pbsTPPObj) {
        return await ctx.db.mutation.updatePbsTPP(
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
        throw new ValidationError(ERRORS.NO_OBJECT_FOUND("PbsTPP"));
      }
    },
  },
};
