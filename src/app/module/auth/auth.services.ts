import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { jwtTokenGen } from "../../helper/jwtTokenGen";
import { verifyToken } from "../../helper/verifyToken";
import { AppError } from "../../utils/appError";
import { UserStatus } from "../user/user.interface";
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

  const { accessToken, refreshToken } = await jwtTokenGen({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const getMe = async (session: any) => {
  const accessToken = session.accessToken;

  const decodedData = verifyToken(accessToken);

  let include: any = {};

  switch (decodedData.role) {
    case "ADMIN":
      include.admin = true;
      break;
    case "TEACHER":
      include.teacher = true;
      break;
    case "STUDENT":
      include.student = true;
      break;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: {
        not: UserStatus.DELETED,
      },
    },
    include: {
      ...include,
    },
  });

  return user;
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = verifyToken(token);
  } catch (err) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: decodedData.email,
      status: {
        not: UserStatus.DELETED,
      },
    },
  });

  const tokenGen = jwtTokenGen({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken: (await tokenGen).accessToken,
    needPasswordChange: user.needPasswordChange,
  };
};
export const AuthServices = {
  crdLogin,
  getMe,
  refreshToken,
};
