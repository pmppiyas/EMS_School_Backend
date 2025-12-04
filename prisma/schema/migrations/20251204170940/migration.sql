/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `feeTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "feeTypes_category_key" ON "feeTypes"("category");
