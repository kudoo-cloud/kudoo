import get from "lodash/get";
import Prisma from "src/db/prisma";

class SalesOrder {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const salesOrders = await Prisma.query.salesOrders(
      {
        where: {
          id,
          isDeleted: false,
          company: {
            id: companyId,
          },
        },
      },
      info,
    );
    return salesOrders[0];
  };
}

export default new SalesOrder();
