-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('FREE', 'VIP');

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "applicationFormId" TEXT NOT NULL,
    "type" "MembershipType" NOT NULL DEFAULT 'FREE',
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_applicationFormId_key" ON "Membership"("applicationFormId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_applicationFormId_fkey" FOREIGN KEY ("applicationFormId") REFERENCES "ApplicationForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
