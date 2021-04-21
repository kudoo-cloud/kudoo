import get from "lodash/get";
import Prisma from "src/db/prisma";

class Service {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const services = await Prisma.query.services(
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
    return services[0];
  };
}

export default new Service();
