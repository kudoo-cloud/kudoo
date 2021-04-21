import { AuthenticationError } from "apollo-server-errors";
import { verifyJWT } from "src/helpers/jwt";
import { COMPANY_MEMBER_STATUS } from "src/helpers/constants";

const USER_AUTH_HEADER = "x-user-auth";
const COMPANY_AUTH_HEADER = "x-company-auth";

export default async (resolve, root, args, context, info) => {
  const newContext = context;
  const headers = context.request.headers;
  let isLoggedIn = false;
  // This middleware gets called on all fields but
  // for now we want to get user and company info on main queries not on all fields
  // so we are checking that if root is undefined that is main parent queries then only we do check authentication
  // and that info will be passed in context in sub fields anyway
  if (typeof root === "undefined") {
    if (headers[USER_AUTH_HEADER]) {
      try {
        const token = headers[USER_AUTH_HEADER];
        const decoded: any = await verifyJWT(token);
        newContext.auth = {
          ...(newContext.auth || {}),
          token,
        };
        if (decoded.id) {
          const user = await newContext.db.query.user({
            where: {
              id: decoded.id,
            },
          });
          // if user is active
          if (user && (user.isActive || decoded.fromInvite)) {
            isLoggedIn = true;
            let company = {};
            let role = "";
            // check for company auth header
            if (headers[COMPANY_AUTH_HEADER]) {
              const companyId = headers[COMPANY_AUTH_HEADER];
              newContext.auth = {
                ...(newContext.auth || {}),
                companyId,
              };

              // get company member details for given user and give company id
              let companyMember = await newContext.db.query.companyMembers({
                where: {
                  company: {
                    id: companyId,
                  },
                  user: {
                    id: decoded.id,
                  },
                },
              });
              // get company info for given company id
              company = await newContext.db.query.company({
                where: { id: companyId },
              });
              companyMember = companyMember[0] || {};
              if (companyMember.status === COMPANY_MEMBER_STATUS.ACTIVE) {
                role = companyMember.role;
              }
            }
            newContext.auth = {
              ...(newContext.auth || {}),
              user,
              company,
              role,
              id: user.id,
            };
          }
        }
      } catch (error) {
        console.error(error);
        if (error && error.name === "TokenExpiredError") {
          throw new AuthenticationError(error.message);
        }
      }
    }
    if (!isLoggedIn) {
      newContext.auth = {};
    }
  }

  const result = await resolve(root, args, newContext, info);
  return result;
};
