import get from "lodash/get";
import Prisma from "src/db/prisma";

class Supplier {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const suppliers = await Prisma.query.suppliers(
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
    return suppliers[0];
  };
}

export default new Supplier();
