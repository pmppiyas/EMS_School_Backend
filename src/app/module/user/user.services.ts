import bcrypt from 'bcryptjs';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { env } from '../../config/env';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/appError';

import {
  createAdminInput,
  createStudentInput,
  createTeacherInput,
  UserStatus,
} from './user.interface';
import { Gender } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

const getAllUser = async () => {
  const user = await prisma.user.findMany();
  return user;
};

const createStudent = async (req: Request) => {
  const salt = env.BCRYPT.SALTNUMBER;

  const { body }: { body: createStudentInput } = req;

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: body.email,
        password: hashPassword,
      },
    });

    const student = await tnx.student.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        roll: Number(body.roll),
        gender: body.gender as Gender,
        phoneNumber: body.phoneNumber || null,
        address: body.address || null,
        photo: body.photoUrl,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        classId: body.classId || null,
        userId: user.id,
      },
    });

    return student;
  });

  return result;
};

const createAdmin = async (req: Request) => {
  const salt = env.BCRYPT.SALTNUMBER;
  const { body }: { body: createAdminInput } = req;

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: body.email,
        password: hashPassword,
        role: 'ADMIN',
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
  const { body }: { body: createTeacherInput } = req;

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    const exist = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (exist) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'User already exist by this email'
      );
    }

    const user = await tnx.user.create({
      data: {
        email: body.email,
        password: hashPassword,
        role: 'TEACHER',
      },
    });

    return await tnx.teacher.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        photo: body.photoUrl,
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
    throw new AppError(StatusCodes.BAD_REQUEST, 'Status is required');
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
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'User is already suspended');
  }

  const updatedStatus = await prisma.user.update({
    where: { id },
    data: {
      status: status,
    },
  });

  return updatedStatus;
};

const getMe = async (user: JwtPayload) => {
  const role = user.role.toUpperCase();

  const userData = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      student: {
        include: {
          class: true,
          feePayments: true,
          results: true,
          studentSubjects: true,
        },
      },
      teacher: {
        include: {
          classSchedules: true,
        },
      },
      admin: true,
    },
  });

  if (!userData) return null;

  let profileData = {};

  if (role === 'STUDENT' && userData.student) {
    profileData = { ...userData.student };
  } else if (role === 'TEACHER' && userData.teacher) {
    profileData = { ...userData.teacher };
  } else if (role === 'ADMIN' && userData.admin) {
    profileData = { ...userData.admin };
  }

  return {
    ...profileData,
    email: userData.email,
    role: userData.role,
    status: userData.status,
    needPasswordChange: userData.needPasswordChange,
  };
};

const updateMe = async (user: JwtPayload, req: Request) => {
  const role = user.role.toUpperCase();
  const email = user.email;
  const payload = req.body;

  const userData = await prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
      teacher: true,
      admin: true,
    },
  });

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  let updatedProfile = {};

  if (role === 'STUDENT' && userData.student) {
    updatedProfile = await prisma.student.update({
      where: { id: userData.student.id },
      data: {
        ...payload,
        dateOfBirth: payload.dateOfBirth
          ? new Date(payload.dateOfBirth)
          : userData.student.dateOfBirth,
        roll: payload.roll ? Number(payload.roll) : userData.student.roll,
      },
    });
  } else if (role === 'TEACHER' && userData.teacher) {
    updatedProfile = await prisma.teacher.update({
      where: { id: userData.teacher.id },
      data: {
        ...payload,
        dateOfBirth: payload.dateOfBirth
          ? new Date(payload.dateOfBirth)
          : userData.teacher.dateOfBirth,
      },
    });
  } else if (role === 'ADMIN' && userData.admin) {
    updatedProfile = await prisma.admin.update({
      where: { id: userData.admin.id },
      data: payload,
    });
  } else {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Invalid role or profile missing'
    );
  }

  return {
    ...updatedProfile,
    email: userData.email,
    role: userData.role,
  };
};

export const UserServices = {
  getAllUser,
  createStudent,
  createAdmin,
  createTeacher,
  changeUserStatus,
  getMe,
  updateMe,
};
