import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { APP_INFO } from "@/constants"
import { formatDateTime, formatDOB } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import { ApplicationForm } from "@/types/application-form"
import { PrintTrigger } from "./print-trigger"

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `app-section-gradient-${title.replace(/\W/g, "-")}`

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
      <linearGradient
        id="application-brand-gradient"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
      >
        <stop offset="0%" stopColor="#D3A753" />
        <stop offset="50%" stopColor="#E791A7" />
        <stop offset="100%" stopColor="#CA617D" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#application-brand-gradient)"
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

const DetailItem = ({ label, value }: { label: string; value: unknown }) => {
  if (value === null || value === undefined || value === "") return null

  const displayValue = Array.isArray(value) ? value.join(", ") : String(value)

  return (
    <div className="flex items-start justify-between gap-6 border-b border-gray-100 py-2 last:border-b-0">
      <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </p>
      <p className="text-right text-sm font-semibold text-gray-800">
        {displayValue}
      </p>
    </div>
  )
}

const DetailGrid = ({
  items,
}: {
  items: Array<{ label: string; value: unknown }>
}) => {
  const filtered = items.filter(
    (item) =>
      item.value !== null && item.value !== undefined && item.value !== ""
  )
  if (filtered.length === 0) return null

  return (
    <div className="mt-2.5">
      {filtered.map((item) => (
        <DetailItem key={item.label} {...item} />
      ))}
    </div>
  )
}

