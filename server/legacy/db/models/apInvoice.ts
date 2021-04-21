import get from "lodash/get";
import Prisma from "src/db/prisma";

class ApInvoice {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const apInvoices = await Prisma.query.apInvoices(
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
    return apInvoices[0];
  };
}

export default new ApInvoice();
