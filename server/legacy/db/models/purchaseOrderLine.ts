import Prisma from "src/db/prisma";

class PurchaseOrderLine {
  public get = async (id, ctx, info?) => {
    const purchaseOrderLines = await Prisma.query.purchaseOrderLines(
      {
        where: {
          id,
          isDeleted: false,
        },
      },
      info,
    );
    return purchaseOrderLines[0];
  };
}

export default new PurchaseOrderLine();
