"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { AppName } from "@/components/app-name"
import { APP_INFO } from "@/constants"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PrinterIcon, ChevronLeft } from "lucide-react"
import { ApplicationForm } from "@/types/application-form"

export default function ProfilePrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, setUser] = useState<ApplicationForm | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { id } = await params

      const res = await fetch(`/api/gallery/${id}`)
      const data = await res.json()

      setUser(data)
    }

    load()
  }, [params])

  useEffect(() => {
    if (user) {
      // Delay printing slightly to ensure the page has rendered with the data
      const timer = setTimeout(() => window.print(), 500)
      return () => clearTimeout(timer)
    }
  }, [user])

  if (!user)
    return (
      <div className="mx-auto max-w-4xl space-y-8 p-10">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16" />
            <div>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-56" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      </div>
    )

  return (
    <>
      <div className="no-print my-4 flex justify-between">
        <Button
          onClick={() => router.back()}
          variant="link"
          className="text-bg"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={() => window.print()}
          variant="default"
          className="btn-gradient"
        >
          <PrinterIcon className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <main
        id="printable-area"
        className="mx-auto border border-gray-300 bg-white p-10 text-sm text-black"
      >
        <header className="mb-8 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={72} height={72} />
            <div className="text-center">
              <div className="text-3xl font-bold print:bg-transparent print:text-black">
                <AppName className="truncate text-base font-bold sm:text-lg" />
              </div>
              <p className="text-gray-600">{APP_INFO.tagline}</p>
            </div>
          </div>
          <p className="text-gray-500">Register Interest Form</p>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Applicant Information</h2>

          <div className="grid grid-cols-2 gap-y-2">
            <p>
              <strong>Name</strong>
            </p>
            <p>
              {user.personalDetails.prefix} {user.personalDetails.name}
            </p>

            <p>
              <strong>Email</strong>
            </p>
            <p>{user.personalDetails.email}</p>

            <p>
              <strong>Phone</strong>
            </p>
            <p>{user.personalDetails.phone}</p>

            <p>
              <strong>Gender</strong>
            </p>
            <p>{user.personalDetails.gender}</p>

            <p>
              <strong>Date of Birth</strong>
            </p>
            <p>{new Date(user.personalDetails.dob).toLocaleDateString()}</p>

            <p>
              <strong>Nationality</strong>
            </p>
            <p>{user.personalDetails.nationality}</p>

            <p>
              <strong>Current Location</strong>
            </p>
            <p>{user.personalDetails.currentLocation}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Timeline</h2>

          <div className="grid grid-cols-2 gap-y-2">
            <p>
              <strong>Submitted On</strong>
            </p>
            <p>{new Date(user.updatedAt).toLocaleString()}</p>
          </div>
        </section>
      </main>
    </>
  )
}
