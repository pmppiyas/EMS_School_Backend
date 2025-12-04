/*
  Warnings:

  - Added the required column `issuedBy` to the `feePayments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feePayments" ADD COLUMN     "issuedBy" TEXT NOT NULL;
