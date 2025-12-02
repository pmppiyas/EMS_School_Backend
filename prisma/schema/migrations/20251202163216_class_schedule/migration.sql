/*
  Warnings:

  - You are about to drop the column `endTime` on the `ClassSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `ClassSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClassSchedule" DROP COLUMN "endTime",
DROP COLUMN "startTime";
