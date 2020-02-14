import { ValidationError } from "apollo-server-errors";
import { defaultFieldResolver } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import isEmpty from "lodash/isEmpty";
import { ERRORS } from "src/helpers/constants";

class RequiresAuth extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const [, , ctx] = args;
      if (isEmpty(ctx.auth)) {
        throw new ValidationError(ERRORS.UNAUTHORIZED);
      }
      const result = await resolve.apply(this, args);
      return result;
    };
  }
}

export default RequiresAuth;
