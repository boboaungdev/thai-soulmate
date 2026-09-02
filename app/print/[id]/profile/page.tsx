import React from "react"
import Image from "next/image"
import { APP_INFO } from "@/constants"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ApplicationForm } from "@/types/application-form"
import { PrintTrigger } from "./print-trigger"

function calculateAge(dob: string | Date): number {
  const birthDate = new Date(dob)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}

const formatFluency = (fluency: number[] | undefined) => {
  if (!fluency || fluency.length === 0) return "N/A"
  const level = fluency[0]
  if (level >= 95) return "Native"
  return `${level}%`
}

const joinValues = (values: string[] | undefined) => {
  if (!values || values.length === 0) return "N/A"
  return values.join(", ")
}

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-1.5 last:border-b-0">
    <p className="text-[11px] font-medium tracking-wider text-gray-500 uppercase">
      {label}
    </p>
    <p className="text-right text-xs font-semibold text-gray-800">
      {value || "N/A"}
    </p>
  </div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `profile-section-gradient-${title.replace(/\W/g, "-")}`

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
      <linearGradient id="profile-brand-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#D3A753" />
        <stop offset="50%" stopColor="#E791A7" />
        <stop offset="100%" stopColor="#CA617D" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#profile-brand-gradient)"
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

export default async function ProfilePrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      applicationForm: true,
    },
  })

  if (!profile || !profile.applicationForm) {
    notFound()
  }

  const user = profile.applicationForm as unknown as ApplicationForm
  const customIdStr = String(user.customId).padStart(4, "0")

  const age = user.personalDetails?.dob
    ? calculateAge(user.personalDetails.dob)
    : null
  const isMale = user.personalDetails?.gender === "Male"
  const firstName = user.personalDetails?.name?.trim().split(/\s+/)[0] || ""
  const nickname = user.personalDetails?.nickname || ""

  const nameToDisplay = isMale
    ? firstName || nickname || "Member"
    : nickname || firstName || "Member"

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
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          background: #eee7df;
        }

        #printable-area.profile-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          padding: 36px;
          background: #eee7df;
        }

        .profile-page {
          position: relative;
          width: 210mm;
          min-height: 297mm;
          max-width: 210mm;
          background: white;
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

          #printable-area.profile-document {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            background: white !important;
          }

          .profile-page {
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

          .profile-page:last-child {
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

      <main id="printable-area" className="profile-document">
        {/* ============================================================
            PAGE 1: SUMMARY & OVERVIEW
            ============================================================ */}
        <section className="profile-page flex flex-col justify-between text-black shadow-2xl">
          <div>
            {/* App Header */}
            <header className="mb-5 flex items-center justify-between border-b-2 border-gray-100 pb-3">
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
                  Confidential Profile
                </p>
                <p className="mt-0.5 font-mono text-xs text-gray-400">
                  ID: {customIdStr}
                </p>
              </div>
            </header>

            <div className="grid grid-cols-[220px_1fr] gap-6">
              {/* Left Column */}
              <aside className="flex flex-col items-center">
                {user.photos?.headshot && (
                  <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-md">
                    <Image
                      src={user.photos.headshot}
                      alt="Headshot"
                      fill
                      priority
                      loading="eager"
                      unoptimized
                      sizes="180px"
                      className="object-cover object-top"
                    />
                  </div>
                )}
                <div className="mt-3 text-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {nameToDisplay}
                  </h2>
                </div>
                <div className="mt-4 w-full space-y-2 border-t border-gray-100 pt-3">
                  <DetailItem
                    label="Age"
                    value={age ? `${age} years old` : "N/A"}
                  />
                  <DetailItem
                    label="Height"
                    value={
                      user.appearance?.height
                        ? `${user.appearance.height} cm`
                        : "N/A"
                    }
                  />
                  <DetailItem
                    label="Weight"
                    value={
                      user.appearance?.weight
                        ? `${user.appearance.weight} kg`
                        : "N/A"
                    }
                  />
                  <DetailItem
                    label="Nationality"
                    value={user.personalDetails?.nationality}
                  />
                  <DetailItem
                    label="Location"
                    value={user.personalDetails?.currentLocation}
                  />
                  <DetailItem
                    label="Religion"
                    value={user.appearance?.religion}
                  />
                  <div className="pt-1.5">
                    <SectionTitle>Languages</SectionTitle>
                    <div className="mt-1.5">
                      <DetailItem
                        label="Thai"
                        value={formatFluency(user.appearance?.thaiFluency)}
                      />
                      <DetailItem
                        label="English"
                        value={formatFluency(user.appearance?.englishFluency)}
                      />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right Column */}
              <div className="space-y-3.5">
                <section>
                  <SectionTitle>About Me</SectionTitle>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                    {user.personality?.about || "N/A"}
                  </p>
                </section>

                <section>
                  <SectionTitle>Vocation</SectionTitle>
                  <div className="mt-1.5 space-y-1">
                    <DetailItem
                      label="Occupation"
                      value={user.career?.occupation}
                    />
                    <DetailItem
                      label="Education"
                      value={user.career?.education}
                    />
                  </div>
                </section>

                <section>
                  <SectionTitle>Lifestyle</SectionTitle>
                  <div className="mt-1.5 space-y-1">
                    <DetailItem
                      label="Exercise"
                      value={user.lifestyle?.exercise}
                    />
                    <DetailItem
                      label="Smoking"
                      value={user.lifestyle?.smoking}
                    />
                    <DetailItem
                      label="Drinking"
                      value={user.lifestyle?.drinking}
                    />
                  </div>
                </section>

                <section>
                  <SectionTitle>Looking For</SectionTitle>
                  <div className="mt-1.5 space-y-1">
                    <DetailItem
                      label="Relationship Goals"
                      value={joinValues(user.relationshipGoals?.lookingFor)}
                    />
                    <DetailItem
                      label="Ideal Age Range"
                      value={user.idealPartner?.ageRange}
                    />
                  </div>
                </section>

                <section>
                  <SectionTitle>Interests</SectionTitle>
                  <div className="mt-1.5 text-xs text-gray-700">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...(user.personality?.personality || []),
                        ...(user.lifestyle?.interests || []),
                      ]
                        .filter(Boolean)
                        .map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-700"
                          >
                            {item}
                          </span>
                        ))}
                    </div>
                  </div>
                </section>

                <section>
                  <SectionTitle>Qualities I&apos;m Looking For</SectionTitle>
                  <div className="mt-1.5 text-xs text-gray-700">
                    <div className="flex flex-wrap gap-1.5">
                      {(user.personality?.lookingForQualities || []).map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-700"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Page 1 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Member Profile • ID: {customIdStr}</span>
            <span>Page 1 of 3</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 2: FULL LENGTH PORTRAIT
            ============================================================ */}
        <section className="profile-page flex flex-col justify-between text-black shadow-2xl">
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
                <p className="font-mono text-xs text-gray-400">
                  ID: {customIdStr}
                </p>
              </div>
            </header>

            <div className="flex flex-col items-center justify-center pt-2">
              {user.photos?.fullLength ? (
                <figure className="flex flex-col items-center">
                  <div
                    className="relative overflow-hidden rounded-xl border border-gray-200 shadow-md"
                    style={{
                      width: "145mm",
                      height: "215mm",
                    }}
                  >
                    <Image
                      src={user.photos.fullLength}
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

          {/* Page 2 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Member Profile • ID: {customIdStr}</span>
            <span>Page 2 of 3</span>
          </footer>
        </section>

        {/* ============================================================
            PAGE 3: LIFESTYLE PORTRAIT
            ============================================================ */}
        <section className="profile-page flex flex-col justify-between text-black shadow-2xl">
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
                <p className="font-mono text-xs text-gray-400">
                  ID: {customIdStr}
                </p>
              </div>
            </header>

            <div className="flex flex-col items-center justify-center pt-2">
              {user.photos?.casualLifestyle ? (
                <figure className="flex flex-col items-center">
                  <div
                    className="relative overflow-hidden rounded-xl border border-gray-200 shadow-md"
                    style={{
                      width: "165mm",
                      height: "215mm",
                    }}
                  >
                    <Image
                      src={user.photos.casualLifestyle}
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

          {/* Page 3 Footer */}
          <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
            <span>Thai Soulmate • 1-2-1 Matchmaking Service</span>
            <span>Confidential Member Profile • ID: {customIdStr}</span>
            <span>Page 3 of 3</span>
          </footer>
        </section>
      </main>
    </>
  )
}
