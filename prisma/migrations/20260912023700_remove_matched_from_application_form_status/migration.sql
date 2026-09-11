-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationFormStatus_new" AS ENUM ('RECEIVED', 'PENDING', 'COMPLETED', 'CLOSED');
ALTER TABLE "public"."ApplicationForm" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ApplicationForm" ALTER COLUMN "status" TYPE "ApplicationFormStatus_new" USING ("status"::text::"ApplicationFormStatus_new");
ALTER TYPE "ApplicationFormStatus" RENAME TO "ApplicationFormStatus_old";
ALTER TYPE "ApplicationFormStatus_new" RENAME TO "ApplicationFormStatus";
DROP TYPE "public"."ApplicationFormStatus_old";
ALTER TABLE "ApplicationForm" ALTER COLUMN "status" SET DEFAULT 'RECEIVED';
COMMIT;
