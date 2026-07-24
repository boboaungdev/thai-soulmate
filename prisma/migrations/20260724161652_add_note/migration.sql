-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'USER');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('REGISTER_INTEREST', 'APPLICATION_FORM');

-- CreateEnum
CREATE TYPE "RegisterInterestStatus" AS ENUM ('PENDING', 'CONTACTED_EMAIL', 'CONTACTED_PHONE', 'CONTACTED_WHATSAPP', 'COMPLETED', 'NOT_INTERESTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
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
    "currentLocation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneCountry" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "otherSource" TEXT,
    "status" "RegisterInterestStatus" NOT NULL DEFAULT 'PENDING',
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
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationForm" (
    "id" TEXT NOT NULL,
    "personalDetails" JSONB NOT NULL,
    "contact" JSONB NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterInterest_email_key" ON "RegisterInterest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterInterest_userId_key" ON "RegisterInterest"("userId");

-- AddForeignKey
ALTER TABLE "RegisterInterest" ADD CONSTRAINT "RegisterInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_registerInterestId_fkey" FOREIGN KEY ("registerInterestId") REFERENCES "RegisterInterest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_applicationFormId_fkey" FOREIGN KEY ("applicationFormId") REFERENCES "ApplicationForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
