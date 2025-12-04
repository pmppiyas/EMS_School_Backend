-- CreateEnum
CREATE TYPE "FeeCategory" AS ENUM ('ADMISSION', 'SESSION', 'MONTHLY', 'TUITION', 'EXAM', 'TRANSPORT', 'LAB', 'OTHER');

-- CreateEnum
CREATE TYPE "TERM" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FINAL');

-- CreateTable
CREATE TABLE "feeTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" "FeeCategory" NOT NULL,
    "isMonthly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feeTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feePayments" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "feeTypeId" TEXT NOT NULL,
    "month" INTEGER,
    "year" INTEGER,
    "term" "TERM",
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "paidDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feePayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feePayments" ADD CONSTRAINT "feePayments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feePayments" ADD CONSTRAINT "feePayments_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "feeTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
