import get from "lodash/get";
import Prisma, { prisma, CustomerCreateInput } from "src/db/prisma";

class Customer {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const customers = await Prisma.query.customers(
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
    return customers[0];
  };

  public create = async (data: CustomerCreateInput) => {
    return await prisma.createCustomer(data);
  };
}

export default new Customer();
