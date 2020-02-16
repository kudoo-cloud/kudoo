import get from "lodash/get";
import Prisma from "src/db/prisma";

class InventoryOnHand {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const inventoryOnHands = await Prisma.query.inventoryOnHands(
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
    return inventoryOnHands[0];
  };
}

export default new InventoryOnHand();
