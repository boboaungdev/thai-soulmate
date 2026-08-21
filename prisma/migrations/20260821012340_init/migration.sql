-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEV', 'ADMIN', 'STAFF', 'MEMBER');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('REGISTER_INTEREST', 'APPLICATION_FORM', 'PROFILE');

-- CreateEnum
CREATE TYPE "RegisterInterestStatus" AS ENUM ('RECEIVED', 'PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ApplicationFormStatus" AS ENUM ('RECEIVED', 'PENDING', 'COMPLETED', 'MATCHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MembershipPlan" AS ENUM ('NONE', 'FEMALE_FREE', 'FEMALE_VIP_ONE_MONTH', 'FEMALE_VIP_THREE_MONTHS', 'FEMALE_VIP_SIX_MONTHS', 'MALE_ONE_MONTH', 'MALE_THREE_MONTHS', 'MALE_SIX_MONTHS');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('INITIAL_CONNECT', 'BOTH_PROFILES_SENT', 'FEMALE_REVIEW', 'FEMALE_THINKING', 'FEMALE_REJECTED', 'FEMALE_ACCEPTED', 'MALE_REVIEW', 'MALE_THINKING', 'MALE_REJECTED', 'MALE_ACCEPTED', 'BOTH_PROFILES_ACCEPTED', 'FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'FIRST_FOLLOW_UP', 'SECOND_FOLLOW_UP', 'THIRD_FOLLOW_UP', 'MATCHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TrackingNoteType" AS ENUM ('INITIAL_CONNECT', 'MALE_PROFILE_SENT_TO_FEMALE', 'FEMALE_PROFILE_SENT_TO_MALE', 'FIRST_GOOGLE_MEET', 'SECOND_GOOGLE_MEET', 'THIRD_GOOGLE_MEET', 'FINAL_MATCH', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisterInterest" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "nationalityRegion" TEXT NOT NULL,
    "currentLocation" TEXT NOT NULL,
    "currentLocationRegion" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneCountry" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "otherSource" TEXT,
    "status" "RegisterInterestStatus" NOT NULL DEFAULT 'RECEIVED',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisterInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NoteType" NOT NULL,
    "registerInterestId" TEXT,
    "applicationFormId" TEXT,
    "profileId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationForm" (
    "id" TEXT NOT NULL,
    "customId" SERIAL NOT NULL,
    "status" "ApplicationFormStatus" NOT NULL DEFAULT 'RECEIVED',
    "personalDetails" JSONB NOT NULL,
    "career" JSONB NOT NULL,
    "appearance" JSONB NOT NULL,
    "personality" JSONB NOT NULL,
    "lifestyle" JSONB NOT NULL,
    "relationshipGoals" JSONB NOT NULL,
    "idealPartner" JSONB NOT NULL,
    "financial" JSONB NOT NULL,
    "photos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "applicationFormId" TEXT NOT NULL,
    "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "applicationFormId" TEXT,
    "plan" "MembershipPlan" NOT NULL DEFAULT 'NONE',
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstImpression" JSONB NOT NULL,
    "easeOfUse" JSONB NOT NULL,
    "designBranding" JSONB NOT NULL,
    "understandingService" JSONB NOT NULL,
    "trustSafety" JSONB NOT NULL,
    "contentQuality" JSONB NOT NULL,
    "registrationProcess" JSONB NOT NULL,
    "pricingValue" JSONB NOT NULL,
    "overallExperience" JSONB NOT NULL,
    "matchmakingSpecific" JSONB NOT NULL,
    "reviewerInfo" JSONB,

    CONSTRAINT "WebsiteReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterInterest_email_key" ON "RegisterInterest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterInterest_userId_key" ON "RegisterInterest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationForm_customId_key" ON "ApplicationForm"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_applicationFormId_key" ON "Profile"("applicationFormId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_applicationFormId_key" ON "Membership"("applicationFormId");

-- AddForeignKey
ALTER TABLE "RegisterInterest" ADD CONSTRAINT "RegisterInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_registerInterestId_fkey" FOREIGN KEY ("registerInterestId") REFERENCES "RegisterInterest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_applicationFormId_fkey" FOREIGN KEY ("applicationFormId") REFERENCES "ApplicationForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_applicationFormId_fkey" FOREIGN KEY ("applicationFormId") REFERENCES "ApplicationForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_applicationFormId_fkey" FOREIGN KEY ("applicationFormId") REFERENCES "ApplicationForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_maleId_fkey" FOREIGN KEY ("maleId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_femaleId_fkey" FOREIGN KEY ("femaleId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingNote" ADD CONSTRAINT "TrackingNote_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingNote" ADD CONSTRAINT "TrackingNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
