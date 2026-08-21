import Image from "next/image"
import { notFound } from "next/navigation"

import { APP_INFO } from "@/constants"
import { formatDateTime, formatDOB } from "@/lib/date"
import { prisma } from "@/lib/prisma"
import { ApplicationForm } from "@/types/application-form"

import { PrintTrigger } from "./print-trigger"

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const title = String(children)
  const gradientId = `section-gradient-${title.replace(/\W/g, "-")}`

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
      <linearGradient id="brand-name-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#f2b854" />
        <stop offset="1" stopColor="#f07797" />
      </linearGradient>
    </defs>
    <text
      x="90"
      y="21"
      fill="url(#brand-name-gradient)"
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
}) => (
  <div className="mt-3">
    {items.map((item) => (
      <DetailItem key={item.label} {...item} />
    ))}
  </div>
)

const PhotoPage = ({
  title,
  source,
  id,
  pageBreakAfter = false,
}: {
  title: string
  source?: string
  id: string
  pageBreakAfter?: boolean
}) => (
  <section
    className="flex min-h-[265mm] break-inside-avoid flex-col"
    style={{
      breakBefore: "page",
      pageBreakBefore: "always",
      ...(pageBreakAfter
        ? { breakAfter: "page", pageBreakAfter: "always" }
        : {}),
    }}
  >
    <header className="mb-5 flex items-end justify-between border-b border-gray-200 pb-5">
      <p className="text-xs font-semibold text-gray-400 uppercase">{title}</p>
      <p className="text-xs font-medium text-gray-400">ID: {id}</p>
    </header>
    <div className="flex flex-1 items-center justify-center">
      {source ? (
        <div className="relative h-[200mm] w-full overflow-hidden rounded-md">
          <Image
            src={source}
            alt={title}
            fill
            priority
            unoptimized
            sizes="760px"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex h-64 w-full items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-400">
          No photo available
        </div>
      )}
    </div>
  </section>
)

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

  return (
    <>
      <PrintTrigger id={id} />
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .text-gradient {
            background: linear-gradient(to right, #f2b854, #f07797);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          .print-section-title {
            text-decoration: none !important;
            border: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <main
        id="printable-area"
        className="mx-auto max-w-4xl bg-white p-6 text-black"
      >
        <section
          className="min-h-[265mm]"
          style={{ breakAfter: "page", pageBreakAfter: "always" }}
        >
          <header className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-5">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={56} height={56} />
              <div className="text-center">
                <h1 className="print-section-title text-xl font-bold">
                  <BrandName />
                </h1>
                <p className="text-sm text-gray-400">{APP_INFO.tagline}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-500 uppercase">
                Application Form
              </p>
              <p className="mt-1 text-xs text-gray-400">ID: {idLabel}</p>
              <p className="text-xs text-gray-400">
                Status: {String(application.status)}
              </p>
              <p className="text-xs text-gray-400">
                Submitted: {formatDateTime(application.createdAt)}
              </p>
            </div>
          </header>

          <div className="rounded-lg p-8">
            <div className="grid gap-8 md:grid-cols-[180px_1fr]">
              <div className="flex justify-center md:justify-start">
                {application.photos?.headshot ? (
                  <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-lg">
                    <Image
                      src={application.photos.headshot}
                      alt="Headshot"
                      fill
                      priority
                      unoptimized
                      sizes="176px"
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-full border border-dashed border-amber-200 text-center text-xs text-gray-400">
                    No headshot available
                  </div>
                )}
              </div>
              <div className="space-y-7">
                <section className="break-inside-avoid">
                  <SectionTitle>Personal Details</SectionTitle>
                  <DetailGrid
                    items={[
                      {
                        label: "Name",
                        value: `${personal.prefix} ${personal.name}`,
                      },
                      { label: "Nickname", value: personal.nickname },
                      { label: "Gender", value: personal.gender },
                      {
                        label: "Date of Birth",
                        value: formatDOB(personal.dob, { showAge: true }),
                      },
                      { label: "Email", value: personal.email },
                      { label: "Phone", value: personal.phone },
                      { label: "Nationality", value: personal.nationality },
                      {
                        label: "Current Location",
                        value: personal.currentLocation,
                      },
                      { label: "Region", value: personal.region },
                    ]}
                  />
                </section>
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
                        value: application.appearance?.height,
                      },
                      {
                        label: "Weight",
                        value: application.appearance?.weight,
                      },
                      {
                        label: "Religion",
                        value: application.appearance?.religion,
                      },
                      {
                        label: "Thai Fluency",
                        value: application.appearance?.thaiFluency,
                      },
                      {
                        label: "English Fluency",
                        value: application.appearance?.englishFluency,
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
          </div>
        </section>

        <section className="space-y-7 py-2">
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
                { label: "Lifestyle", value: application.lifestyle?.lifestyle },
                { label: "Interests", value: application.lifestyle?.interests },
                {
                  label: "Other Interest",
                  value: application.lifestyle?.otherInterest,
                },
                {
                  label: "Travel Destinations",
                  value: application.lifestyle?.travelDestinations,
                },
                { label: "Exercise", value: application.lifestyle?.exercise },
                { label: "Smoking", value: application.lifestyle?.smoking },
                { label: "Drinking", value: application.lifestyle?.drinking },
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
          <section className="break-inside-avoid">
            <SectionTitle>Ideal Partner & Financial</SectionTitle>
            <DetailGrid
              items={[
                { label: "Height", value: application.idealPartner?.height },
                { label: "Weight", value: application.idealPartner?.weight },
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
                { label: "Membership Plan", value: record.membership?.plan },
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
        </section>

        {application.notes && application.notes.length > 0 && (
          <section className="break-inside-avoid py-2">
            <SectionTitle>Notes</SectionTitle>
            <div className="mt-3">
              {application.notes.map((note) => (
                <div
                  key={note.id}
                  className="border-b border-gray-100 py-3 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-6">
                    <p className="text-sm text-gray-800">{note.message}</p>
                    <p className="shrink-0 text-right text-xs text-gray-500">
                      {note.user?.name || "Unknown"}
                      <br />
                      {note.createdAt ? formatDateTime(note.createdAt) : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <PhotoPage
          title="Full Length Portrait"
          source={application.photos?.fullLength}
          id={idLabel}
          pageBreakAfter
        />
        <PhotoPage
          title="Lifestyle Portrait"
          source={application.photos?.casualLifestyle}
          id={idLabel}
        />
      </main>
    </>
  )
}
