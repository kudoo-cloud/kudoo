import { ValidationError } from "apollo-server-errors";
import { defaultFieldResolver } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import isEmpty from "lodash/isEmpty";
import { ERRORS } from "src/helpers/constants";

class HasRolesDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const roles = this.args.roles || [];
    field.resolve = async function(...args) {
      const [, , ctx, info] = args;
      const role = ctx.auth.role;
      if (isEmpty(ctx.auth) || roles.indexOf(role) <= -1) {
        throw new ValidationError(
          ERRORS.UNAUTHORIZED + `, operation: ${info.fieldName}`,
        );
      }
      const result = await resolve.apply(this, args);
      return result;
    };
  }
}

export default HasRolesDirective;
