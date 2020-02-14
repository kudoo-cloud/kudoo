import get from "lodash/get";
import Prisma from "src/db/prisma";

class HealthcareProvider {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const healthcareProviders = await Prisma.query.healthcareProviders(
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
    return healthcareProviders[0];
  };
}

export default new HealthcareProvider();
