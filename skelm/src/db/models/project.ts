import get from "lodash/get";
import Prisma from "src/db/prisma";

class Project {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    if (!companyId) {
      return null;
    }
    const projects = await Prisma.query.projects(
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
    return projects[0];
  };
}

export default new Project();
