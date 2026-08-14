/*
  Warnings:

  - You are about to drop the `Soulmate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SoulmateNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('INITIAL_CONNECT', 'MALE_PROFILE_SENT_TO_FEMALE', 'FEMALE_THINKING', 'FEMALE_REJECT', 'FEMALE_ACCEPTED', 'FEMALE_PROFILE_SENT_TO_MALE', 'MALE_THINKING', 'MALE_REJECT', 'MALE_ACCEPTED', 'FIRST_GOOGLE_MEET', 'REVIEW_FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'REVIEW_SECOND_GOOGLE_MEET', 'THIRD_GOOGLE_MEET', 'REVIEW_THIRD_GOOGLE_MEET', 'FINAL_MATCH', 'CONNECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TrackingNoteType" AS ENUM ('INITIAL_CONNECT', 'MALE_PROFILE_SENT_TO_FEMALE', 'FEMALE_PROFILE_SENT_TO_MALE', 'FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'THIRD_GOOGLE_MEET', 'FINAL_MATCH', 'CLOSED');

-- DropForeignKey
ALTER TABLE "Soulmate" DROP CONSTRAINT "Soulmate_femaleId_fkey";

-- DropForeignKey
ALTER TABLE "Soulmate" DROP CONSTRAINT "Soulmate_maleId_fkey";

-- DropForeignKey
ALTER TABLE "SoulmateNote" DROP CONSTRAINT "SoulmateNote_soulmateId_fkey";

-- DropForeignKey
ALTER TABLE "SoulmateNote" DROP CONSTRAINT "SoulmateNote_userId_fkey";

-- DropTable
DROP TABLE "Soulmate";

-- DropTable
DROP TABLE "SoulmateNote";

-- DropEnum
DROP TYPE "SoulmateNoteType";

-- DropEnum
DROP TYPE "SoulmateStatus";

-- CreateTable
CREATE TABLE "Tracking" (
    "id" TEXT NOT NULL,
    "maleId" TEXT NOT NULL,
    "femaleId" TEXT NOT NULL,
    "matchPercentage" INTEGER NOT NULL,
    "status" "TrackingStatus" NOT NULL DEFAULT 'INITIAL_CONNECT',
    "closedFromStatus" "TrackingStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingNote" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "TrackingNoteType" NOT NULL,
    "trackingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_maleId_fkey" FOREIGN KEY ("maleId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_femaleId_fkey" FOREIGN KEY ("femaleId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingNote" ADD CONSTRAINT "TrackingNote_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingNote" ADD CONSTRAINT "TrackingNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
