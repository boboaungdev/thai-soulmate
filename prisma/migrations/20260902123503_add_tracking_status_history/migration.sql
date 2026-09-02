-- CreateTable
CREATE TABLE "TrackingStatusHistory" (
    "id" TEXT NOT NULL,
    "status" "TrackingStatus" NOT NULL,
    "trackingId" TEXT NOT NULL,
    "changedBy" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackingStatusHistory_trackingId_idx" ON "TrackingStatusHistory"("trackingId");

-- CreateIndex
CREATE INDEX "TrackingStatusHistory_trackingId_status_idx" ON "TrackingStatusHistory"("trackingId", "status");

-- AddForeignKey
ALTER TABLE "TrackingStatusHistory" ADD CONSTRAINT "TrackingStatusHistory_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
