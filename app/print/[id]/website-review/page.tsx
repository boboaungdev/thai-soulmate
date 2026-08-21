import { notFound } from "next/navigation"
import { Prisma } from "@/lib/generated/prisma/client"
import { formatDateTime } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { APP_INFO } from "@/constants"

import { PrintTrigger } from "./print-trigger"

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `review-section-gradient-${title.replace(/\W/g, "-")}`

  return (
    <h2 className="h-7 font-bold">
      <svg
        aria-label={title}
        className="block h-7 w-fit"
        role="img"
        viewBox="0 0 360 28"
        preserveAspectRatio="xMinYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#f2b854" />
            <stop offset="1" stopColor="#f07797" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="21"
          fill={`url(#${gradientId})`}
          fontFamily="sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          {title}
        </text>
      </svg>
    </h2>
  )
}

const BrandName = () => (
  <svg
    aria-label={APP_INFO.name}
    className="inline-block h-7 w-[180px]"
    role="img"
    viewBox="0 0 180 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="review-brand-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#f2b854" />
        <stop offset="1" stopColor="#f07797" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#review-brand-gradient)"
      fontFamily="sans-serif"
      fontSize="20"
      fontWeight="700"
      textAnchor="middle"
    >
      {APP_INFO.name}
    </text>
  </svg>
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
      <div className="mt-3">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-start justify-between gap-6 border-b border-gray-100 py-2 last:border-b-0"
          >
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </p>
            <p className="text-right text-sm font-semibold text-gray-800">
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
              <h1 className="text-xl font-bold">
                <BrandName />
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

        <div className="space-y-7 p-8">
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
