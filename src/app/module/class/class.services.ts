import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

const createClass = async (name: string) => {
  const isExist = await prisma.class.findUnique({
    where: { name },
  });
  if (isExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "Class with this name already exists"
    );
  }
  return await prisma.class.create({
    data: {
      name,
    },
  });
};

const getClasses = async () => {
  const count = await prisma.class.count();
  const classes = await prisma.class.findMany();
  return {
    classes,
    meta: {
      total: count,
    },
  };
};

const deleteClass = async (id: string) => {
  const isExist = await prisma.class.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Class not found");
  }
  const result = await prisma.class.delete({
    where: { id },
  });
  return result.name;
};

const editClass = async (id: string, name: string) => {
  const isExist = await prisma.class.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Class not found");
  }
  return await prisma.class.update({
    where: { id },
    data: { name },
  });
};

const addClassTime = async (times: any[]) => {
  return await prisma.$transaction(async (prisma) => {
    for (const time of times) {
      await prisma.classTime.deleteMany({
        where: {
          period: time.period,
        },
      });

      await prisma.classTime.create({
        data: {
          period: time.period,
          startTime: time.startTime,
          endTime: time.endTime,
        },
      });
    }
  });
};

const getClassTime = async () => {
  const classes = await prisma.classTime.findMany();
  const count = await prisma.classTime.count();
  return {
    classes,
    meta: {
      tota: count,
    },
  };
};

export const ClassServices = {
  createClass,
  getClasses,
  deleteClass,
  editClass,
  addClassTime,
  getClassTime,
};
