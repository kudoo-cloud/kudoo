import get from "lodash/get";
import Prisma from "src/db/prisma";

class BankTransaction {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }

    const bankTransactions = await Prisma.query.bankTransactions(
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
    return bankTransactions[0];
  };
}

export default new BankTransaction();
