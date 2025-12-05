import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { IUser } from "../user/user.interface";
import { IFeeType, ITerm } from "./fee.interfaces";

const createFee = async (
  payload: {
    studentId: string;
    feeTypeId: string;
    amount?: number;
    term?: ITerm;
    month?: string[];
  },
  user: IUser
) => {
  const { feeTypeId, studentId, term, month = [] } = payload;

  const issuer = await prisma.admin.findUnique({
    where: { email: user.email },
  });

  if (!issuer) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are unauthorized!");
  }

  const feeType = await prisma.feeType.findUniqueOrThrow({
    where: { id: feeTypeId },
  });

  const issuedBy = `${issuer.firstName} ${issuer.lastName}`;
  const year = new Date().getFullYear();

  if (feeType.category === "MONTHLY") {
    if (!month.length) {
      throw new AppError(400, "At least 1 month is required.");
    }

    const existingPayments = await prisma.feePayment.findMany({
      where: {
        studentId,
        feeTypeId,
        year,
        month: { in: month },
      },
      select: { month: true },
    });

    if (existingPayments.length > 0) {
      const alreadyPaidMonths = existingPayments.map((e) => e.month).join(", ");
      throw new AppError(
        StatusCodes.NOT_IMPLEMENTED,
        `${alreadyPaidMonths} ${year} is already paid`
      );
    }

    const data = month.map((m) => ({
      studentId,
      feeTypeId,
      paidAmount: feeType.amount,
      term: null,
      year,
      month: m,
      issuedBy,
    }));

    return await prisma.feePayment.createMany({ data });
  }

  if (feeType.category === "EXAM") {
    if (!term) throw new AppError(400, "Term is required for exam fees.");

    return prisma.feePayment.create({
      data: {
        studentId,
        feeTypeId,
        paidAmount: feeType.amount,
        year,
        term,
        month: null,
        issuedBy,
      },
    });
  }

  if (feeType.category === "SESSION") {
    return prisma.feePayment.create({
      data: {
        studentId,
        feeTypeId,
        paidAmount: feeType.amount,
        issuedBy,
      },
    });
  }

  return prisma.feePayment.create({
    data: {
      studentId,
      feeTypeId,
      paidAmount: feeType.amount,
      issuedBy,
    },
  });
};

const getAllFee = async () => {
  const fees = await prisma.feePayment.findMany({
    select: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          class: {
            select: {
              name: true,
            },
          },
        },
      },
      feeType: {
        select: {
          category: true,
          amount: true,
        },
      },
      term: true,
      month: true,
      year: true,
      paidDate: true,
      issuedBy: true,
    },
  });
  return fees;
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

export const FeeServices = {
  createFee,
  getAllFee,
  createFeeType,
  deleteFeeType,
};