export default async function ApplicationFormPrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const record = await prisma.applicationForm.findUnique({
    where: { id },
    include: {
      membership: true,
      notes: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  })

  if (!record) notFound()

  const application = record as unknown as ApplicationForm
  const personal = application.personalDetails
  const idLabel = String(application.customId).padStart(4, "0")

  const fullNameWithPrefix = [personal?.prefix, personal?.name]
    .filter(Boolean)
    .join(" ")

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

        #printable-area.application-form-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          min-height: 100vh;
          padding: 36px;
          background: var(--background);
        }

        .application-form-page {
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

          #printable-area.application-form-document {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            background: white !important;
          }

          .application-form-page {
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

          .application-form-page:last-child {
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
        className="application-form-document min-h-screen bg-muted/40 dark:bg-neutral-950"
      >
        {/* ============================================================
            PAGE 1: HEADSHOT (MIDDLE TOP) & PERSONAL DETAILS
            ============================================================ */}
        <section className="application-form-page flex flex-col justify-between text-black shadow-2xl">
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
                  Application Form
                </p>
                <p className="mt-0.5 font-mono text-xs text-gray-400">
                  ID: {idLabel}
                </p>
                <p className="text-[11px] text-gray-400">
                  Status: {String(application.status)}
                </p>
                <p className="text-[10px] text-gray-400">
                  Submitted: {formatDateTime(application.createdAt)}
                </p>
              </div>
            </header>

            {/* Middle Top Headshot Photo */}
            <div className="my-3 flex flex-col items-center justify-center text-center">
              {application.photos?.headshot ? (
                <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-lg ring-1 ring-gray-200">
                  <Image
                    src={application.photos.headshot}
                    alt="Headshot"
                    fill
                    priority
                    unoptimized
                    sizes="144px"
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-full border border-dashed border-gray-200 text-center text-xs text-gray-400">
                  No headshot available
                </div>
              )}
              <h2 className="mt-2.5 text-lg font-bold text-gray-800">
                {fullNameWithPrefix || "Member"}
              </h2>
              {personal?.nickname && (
                <p className="text-xs font-medium text-gray-500">
                  ({personal.nickname})
                </p>
              )}
            </div>

            {/* Personal Details Under Headshot */}
            <div className="mt-3 space-y-4">
              <section className="break-inside-avoid">
                <SectionTitle>Personal Details</SectionTitle>
                <DetailGrid
                  items={[
                    {
                      label: "Full Name",
                      value: fullNameWithPrefix,
                    },
                    { label: "Nickname", value: personal?.nickname },
                    { label: "Gender", value: personal?.gender },
                    {
                      label: "Date of Birth",
                      value: personal?.dob
                        ? formatDOB(personal.dob, { showAge: true })
                        : undefined,
                    },
                    { label: "Email", value: personal?.email },
                    { label: "Phone", value: personal?.phone },
                    { label: "Nationality", value: personal?.nationality },
                    {
                      label: "Current Location",
                      value: personal?.currentLocation,
                    },
                    { label: "Region", value: personal?.region },
                  ]}
                />
              </section>
            </div>
          </div>

          {/* Page 1 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Application Form • ID: {idLabel}</span>
            <span>Page 1 of 6</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 2: CAREER, APPEARANCE & RELATIONSHIP GOALS
            ============================================================ */}
        <section className="application-form-page flex flex-col justify-between text-black shadow-2xl">
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
                  Career & Relationship
                </p>
                <p className="font-mono text-xs text-gray-400">ID: {idLabel}</p>
              </div>
            </header>

            <div className="space-y-6">
              <section className="break-inside-avoid">
                <SectionTitle>Career & Appearance</SectionTitle>
                <DetailGrid
                  items={[
                    {
                      label: "Occupation",
                      value: application.career?.occupation,
                    },
                    { label: "Company", value: application.career?.company },
                    {
                      label: "Education",
                      value: application.career?.education,
                    },
                    {
                      label: "Height",
                      value: application.appearance?.height
                        ? `${application.appearance.height} cm`
                        : undefined,
                    },
                    {
                      label: "Weight",
                      value: application.appearance?.weight
                        ? `${application.appearance.weight} kg`
                        : undefined,
                    },
                    {
                      label: "Religion",
                      value: application.appearance?.religion,
                    },
                    {
                      label: "Thai Fluency",
                      value: application.appearance?.thaiFluency
                        ? `${application.appearance.thaiFluency[0]}%`
                        : undefined,
                    },
                    {
                      label: "English Fluency",
                      value: application.appearance?.englishFluency
                        ? `${application.appearance.englishFluency[0]}%`
                        : undefined,
                    },
                  ]}
                />
              </section>

              <section className="break-inside-avoid">
                <SectionTitle>Relationship Goals</SectionTitle>
                <DetailGrid
                  items={[
                    {
                      label: "Looking For",
                      value: application.relationshipGoals?.lookingFor,
                    },
                    {
                      label: "Relocate",
                      value: application.relationshipGoals?.relocate,
                    },
                    {
                      label: "Settle Down",
                      value: application.relationshipGoals?.settleDown,
                    },
                    {
                      label: "Ideal Age Range",
                      value: application.idealPartner?.ageRange,
                    },
                    {
                      label: "Ideal Nationality",
                      value: application.idealPartner?.nationality,
                    },
                    {
                      label: "Ideal Location",
                      value: application.idealPartner?.location,
                    },
                  ]}
                />
              </section>
            </div>
          </div>

          {/* Page 2 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Application Form • ID: {idLabel}</span>
            <span>Page 2 of 6</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 3: PERSONALITY & LIFESTYLE
            ============================================================ */}
        <section className="application-form-page flex flex-col justify-between text-black shadow-2xl">
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
                  Personality & Lifestyle
                </p>
                <p className="font-mono text-xs text-gray-400">ID: {idLabel}</p>
              </div>
            </header>

            <div className="space-y-4">
              <section className="break-inside-avoid">
                <SectionTitle>Personality & Lifestyle</SectionTitle>
                <DetailGrid
                  items={[
                    { label: "About", value: application.personality?.about },
                    {
                      label: "Personality",
                      value: application.personality?.personality,
                    },
                    {
                      label: "Best Qualities",
                      value: application.personality?.bestQualities,
                    },
                    {
                      label: "Marital Status",
                      value: application.personality?.maritalStatus,
                    },
                    {
                      label: "Children",
                      value: application.personality?.hasChildren,
                    },
                    {
                      label: "Children Count",
                      value: application.personality?.childrenCount,
                    },
                    {
                      label: "Looking For Qualities",
                      value: application.personality?.lookingForQualities,
                    },
                    {
                      label: "Lifestyle",
                      value: application.lifestyle?.lifestyle,
                    },
                    {
                      label: "Interests",
                      value: application.lifestyle?.interests,
                    },
                    {
                      label: "Other Interest",
                      value: application.lifestyle?.otherInterest,
                    },
                    {
                      label: "Travel Destinations",
                      value: application.lifestyle?.travelDestinations,
                    },
                    {
                      label: "Exercise",
                      value: application.lifestyle?.exercise,
                    },
                    { label: "Smoking", value: application.lifestyle?.smoking },
                    {
                      label: "Drinking",
                      value: application.lifestyle?.drinking,
                    },
                    {
                      label: "Family Importance",
                      value: application.lifestyle?.familyImportance,
                    },
                    {
                      label: "Future Children",
                      value: application.lifestyle?.futureChildren,
                    },
                    { label: "Values", value: application.lifestyle?.values },
                    {
                      label: "Weekend Activity",
                      value: application.lifestyle?.weekendActivity,
                    },
                  ]}
                />
              </section>
            </div>
          </div>

          {/* Page 3 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Application Form • ID: {idLabel}</span>
            <span>Page 3 of 6</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 4: IDEAL PARTNER, FINANCIAL & NOTES
            ============================================================ */}
        <section className="application-form-page flex flex-col justify-between text-black shadow-2xl">
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
                  Partner & Financial
                </p>
                <p className="font-mono text-xs text-gray-400">ID: {idLabel}</p>
              </div>
            </header>

            <div className="space-y-6">
              <section className="break-inside-avoid">
                <SectionTitle>Ideal Partner & Financial</SectionTitle>
                <DetailGrid
                  items={[
                    {
                      label: "Height",
                      value: application.idealPartner?.height,
                    },
                    {
                      label: "Weight",
                      value: application.idealPartner?.weight,
                    },
                    {
                      label: "Education",
                      value: application.idealPartner?.education,
                    },
                    {
                      label: "Personality",
                      value: application.idealPartner?.personality,
                    },
                    {
                      label: "Qualities",
                      value: application.idealPartner?.qualities,
                    },
                    {
                      label: "Deal Breakers",
                      value: application.idealPartner?.dealBreakers,
                    },
                    {
                      label: "Own Business",
                      value: application.financial?.ownBusiness,
                    },
                    {
                      label: "Own Property",
                      value: application.financial?.ownProperty,
                    },
                    {
                      label: "Membership Plan",
                      value: record.membership?.plan,
                    },
                    {
                      label: "Membership Starts",
                      value: record.membership?.startsAt
                        ? formatDateTime(record.membership.startsAt)
                        : undefined,
                    },
                    {
                      label: "Membership Expires",
                      value: record.membership?.expiresAt
                        ? formatDateTime(record.membership.expiresAt)
                        : undefined,
                    },
                  ]}
                />
              </section>

              {application.notes && application.notes.length > 0 && (
                <section className="break-inside-avoid">
                  <SectionTitle>Internal Notes</SectionTitle>
                  <div className="mt-2 divide-y divide-gray-100">
                    {application.notes.map((note) => (
                      <div
                        key={note.id}
                        className="py-2.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs text-gray-800">
                            {note.message}
                          </p>
                          <p className="shrink-0 text-right text-[10px] text-gray-400">
                            {note.user?.name || "Staff"}
                            <br />
                            {note.createdAt
                              ? formatDateTime(note.createdAt)
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Page 4 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Application Form • ID: {idLabel}</span>
            <span>Page 4 of 6</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 5: FULL LENGTH PORTRAIT
            ============================================================ */}
        <section className="application-form-page flex flex-col justify-between text-black shadow-2xl">
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
                  Full Length Portrait
                </p>
                <p className="font-mono text-xs text-gray-400">ID: {idLabel}</p>
              </div>
            </header>

            <div className="flex flex-col items-center justify-center pt-2">
              {application.photos?.fullLength ? (
                <figure className="flex flex-col items-center">
                  <div
                    className="relative overflow-hidden rounded-xl border border-gray-200 shadow-md"
                    style={{
                      width: "145mm",
                      height: "215mm",
                    }}
                  >
                    <Image
                      src={application.photos.fullLength}
                      alt="Full length portrait"
                      fill
                      priority
                      loading="eager"
                      unoptimized
                      sizes="550px"
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Full Length Portrait
                  </figcaption>
                </figure>
              ) : (
                <div
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400"
                  style={{ width: "145mm", height: "215mm" }}
                >
                  <p>No full length photo available</p>
                </div>
              )}
            </div>
          </div>

          {/* Page 5 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Application Form • ID: {idLabel}</span>
            <span>Page 5 of 6</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 6: LIFESTYLE PORTRAIT
            ============================================================ */}
        <section className="application-form-page flex flex-col justify-between text-black shadow-2xl">
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
                  Casual Lifestyle Portrait
                </p>
                <p className="font-mono text-xs text-gray-400">ID: {idLabel}</p>
              </div>
            </header>

            <div className="flex flex-col items-center justify-center pt-2">
              {application.photos?.casualLifestyle ? (
                <figure className="flex flex-col items-center">
                  <div
                    className="relative overflow-hidden rounded-xl border border-gray-200 shadow-md"
                    style={{
                      width: "165mm",
                      height: "215mm",
                    }}
                  >
                    <Image
                      src={application.photos.casualLifestyle}
                      alt="Lifestyle portrait"
                      fill
                      priority
                      loading="eager"
                      unoptimized
                      sizes="620px"
                      className="object-cover object-center"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Casual Lifestyle Portrait
                  </figcaption>
                </figure>
              ) : (
                <div
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400"
                  style={{ width: "165mm", height: "215mm" }}
                >
                  <p>No lifestyle photo available</p>
                </div>
              )}
            </div>
          </div>

          {/* Page 6 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Application Form • ID: {idLabel}</span>
            <span>Page 6 of 6</span>
          </footer>
        </section>
      </main>
    </>
  )
}
