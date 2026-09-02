-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TrackingNoteType" ADD VALUE 'BOTH_PROFILES_SENT';
ALTER TYPE "TrackingNoteType" ADD VALUE 'FEMALE_REVIEW';
ALTER TYPE "TrackingNoteType" ADD VALUE 'FEMALE_THINKING';
ALTER TYPE "TrackingNoteType" ADD VALUE 'FEMALE_REJECTED';
ALTER TYPE "TrackingNoteType" ADD VALUE 'FEMALE_ACCEPTED';
ALTER TYPE "TrackingNoteType" ADD VALUE 'MALE_REVIEW';
ALTER TYPE "TrackingNoteType" ADD VALUE 'MALE_THINKING';
ALTER TYPE "TrackingNoteType" ADD VALUE 'MALE_REJECTED';
ALTER TYPE "TrackingNoteType" ADD VALUE 'MALE_ACCEPTED';
ALTER TYPE "TrackingNoteType" ADD VALUE 'BOTH_PROFILES_ACCEPTED';
ALTER TYPE "TrackingNoteType" ADD VALUE 'FIRST_FOLLOW_UP';
ALTER TYPE "TrackingNoteType" ADD VALUE 'SECOND_FOLLOW_UP';
ALTER TYPE "TrackingNoteType" ADD VALUE 'THIRD_FOLLOW_UP';
ALTER TYPE "TrackingNoteType" ADD VALUE 'MATCHED';
