import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { jwtTokenGen } from "../../helper/jwtTokenGen";
import { AppError } from "../../utils/appError";
import { ILoginPayload } from "./auth.interface";

const crdLogin = async (payload: ILoginPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Patient not exist by this gmail."
    );
  }

  const isCorrectPass = await bcrypt.compare(payload.password, user.password);
  if (!isCorrectPass) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "This password is wrong");
  }

  const { accessToken, refreshToken } = await jwtTokenGen(user);

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthServices = {
  crdLogin,
};
