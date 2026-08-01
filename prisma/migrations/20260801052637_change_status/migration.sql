/*
  Warnings:

  - The values [PENDING,APPROVED,REJECTED] on the enum `SoulmateStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SoulmateStatus_new" AS ENUM ('INITIAL_CONNECT', 'MALE_PROFILE_SENT', 'FEMALE_PROFILE_SENT', 'MALE_REJECT', 'FEMALE_REJECT', 'PROFILES_ACCEPTED', 'FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'FOLLOW_UP');
ALTER TABLE "public"."Soulmate" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Soulmate" ALTER COLUMN "status" TYPE "SoulmateStatus_new" USING ("status"::text::"SoulmateStatus_new");
ALTER TYPE "SoulmateStatus" RENAME TO "SoulmateStatus_old";
ALTER TYPE "SoulmateStatus_new" RENAME TO "SoulmateStatus";
DROP TYPE "public"."SoulmateStatus_old";
ALTER TABLE "Soulmate" ALTER COLUMN "status" SET DEFAULT 'INITIAL_CONNECT';
COMMIT;

-- AlterTable
ALTER TABLE "Soulmate" ALTER COLUMN "status" SET DEFAULT 'INITIAL_CONNECT';
