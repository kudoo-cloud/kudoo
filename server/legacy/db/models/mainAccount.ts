import get from 'lodash/get';
import Prisma from 'src/db/prisma';

class MainAccount {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, 'auth.company.id');
    if (!companyId) {
      return null;
    }
    const mainAccounts = await Prisma.query.mainAccounts(
      {
        where: {
          id,
          isDeleted: false,
          company: {
            id: companyId,
          },
        },
      },
      info
    );
    return mainAccounts[0];
  };
  public create = async (data, companyId) => {
    return await Prisma.mutation.createMainAccount({
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

export default new MainAccount();
