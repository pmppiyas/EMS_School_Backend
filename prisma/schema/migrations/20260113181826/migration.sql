/*
  Warnings:

  - Added the required column `teacherId` to the `diary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diary" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "diary" ADD CONSTRAINT "diary_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
