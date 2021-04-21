import get from "lodash/get";
import Prisma from "src/db/prisma";

class Patient {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const patients = await Prisma.query.patients(
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
    return patients[0];
  };
}

export default new Patient();
