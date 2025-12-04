/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClassSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClassTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassSchedule" DROP CONSTRAINT "ClassSchedule_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSchedule" DROP CONSTRAINT "ClassSchedule_classTimeId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSchedule" DROP CONSTRAINT "ClassSchedule_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "ClassSchedule" DROP CONSTRAINT "ClassSchedule_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Notice" DROP CONSTRAINT "Notice_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "StudentSubject" DROP CONSTRAINT "StudentSubject_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentSubject" DROP CONSTRAINT "StudentSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_studentId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_classId_fkey";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "ClassSchedule";

-- DropTable
DROP TABLE "ClassTime";

-- DropTable
DROP TABLE "Notice";

-- DropTable
DROP TABLE "StudentSubject";

-- DropTable
DROP TABLE "Subject";

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "studentId" TEXT,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "pinned" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classSchedules" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classTimeId" TEXT,

    CONSTRAINT "classSchedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classTimes" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "classTimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentSubjects" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "dayOfWeek" "WeekDay" NOT NULL,

    CONSTRAINT "studentSubjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "studentSubjects_studentId_subjectId_dayOfWeek_key" ON "studentSubjects"("studentId", "subjectId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classSchedules" ADD CONSTRAINT "classSchedules_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classSchedules" ADD CONSTRAINT "classSchedules_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classSchedules" ADD CONSTRAINT "classSchedules_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classSchedules" ADD CONSTRAINT "classSchedules_classTimeId_fkey" FOREIGN KEY ("classTimeId") REFERENCES "classTimes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentSubjects" ADD CONSTRAINT "studentSubjects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentSubjects" ADD CONSTRAINT "studentSubjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
