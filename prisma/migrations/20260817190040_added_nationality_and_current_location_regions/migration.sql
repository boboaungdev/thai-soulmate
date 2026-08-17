/*
  Warnings:

  - You are about to drop the column `region` on the `RegisterInterest` table. All the data in the column will be lost.
  - Added the required column `currentLocationRegion` to the `RegisterInterest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalityRegion` to the `RegisterInterest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisterInterest" DROP COLUMN "region",
ADD COLUMN     "currentLocationRegion" TEXT NOT NULL,
ADD COLUMN     "nationalityRegion" TEXT NOT NULL;
