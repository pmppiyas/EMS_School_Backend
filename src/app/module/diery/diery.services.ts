import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/appError';

const createDiery = async (payload: Prisma.DieryCreateInput) => {
  return await prisma.diery.create({
    data: { ...payload, date: new Date(payload.date) },
  });
};

const updateDiery = async (id: string, payload: Prisma.DieryUpdateInput) => {
  const isExist = await prisma.diery.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Diery record not found!');
  }

  const result = await prisma.diery.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteDiery = async (id: string) => {
  const isExist = await prisma.diery.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Diery record not found!');
  }

  return await prisma.diery.delete({
    where: {
      id,
    },
  });
};

const readDiery = async (classId: string, date: string) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const result = await prisma.diery.findMany({
    where: {
      classId: classId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return result;
};

export const DieryServices = {
  createDiery,
  updateDiery,
  deleteDiery,
  readDiery,
};
