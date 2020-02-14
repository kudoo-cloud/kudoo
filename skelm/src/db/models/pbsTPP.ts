import Prisma from "src/db/prisma";

class PbsTPP {
  public get = async (id, ctx, info?) => {
    const pbsTPPs = await Prisma.query.pbsTPPs(
      {
        where: {
          id,
          isDeleted: false,
        },
      },
      info,
    );
    return pbsTPPs[0];
  };
}

export default new PbsTPP();
