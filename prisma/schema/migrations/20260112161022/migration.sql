/*
  Warnings:

  - You are about to drop the `Diery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Diery";

-- CreateTable
CREATE TABLE "diery" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "diery_pkey" PRIMARY KEY ("id")
);
