import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { generateTransactionId } from "../../utils/generateTransactionId";
import { IUser } from "../user/user.interface";
import { IPayment } from "./payment.interface";

const paymentInit = async (payload: IPayment, user: IUser) => {
  const { feeTypeId, term, months = [] } = payload;
  const transactionId = generateTransactionId();

  const student = await prisma.student.findUnique({
    where: { email: user.email },
  });

  if (!student) throw new AppError(StatusCodes.NOT_FOUND, "Student not found");

  const feeType = await prisma.feeType.findUniqueOrThrow({
    where: { id: feeTypeId },
  });

  const year = new Date().getFullYear();

  const paymentRecords = await prisma.$transaction(async (tx) => {
    const paymentRecords: any[] = [];

    if (feeType.category === "MONTHLY") {
      const monthsArray = Array.isArray(months)
        ? months
        : months
        ? [months]
        : [];
      if (!monthsArray.length)
        throw new AppError(400, "At least one month is required!");

      const existing = await tx.feePayment.findMany({
        where: {
          studentId: student.id,
          feeTypeId,
          year,
          month: { in: monthsArray },
          payment: {
            status: "SUCCESS",
          },
        },
      });

      if (existing.length > 0) {
        const already = existing.map((e) => e.month).join(", ");
        throw new AppError(400, `${already} already paid for ${year}`);
      }

      for (const m of monthsArray) {
        const monthTransactionId = `${transactionId}-${m}`;

        const feePayment = await tx.feePayment.create({
          data: {
            studentId: student.id,
            feeTypeId,
            paidAmount: feeType.amount,
            year,
            month: m,
            issuedBy: "Electronically",
          },
        });

        paymentRecords.push({
          feePaymentId: feePayment.id,
          amount: feeType.amount,
          transactionId: monthTransactionId,
          method: "SSL",
          status: "PENDING",
        });
      }
    }

    if (feeType.category === "EXAM") {
      if (!term) throw new AppError(400, "Term is required!");
      const feePayment = await tx.feePayment.create({
        data: {
          studentId: student.id,
          feeTypeId,
          paidAmount: feeType.amount,
          year,
          term,
          issuedBy: "Electronic",
        },
      });

      paymentRecords.push({
        feePaymentId: feePayment.id,
        amount: feeType.amount,
        transactionId,
        method: "SSL",
        status: "PENDING",
      });
    }

    if (feeType.category === "SESSION") {
      const feePayment = await tx.feePayment.create({
        data: {
          studentId: student.id,
          feeTypeId,
          paidAmount: feeType.amount,
          issuedBy: "Electronic",
        },
      });

      paymentRecords.push({
        feePaymentId: feePayment.id,
        amount: feeType.amount,
        transactionId,
        method: "SSL",
        status: "PENDING",
      });
    }

    await tx.payment.createMany({ data: paymentRecords });

    return paymentRecords;
  });

  const totalAmount = paymentRecords.reduce(
    (sum, record) => sum + record.amount,
    0
  );

  // ADD THIS
  const allTransIds = paymentRecords.map((p) => p.transactionId).join(",");

  const sslData = {
    store_id: env.SSL.STORE_ID,
    store_passwd: env.SSL.STORE_PASS,
    total_amount: totalAmount,
    currency: "BDT",

    tran_id: allTransIds,

    success_url: `${env.SSL.SUCCESS_BACKEND_URL}?tran_id=${allTransIds}`,
    fail_url: `${env.SSL.FAIL_BACKEND_URL}?tran_id=${allTransIds}`,
    cancel_url: `${env.SSL.CANCEL_BACKEND_URL}?tran_id=${allTransIds}`,

    product_name: "School Fee Payment",
    product_category: "Education",
    product_profile: "general",
    shipping_method: "N/A",
    cus_name: `${student.firstName} ${student.lastName}`,
    cus_email: student.email,
    cus_add1: student.address ?? "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: student.phoneNumber ?? "N/A",
  };

  const res = await axios({
    method: "POST",
    url: env.SSL.PAYMENT_API,
    data: new URLSearchParams(sslData as any).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data.GatewayPageURL;
};

const successPayment = async (query: Record<string, string>) => {
  const ids = query.tran_id.split(",");

  return await prisma.payment.updateMany({
    where: {
      transactionId: { in: ids },
    },
    data: { status: "SUCCESS" },
  });
};

const failPayment = async () => {
  return "Ok";
};
const cancelPayment = async () => {
  return "Cancel";
};
export const PaymentService = {
  paymentInit,
  successPayment,
  failPayment,
  cancelPayment,
};
