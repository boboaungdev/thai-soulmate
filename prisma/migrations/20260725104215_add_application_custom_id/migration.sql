/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `ApplicationForm` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ApplicationForm" ADD COLUMN     "customId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationForm_customId_key" ON "ApplicationForm"("customId");
