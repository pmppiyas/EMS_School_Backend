import prisma from "../../config/prisma";
import { IFeeType } from "./fee.interfaces";

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
  createFeeType,
  deleteFeeType,
};
