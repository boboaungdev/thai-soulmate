import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { APP_INFO } from "@/constants"
import { formatDateTime } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/lib/generated/prisma/client"
import { PrintTrigger } from "./print-trigger"

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `review-section-gradient-${title.replace(/\W/g, "-")}`

  return (
    <h2 className="h-6 font-bold">
      <svg
        aria-label={title}
        className="block h-6 w-fit"
        role="img"
        viewBox="0 0 360 24"
        preserveAspectRatio="xMinYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D3A753" />
            <stop offset="50%" stopColor="#E791A7" />
            <stop offset="100%" stopColor="#CA617D" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="18"
          fill={`url(#${gradientId})`}
          fontFamily="sans-serif"
          fontSize="15"
          fontWeight="700"
          letterSpacing="0.5"
        >
          {title}
        </text>
      </svg>
    </h2>
  )
}

const BrandName = ({ className = "" }: { className?: string }) => (
  <svg
    aria-label={APP_INFO.name}
    className={`inline-block h-7 w-[180px] ${className}`}
    role="img"
    viewBox="0 0 180 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="review-brand-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#D3A753" />
        <stop offset="50%" stopColor="#E791A7" />
        <stop offset="100%" stopColor="#CA617D" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#review-brand-gradient)"
      fontFamily="sans-serif"
      fontSize="20"
      fontWeight="700"
      letterSpacing="1"
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

  const entries = Object.entries(data).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  )
  if (entries.length === 0) return null

  return (
    <section className="break-inside-avoid">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-2.5">
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
                : Array.isArray(value)
                  ? value.join(", ")
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
    <>
      <PrintTrigger id={id} />

      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: var(--background);
          color: var(--foreground);
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        #printable-area.website-review-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          min-height: 100vh;
          padding: 36px;
          background: var(--background);
        }

        .website-review-page {
          position: relative;
          width: 210mm;
          min-height: 297mm;
          max-width: 210mm;
          background: white !important;
          color: black !important;
          padding: 15mm;
          overflow: hidden;
        }

        /* ========================================================
           PRINT
           ======================================================== */

        @media print {
          html,
          body {
            width: 210mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #printable-area.website-review-document {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            background: white !important;
          }

          .website-review-page {
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            width: 210mm !important;
            height: 297mm !important;
            min-width: 210mm !important;
            min-height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            overflow: hidden !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            break-after: page !important;
            page-break-after: always !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .website-review-page:last-child {
            break-after: auto !important;
            page-break-after: auto !important;
          }

          img,
          svg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <main
        id="printable-area"
        className="website-review-document min-h-screen bg-muted/40 dark:bg-neutral-950"
      >
        {/* ============================================================
            PAGE 1: OVERVIEW & FIRST IMPRESSION
            ============================================================ */}
        <section className="website-review-page flex flex-col justify-between text-black shadow-2xl">
          <div>
            {/* Header */}
            <header className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-4">
              <div className="flex items-center gap-3.5">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={52}
                  height={52}
                  unoptimized
                  className="shrink-0"
                />
                <div className="flex flex-col items-center text-center">
                  <h1 className="flex justify-center leading-none">
                    <BrandName />
                  </h1>
                  <p className="mt-1 w-full text-center font-sans text-[9px] font-semibold tracking-[0.3em] text-[#E791A7] uppercase">
                    Exclusive
                  </p>
                  <p className="mt-0.5 w-full text-center font-sans text-[10.5px] font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
                    {APP_INFO.tagline}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Website Review
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Submitted: {formatDateTime(review.createdAt)}
                </p>
              </div>
            </header>

            <div className="space-y-6">
              {review.reviewerInfo && (
                <DetailSection
                  title="Reviewer Information"
                  data={review.reviewerInfo}
                />
              )}
              <DetailSection
                title="Overall Experience"
                data={review.overallExperience}
              />
              <DetailSection
                title="First Impression"
                data={review.firstImpression}
              />
              <DetailSection title="Ease of Use" data={review.easeOfUse} />
            </div>
          </div>

          {/* Page 1 Footer */}
          <footer className="mt-6 flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Website Review</span>
            <span>Page 1 of 3</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 2: BRANDING, CONTENT & TRUST
            ============================================================ */}
        <section className="website-review-page flex flex-col justify-between text-black shadow-2xl">
          <div>
            <header className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={42}
                  height={42}
                  unoptimized
                  className="shrink-0"
                />
                <div className="flex flex-col items-center text-center">
                  <div className="flex justify-center leading-none">
                    <BrandName className="!h-5.5 !w-[145px]" />
                  </div>
                  <p className="mt-0.5 w-full text-center font-sans text-[8px] font-semibold tracking-[0.25em] text-[#E791A7] uppercase">
                    Exclusive
                  </p>
                  <p className="mt-0.5 w-full text-center font-sans text-[9px] font-semibold tracking-[0.16em] text-[#D3A753] uppercase">
                    {APP_INFO.tagline}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Website Review
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Submitted: {formatDateTime(review.createdAt)}
                </p>
              </div>
            </header>

            <div className="space-y-6">
              <DetailSection
                title="Design & Branding"
                data={review.designBranding}
              />
              <DetailSection
                title="Understanding of Service"
                data={review.understandingService}
              />
              <DetailSection
                title="Content Quality"
                data={review.contentQuality}
              />
              <DetailSection title="Trust & Safety" data={review.trustSafety} />
            </div>
          </div>

          {/* Page 2 Footer */}
          <footer className="mt-6 flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Website Review</span>
            <span>Page 2 of 3</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 3: PROCESS, PRICING & MATCHMAKING
            ============================================================ */}
        <section className="website-review-page flex flex-col justify-between text-black shadow-2xl">
          <div>
            <header className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={42}
                  height={42}
                  unoptimized
                  className="shrink-0"
                />
                <div className="flex flex-col items-center text-center">
                  <div className="flex justify-center leading-none">
                    <BrandName className="!h-5.5 !w-[145px]" />
                  </div>
                  <p className="mt-0.5 w-full text-center font-sans text-[8px] font-semibold tracking-[0.25em] text-[#E791A7] uppercase">
                    Exclusive
                  </p>
                  <p className="mt-0.5 w-full text-center font-sans text-[9px] font-semibold tracking-[0.16em] text-[#D3A753] uppercase">
                    {APP_INFO.tagline}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Website Review
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Submitted: {formatDateTime(review.createdAt)}
                </p>
              </div>
            </header>

            <div className="space-y-6">
              <DetailSection
                title="Registration Process"
                data={review.registrationProcess}
              />
              <DetailSection
                title="Pricing & Value"
                data={review.pricingValue}
              />
              <DetailSection
                title="Matchmaking Specific"
                data={review.matchmakingSpecific}
              />
            </div>
          </div>

          {/* Page 3 Footer */}
          <footer className="mt-6 flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Website Review</span>
            <span>Page 3 of 3</span>
          </footer>
        </section>
      </main>
    </>
  )
}
