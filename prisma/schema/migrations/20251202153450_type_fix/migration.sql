/*
  Warnings:

  - Added the required column `period` to the `ClassTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassTime" ADD COLUMN     "period" TEXT NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;
