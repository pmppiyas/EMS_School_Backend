import { z } from "zod";

export const createFeeTypeSchema = z.object({
  name: z.string().min(1),
  amount: z.number().nonnegative(),
  category: z.enum([
    "ADMISSION",
    "SESSION",
    "MONTHLY",
    "TUITION",
    "EXAM",
    "TRANSPORT",
    "LAB",
    "OTHER",
  ]),
  isMonthly: z.boolean().optional().default(false),
});

export const updateFeeTypeSchema = createFeeTypeSchema.partial();

export const createPaymentSchema = z.object({
  studentId: z.string().uuid(),
  feeTypeId: z.string().uuid(),
  month: z.number().int().min(1).max(12).optional(), // for monthly fees
  year: z.number().int().min(1970).optional(),
  paidAmount: z.number().nonnegative(),
});

export const updatePaymentSchema = createPaymentSchema.partial();
