-- DropForeignKey
ALTER TABLE "TrackingNote" DROP CONSTRAINT "TrackingNote_trackingId_fkey";

-- CreateTable
CREATE TABLE "TrackingFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "r2Key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "folderId" TEXT,
    "trackingId" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackingFolder_trackingId_name_key" ON "TrackingFolder"("trackingId", "name");

-- AddForeignKey
ALTER TABLE "TrackingFolder" ADD CONSTRAINT "TrackingFolder_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingFile" ADD CONSTRAINT "TrackingFile_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "TrackingFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingFile" ADD CONSTRAINT "TrackingFile_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingNote" ADD CONSTRAINT "TrackingNote_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
