-- AlterTable
ALTER TABLE "feeTypes" ADD COLUMN     "classId" TEXT,
ALTER COLUMN "isMonthly" DROP DEFAULT;
