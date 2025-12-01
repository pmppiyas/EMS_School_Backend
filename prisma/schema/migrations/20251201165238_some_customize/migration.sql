-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "gender" DROP NOT NULL;
