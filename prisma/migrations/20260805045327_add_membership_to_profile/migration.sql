/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "profileId" TEXT,
ALTER COLUMN "applicationFormId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Membership_profileId_key" ON "Membership"("profileId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
