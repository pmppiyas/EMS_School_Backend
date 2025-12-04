import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { IUser } from "../user/user.interface";
import { IFeeType } from "./fee.interfaces";

const createFee = async (
  payload: {
    studentId: string;
    feeTypeId: string;
    amount: number;
  },
  user: IUser
) => {
  const { feeTypeId, studentId } = payload;
  const issuedBy = await prisma.admin.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  if (!issuedBy) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are unauthorized!");
  }

  const result = await prisma.feePayment.create({
    data: {
      feeTypeId,
      studentId,
      paidAmount: payload.amount,
      issuedBy: issuedBy.firstName + " " + issuedBy.lastName,
    },
  });
  return result;
};

// Fee types
const createFeeType = async (payload: IFeeType) => {
  const { category, amount, isMonthly } = payload;

  return prisma.feeType.upsert({
    where: { category },
    update: {
      amount,
      isMonthly: isMonthly,
    },
    create: {
      name: category,
      category,
      amount,
      isMonthly: isMonthly,
    },
    select: {
      name: true,
      amount: true,
    },
  });
};

const deleteFeeType = async (id: string) => {
  const result = await prisma.feeType.delete({
    where: {
      id,
    },
  });
  return result.name;
};

const myFee = async (email: string) => {
  const student = await prisma.student.findFirstOrThrow({
    where: {
      email,
    },
  });
  if (!student) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are unauthorized!");
  }
  return await prisma.feePayment.findMany({
    where: {
      studentId: student.id,
    },
    select: {
      paidAmount: true,
      feeType: {
        select: {
          category: true,
        },
      },
      month: true,
      year: true,
      term: true,
      issuedBy: true,
    },
  });
};

export const FeeServices = {
  createFee,
  myFee,
  createFeeType,
  deleteFeeType,
};
