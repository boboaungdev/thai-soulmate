import React from "react"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PrintTrigger } from "@/features/shared"
import { formatDateTime } from "@/lib/date"

const SectionTitle = ({
  children,
  gender,
}: {
  children: React.ReactNode
  gender?: "Male" | "Female" | string
}) => {
  const title = String(children)
  const accentColor = gender === "Male" ? "#D3A753" : "#E791A7"

  return (
    <h2
      className="h-6 text-[15px] font-black tracking-[0.5px]"
      style={{ color: accentColor }}
    >
      {title}
    </h2>
  )
}

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
              <div className="flex items-center">
                <Image
                  src="/assets/logo-section-horizontal.png"
                  alt="Thai Soulmate logo"
                  width={280}
                  height={62}
                  unoptimized
                  className="h-auto w-[220px] max-w-full object-contain"
                />
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
                <SectionTitle gender={interest.gender}>
                  Personal Details
                </SectionTitle>
                <div className="mt-2.5">
                  <DetailItem
                    label="Name"
                    value={[
                      interest.prefix,
                      interest.firstName,
                      interest.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <DetailItem label="Gender" value={interest.gender} />
                  {interest.relationshipGoal && (
                    <DetailItem
                      label="Relationship Goal"
                      value={interest.relationshipGoal}
                    />
                  )}
                  <DetailItem
                    label="Current Location"
                    value={interest.currentLocation}
                  />
                </div>
              </section>

              {/* Contact Information */}
              <section className="break-inside-avoid">
                <SectionTitle gender={interest.gender}>
                  Contact Information
                </SectionTitle>
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

              {/* Status */}
              <section className="break-inside-avoid">
                <SectionTitle gender={interest.gender}>
                  Registration Status
                </SectionTitle>
                <div className="mt-2.5">
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
