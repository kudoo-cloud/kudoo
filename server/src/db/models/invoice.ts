import get from "lodash/get";
import Prisma from "src/db/prisma";

class Invoice {
  public get = async (id, ctx, info) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const invoices = await Prisma.query.invoices(
      {
        where: {
          id,
          seller: {
            id: companyId,
          },
        },
      },
      info,
    );
    return invoices[0];
  };
}

export default new Invoice();
