import { notFound } from "next/navigation"
import { Prisma } from "@/lib/generated/prisma/client"
import { Separator } from "@/components/ui/separator"
import { formatDateTime } from "@/lib/date"
import { prisma } from "@/lib/prisma"

import { PrintTrigger } from "./print-trigger"

const DetailSection = ({
  title,
  data,
}: {
  title: string
  data: Prisma.JsonValue
}) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null
  }

  const entries = Object.entries(data)
  if (entries.length === 0) return null

  return (
    <div className="break-inside-avoid space-y-2">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="font-medium text-gray-600 capitalize">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              :
            </span>{" "}
            <span className="text-gray-800">
              {typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : String(value) || "N/A"}
            </span>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
    </div>
  )
}

export default async function PrintWebsiteReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const review = await prisma.websiteReview.findUnique({
    where: { id },
  })

  if (!review) {
    notFound()
  }

  return (
    <div className="bg-white p-8 font-sans" id="printable-area">
      <PrintTrigger />
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
      `}</style>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Website Review Details</h1>
        <p className="text-sm text-gray-500">
          Submitted on: {formatDateTime(review.createdAt)}
        </p>
      </div>

      <div className="space-y-6">
        <DetailSection title="First Impression" data={review.firstImpression} />
        <DetailSection title="Ease of Use" data={review.easeOfUse} />
        <DetailSection title="Design & Branding" data={review.designBranding} />
        <DetailSection
          title="Understanding of Service"
          data={review.understandingService}
        />
        <DetailSection title="Trust & Safety" data={review.trustSafety} />
        <DetailSection title="Content Quality" data={review.contentQuality} />
        <DetailSection
          title="Registration Process"
          data={review.registrationProcess}
        />
        <DetailSection title="Pricing & Value" data={review.pricingValue} />
        <DetailSection
          title="Overall Experience"
          data={review.overallExperience}
        />
        <DetailSection
          title="Matchmaking Specific"
          data={review.matchmakingSpecific}
        />
        <DetailSection title="Reviewer Info" data={review.reviewerInfo} />
      </div>
    </div>
  )
}
