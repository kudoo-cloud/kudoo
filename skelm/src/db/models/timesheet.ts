import get from "lodash/get";
import Prisma from "src/db/prisma";
import { COMPANY_MEMBER_ROLE } from "src/helpers/constants";

class Timesheet {
  public get = async (id, ctx, info?) => {
    const companyId = get(ctx, "auth.companyId");
    const userId = get(ctx, "auth.user.id");
    if (!companyId) {
      return null;
    }
    const query = {
      id,
      isDeleted: false,
      company: {
        id: companyId,
      },
      user: undefined,
    };
    if (get(ctx, "auth.role") === COMPANY_MEMBER_ROLE.USER) {
      query.user = {
        id: userId,
      };
    }
    const timesheets = await Prisma.query.timeSheets(
      {
        where: query,
      },
      info,
    );
    return get(timesheets, `0`);
  };
}

export default new Timesheet();
