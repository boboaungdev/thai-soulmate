-- AlterTable
ALTER TABLE "Tracking" ADD COLUMN     "completedStatuses" "TrackingStatus"[] DEFAULT ARRAY['INITIAL_CONNECT']::"TrackingStatus"[];
