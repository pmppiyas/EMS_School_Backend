-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_classId_fkey";

-- AlterTable
ALTER TABLE "attendance" ALTER COLUMN "classId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
