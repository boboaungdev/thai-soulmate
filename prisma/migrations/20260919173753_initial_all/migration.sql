/*
  Warnings:

  - You are about to drop the column `currentLocationRegion` on the `RegisterInterest` table. All the data in the column will be lost.
  - You are about to drop the column `dob` on the `RegisterInterest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RegisterInterest` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `RegisterInterest` table. All the data in the column will be lost.
  - You are about to drop the column `nationalityRegion` on the `RegisterInterest` table. All the data in the column will be lost.
  - You are about to drop the column `otherSource` on the `RegisterInterest` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `RegisterInterest` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `RegisterInterest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisterInterest" DROP COLUMN "currentLocationRegion",
DROP COLUMN "dob",
DROP COLUMN "name",
DROP COLUMN "nationality",
DROP COLUMN "nationalityRegion",
DROP COLUMN "otherSource",
DROP COLUMN "source",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT;
