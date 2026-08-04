import Image from "next/image"
import { APP_INFO } from "@/constants"

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ApplicationForm } from "@/types/application-form"

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
  if (level >= 95) return "Native Speaker"
  return `${level}%`
}

const joinValues = (values: string[] | undefined) => {
  if (!values || values.length === 0) return "N/A"
  return values.join(", ")
}

const FluencyBar = ({
  label,
  level,
}: {
  label: string
  level: number | undefined
}) => {
  const displayLevel = level || 0
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-500">
        <span>{label}</span>
        <span>{formatFluency([displayLevel])}</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-pink-400"
          style={{ width: `${displayLevel}%` }}
        />
      </div>
    </div>
  )
}

const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}) => (
  <div className="flex items-start gap-3">
    {icon && <div className="mt-0.5 w-4 text-gray-400">{icon}</div>}
    <div className="flex-1">
      <p className="text-[11px] font-medium text-gray-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-800">
        {value || "N/A"}
      </p>
    </div>
  </div>
)

export default async function ProfilePrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const userDB = await prisma.applicationForm.findUnique({
    where: {
      id,
    },
  })

  if (!userDB) {
    notFound()
  }

  const user = userDB as unknown as ApplicationForm

  const age = user.personalDetails?.dob
    ? calculateAge(user.personalDetails.dob)
    : null
  const displayName = `${user.personalDetails?.prefix || ""} ${
    user.personalDetails?.name || ""
  }`.trim()
  const nickname = user.personalDetails?.nickname

  return (
    <>
      {/* PRINT ONLY THIS */}
      <div>
        <main
          id="printable-area"
          className="mx-auto max-w-4xl bg-white text-black"
        >
          <section
            className="flex min-h-[265mm] flex-col"
            style={{ breakAfter: "page", pageBreakAfter: "always" }}
          >
            {/* App Header */}
            <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-5">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" alt="Logo" width={56} height={56} />
                <div className="text-center">
                  <h1 className="text-gradient text-xl font-bold">
                    {APP_INFO.name}
                  </h1>
                  <p className="text-sm text-gray-400">{APP_INFO.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase">
                  Confidential Profile
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  ID: {String(user.customId).padStart(4, "0")}
                </p>
              </div>
            </header>

            <div className="grid flex-1 grid-cols-[1fr_1.5fr] gap-10">
              <aside className="space-y-5">
                {user.photos?.headshot && (
                  <div
                    className="relative w-full overflow-hidden rounded-md bg-gray-100"
                    style={{ height: "110mm" }}
                  >
                    <Image
                      src={user.photos.headshot}
                      alt="Headshot"
                      fill
                      priority
                      loading="eager"
                      unoptimized
                      sizes="280px"
                      className="object-cover object-top"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                  <DetailItem label="Age" value={age} />
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
                </div>
              </aside>

              <div className="flex flex-col">
                <div className="pb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Profile Introduction
                  </p>
                  <h1 className="mt-3 text-2xl leading-tight font-bold">
                    {displayName}
                    {nickname && (
                      <span className="block text-xl font-semibold text-gray-500">
                        {nickname}
                      </span>
                    )}
                  </h1>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-gray-100 pt-5">
                  <DetailItem
                    label="Occupation"
                    value={user.career?.occupation}
                  />
                  <DetailItem
                    label="Education"
                    value={user.career?.education}
                  />
                  <div className="col-span-2 space-y-3">
                    <p className="text-[11px] font-medium text-gray-400 uppercase">
                      Languages
                    </p>
                    <FluencyBar
                      label="Thai"
                      level={user.appearance?.thaiFluency?.[0]}
                    />
                    <FluencyBar
                      label="English"
                      level={user.appearance?.englishFluency?.[0]}
                    />
                  </div>
                  <DetailItem
                    label="Exercise"
                    value={user.lifestyle?.exercise}
                  />
                  <DetailItem label="Smoking" value={user.lifestyle?.smoking} />
                  <DetailItem
                    label="Drinking"
                    value={user.lifestyle?.drinking}
                  />
                </div>

                <section className="mt-6 border-t border-gray-100 pt-5">
                  <h2 className="font-bold">About Me</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {user.personality?.about || "N/A"}
                  </p>
                </section>

                <section className="mt-6 border-t border-gray-100 pt-5">
                  <h2 className="font-bold">Personality & Interests</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      ...(user.personality?.personality || []),
                      ...(user.lifestyle?.interests || []),
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="mt-6 border-t border-gray-100 pt-5">
                  <h2 className="font-bold">Looking For</h2>
                  <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-3">
                    <DetailItem
                      label="Relationship Goals"
                      value={joinValues(user.relationshipGoals?.lookingFor)}
                    />
                    <DetailItem
                      label="Ideal Age Range"
                      value={user.idealPartner?.ageRange}
                    />
                    <div className="col-span-2">
                      <DetailItem
                        label="Qualities in a Partner"
                        value={joinValues(
                          user.personality?.lookingForQualities
                        )}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>

          <section
            className="flex min-h-[265mm] flex-col"
            style={{ breakAfter: "page", pageBreakAfter: "always" }}
          >
            <header className="mb-5">
              <div className="flex items-end justify-between pb-5">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Full Length Portrait
                  </p>
                </div>
                <p className="text-xs font-medium text-gray-400">
                  ID: {String(user.customId).padStart(4, "0")}
                </p>
              </div>
              <div className="h-px w-full bg-gray-200" />
            </header>

            <div className="flex flex-1 items-center justify-center">
              {user.photos?.fullLength ? (
                <figure className="flex flex-col items-center">
                  <div
                    className="relative overflow-hidden rounded-md bg-gray-100"
                    style={{
                      width: "150mm",
                      height: "200mm",
                    }}
                  >
                    <Image
                      src={user.photos.fullLength}
                      alt="Full length portrait"
                      fill
                      priority
                      loading="eager"
                      unoptimized
                      sizes="567px"
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-xs font-semibold text-gray-400 uppercase">
                    Full Length
                  </figcaption>
                </figure>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-400">
                  No full length photo available
                </div>
              )}
            </div>
          </section>

          <section className="flex min-h-[265mm] flex-col">
            <header className="mb-5">
              <div className="flex items-end justify-between pb-5">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Lifestyle Portrait
                  </p>
                </div>
                <p className="text-xs font-medium text-gray-400">
                  ID: {String(user.customId).padStart(4, "0")}
                </p>
              </div>
              <div className="h-px w-full bg-gray-200" />
            </header>
            <div className="flex flex-1 items-center justify-center">
              {user.photos?.casualLifestyle ? (
                <figure className="flex w-full flex-col items-center">
                  <div
                    className="relative w-full overflow-hidden rounded-md bg-gray-100"
                    style={{ height: "180mm" }}
                  >
                    <Image
                      src={user.photos.casualLifestyle}
                      alt="Lifestyle portrait"
                      fill
                      priority
                      loading="eager"
                      unoptimized
                      sizes="760px"
                      className="object-cover object-center"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-xs font-semibold text-gray-400 uppercase">
                    Lifestyle
                  </figcaption>
                </figure>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-400">
                  No lifestyle photo available
                </div>
              )}
            </div>
            i dont like current style print profile page, edit as you like, i
            would like to use pink and gold color , not gradient color, i want
            to change only first page and dont touch header, i want headshot and
            user details want to edit postion and layout , design as you like,
            dont touch other pages, dont touch second and third page these are
            phtos, edit as you like fist page print
          </section>
        </main>
      </div>
    </>
  )
}
