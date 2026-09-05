-- AlterTable
ALTER TABLE "RegisterInterest" ALTER COLUMN "dob" DROP NOT NULL;
ALTER TABLE "RegisterInterest" ADD COLUMN "relationshipGoal" TEXT;
