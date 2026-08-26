import { notFound } from "next/navigation"
import { formatDateTime, formatDOB } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { APP_INFO } from "@/constants"

import { PrintTrigger } from "./print-trigger"

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `interest-section-gradient-${title.replace(/\W/g, "-")}`

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
      <linearGradient id="interest-brand-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#f2b854" />
        <stop offset="1" stopColor="#f07797" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#interest-brand-gradient)"
      fontFamily="sans-serif"
      fontSize="20"
      fontWeight="700"
      textAnchor="middle"
    >
      {APP_INFO.name}
    </text>
  </svg>
)

const DetailItem = ({ label, value }: { label: string; value: unknown }) => {
  if (value === null || value === undefined || value === "") return null

  return (
    <div className="flex items-start justify-between gap-6 border-b border-gray-100 py-2 last:border-b-0">
      <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-right text-sm font-semibold text-gray-800">
        {String(value)}
      </p>
    </div>
  )
}

export default async function PrintRegisterInterestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const interest = await prisma.registerInterest.findUnique({
    where: { id },
  })

  if (!interest) {
    notFound()
  }

  return (
    <div className="bg-white text-black" id="printable-area">
      <PrintTrigger id={id} />
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>
      <main className="mx-auto max-w-4xl bg-white text-black">
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
              Interest Registration
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Submitted: {formatDateTime(interest.createdAt)}
            </p>
          </div>
        </header>

        <div className="space-y-7 p-8">
          <section className="break-inside-avoid">
            <SectionTitle>Personal Details</SectionTitle>
            <div className="mt-3">
              <DetailItem
                label="Name"
                value={`${interest.prefix} ${interest.name}`}
              />
              <DetailItem
                label="Date of Birth"
                value={formatDOB(interest.dob, { showAge: true })}
              />
              <DetailItem label="Gender" value={interest.gender} />
              <DetailItem label="Nationality" value={interest.nationality} />
              <DetailItem
                label="Current Location"
                value={interest.currentLocation}
              />
            </div>
          </section>
          <section className="break-inside-avoid">
            <SectionTitle>Contact Information</SectionTitle>
            <div className="mt-3">
              <DetailItem label="Email" value={interest.email} />
              <DetailItem
                label="Phone"
                value={`${interest.phoneCountry} ${interest.phone}`}
              />
              <DetailItem
                label="Preferred Contact Date"
                value={
                  interest.preferredContactDate
                    ? formatDateTime(interest.preferredContactDate).replace(
                        / \d{2}:\d{2}$/,
                        ""
                      )
                    : null
                }
              />
            </div>
          </section>
          <section className="break-inside-avoid">
            <SectionTitle>Source</SectionTitle>
            <div className="mt-3">
              <DetailItem label="Source" value={interest.source} />
              <DetailItem label="Other Source" value={interest.otherSource} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
