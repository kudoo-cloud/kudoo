import Prisma from 'src/db/prisma';

class MediCareService {
  public get = async (id, ctx, info?) => {
    const medicareServices = await Prisma.query.medicareServices(
      {
        where: {
          id,
          isDeleted: false,
        },
      },
      info
    );
    return medicareServices[0];
  };
}

export default new MediCareService();
