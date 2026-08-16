/*
  Warnings:

  - The values [CONTACTED_EMAIL,CONTACTED_PHONE,CONTACTED_WHATSAPP] on the enum `RegisterInterestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegisterInterestStatus_new" AS ENUM ('RECEIVED', 'PENDING', 'ACCEPTED', 'DECLINED');
ALTER TABLE "public"."RegisterInterest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "RegisterInterest" ALTER COLUMN "status" TYPE "RegisterInterestStatus_new" USING ("status"::text::"RegisterInterestStatus_new");
ALTER TYPE "RegisterInterestStatus" RENAME TO "RegisterInterestStatus_old";
ALTER TYPE "RegisterInterestStatus_new" RENAME TO "RegisterInterestStatus";
DROP TYPE "public"."RegisterInterestStatus_old";
ALTER TABLE "RegisterInterest" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;
