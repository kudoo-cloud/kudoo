import get from "lodash/get";
import Prisma from "src/db/prisma";

class PurchaseOrder {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const purchaseOrders = await Prisma.query.purchaseOrders(
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
    return purchaseOrders[0];
  };
  public getLength = async () => {
    const purchaseOrders = await Prisma.query.purchaseOrders();
    return purchaseOrders.length;
  };
}

export default new PurchaseOrder();
