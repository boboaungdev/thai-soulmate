import React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"
import { formatDOB } from "@/lib/date"
import { PrintTrigger } from "./print-trigger"

type Breakdown = {
  key: string
  category: string
  label: string
  femaleValue: string
  maleValue: string
  malePoints: number
  femalePoints: number
  malePossiblePoints: number
  femalePossiblePoints: number
}

type Applicant = {
  id?: string
  customId: number
  personalDetails?: {
    prefix?: string
    name?: string
    nickname?: string
    gender?: string
    nationality?: string
    currentLocation?: string
    dob?: string
  }
  photos?: {
    headshot?: string
    fullLength?: string
    casualLifestyle?: string
  }
}

type Penalty = { label: string; penalty: number }

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `matching-section-gradient-${title.replace(/\W/g, "-")}`

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
      <linearGradient id="matching-brand-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#D3A753" />
        <stop offset="50%" stopColor="#E791A7" />
        <stop offset="100%" stopColor="#CA617D" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#matching-brand-gradient)"
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

const getMatchScoreColor = (score: number) => {
  if (score >= 80) return "#16a34a"
  if (score >= 50) return "#ca8a04"
  return "#dc2626"
}

const DetailRow = ({ label, value }: { label: string; value: unknown }) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-1.5 last:border-b-0">
    <span className="text-[11px] font-medium tracking-wider text-gray-500 uppercase">
      {label}
    </span>
    <span className="text-right text-xs font-semibold text-gray-800">
      {String(value || "Not provided")}
    </span>
  </div>
)

