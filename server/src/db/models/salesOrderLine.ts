import Prisma from "src/db/prisma";

class SalesOrderLine {
  public get = async (id, ctx, info?) => {
    const salesOrderLines = await Prisma.query.salesOrderLines(
      {
        where: {
          id,
          isDeleted: false,
        },
      },
      info,
    );
    return salesOrderLines[0];
  };
}

export default new SalesOrderLine();
