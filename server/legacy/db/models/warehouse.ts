import get from "lodash/get";
import Prisma from "src/db/prisma";

class WareHouse {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const wareHouses = await Prisma.query.wareHouses(
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
    return wareHouses[0];
  };
}

export default new WareHouse();