export default async function MatchComparisonPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ maleId?: string; femaleId?: string }>
}) {
  const { maleId, femaleId } = await searchParams
  if (!maleId || !femaleId) notFound()

  const response = await fetch(
    `${env.BASE_URL}/api/matching/${maleId}/${femaleId}`,
    { cache: "no-store" }
  )
  if (!response.ok) notFound()

  const data = await response.json()
  if (data.error || !data.male || !data.female) notFound()

  const male = data.male as Applicant
  const female = data.female as Applicant
  const breakdown = (data.matchBreakdown || []) as Breakdown[]
  const penalties = (data.dealBreakerPenalties || []) as Penalty[]

  // Split breakdown across 2 pages for optimal readability
  const page1Breakdown = breakdown.slice(0, 6)
  const page2Breakdown = breakdown.slice(6)

  return (
    <>
      <PrintTrigger id={`${maleId}-${femaleId}`} />

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

        #printable-area.matching-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          min-height: 100vh;
          padding: 36px;
          background: var(--background);
        }

        .matching-page {
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

          #printable-area.matching-document {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            background: white !important;
          }

          .matching-page {
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

          .matching-page:last-child {
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
        className="matching-document min-h-screen bg-muted/40 dark:bg-neutral-950"
      >
        {/* ============================================================
            PAGE 1: APPLICANT HEADSHOTS, PROFILES & TOP BREAKDOWN
            ============================================================ */}
        <section className="matching-page flex flex-col justify-between text-black shadow-2xl">
          <div>
            {/* Header */}
            <header className="mb-4 flex items-center justify-between border-b-2 border-gray-100 pb-3">
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
                  Match Comparison
                </p>
                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{
                      backgroundColor: `${getMatchScoreColor(data.matchPercentage)}15`,
                      color: getMatchScoreColor(data.matchPercentage),
                    }}
                  >
                    {data.matchPercentage}% Compatibility
                  </span>
                </div>
              </div>
            </header>

            {/* Top Headshots & Profiles Side-by-Side */}
            <div className="my-3 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
              {/* Male Profile */}
              <div className="flex flex-col items-center text-center">
                {male.photos?.headshot ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-3 border-white shadow-md ring-1 ring-gray-200">
                    <Image
                      src={male.photos.headshot}
                      alt="Male Headshot"
                      fill
                      priority
                      unoptimized
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-gray-200 text-xs text-gray-400">
                    No photo
                  </div>
                )}
                <h3 className="mt-2 text-sm font-bold text-gray-800">
                  {[male.personalDetails?.prefix, male.personalDetails?.name]
                    .filter(Boolean)
                    .join(" ") || "Male Profile"}
                </h3>
                {male.personalDetails?.nickname && (
                  <p className="text-[11px] font-medium text-gray-500">
                    ({male.personalDetails.nickname})
                  </p>
                )}
                <p className="font-mono text-[10px] text-gray-400">
                  ID: {String(male.customId).padStart(4, "0")}
                </p>
              </div>

              {/* Match Score Badge */}
              <div className="flex flex-col items-center px-2">
                <div
                  className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 bg-white shadow-sm"
                  style={{
                    borderColor: getMatchScoreColor(data.matchPercentage),
                  }}
                >
                  <span
                    className="text-sm leading-none font-extrabold"
                    style={{
                      color: getMatchScoreColor(data.matchPercentage),
                    }}
                  >
                    {data.matchPercentage}%
                  </span>
                  <span className="mt-0.5 text-[8px] font-semibold text-gray-400 uppercase">
                    Match
                  </span>
                </div>
              </div>

              {/* Female Profile */}
              <div className="flex flex-col items-center text-center">
                {female.photos?.headshot ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-3 border-white shadow-md ring-1 ring-gray-200">
                    <Image
                      src={female.photos.headshot}
                      alt="Female Headshot"
                      fill
                      priority
                      unoptimized
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-gray-200 text-xs text-gray-400">
                    No photo
                  </div>
                )}
                <h3 className="mt-2 text-sm font-bold text-gray-800">
                  {[
                    female.personalDetails?.prefix,
                    female.personalDetails?.name,
                  ]
                    .filter(Boolean)
                    .join(" ") || "Female Profile"}
                </h3>
                {female.personalDetails?.nickname && (
                  <p className="text-[11px] font-medium text-gray-500">
                    ({female.personalDetails.nickname})
                  </p>
                )}
                <p className="font-mono text-[10px] text-gray-400">
                  ID: {String(female.customId).padStart(4, "0")}
                </p>
              </div>
            </div>

            {/* Applicant Details Comparison */}
            <div className="my-3 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="mb-1 text-xs font-bold text-gray-700">
                  Male Information
                </p>
                <DetailRow
                  label="Age"
                  value={
                    male.personalDetails?.dob
                      ? formatDOB(male.personalDetails.dob, { showAge: true })
                      : "N/A"
                  }
                />
                <DetailRow
                  label="Nationality"
                  value={male.personalDetails?.nationality}
                />
                <DetailRow
                  label="Location"
                  value={male.personalDetails?.currentLocation}
                />
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="mb-1 text-xs font-bold text-gray-700">
                  Female Information
                </p>
                <DetailRow
                  label="Age"
                  value={
                    female.personalDetails?.dob
                      ? formatDOB(female.personalDetails.dob, { showAge: true })
                      : "N/A"
                  }
                />
                <DetailRow
                  label="Nationality"
                  value={female.personalDetails?.nationality}
                />
                <DetailRow
                  label="Location"
                  value={female.personalDetails?.currentLocation}
                />
              </div>
            </div>

            {/* Match Breakdown Part 1 */}
            <section className="mt-3 space-y-3">
              <SectionTitle>Match Breakdown</SectionTitle>
              <div className="space-y-2">
                {page1Breakdown.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-lg border border-gray-100 p-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                      <p className="text-xs font-bold text-gray-800">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {item.category}
                      </p>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-x-4">
                      <div>
                        <p className="text-[10px] text-gray-400">
                          Male: {item.maleValue} ({item.malePoints}/
                          {item.malePossiblePoints} pts)
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">
                          Female: {item.femaleValue} ({item.femalePoints}/
                          {item.femalePossiblePoints} pts)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Page 1 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Match Comparison</span>
            <span>Page 1 of 2</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 2: REMAINING MATCH BREAKDOWN & DEAL BREAKERS
            ============================================================ */}
        <section className="matching-page flex flex-col justify-between text-black shadow-2xl">
          <div>
            <header className="mb-4 flex items-center justify-between border-b-2 border-gray-100 pb-3">
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
                  Match Breakdown (Cont.)
                </p>
                <p className="font-mono text-xs text-gray-400">
                  {data.matchPercentage}% Compatibility
                </p>
              </div>
            </header>

            <div className="space-y-4">
              <section className="space-y-2.5">
                <SectionTitle>Detailed Criteria Evaluation</SectionTitle>
                <div className="space-y-2">
                  {page2Breakdown.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-lg border border-gray-100 p-2.5"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                        <p className="text-xs font-bold text-gray-800">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {item.category}
                        </p>
                      </div>
                      <div className="mt-1.5 grid grid-cols-2 gap-x-4">
                        <div>
                          <p className="text-[10px] text-gray-400">
                            Male: {item.maleValue} ({item.malePoints}/
                            {item.malePossiblePoints} pts)
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">
                            Female: {item.femaleValue} ({item.femalePoints}/
                            {item.femalePossiblePoints} pts)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {penalties.length > 0 && (
                <section className="mt-4 space-y-2">
                  <SectionTitle>Deal Breaker Penalties</SectionTitle>
                  <div className="rounded-lg border border-red-100 bg-red-50/40 p-3">
                    {penalties.map((penalty) => (
                      <DetailRow
                        key={penalty.label}
                        label={penalty.label}
                        value={`-${penalty.penalty} points`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Page 2 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Match Comparison</span>
            <span>Page 2 of 2</span>
          </footer>
        </section>
      </main>
    </>
  )
}
