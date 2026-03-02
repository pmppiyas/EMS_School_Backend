import { StatusCodes } from 'http-status-codes';
import prisma from '../../config/prisma';
import { TERM } from '@prisma/client';
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
    year?: number;
  },
  user: IUser
) => {
  const { feeTypeId, studentId, term, month = [], year } = payload;

  return await prisma.$transaction(async (tx) => {
    const issuer = await tx.admin.findUnique({
      where: { email: user.email },
    });

    if (!issuer) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are unauthorized!');
    }

    const feeType = await tx.feeType.findUniqueOrThrow({
      where: { id: feeTypeId },
    });

    const issuedBy = `${issuer.firstName} ${issuer.lastName}`;
    const paymentYear = year || new Date().getFullYear();

    if (feeType.category === 'MONTHLY' || feeType.category === 'TUITION') {
      if (!month.length) {
        throw new AppError(400, 'At least 1 month is required.');
      }

      const existingPayments = await tx.feePayment.findMany({
        where: {
          studentId,
          feeTypeId,
          year: paymentYear,
          month: { in: month },
        },
        select: { month: true },
      });

      if (existingPayments.length > 0) {
        const alreadyPaidMonths = existingPayments
          .map((e) => e.month)
          .join(', ');
        const categoryName =
          feeType.category === 'TUITION' ? 'Tuition' : 'Monthly';
        throw new AppError(
          StatusCodes.CONFLICT,
          `${categoryName} fee for ${alreadyPaidMonths} ${paymentYear} is already paid`
        );
      }

      const data = month.map((m) => ({
        studentId,
        feeTypeId,
        paidAmount: feeType.amount,
        term: null,
        year: paymentYear,
        month: m,
        issuedBy,
      }));

      return await tx.feePayment.createMany({ data });
    }

    if (feeType.category === 'EXAM') {
      if (!term) throw new AppError(400, 'Term is required for exam fees.');

      const existingExamPayment = await tx.feePayment.findFirst({
        where: {
          studentId,
          feeTypeId,
          year: paymentYear,
          term: term as TERM,
        },
      });

      if (existingExamPayment) {
        throw new AppError(
          StatusCodes.CONFLICT,
          `Exam fee for ${term} ${paymentYear} is already paid`
        );
      }

      return tx.feePayment.create({
        data: {
          studentId,
          feeTypeId,
          paidAmount: feeType.amount,
          year: paymentYear,
          term: term as TERM,
          month: null,
          issuedBy,
        },
      });
    }

    if (feeType.category === 'SESSION') {
      const existingSessionPayment = await tx.feePayment.findFirst({
        where: {
          studentId,
          feeTypeId,
          year: paymentYear,
        },
      });

      if (existingSessionPayment) {
        throw new AppError(
          StatusCodes.CONFLICT,
          `Session fee for ${paymentYear} is already paid`
        );
      }

      return tx.feePayment.create({
        data: {
          studentId,
          feeTypeId,
          paidAmount: feeType.amount,
          year: paymentYear,
          issuedBy,
        },
      });
    }

    const existingOneTimePayment = await tx.feePayment.findFirst({
      where: {
        studentId,
        feeTypeId,
        year: paymentYear,
      },
    });

    if (existingOneTimePayment) {
      throw new AppError(
        StatusCodes.CONFLICT,
        `${feeType.category} fee for ${paymentYear} is already paid`
      );
    }

    return tx.feePayment.create({
      data: {
        studentId,
        feeTypeId,
        paidAmount: feeType.amount,
        year: paymentYear,
        issuedBy,
      },
    });
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
    orderBy: {
      paidDate: 'desc',
    },
  });
  return { fees };
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

const paidFees = async ({
  studentId,
  year,
}: {
  studentId: string;
  year: number;
}) => {
  const paidFees = await prisma.feePayment.findMany({
    where: {
      studentId,
      year,
    },
    select: {
      month: true,
      feeType: { select: { category: true } },
    },
  });

  return paidFees;
};

const createFeeType = async (payload: IFeeType) => {
  const { category, amount, isMonthly, classId } = payload;

  const existing = await prisma.feeType.findFirst({
    where: {
      category,
      classId,
    },
  });

  if (existing) {
    await prisma.feeType.update({
      where: {
        id: existing.id,
      },
      data: { ...payload, isMonthly: isMonthly ?? false },
    });
  } else {
    await prisma.feeType.create({
      data: { ...payload, name: category, isMonthly: isMonthly ?? false },
    });
  }
};

const deleteFeeType = async (id: string) => {
  const result = await prisma.feeType.delete({
    where: {
      id,
    },
  });
  return result.name;
};

const getAllfeeType = async (classId?: string) => {
  return await prisma.feeType.findMany({
    include: {
      class: true,
    },
    where: classId
      ? {
          OR: [{ classId: classId }, { classId: null }],
        }
      : {},
  });
};

export const FeeServices = {
  createFee,
  getAllFee,
  paidFees,
  myFee,
  createFeeType,
  deleteFeeType,
  getAllfeeType,
};
