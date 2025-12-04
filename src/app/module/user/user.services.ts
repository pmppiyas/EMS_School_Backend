import bcrypt from "bcryptjs";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

import {
  createAdminInput,
  createStudentInput,
  createTeacherInput,
  UserStatus,
} from "./user.interface";

const getAllUser = async () => {
  const user = await prisma.user.findMany();
  return user;
};

const createStudent = async (req: Request) => {
  const salt = env.BCRYPT.SALTNUMBER;
  const {
    body,
    file,
  }: { body: createStudentInput; file?: Express.Multer.File } = req;

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: body.email,
        password: hashPassword,
      },
    });

    return await tnx.student.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        address: body.address!,
        classId: body.class,
        roll: body.roll,
        gender: body.gender!,
        dateOfBirth: body.dateOfBirth!,
        phoneNumber: body.phoneNumber!,
        userId: user.id,
      },
    });
  });
  return result;
};

const createAdmin = async (req: Request) => {
  const salt = env.BCRYPT.SALTNUMBER;
  const { body, file }: { body: createAdminInput; file?: Express.Multer.File } =
    req;

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: body.email,
        password: hashPassword,
        role: "ADMIN",
      },
    });

    const admin = await tnx.admin.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber!,
        gender: body.gender!,
        designation: body.designation!,
        address: body.address!,
        userId: user.id,
      },
    });
    return admin;
  });
  return result;
};

const createTeacher = async (req: Request) => {
  const salt = env.BCRYPT.SALTNUMBER;
  const {
    body,
    file,
  }: { body: createTeacherInput; file?: Express.Multer.File } = req;

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: body.email,
        password: hashPassword,
        role: "TEACHER",
      },
    });

    return await tnx.teacher.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        address: body.address!,
        gender: body.gender!,
        phoneNumber: body.phoneNumber!,
        userId: user.id,
        designation: body.designation!,
        dateOfBirth: body.dateOfBirth!,
      },
    });
  });
  return result;
};

const changeUserStatus = async (id: string, status: UserStatus) => {
  if (!status) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Status is required");
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  if (user.status === status) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `User's status is already ${status}`
    );
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is already suspended");
  }

  const updatedStatus = await prisma.user.update({
    where: { id },
    data: {
      status: status,
    },
  });

  return updatedStatus;
};
export const UserServices = {
  getAllUser,
  createStudent,
  createAdmin,
  createTeacher,
  changeUserStatus,
};
