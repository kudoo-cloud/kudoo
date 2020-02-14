import _ from "lodash";
import compact from "lodash/compact";
import get from "lodash/get";
import pgPromise, { IDatabase } from "pg-promise";
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export interface IDbExt {
  preparePaginationQuery: (
    data: IPaginationQueryParam,
  ) => {
    data: any;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  getById: (data: IGetOneQueryParam) => string;
}

export type IPgDb = IDatabase<IDbExt> & IDbExt;

interface IPaginationQueryParam {
  templateQuery: string;
  tableRef: string;
  orderBy: string;
  after: string;
  before: string;
  first: string;
  last: string;
  cursorColumn: string;
  skip: number;
  where: string;
}

interface IGetOneQueryParam {
  schema: string;
  table: string;
  id: string;
}

const initOptions = {
  extend(obj, dc) {
    obj.getById = (data: IGetOneQueryParam) => {
      const query = `SELECT * FROM ${data.schema}.${data.table} WHERE id = '${
        data.id
      }'`;
      return obj.oneOrNone(query);
    };

    obj.preparePaginationQuery = async (data: IPaginationQueryParam) => {
      const table = `${data.tableRef}`;
      if (data.first && data.last) {
        throw new Error(
          "Including a value for both first and last is not supported. See the spec for a discussion of why https://facebook.github.io/relay/graphql/connections.htm#sec-Pagination-algorithm",
        );
      }

      // prepare where clause
      let afterClause;
      let beforeClause;
      if (data.after) {
        afterClause = `${table}."${data.cursorColumn}" > '${data.after}'`;
      }
      if (data.before) {
        beforeClause = `${table}."${data.cursorColumn}" < '${data.before}'`;
      }
      let whereClause = "";
      const afterBefore = compact([afterClause, beforeClause, data.where]);
      if (afterBefore.length > 0) {
        whereClause = " WHERE " + afterBefore.join(" AND ");
      }

      // handle offset
      let offsetClause = "";
      if (data.skip) {
        offsetClause = ` OFFSET ${data.skip} `;
      }

      // handle order by
      let orderbyClause = "";
      // this will be used when we want to handle `last`
      let reverseOrderbyClause = "";
      if (data.orderBy) {
        const columnName = data.orderBy.split("_")[0];
        const order = data.orderBy.split("_")[1];
        const reverseOrder = order.toUpperCase() === "ASC" ? "DESC" : "ASC";
        orderbyClause = ` ORDER BY "${columnName}" ${order}`;
        reverseOrderbyClause = ` ORDER BY "${columnName}" ${reverseOrder}`;
      }

      if (data.first) {
        const limit = ` LIMIT ${data.first} `;
        const compiledTemplate = _.template(data.templateQuery);
        const conditions = `${whereClause} ${orderbyClause} ${limit} ${offsetClause}`;

        // check next page limit
        const nextPageLimit = ` LIMIT 1 `;
        const nextPageConditions = `${whereClause}  ${orderbyClause} ${nextPageLimit} OFFSET ${
          data.first
        }`;

        const query = compiledTemplate({ conditions });
        const nextPageQuery = compiledTemplate({
          conditions: nextPageConditions,
        });
        const res = await obj.any(query);
        const nextPageRes = await obj.any(nextPageQuery);
        return {
          data: res,
          hasNextPage: nextPageRes.length > 0,
          hasPreviousPage: false,
        };
      } else if (data.last) {
        const limit = ` LIMIT ${data.last} `;
        const compiledTemplate = _.template(data.templateQuery);
        const conditions = `${whereClause} ${reverseOrderbyClause} ${limit} ${offsetClause}`;
        const query = compiledTemplate({ conditions });
        return `SELECT * FROM (${query}) as temp ${orderbyClause}`;
      } else {
        const compiledTemplate = _.template(data.templateQuery);
        const conditions = `${whereClause} ${orderbyClause} ${offsetClause}`;
        return compiledTemplate({ conditions });
      }
    };
  },
};

const pgpObject = pgPromise(initOptions);

const cn = {
  host: process.env.PG_HOST,
  port: 5432,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
};

const db: IPgDb = pgpObject(cn); // database instance;

export default db;
