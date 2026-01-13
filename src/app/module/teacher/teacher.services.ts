import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { Prisma } from '@prisma/client';

const allTeachers = async () => {
  const teachers = await prisma.teacher.findMany({
    include: {
      user: {
        select: {
          attendances: true,
          status: true,
          needPasswordChange: true,
        },
      },
      classSchedules: true,
    },
  });
  const total = await prisma.teacher.count();
  return {
    teachers,
    meta: {
      total,
    },
  };
};

const deleteTeacher = async (teacherId: string) => {
  await prisma.$transaction(async (tx) => {
    const teacher = await tx.teacher.findUnique({
      where: { id: teacherId },
      select: { userId: true },
    });

    if (!teacher) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Teacher not found');
    }

    await tx.teacher.delete({
      where: { id: teacherId },
    });

    await tx.user.delete({
      where: { id: teacher.userId },
    });
  });
};

const updateTeacher = async (
  teacherId: string,
  data: Prisma.TeacherUpdateInput
) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });
  if (!teacher) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Teacher not found');
  }

  const updatedTeacher = await prisma.teacher.update({
    where: { id: teacherId },
    data,
  });
  return updatedTeacher;
};

const getById = async (teacherId: string) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId,
    },
    include: {
      user: {
        select: {
          attendances: true,
          status: true,
          needPasswordChange: true,
        },
      },
      classSchedules: true,
    },
  });

  if (!teacher) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Teacher not found');
  }
  return teacher;
};

export const TeacherServices = {
  allTeachers,
  deleteTeacher,
  updateTeacher,
  getById,
};
