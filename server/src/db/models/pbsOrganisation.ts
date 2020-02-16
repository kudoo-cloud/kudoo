import Prisma from "src/db/prisma";

class PbsOrganisation {
  public get = async (id, ctx, info?) => {
    const pbsOrganisations = await Prisma.query.pbsOrganisations(
      {
        where: {
          id,
          isDeleted: false,
        },
      },
      info,
    );
    return pbsOrganisations[0];
  };
}

export default new PbsOrganisation();
