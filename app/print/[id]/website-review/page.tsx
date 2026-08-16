import { notFound } from "next/navigation"
import { Prisma } from "@/lib/generated/prisma/client"
import { formatDateTime } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { APP_INFO } from "@/constants"

import { PrintTrigger } from "./print-trigger"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center">
    <h2 className="text-gradient text-lg font-bold">{children}</h2>
  </div>
)

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
    <section className="break-inside-avoid">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : String(value) || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </section>
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
    <div className="bg-white text-black" id="printable-area">
      <PrintTrigger id={id} />
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
          .text-gradient {
            background: linear-gradient(to right, #f2b854, #f07797);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        }
      `}</style>
      <main className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-5">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={56} height={56} />
            <div className="text-center">
              <h1 className="text-gradient text-xl font-bold">
                {APP_INFO.name}
              </h1>
              <p className="text-sm text-gray-400">{APP_INFO.tagline}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-500 uppercase">
              Website Review
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Submitted: {formatDateTime(review.createdAt)}
            </p>
          </div>
        </header>

        <div className="rounded-lg bg-amber-50/30 p-6">
          <div className="space-y-8">
            <DetailSection
              title="First Impression"
              data={review.firstImpression}
            />
            <DetailSection title="Ease of Use" data={review.easeOfUse} />
            <DetailSection
              title="Design & Branding"
              data={review.designBranding}
            />
            <DetailSection
              title="Understanding of Service"
              data={review.understandingService}
            />
            <DetailSection title="Trust & Safety" data={review.trustSafety} />
            <DetailSection
              title="Content Quality"
              data={review.contentQuality}
            />
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
      </main>
    </div>
  )
}
