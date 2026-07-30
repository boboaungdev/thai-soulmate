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
          className="mx-auto max-w-4xl rounded-lg border bg-white p-8 text-black"
        >
          {/* App Header */}
          <header className="mb-8 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={64} height={64} />
              <div className="text-center">
                <AppName className="text-xl font-bold" />
                <p className="text-sm text-gray-500">{APP_INFO.tagline}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">Confidential Member Profile</p>
              <p className="text-sm text-gray-500">For internal use only</p>
            </div>
          </header>

          {/* Header */}
          <section className="flex items-start justify-between">
            <div className="flex-grow text-left">
              <h1 className="text-3xl font-bold">
                {user.personalDetails?.prefix} {user.personalDetails?.name}
                {user.personalDetails?.nickname &&
                  ` (${user.personalDetails.nickname})`}
              </h1>
              <p className="mt-1 text-gray-500">
                ID: {String(user.customId).padStart(4, "0")}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 text-gray-600">
                <span>{age} years old</span>
                <span>&bull;</span>
                <span>{user.personalDetails?.currentLocation}</span>
                <span>&bull;</span>
                <span>{user.personalDetails?.nationality}</span>
              </div>
            </div>
            {user.photos?.headshot && (
              <Image
                src={user.photos.headshot}
                alt="Headshot"
                width={120}
                height={120}
                className="ml-4 aspect-square rounded-lg object-cover"
              />
            )}
          </section>

          {/* About Me */}
          <section className="mt-8">
            <h2 className="text-xl font-bold">About Me</h2>
            <p className="mt-2 text-gray-700">{user.personality?.about}</p>
          </section>

          {/* Personality */}
          <section className="mt-8">
            <h2 className="text-xl font-bold">Personality</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.personality?.personality?.map((p) => (
                <div
                  key={p}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {p}
                </div>
              ))}
            </div>
          </section>

          {/* Details */}
          <section className="mt-8">
            <h2 className="text-xl font-bold">Details</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
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
              <DetailItem label="Religion" value={user.appearance?.religion} />
              <DetailItem label="Occupation" value={user.career?.occupation} />
              <DetailItem label="Education" value={user.career?.education} />
              <DetailItem
                label="Languages"
                value={`Thai (${formatFluency(
                  user.appearance?.thaiFluency
                )}), English (${formatFluency(user.appearance?.englishFluency)})`}
              />
            </div>
          </section>

          {/* Lifestyle */}
          <section className="mt-8">
            <h2 className="text-xl font-bold">Lifestyle</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
              <DetailItem label="Smoking" value={user.lifestyle?.smoking} />
              <DetailItem label="Drinking" value={user.lifestyle?.drinking} />
              <DetailItem label="Exercise" value={user.lifestyle?.exercise} />
            </div>
          </section>

          {/* Interests */}
          <section className="mt-8">
            <h2 className="text-xl font-bold">Interests</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.lifestyle?.interests?.map((interest) => (
                <div
                  key={interest}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {interest}
                </div>
              ))}
            </div>
          </section>

          {/* Looking For */}
          <section className="mt-8">
            <h2 className="text-xl font-bold">Looking For</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <section className="mt-8">
            <h2 className="text-xl font-bold">Gallery</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {user.photos?.headshot && (
                <Image
                  src={user.photos.headshot}
                  alt=""
                  width={250}
                  height={250}
                  className="aspect-square rounded-lg object-cover"
                />
              )}

              {user.photos?.fullLength && (
                <Image
                  src={user.photos.fullLength}
                  alt=""
                  width={250}
                  height={250}
                  className="aspect-square rounded-lg object-cover"
                />
              )}

              {user.photos?.casualLifestyle && (
                <Image
                  src={user.photos.casualLifestyle}
                  alt=""
                  width={250}
                  height={250}
                  className="aspect-square rounded-lg object-cover"
                />
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
