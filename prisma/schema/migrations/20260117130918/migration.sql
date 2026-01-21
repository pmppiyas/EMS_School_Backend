/*
  Warnings:

  - You are about to drop the column `studentId` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the `diary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classId` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "diary" DROP CONSTRAINT "diary_classId_fkey";

-- DropForeignKey
ALTER TABLE "diary" DROP CONSTRAINT "diary_periodId_fkey";

-- DropForeignKey
ALTER TABLE "diary" DROP CONSTRAINT "diary_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "diary" DROP CONSTRAINT "diary_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_studentId_fkey";

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "studentId",
ADD COLUMN     "classId" TEXT NOT NULL;

-- DropTable
DROP TABLE "diary";

-- CreateTable
CREATE TABLE "diaries" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "diaries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "classTimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaries" ADD CONSTRAINT "diaries_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
