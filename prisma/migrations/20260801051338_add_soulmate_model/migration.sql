-- CreateEnum
CREATE TYPE "SoulmateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "NoteType" ADD VALUE 'SOULMATE';

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "soulmateId" TEXT;

-- CreateTable
CREATE TABLE "Soulmate" (
    "id" TEXT NOT NULL,
    "maleId" TEXT NOT NULL,
    "femaleId" TEXT NOT NULL,
    "status" "SoulmateStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Soulmate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Soulmate_maleId_femaleId_key" ON "Soulmate"("maleId", "femaleId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_soulmateId_fkey" FOREIGN KEY ("soulmateId") REFERENCES "Soulmate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soulmate" ADD CONSTRAINT "Soulmate_maleId_fkey" FOREIGN KEY ("maleId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soulmate" ADD CONSTRAINT "Soulmate_femaleId_fkey" FOREIGN KEY ("femaleId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
