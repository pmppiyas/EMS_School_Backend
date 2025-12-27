import { get } from 'http';
import prisma from '../../config/prisma';
import { IUser, Role } from '../user/user.interface';
import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/appError';
import httpStatus from 'http-status-codes';

const allStudents = async (classId?: string) => {
  const whereCondition: any = {};
  let className: string = 'All Classes';

  if (classId) {
    const existClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    className = existClass?.name as string;

    if (!existClass) {
      throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
    }
    whereCondition.classId = classId;
  }

  const students = await prisma.student.findMany({
    where: whereCondition,
    include: {
      class: {
        select: {
          name: true,
          id: true,
        },
      },
    },

    orderBy: [
      {
        class: {
          name: 'asc',
        },
      },
      {
        firstName: 'asc',
      },
    ],
  });

  const total = await prisma.student.count({
    where: whereCondition,
  });

  return {
    students,
    meta: {
      className,
      total,
    },
  };
};

const deleteStudent = async (id: string) => {
  const studnet = await prisma.student.delete({
    where: {
      id,
    },
  });

  return studnet;
};

const updateStudent = async (
  id: string,
  currentUser: IUser,
  payload: Prisma.StudentUpdateInput
) => {
  if (currentUser.role === Role.STUDENT) {
    const isOwn = await prisma.student.findUnique({
      where: {
        userId: currentUser.id,
      },
    });
    if (!isOwn || isOwn.id !== id) {
      throw new Error('Unauthorized: You can only update your own profile.');
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'gender',
      'address',
      'dateOfBirth',
      'phoneNumber',
      'profilePicture',
    ];

    const filteredPayload: Prisma.StudentUpdateInput = {};

    Object.keys(payload).forEach((key) => {
      if (allowedFields.includes(key)) {
        // @ts-ignore
        filteredPayload[key] = payload[key];
      }
    });

    payload = filteredPayload;

    if (Object.keys(payload).length === 0) {
      throw new Error('No valid or permitted fields provided for update.');
    }
  }

  return await prisma.student.update({
    where: { id },
    data: payload,
  });
};

const getById = async (id: string) => {
  return await prisma.student.findFirst({
    where: { id },
  });
};
export const StudentServices = {
  allStudents,
  deleteStudent,
  updateStudent,
  getById,
};
