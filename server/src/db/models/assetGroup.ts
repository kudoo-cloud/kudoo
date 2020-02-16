import get from "lodash/get";
import Prisma from "src/db/prisma";

class AssetGroup {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const assetGroups = await Prisma.query.assetGroups(
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
    return assetGroups[0];
  };
}

export default new AssetGroup();
