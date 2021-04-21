import Prisma from "src/db/prisma";

class PoReceipt {
  public get = async (id, ctx, info?) => {
    const poReceipts = await Prisma.query.poReceipts(
      {
        where: {
          id,
          isDeleted: false,
        },
      },
      info,
    );
    return poReceipts[0];
  };
}

export default new PoReceipt();
