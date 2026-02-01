import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { jwtTokenGen } from "../../helper/jwtTokenGen";
import { verifyToken } from "../../helper/verifyToken";
import { AppError } from "../../utils/appError";
import { UserStatus } from "../user/user.interface";
import { ILoginPayload } from "./auth.interface";
import { env } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

const crdLogin = async (payload: ILoginPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not exist by this gmail.");
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


const changePassWord = async (
  authUser: JwtPayload,
  targetUserId: string,
  oldPassword: string,
  newPassword: string
) => {
  const salt = env.BCRYPT.SALTNUMBER;


  const targetUserExist = await prisma.user.findUnique({
    where: { id: targetUserId }
  });

  if (!targetUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const isAdmin = authUser.role === 'ADMIN';
  const isSelf = authUser.id === targetUserId;
  const adminChanged = authUser.id !== targetUserId;


  if (!isAdmin && !isSelf) {
    throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized access");
  }


  if (!isAdmin) {
    if (!oldPassword) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Old password is required");
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, targetUserExist.password);
    if (!isPasswordMatch) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Current password is wrong");
    }
  }


  const hashedPassword = await bcrypt.hash(newPassword, Number(salt));

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      password: hashedPassword,
      needPasswordChange: adminChanged ? true : false
    }
  });

  return true;
};


const changeEmail = async (authUser: JwtPayload, newEmail: string) => {

  const isEmailTaken = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (isEmailTaken) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email already in use");
  }


   const result = await prisma.$transaction(async (tx) => {

  const updatedUser = await tx.user.update({
    where: { id: authUser.id },
    data: { email: newEmail },
  });


  switch (updatedUser.role) {
    case "ADMIN":
      await tx.admin.update({
        where: { email: authUser.email },
        data: { email: newEmail },
      });
      break;

    case "TEACHER":
      await tx.teacher.update({
        where: { email: authUser.email },
        data: { email: newEmail },
      });
      break;

    case "STUDENT":
      await tx.student.update({
        where: { email: authUser.email },
        data: { email: newEmail },
      });
      break;

    default:
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid user role for email update");
  }

  return updatedUser;
    });

  const { accessToken, refreshToken } = await jwtTokenGen({
    id: result.id,
    email: result.email,
    role: result.role,
  });

  return {
    accessToken,
    refreshToken,
  };
};



export const AuthServices = {
  crdLogin,
  getMe,
  refreshToken,
  changePassWord,
  changeEmail,
};
