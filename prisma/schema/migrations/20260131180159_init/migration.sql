/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classSchedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classTimes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feePayments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feeTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `results` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentSubjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teachers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_classId_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "classSchedules" DROP CONSTRAINT "classSchedules_classId_fkey";

-- DropForeignKey
ALTER TABLE "classSchedules" DROP CONSTRAINT "classSchedules_classTimeId_fkey";

-- DropForeignKey
ALTER TABLE "classSchedules" DROP CONSTRAINT "classSchedules_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "classSchedules" DROP CONSTRAINT "classSchedules_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "diaries" DROP CONSTRAINT "diaries_classId_fkey";

-- DropForeignKey
ALTER TABLE "diaries" DROP CONSTRAINT "diaries_periodId_fkey";

-- DropForeignKey
ALTER TABLE "diaries" DROP CONSTRAINT "diaries_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "diaries" DROP CONSTRAINT "diaries_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "feePayments" DROP CONSTRAINT "feePayments_feeTypeId_fkey";

-- DropForeignKey
ALTER TABLE "feePayments" DROP CONSTRAINT "feePayments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "feeTypes" DROP CONSTRAINT "feeTypes_classId_fkey";

-- DropForeignKey
ALTER TABLE "notices" DROP CONSTRAINT "notices_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_feePaymentId_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_classId_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_studentId_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "studentSubjects" DROP CONSTRAINT "studentSubjects_studentId_fkey";

-- DropForeignKey
ALTER TABLE "studentSubjects" DROP CONSTRAINT "studentSubjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_classId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "attendance";

-- DropTable
DROP TABLE "classSchedules";

-- DropTable
DROP TABLE "classTimes";

-- DropTable
DROP TABLE "classes";

-- DropTable
DROP TABLE "diaries";

-- DropTable
DROP TABLE "feePayments";

-- DropTable
DROP TABLE "feeTypes";

-- DropTable
DROP TABLE "notices";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "results";

-- DropTable
DROP TABLE "studentSubjects";

-- DropTable
DROP TABLE "students";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "teachers";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "AttendanceStatus";

-- DropEnum
DROP TYPE "Classes";

-- DropEnum
DROP TYPE "FeeCategory";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "TERM";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "UserStatus";

-- DropEnum
DROP TYPE "WeekDay";
