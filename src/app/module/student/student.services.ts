import { get } from 'http';
import prisma from '../../config/prisma';
import { IUser, Role } from '../user/user.interface';
import { Prisma } from '@prisma/client';

const allStudents = async () => {
  const students = await prisma.student.findMany({
    include: {
      class: {
        select: {
          name: true,
        },
      },
    },
  });
  const total = await prisma.student.count();
  console.log(students);
  return {
    students,
    total,
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
