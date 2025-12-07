/*
  Warnings:

  - Changed the type of `status` on the `attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'LEAVE');

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "status",
ADD COLUMN     "status" "AttendanceStatus" NOT NULL;
