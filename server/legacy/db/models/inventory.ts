import get from "lodash/get";
import Prisma from "src/db/prisma";

class Inventory {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const inventories = await Prisma.query.inventories(
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
    return inventories[0];
  };
}

export default new Inventory();
