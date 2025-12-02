import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";

const createClass = async (name: string) => {
  const isExist = await prisma.class.findUniqueOrThrow({
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

export const ClassServices = {
  createClass,
};
