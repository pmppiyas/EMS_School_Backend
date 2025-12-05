import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { allMonths } from "../../Constant/page";
import { AppError } from "../../utils/appError";

const myFee = async (email: string) => {
  const student = await prisma.student.findFirstOrThrow({
    where: { email },
  });

  if (!student) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are unauthorized!");
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
      feeType: { category: "MONTHLY" },
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

export const StudentServices = {
  myFee,
};
