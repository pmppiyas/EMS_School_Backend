/*
  Warnings:

  - You are about to drop the `diery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "diery";

-- CreateTable
CREATE TABLE "diary" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "diary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "diary" ADD CONSTRAINT "diary_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diary" ADD CONSTRAINT "diary_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diary" ADD CONSTRAINT "diary_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "classTimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
