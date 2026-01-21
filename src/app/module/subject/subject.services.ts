import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { Prisma } from '@prisma/client';

const createSubject = async (payload: Prisma.SubjectUncheckedCreateInput[]) => {
  if (!payload || payload.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'No subjects provided');
  }

  const result = await prisma.subject.createMany({
    data: payload,
    skipDuplicates: true,
  });

  return result;
};

const getAllSubjects = async (classId: string) => {
  const count = await prisma.subject.count();
  const subjects = await prisma.subject.findMany({
    where: {
      classId,
    },
  });
  return {
    subjects,
    meta: {
      total: count,
    },
  };
};

const editSubject = async (
  id: string,
  payload: { name: string; code?: string }
) => {
  const isExist = await prisma.subject.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Subject not found');
  }
  return await prisma.subject.update({
    where: { id },
    data: { name: payload.name, code: payload.code! },
  });
};

const deleteSubject = async (id: string) => {
  const isExist = await prisma.subject.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Subject not found');
  }
  const result = await prisma.subject.delete({
    where: { id },
  });
  return result.name;
};

export const SubjectServices = {
  createSubject,
  getAllSubjects,
  editSubject,
  deleteSubject,
};
