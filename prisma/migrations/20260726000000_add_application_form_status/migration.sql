-- CreateEnum
CREATE TYPE "ApplicationFormStatus" AS ENUM ('OPEN', 'IN_MATCHING', 'MATCHED', 'CLOSED');

-- AlterTable
ALTER TABLE "ApplicationForm" ADD COLUMN "status" "ApplicationFormStatus" NOT NULL DEFAULT 'OPEN';
