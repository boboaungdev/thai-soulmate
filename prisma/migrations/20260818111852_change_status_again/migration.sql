/*
  Warnings:

  - The values [FEMALE_MEMBER,MALE_MEMBER] on the enum `TrackingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TrackingStatus_new" AS ENUM ('INITIAL_CONNECT', 'BOTH_PROFILES_SENT', 'FEMALE_REVIEW', 'FEMALE_THINKING', 'FEMALE_REJECTED', 'FEMALE_ACCEPTED', 'MALE_REVIEW', 'MALE_THINKING', 'MALE_REJECTED', 'MALE_ACCEPTED', 'BOTH_PROFILES_ACCEPTED', 'FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'FIRST_FOLLOW_UP', 'SECOND_FOLLOW_UP', 'THIRD_FOLLOW_UP', 'MATCHED', 'CLOSED');
ALTER TABLE "public"."Tracking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tracking" ALTER COLUMN "status" TYPE "TrackingStatus_new" USING ("status"::text::"TrackingStatus_new");
ALTER TABLE "Tracking" ALTER COLUMN "closedFromStatus" TYPE "TrackingStatus_new" USING ("closedFromStatus"::text::"TrackingStatus_new");
ALTER TYPE "TrackingStatus" RENAME TO "TrackingStatus_old";
ALTER TYPE "TrackingStatus_new" RENAME TO "TrackingStatus";
DROP TYPE "public"."TrackingStatus_old";
ALTER TABLE "Tracking" ALTER COLUMN "status" SET DEFAULT 'INITIAL_CONNECT';
COMMIT;
