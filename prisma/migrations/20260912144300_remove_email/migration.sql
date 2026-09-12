/*
  Warnings:

  - You are about to drop the `EmailAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MailboxSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailAttachment" DROP CONSTRAINT "EmailAttachment_emailId_fkey";

-- DropForeignKey
ALTER TABLE "EmailMessage" DROP CONSTRAINT "EmailMessage_userId_fkey";

-- DropTable
DROP TABLE "EmailAttachment";

-- DropTable
DROP TABLE "EmailMessage";

-- DropTable
DROP TABLE "MailboxSetting";

-- DropEnum
DROP TYPE "EmailDirection";

-- DropEnum
DROP TYPE "EmailFolder";
