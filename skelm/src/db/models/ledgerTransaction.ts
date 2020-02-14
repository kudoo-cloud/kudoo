import get from "lodash/get";
import Prisma from "src/db/prisma";

class LedgerTransaction {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.company.id");
    if (!companyId) {
      return null;
    }

    const ledgerTransactions = await Prisma.query.ledgerTransactions(
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
    return ledgerTransactions[0];
  };
}

export default new LedgerTransaction();
