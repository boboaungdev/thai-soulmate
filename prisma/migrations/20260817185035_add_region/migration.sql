/*
  Warnings:

  - Added the required column `region` to the `RegisterInterest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RegisterInterest" ADD COLUMN     "region" TEXT NOT NULL;
