import { ForbiddenError } from "apollo-server-errors";
import get from "lodash/get";
import { ERRORS } from "src/helpers/constants";

export default (ctx, objectToCheck: object, keyPath: string = "company.id") => {
  if (get(objectToCheck, keyPath) !== get(ctx, "auth.companyId")) {
    throw new ForbiddenError(ERRORS.UNAUTHORIZED);
  }
  return objectToCheck;
};
