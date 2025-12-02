import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

const createSubject = async (payload: { name: string; code?: string }) => {
  const isExist = await prisma.subject.findUnique({
    where: { name: payload.name, code: payload.code! },
  });
  if (isExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Subject with this name already exists"
    );
  }
  return await prisma.subject.create({
    data: {
      name: payload.name,
      code: payload.code!,
    },
  });
};

const getAllSubjects = async () => {
  const count = await prisma.subject.count();
  const subjects = await prisma.subject.findMany();
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
    throw new AppError(StatusCodes.NOT_FOUND, "Subject not found");
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
    throw new AppError(StatusCodes.NOT_FOUND, "Subject not found");
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
