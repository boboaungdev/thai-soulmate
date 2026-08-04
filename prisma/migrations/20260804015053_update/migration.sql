/*
  Warnings:

  - The values [OPEN,IN_MATCHING] on the enum `ApplicationFormStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMPLETED,NOT_INTERESTED] on the enum `RegisterInterestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationFormStatus_new" AS ENUM ('RECEIVED', 'PENDING', 'COMPLETED', 'MATCHED', 'CLOSED');
ALTER TABLE "public"."ApplicationForm" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ApplicationForm" ALTER COLUMN "status" TYPE "ApplicationFormStatus_new" USING ("status"::text::"ApplicationFormStatus_new");
ALTER TYPE "ApplicationFormStatus" RENAME TO "ApplicationFormStatus_old";
ALTER TYPE "ApplicationFormStatus_new" RENAME TO "ApplicationFormStatus";
DROP TYPE "public"."ApplicationFormStatus_old";
ALTER TABLE "ApplicationForm" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RegisterInterestStatus_new" AS ENUM ('RECEIVED', 'PENDING', 'ACCEPTED', 'DECLINED', 'CONTACTED_EMAIL', 'CONTACTED_PHONE', 'CONTACTED_WHATSAPP');
ALTER TABLE "public"."RegisterInterest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "RegisterInterest" ALTER COLUMN "status" TYPE "RegisterInterestStatus_new" USING ("status"::text::"RegisterInterestStatus_new");
ALTER TYPE "RegisterInterestStatus" RENAME TO "RegisterInterestStatus_old";
ALTER TYPE "RegisterInterestStatus_new" RENAME TO "RegisterInterestStatus";
DROP TYPE "public"."RegisterInterestStatus_old";
ALTER TABLE "RegisterInterest" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;

-- AlterTable
ALTER TABLE "ApplicationForm" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';

-- AlterTable
ALTER TABLE "RegisterInterest" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
