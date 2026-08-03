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

const DetailItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
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
          className="mx-auto max-w-4xl bg-white p-10 text-black"
        >
          {/* App Header */}
          <header className="mb-10 flex items-center justify-between border-b-2 border-gray-200 pb-5">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={64} height={64} />
              <div>
                <AppName className="text-2xl font-bold" />
                <p className="text-sm text-gray-400">{APP_INFO.tagline}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">Confidential Profile</p>
              <p className="text-xs text-gray-400">
                ID: {String(user.customId).padStart(4, "0")}
              </p>
            </div>
          </header>

          <div className="grid grid-cols-3 gap-10">
            {/* Left Column */}
            <div className="col-span-1 space-y-6">
              {user.photos?.headshot && (
                <div className="relative aspect-square w-full">
                  <Image
                    src={user.photos.headshot}
                    alt="Headshot"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="space-y-3">
                <DetailItem label="Age" value={age} />
                <DetailItem
                  label="Height"
                  value={`${user.appearance?.height} cm`}
                />
                <DetailItem
                  label="Weight"
                  value={`${user.appearance?.weight} kg`}
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
                <DetailItem
                  label="Occupation"
                  value={user.career?.occupation}
                />
                <DetailItem label="Education" value={user.career?.education} />
                <DetailItem
                  label="Languages"
                  value={`Thai (${formatFluency(
                    user.appearance?.thaiFluency
                  )}), English (${formatFluency(
                    user.appearance?.englishFluency
                  )})`}
                />
                <DetailItem label="Smoking" value={user.lifestyle?.smoking} />
                <DetailItem label="Drinking" value={user.lifestyle?.drinking} />
                <DetailItem label="Exercise" value={user.lifestyle?.exercise} />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl font-bold">
                  {user.personalDetails?.prefix} {user.personalDetails?.name}
                  {user.personalDetails?.nickname &&
                    ` (${user.personalDetails.nickname})`}
                </h1>
              </div>

              <section>
                <h2 className="text-xl font-bold">About Me</h2>
                <p className="mt-2 text-gray-700">
                  {user.personality?.about}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold">Personality & Interests</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    ...(user.personality?.personality || []),
                    ...(user.lifestyle?.interests || []),
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold">Looking For</h2>
                <div className="mt-4 space-y-3">
                  <DetailItem
                    label="Relationship Goals"
                    value={user.relationshipGoals?.lookingFor?.join(", ")}
                  />
                  <DetailItem
                    label="Qualities in a Partner"
                    value={user.personality?.lookingForQualities?.join(", ")}
                  />
                  <DetailItem
                    label="Ideal Age Range"
                    value={user.idealPartner?.ageRange}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold">Gallery</h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {user.photos?.fullLength && (
                    <Image
                      src={user.photos.fullLength}
                      alt="Full Length"
                      width={300}
                      height={400}
                      className="rounded-lg object-cover"
                    />
                  )}
                  {user.photos?.casualLifestyle && (
                    <Image
                      src={user.photos.casualLifestyle}
                      alt="Lifestyle"
                      width={300}
                      height={400}
                      className="rounded-lg object-cover"
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
