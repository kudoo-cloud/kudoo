import express from "express";
import qs from "qs";
import prisma from "src/db/prisma";
import { COMPANY_MEMBER_STATUS, VIZIER_URL } from "src/helpers/constants";
import { verifyJWT } from "src/helpers/jwt";
const router = express.Router();

// This route will be used to confirm user on signup
router.get("/confirm/:token", async (req, res) => {
  const { token } = req.params;
  if (!token) {
    res.redirect(VIZIER_URL.CONFIRM("invalid"));
    return;
  }
  const decoded: any = await verifyJWT(token);
  const baseURL: string = decoded.baseURL;
  try {
    await prisma.mutation.updateUser({
      data: {
        isActive: true,
      },
      where: {
        id: decoded.id,
      },
    });
    res.redirect(baseURL + VIZIER_URL.CONFIRM("success"));
  } catch (error) {
    res.redirect(baseURL + VIZIER_URL.CONFIRM("invalid"));
  }
});

// This route will be used when user click on invite link from email
router.get("/accept-invite/:type/:token", async (req, res) => {
  const { token, type } = req.params;
  if (!token) {
    res.redirect(VIZIER_URL.INVITE("invalid"));
    return;
  }
  const decoded: any = await verifyJWT(token);
  const baseURL: string = decoded.baseURL;
  try {
    if (decoded.fromInvite) {
      // set company member as a active
      await prisma.mutation.updateCompanyMember({
        data: {
          status: COMPANY_MEMBER_STATUS.ACTIVE,
        },
        where: {
          id: decoded.companyMemberId,
        },
      });
      res.redirect(baseURL + VIZIER_URL.INVITE("success", type, token));
    } else {
      res.redirect(baseURL + VIZIER_URL.INVITE("invalid"));
    }
  } catch (error) {
    res.redirect(baseURL + VIZIER_URL.INVITE("invalid"));
  }
});

// This route will be used to start reset password process
router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const errorParam = qs.stringify({
    message: "Link is not valid or expired",
  });

  if (!token) {
    res.redirect(VIZIER_URL.REMEMBER("invalid", errorParam));
    return;
  }
  const decoded: any = await verifyJWT(token);
  const baseURL: string = decoded.baseURL;
  try {
    // verify token
    if (decoded.resetPassword) {
      const tokenStr = qs.stringify({
        token,
      });
      // redirect user to new password page with token
      res.redirect(baseURL + VIZIER_URL.REMEMBER("success", tokenStr));
    } else {
      res.redirect(baseURL + VIZIER_URL.REMEMBER("invalid", errorParam));
    }
  } catch (error) {
    res.redirect(baseURL + VIZIER_URL.REMEMBER("invalid", errorParam));
  }
});

export default router;
