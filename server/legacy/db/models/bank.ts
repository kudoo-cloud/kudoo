import get from "lodash/get";
import Prisma from "src/db/prisma";

class Bank {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const banks = await Prisma.query.banks(
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
    return banks[0];
  };
}

export default new Bank();
