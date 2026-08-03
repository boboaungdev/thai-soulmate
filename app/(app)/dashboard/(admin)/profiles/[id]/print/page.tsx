"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, PrinterIcon } from "lucide-react"
import { AppName } from "@/components/app-name"
import { APP_INFO } from "@/constants"
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

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="border-b border-gray-100 pb-2">
    <p className="text-[11px] font-medium text-gray-400 uppercase">{label}</p>
    <p className="mt-1 text-sm font-semibold text-gray-900">{value || "N/A"}</p>
  </div>
)

const GradientPrintName = ({ name }: { name: string }) => (
  <h2 className="text-gradient mt-2 block text-3xl leading-none font-bold [box-shadow:none] [border-bottom:0] [text-decoration:none]">
    {name}
  </h2>
)

export default function ProfilePrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, setUser] = useState<ApplicationForm | null>(null)

  const router = useRouter()

  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Profile-${user?.customId}`,
  })

  useEffect(() => {
    async function load() {
      const { id } = await params

      const res = await fetch(`/api/profiles/${id}`)

      if (!res.ok) return

      const data = await res.json()

      if (data.success) {
        setUser(data.application)
      }
    }

    load()
  }, [params])

  useEffect(() => {
    if (!user) return

    const timer = setTimeout(() => {
      handlePrint()
    }, 500)

    return () => clearTimeout(timer)
  }, [user, handlePrint])

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl p-10">
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const age = user.personalDetails?.dob
    ? calculateAge(user.personalDetails.dob)
    : null
  const displayName = `${user.personalDetails?.prefix || ""} ${
    user.personalDetails?.name || ""
  }`.trim()
  const nickname = user.personalDetails?.nickname

  return (
    <>
      {/* NOT PRINTED */}
      <div className="no-print my-6 flex justify-between">
        <Button
          variant="link"
          onClick={() => router.back()}
          className="text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <Button className="btn-gradient" onClick={handlePrint}>
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      {/* PRINT ONLY THIS */}
      <div ref={printRef}>
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
                <div>
                  <AppName className="text-gradient text-2xl font-bold" />
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

            <div className="grid flex-1 grid-cols-[0.95fr_1.35fr] gap-10">
              <aside className="space-y-5">
                {user.photos?.headshot && (
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={user.photos.headshot}
                      alt="Headshot"
                      fill
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
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Profile Introduction
                  </p>
                  <h1 className="text-gradient mt-3 text-3xl leading-tight font-bold">
                    {displayName}
                    {nickname && (
                      <span className="block text-xl font-semibold text-gray-500">
                        {nickname}
                      </span>
                    )}
                  </h1>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5">
                  <DetailItem
                    label="Occupation"
                    value={user.career?.occupation}
                  />
                  <DetailItem
                    label="Education"
                    value={user.career?.education}
                  />
                  <DetailItem
                    label="Languages"
                    value={`Thai (${formatFluency(
                      user.appearance?.thaiFluency
                    )}), English (${formatFluency(
                      user.appearance?.englishFluency
                    )})`}
                  />
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

                <section className="mt-8">
                  <h2 className="text-gradient text-xl font-bold">About Me</h2>
                  <p className="mt-3 text-[15px] leading-7 text-gray-700">
                    {user.personality?.about || "N/A"}
                  </p>
                </section>

                <section className="mt-7">
                  <h2 className="text-gradient text-xl font-bold">
                    Personality & Interests
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      ...(user.personality?.personality || []),
                      ...(user.lifestyle?.interests || []),
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-sm border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="mt-7">
                  <h2 className="text-gradient text-xl font-bold">
                    Looking For
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-4">
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
                  <GradientPrintName name={displayName} />
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
                  <div className="relative h-[200mm] w-[150mm] overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={user.photos.fullLength}
                      alt="Full length portrait"
                      fill
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
                  <GradientPrintName name={displayName} />
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
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={user.photos.casualLifestyle}
                      alt="Lifestyle portrait"
                      fill
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
          </section>
        </main>
      </div>
    </>
  )
}
