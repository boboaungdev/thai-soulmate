/*
  Warnings:

  - You are about to drop the column `type` on the `Membership` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipPlan" AS ENUM ('NONE', 'FEMALE_FREE', 'FEMALE_VIP_ONE_MONTH', 'FEMALE_VIP_THREE_MONTHS', 'FEMALE_VIP_SIX_MONTHS', 'MALE_ONE_MONTH', 'MALE_THREE_MONTHS', 'MALE_SIX_MONTHS');

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "type",
ADD COLUMN     "plan" "MembershipPlan" NOT NULL DEFAULT 'NONE';

-- DropEnum
DROP TYPE "MembershipType";
