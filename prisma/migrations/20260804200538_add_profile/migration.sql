-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterEnum
ALTER TYPE "NoteType" ADD VALUE 'PROFILE';

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "profileId" TEXT;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "customId" INTEGER NOT NULL,
    "applicationFormId" TEXT NOT NULL,
    "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING',
    "nickname" TEXT,
    "occupation" TEXT,
    "education" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "religion" TEXT,
    "thaiFluency" INTEGER,
    "englishFluency" INTEGER,
    "personality" TEXT[],
    "about" TEXT,
    "lookingForQualities" TEXT[],
    "smoking" TEXT,
    "drinking" TEXT,
    "exercise" TEXT,
    "interests" TEXT[],
    "lookingFor" TEXT[],
    "idealPartnerAgeRange" TEXT,
    "headshot" TEXT,
    "fullLength" TEXT,
    "casualLifestyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_customId_key" ON "Profile"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_applicationFormId_key" ON "Profile"("applicationFormId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_applicationFormId_fkey" FOREIGN KEY ("applicationFormId") REFERENCES "ApplicationForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
