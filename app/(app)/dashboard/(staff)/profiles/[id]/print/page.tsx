"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, PrinterIcon } from "lucide-react"
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

      const res = await fetch(`/api/gallery/${id}`)

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
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
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
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <h1 className="text-3xl font-bold">
                {user.personalDetails?.prefix} {user.personalDetails?.name}
              </h1>

              <p className="mt-1 text-gray-500">
                #{String(user.customId).padStart(4, "0")}
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                <span>{age} years old</span>

                <span>{user.personalDetails?.nationality}</span>

                <span>{user.personalDetails?.currentLocation}</span>
              </div>
            </div>

            <div>
              {user.photos?.headshot && (
                <Image
                  src={user.photos.headshot}
                  alt=""
                  width={220}
                  height={220}
                  className="rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">About Me</h2>

            <p className="mt-2">{user.personality?.about}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Details</h2>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <strong>Height</strong>
                <p>{user.appearance?.height} cm</p>
              </div>

              <div>
                <strong>Weight</strong>
                <p>{user.appearance?.weight} kg</p>
              </div>

              <div>
                <strong>Religion</strong>
                <p>{user.appearance?.religion}</p>
              </div>

              <div>
                <strong>Occupation</strong>
                <p>{user.career?.occupation}</p>
              </div>

              <div>
                <strong>Education</strong>
                <p>{user.career?.education}</p>
              </div>

              <div>
                <strong>Smoking</strong>
                <p>{user.lifestyle?.smoking}</p>
              </div>

              <div>
                <strong>Drinking</strong>
                <p>{user.lifestyle?.drinking}</p>
              </div>

              <div>
                <strong>Exercise</strong>
                <p>{user.lifestyle?.exercise}</p>
              </div>
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
                  className="rounded-lg object-cover"
                />
              )}

              {user.photos?.fullLength && (
                <Image
                  src={user.photos.fullLength}
                  alt=""
                  width={250}
                  height={250}
                  className="rounded-lg object-cover"
                />
              )}

              {user.photos?.casualLifestyle && (
                <Image
                  src={user.photos.casualLifestyle}
                  alt=""
                  width={250}
                  height={250}
                  className="rounded-lg object-cover"
                />
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
