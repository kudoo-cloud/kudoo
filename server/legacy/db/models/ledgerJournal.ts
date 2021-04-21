import get from "lodash/get";
import Prisma from "src/db/prisma";

class LedgerJournal {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.company.id");
    if (!companyId) {
      return null;
    }

    const ledgerJournals = await Prisma.query.ledgerJournals(
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
    return ledgerJournals[0];
  };
}

export default new LedgerJournal();
