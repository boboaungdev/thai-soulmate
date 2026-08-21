import { notFound } from "next/navigation"
import Image from "next/image"

import { APP_INFO } from "@/constants"
import { env } from "@/lib/env"

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
  customId: number
  personalDetails?: Record<string, string>
}

type Penalty = { label: string; penalty: number }

const BrandName = () => (
  <svg
    aria-label={APP_INFO.name}
    className="inline-block h-7 w-[180px]"
    role="img"
    viewBox="0 0 180 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="matching-brand-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#f2b854" />
        <stop offset="1" stopColor="#f07797" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#matching-brand-gradient)"
      fontFamily="sans-serif"
      fontSize="20"
      fontWeight="700"
      textAnchor="middle"
    >
      {APP_INFO.name}
    </text>
  </svg>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `matching-section-gradient-${title.replace(/\W/g, "-")}`

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

const getMatchScoreColor = (score: number) => {
  if (score > 80) return "#16a34a"
  if (score >= 50) return "#ca8a04"
  return "#dc2626"
}

const ScoreValue = ({ value, color }: { value: string; color: string }) => (
  <svg
    aria-label={value}
    className="inline-block h-5 w-[58px] align-middle"
    role="img"
    viewBox="0 0 58 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="29"
      y="16"
      fill={color}
      fontFamily="sans-serif"
      fontSize="16"
      fontWeight="700"
      textAnchor="middle"
    >
      {value}
    </text>
  </svg>
)

const DetailRow = ({ label, value }: { label: string; value: unknown }) => (
  <div className="flex items-start justify-between gap-6 border-b border-gray-100 py-2 last:border-b-0">
    <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
      {label}
    </span>
    <span className="text-right text-sm font-semibold text-gray-800">
      {String(value || "Not provided")}
    </span>
  </div>
)

const ApplicantSummary = ({
  title,
  applicant,
}: {
  title: string
  applicant: Applicant
}) => {
  const details = applicant.personalDetails
  return (
    <section className="break-inside-avoid">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-3">
        <DetailRow label="Name" value={details?.nickname || details?.name} />
        <DetailRow label="Gender" value={details?.gender} />
        <DetailRow label="Nationality" value={details?.nationality} />
        <DetailRow label="Location" value={details?.currentLocation} />
        <DetailRow
          label="ID"
          value={String(applicant.customId).padStart(4, "0")}
        />
      </div>
    </section>
  )
}

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

  const breakdown = data.matchBreakdown as Breakdown[]
  const penalties = data.dealBreakerPenalties as Penalty[]

  return (
    <>
      <PrintTrigger id={`${maleId}-${femaleId}`} />
      <style>{`@media print { body { -webkit-print-color-adjust: exact; } }`}</style>
      <main
        id="printable-area"
        className="mx-auto max-w-4xl bg-white p-6 text-black"
      >
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
              Match Comparison
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <p className="text-xs font-medium text-gray-500">Score:</p>
              <ScoreValue
                value={`${data.matchPercentage}%`}
                color={getMatchScoreColor(data.matchPercentage)}
              />
            </div>
          </div>
        </header>

        <section className="space-y-7 p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <ApplicantSummary title="Male Profile" applicant={data.male} />
            <ApplicantSummary title="Female Profile" applicant={data.female} />
          </div>
          <section className="break-inside-avoid">
            <SectionTitle>Match Score</SectionTitle>
            <DetailRow
              label="Overall Match"
              value={`${data.matchPercentage}%`}
            />
          </section>
          <section>
            <SectionTitle>Match Breakdown</SectionTitle>
            <div className="mt-3 space-y-5">
              {breakdown.map((item) => (
                <div key={item.key} className="break-inside-avoid">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                    <SectionTitle>{item.label}</SectionTitle>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="mt-2 grid gap-x-8 md:grid-cols-2">
                    <DetailRow
                      label="Male Preference"
                      value={`${item.malePoints}/${item.malePossiblePoints} points`}
                    />
                    <DetailRow label="Female Value" value={item.femaleValue} />
                    <DetailRow
                      label="Female Preference"
                      value={`${item.femalePoints}/${item.femalePossiblePoints} points`}
                    />
                    <DetailRow label="Male Value" value={item.maleValue} />
                  </div>
                </div>
              ))}
            </div>
          </section>
          {penalties.length > 0 && (
            <section className="break-inside-avoid">
              <SectionTitle>Deal Breaker Penalties</SectionTitle>
              <div className="mt-3">
                {penalties.map((penalty) => (
                  <DetailRow
                    key={penalty.label}
                    label={penalty.label}
                    value={`-${penalty.penalty}`}
                  />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
    </>
  )
}
