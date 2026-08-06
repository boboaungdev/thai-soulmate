-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstImpression" JSONB NOT NULL,
    "easeOfUse" JSONB NOT NULL,
    "designBranding" JSONB NOT NULL,
    "understandingService" JSONB NOT NULL,
    "trustSafety" JSONB NOT NULL,
    "contentQuality" JSONB NOT NULL,
    "registrationProcess" JSONB NOT NULL,
    "pricingValue" JSONB NOT NULL,
    "overallExperience" JSONB NOT NULL,
    "matchmakingSpecific" JSONB NOT NULL,
    "reviewerInfo" JSONB,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
