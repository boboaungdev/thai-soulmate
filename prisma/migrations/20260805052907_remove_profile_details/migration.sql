/*
  Warnings:

  - You are about to drop the column `profileId` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the column `about` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `casualLifestyle` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `customId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `drinking` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `englishFluency` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `exercise` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fullLength` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `headshot` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `idealPartnerAgeRange` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `interests` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lookingFor` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lookingForQualities` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `personality` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `smoking` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `thaiFluency` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_profileId_fkey";

-- DropIndex
DROP INDEX "Membership_profileId_key";

-- DropIndex
DROP INDEX "Profile_customId_key";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "profileId";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "about",
DROP COLUMN "casualLifestyle",
DROP COLUMN "customId",
DROP COLUMN "drinking",
DROP COLUMN "education",
DROP COLUMN "englishFluency",
DROP COLUMN "exercise",
DROP COLUMN "fullLength",
DROP COLUMN "headshot",
DROP COLUMN "height",
DROP COLUMN "idealPartnerAgeRange",
DROP COLUMN "interests",
DROP COLUMN "lookingFor",
DROP COLUMN "lookingForQualities",
DROP COLUMN "nickname",
DROP COLUMN "occupation",
DROP COLUMN "personality",
DROP COLUMN "religion",
DROP COLUMN "smoking",
DROP COLUMN "thaiFluency",
DROP COLUMN "weight";
