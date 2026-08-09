/*
  Warnings:

  - The values [MANUAL] on the enum `SoulmateNoteType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SoulmateNoteType_new" AS ENUM ('INITIAL_CONNECT', 'MALE_PROFILE_SENT_TO_FEMALE', 'FEMALE_PROFILE_SENT_TO_MALE', 'FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'THIRD_GOOGLE_MEET', 'FINAL_MATCH', 'CLOSED');
ALTER TABLE "SoulmateNote" ALTER COLUMN "type" TYPE "SoulmateNoteType_new" USING ("type"::text::"SoulmateNoteType_new");
ALTER TYPE "SoulmateNoteType" RENAME TO "SoulmateNoteType_old";
ALTER TYPE "SoulmateNoteType_new" RENAME TO "SoulmateNoteType";
DROP TYPE "public"."SoulmateNoteType_old";
COMMIT;
