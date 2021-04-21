import { Mail } from "@kudoo/email";
import { ForbiddenError, ValidationError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import get from "lodash/get";
import { ERRORS, SKELM_URL } from "src/helpers/constants";
import { signJWT, verifyJWT } from "src/helpers/jwt";

export default {
  Mutation: {
    register: async (
      _,
      { email, firstName, lastName, password, passwordRepeat, baseURL },
      ctx,
    ) => {
      // check user existance
      const isUserExist = await ctx.db.exists.User({
        email,
      });
      if (isUserExist) {
        throw new ValidationError(ERRORS.USER_ALREADY_EXISTS);
      }
      if (password !== passwordRepeat) {
        throw new ValidationError(ERRORS.PASSWORD_DOES_NOT_MATCH);
      }
      const encPass = await bcrypt.hash(password, 10);
      const user = await ctx.db.mutation.createUser({
        data: {
          email,
          firstName,
          lastName,
          password: encPass,
        },
      });
      // create confirm token
      const token = await signJWT({ ...user, baseURL });
      // send confirm mail
      Mail.send({
        templateName: Mail.TEMPLATES.confirm,
        templateData: {
          token_url: SKELM_URL.CONFIRM(token),
          first_name: firstName,
          last_name: lastName,
        },
        to: [email],
      });

      return {
        success: true,
      };
    },
    login: async (_, { email, password }, ctx) => {
      // check user existance
      const isUserExist = await ctx.db.exists.User({
        email,
      });
      if (!isUserExist) {
        throw new ValidationError(ERRORS.USER_DOES_NOT_EXIST);
      }
      if (isUserExist) {
        // get user
        const users = await ctx.db.query.users({
          where: {
            email,
          },
          first: 1,
        });
        const foundUser = users[0];
        const isSamePassword = await bcrypt.compare(
          password,
          foundUser.password,
        );
        if (!foundUser.isActive) {
          throw new ValidationError(ERRORS.ACCOUNT_NOT_ACTIVE);
        }
        if (foundUser && isSamePassword) {
          const token = await signJWT({ id: foundUser.id });
          delete foundUser.password;
          return { ...foundUser, token };
        } else {
          throw new ValidationError(ERRORS.EMAIL_OR_PASSWORD_NOT_MATCH);
        }
      }
    },
    remember: async (_, { email, baseURL }, ctx) => {
      // check user existance
      const isUserExist = await ctx.db.exists.User({
        email,
      });
      if (!isUserExist) {
        throw new ValidationError(ERRORS.USER_DOES_NOT_EXIST);
      }

      const users = await ctx.db.query.users({
        where: {
          email,
        },
        first: 1,
      });
      const foundUser = users[0];

      if (!foundUser.isActive) {
        throw new ValidationError(ERRORS.ACCOUNT_NOT_ACTIVE);
      }

      // generate token
      const token = await signJWT({
        ...foundUser,
        // to indicate that user is coming from reset-password process when we decode the token
        // we are adding resetPassword field when creating token and in `resetPassword` mutation we will check whether decoded token has resetPassword field or not
        // so that any valid login token can't call `resetPassword` mutation
        resetPassword: true,
        baseURL,
      });

      Mail.send({
        templateName: Mail.TEMPLATES.remember,
        templateData: {
          token_url: SKELM_URL.RESET_PASSWORD(token),
        },
        to: [email],
      });

      return {
        success: true,
      };
    },
    resetPassword: async (_, { password, passwordRepeat }, ctx) => {
      const token = get(ctx, "auth.token");

      if (!token) {
        throw new ForbiddenError(ERRORS.UNAUTHORIZED);
      }

      const userId = get(ctx, "auth.id");
      const decoded: any = await verifyJWT(token);
      if (decoded.resetPassword) {
        // resetPassword is set then only reset the password
        if (!password) {
          throw new ValidationError(ERRORS.PASSWORD_EMPTY);
        }
        if (password !== passwordRepeat) {
          throw new ValidationError(ERRORS.PASSWORD_DOES_NOT_MATCH);
        }
        const encPass = await bcrypt.hash(password, 10);
        await ctx.db.mutation.updateUser({
          data: {
            password: encPass,
          },
          where: {
            id: userId,
          },
        });
        return { success: true };
      }
      throw new ForbiddenError(ERRORS.UNAUTHORIZED);
    },
    updateUser: async (
      _,
      {
        firstName,
        lastName,
        jobTitle,
        contactNumber,
        secondAuthEnabled,
        password,
        passwordRepeat,
        oldPassword,
      },
      ctx,
    ) => {
      const userId = get(ctx, "auth.id");
      const decoded: any = await verifyJWT(get(ctx, "auth.token"));
      // if user is not active and not coming from invite
      // in case user is coming from invite then that user will be inactive already, so ignore that case
      if (!get(ctx, "auth.user.isActive") && !decoded.fromInvite) {
        throw new ValidationError(ERRORS.ACCOUNT_NOT_ACTIVE);
      }
      let dataToUpdate: any = {
        firstName,
        lastName,
        jobTitle,
        contactNumber,
        secondAuthEnabled,
      };
      if (password) {
        if (password !== passwordRepeat) {
          throw new ValidationError(ERRORS.PASSWORD_DOES_NOT_MATCH);
        }
        if (!decoded.fromInvite) {
          // if user is not from invite , then old password is required
          const isPasswordMatching = await bcrypt.compare(
            oldPassword,
            get(ctx, "auth.user.password"),
          );
          if (!isPasswordMatching) {
            throw new ValidationError(ERRORS.OLD_PASSWORD_DOES_NOT_MATCH);
          }
        }

        const encPass = await bcrypt.hash(password, 10);
        dataToUpdate = {
          ...dataToUpdate,
          password: encPass,
        };
      }

      if (decoded.fromInvite) {
        dataToUpdate = {
          ...dataToUpdate,
          isActive: true,
        };
      }

      const updatedUser = await ctx.db.mutation.updateUser({
        data: dataToUpdate,
        where: {
          id: userId,
        },
      });
      const token = await signJWT({ id: updatedUser.id });
      return { ...updatedUser, token };
    },
  },
};
