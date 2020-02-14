import jwt, { VerifyErrors } from "jsonwebtoken";

export const signJWT = async (payload: object) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      },
      (err: Error, token: string) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      },
    );
  });
};

export const verifyJWT = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      {
        ignoreExpiration: false,
      },
      (err: VerifyErrors, decoded: object | string) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      },
    );
  });
};
