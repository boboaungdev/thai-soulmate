/*
  Warnings:

  - The values [MALE_PROFILE_SENT,FEMALE_PROFILE_SENT,PROFILES_ACCEPTED,FOLLOW_UP] on the enum `SoulmateStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SoulmateStatus_new" AS ENUM ('INITIAL_CONNECT', 'MALE_PROFILE_SENT_TO_FEMALE', 'FEMALE_REJECT', 'FEMALE_ACCEPTED', 'FEMALE_PROFILE_SENT_TO_MALE', 'MALE_REJECT', 'MALE_ACCEPTED', 'FIRST_GOOGLE_MEET', 'REVIEW_FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'REVIEW_SECOND_GOOGLE_MEET', 'THIRD_GOOGLE_MEET', 'REVIEW_THIRD_GOOGLE_MEET', 'FINAL_MATCH', 'CONNECTED', 'CLOSED');
ALTER TABLE "public"."Soulmate" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Soulmate" ALTER COLUMN "status" TYPE "SoulmateStatus_new" USING ("status"::text::"SoulmateStatus_new");
ALTER TYPE "SoulmateStatus" RENAME TO "SoulmateStatus_old";
ALTER TYPE "SoulmateStatus_new" RENAME TO "SoulmateStatus";
DROP TYPE "public"."SoulmateStatus_old";
ALTER TABLE "Soulmate" ALTER COLUMN "status" SET DEFAULT 'INITIAL_CONNECT';
COMMIT;
