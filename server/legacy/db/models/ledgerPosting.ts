import Prisma from 'src/db/prisma';
import get from 'lodash/get';

class LedgerPosting {
  public get = async (id, ctx, info?) => {
    const ledgerPostings = await Prisma.query.ledgerPostings(
      {
        where: {
          id,
          isDeleted: false,
        },
      },
      info
    );
    return ledgerPostings[0];
  };

  public create = async (data, companyId) => {
    return await Prisma.mutation.createLedgerPosting({
      data: {
        ...data,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  };
}

export default new LedgerPosting();
