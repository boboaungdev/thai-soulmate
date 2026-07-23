"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { AppName } from "@/components/app-name"
import { APP_INFO } from "@/constants"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PrinterIcon, ArrowLeftIcon, ChevronLeft } from "lucide-react"

export default function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, setUser] = useState<any>(null)
  const hasPrinted = useRef(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { id } = await params

      const res = await fetch(`/api/register-interest/${id}`)
      const data = await res.json()

      setUser(data)
    }

    load()
  }, [params])

  useEffect(() => {
    if (!user || hasPrinted.current) return

    hasPrinted.current = true

    setTimeout(() => {
      window.print()
    }, 100)
  }, [user])

  if (!user) return <p>Loading...</p>

  return (
    <>
      <div className="flex justify-between my-4 no-print">
        <Button onClick={() => router.back()} variant="link" className="text-bg">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={() => window.print()} variant="default" className="btn-gradient">
          <PrinterIcon className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <main
        id="printable-area"
        className="mx-auto p-10 border border-gray-300 bg-white text-sm text-black"
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
              {user.prefix} {user.name}
            </p>

            <p>
              <strong>Email</strong>
            </p>
            <p>{user.email}</p>

            <p>
              <strong>Phone</strong>
            </p>
            <p>
              {user.phoneCountry} {user.phone}
            </p>

            <p>
              <strong>Gender</strong>
            </p>
            <p>{user.gender}</p>

            <p>
              <strong>Date of Birth</strong>
            </p>
            <p>{new Date(user.dob).toLocaleDateString()}</p>

            <p>
              <strong>Nationality</strong>
            </p>
            <p>{user.nationality}</p>

            <p>
              <strong>Current Location</strong>
            </p>
            <p>{user.currentLocation}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Registration</h2>

          <div className="grid grid-cols-2 gap-y-2">
            <p>
              <strong>Status</strong>
            </p>
            <p>{user.status}</p>

            <p>
              <strong>Source</strong>
            </p>
            <p>{user.source}</p>

            {user.otherSource && <p>Other Source</p>}
            {user.otherSource && <p>{user.otherSource}</p>}
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

