import get from "lodash/get";
import Prisma from "src/db/prisma";

class Asset {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const assets = await Prisma.query.assets(
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
    return assets[0];
  };
}

export default new Asset();
