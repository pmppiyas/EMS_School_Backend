import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { AppError } from '../../utils/appError';
import { IUser } from '../user/user.interface';
import { IFeeType, ITerm } from './fee.interfaces';
import { allMonths } from '../../Constant/page';

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
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are unauthorized!');
  }

  const feeType = await prisma.feeType.findUniqueOrThrow({
    where: { id: feeTypeId },
  });

  const issuedBy = `${issuer.firstName} ${issuer.lastName}`;
  const year = new Date().getFullYear();

  if (feeType.category === 'MONTHLY') {
    if (!month.length) {
      throw new AppError(400, 'At least 1 month is required.');
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
      const alreadyPaidMonths = existingPayments.map((e) => e.month).join(', ');
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

  if (feeType.category === 'EXAM') {
    if (!term) throw new AppError(400, 'Term is required for exam fees.');

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

  if (feeType.category === 'SESSION') {
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

const myFee = async (email: string) => {
  const student = await prisma.student.findFirstOrThrow({
    where: { email },
  });

  if (!student) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are unauthorized!');
  }

  const admissionDate = new Date(student.createdAt);
  const admissionYear = admissionDate.getFullYear();
  const admissionMonthIndex = admissionDate.getMonth();

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();

  let expectedMonths: string[] = [];

  for (let year = admissionYear; year <= currentYear; year++) {
    const startMonth = year === admissionYear ? admissionMonthIndex : 0;
    const endMonth = year === currentYear ? currentMonthIndex : 11;

    for (let m = startMonth; m <= endMonth; m++) {
      expectedMonths.push(`${allMonths[m]}-${year}`);
    }
  }

  const payments = await prisma.feePayment.findMany({
    where: {
      studentId: student.id,
      feeType: { category: 'MONTHLY' },
    },
    select: {
      paidAmount: true,
      month: true,
      year: true,
      issuedBy: true,
      feeType: { select: { category: true } },
    },
  });

  const paidMonths = payments
    .filter((p) => p.month !== null)
    .map((p) => `${p.month}-${p.year}`);

  const unpaidMonths = expectedMonths.filter((m) => !paidMonths.includes(m));

  const allPayments = await prisma.feePayment.findMany({
    where: { studentId: student.id },
    select: {
      feeType: {
        select: { category: true },
      },
      month: true,
      year: true,
      term: true,
      paidAmount: true,
      paidDate: true,
      issuedBy: true,
    },
  });

  const grouped: Record<string, any[]> = {};

  for (const payment of allPayments) {
    const category = payment.feeType.category;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      month: payment.month,
      year: payment.year,
      term: payment.term,
      paidAmount: payment.paidAmount,
      paidDate: payment.paidDate,
      issuedBy: payment.issuedBy,
    });
  }

  return {
    paidMonths,
    unpaidMonths,
    paid: grouped,
  };
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
      isMonthly: category === 'MONTHLY' ? true : false,
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

const getAllfeeType = async () => {
  return await prisma.feeType.findMany({});
};

export const FeeServices = {
  createFee,
  getAllFee,
  myFee,
  createFeeType,
  deleteFeeType,
  getAllfeeType,
};
