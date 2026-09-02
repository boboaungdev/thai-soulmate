import React from "react"
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
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
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
      <linearGradient id="interest-brand-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#D3A753" />
        <stop offset="50%" stopColor="#E791A7" />
        <stop offset="100%" stopColor="#CA617D" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#interest-brand-gradient)"
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

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => {
  if (value === null || value === undefined || value === "") return null

  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-b-0">
      <p className="text-[11px] font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-right text-xs font-semibold text-gray-800">
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

        #printable-area.register-interest-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          min-height: 100vh;
          padding: 36px;
          background: var(--background);
        }

        .register-interest-page {
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

          #printable-area.register-interest-document {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            background: white !important;
          }

          .register-interest-page {
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
            break-after: auto !important;
            page-break-after: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
        className="register-interest-document min-h-screen bg-muted/40 dark:bg-neutral-950"
      >
        <section className="register-interest-page flex flex-col justify-between text-black shadow-2xl">
          <div>
            {/* App Header */}
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
                  Interest Registration
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Submitted: {formatDateTime(interest.createdAt)}
                </p>
              </div>
            </header>

            <div className="space-y-6">
              {/* Personal Details */}
              <section className="break-inside-avoid">
                <SectionTitle>Personal Details</SectionTitle>
                <div className="mt-2.5">
                  <DetailItem
                    label="Name"
                    value={`${interest.prefix} ${interest.name}`}
                  />
                  <DetailItem
                    label="Date of Birth"
                    value={formatDOB(interest.dob, { showAge: true })}
                  />
                  <DetailItem label="Gender" value={interest.gender} />
                  <DetailItem
                    label="Nationality"
                    value={
                      interest.nationalityRegion
                        ? `${interest.nationality} (${interest.nationalityRegion})`
                        : interest.nationality
                    }
                  />
                  <DetailItem
                    label="Current Location"
                    value={
                      interest.currentLocationRegion
                        ? `${interest.currentLocation} (${interest.currentLocationRegion})`
                        : interest.currentLocation
                    }
                  />
                </div>
              </section>

              {/* Contact Information */}
              <section className="break-inside-avoid">
                <SectionTitle>Contact Information</SectionTitle>
                <div className="mt-2.5">
                  <DetailItem label="Email" value={interest.email} />
                  <DetailItem
                    label="Phone"
                    value={`${interest.phoneCountry} ${interest.phone}`}
                  />
                  {interest.preferredContactDate && (
                    <DetailItem
                      label="Preferred Contact Date"
                      value={formatDateTime(
                        interest.preferredContactDate
                      ).replace(/ \d{2}:\d{2}$/, "")}
                    />
                  )}
                  {interest.preferredContactTime && (
                    <DetailItem
                      label="Preferred Contact Time"
                      value={interest.preferredContactTime}
                    />
                  )}
                </div>
              </section>

              {/* Source & Status */}
              <section className="break-inside-avoid">
                <SectionTitle>Discovery & Source</SectionTitle>
                <div className="mt-2.5">
                  <DetailItem label="Source" value={interest.source} />
                  {interest.otherSource && (
                    <DetailItem
                      label="Source Details"
                      value={interest.otherSource}
                    />
                  )}
                  <DetailItem label="Status" value={interest.status} />
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6 flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Interest Registration</span>
            <span>Page 1 of 1</span>
          </footer>
        </section>
      </main>
    </>
  )
}
