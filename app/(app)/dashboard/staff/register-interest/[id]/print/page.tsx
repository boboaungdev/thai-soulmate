"use client"

import { useEffect, useRef, useState } from "react"

export default function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [user, setUser] = useState<any>(null)
  const hasPrinted = useRef(false)

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
   <main className="mx-auto w-[210mm] min-h-[297mm] bg-white p-10 text-sm">
  <header className="mb-8 border-b pb-4">
    <h1 className="text-3xl font-bold">Thai Soulmate</h1>
    <p className="text-gray-500">Register Interest Form</p>
  </header>

  <section className="mb-8">
    <h2 className="mb-3 text-lg font-semibold">
      Applicant Information
    </h2>

    <div className="grid grid-cols-2 gap-y-2">
      <p><strong>Name</strong></p>
      <p>{user.prefix} {user.name}</p>

      <p><strong>Email</strong></p>
      <p>{user.email}</p>

      <p><strong>Phone</strong></p>
      <p>{user.phoneCountry} {user.phone}</p>

      <p><strong>Gender</strong></p>
      <p>{user.gender}</p>

      <p><strong>Date of Birth</strong></p>
      <p>{new Date(user.dob).toLocaleDateString()}</p>

      <p><strong>Nationality</strong></p>
      <p>{user.nationality}</p>

      <p><strong>Current Location</strong></p>
      <p>{user.currentLocation}</p>
    </div>
  </section>

  <section className="mb-8">
    <h2 className="mb-3 text-lg font-semibold">
      Registration
    </h2>

    <div className="grid grid-cols-2 gap-y-2">
      <p><strong>Status</strong></p>
      <p>{user.status}</p>

      <p><strong>Source</strong></p>
      <p>{user.source}</p>

      <p><strong>Other Source</strong></p>
      <p>{user.otherSource || "-"}</p>
    </div>
  </section>

  <section>
    <h2 className="mb-3 text-lg font-semibold">
      Timeline
    </h2>

    <div className="grid grid-cols-2 gap-y-2">
      <p><strong>Created</strong></p>
      <p>{new Date(user.createdAt).toLocaleString()}</p>

      <p><strong>Updated</strong></p>
      <p>{new Date(user.updatedAt).toLocaleString()}</p>
    </div>
  </section>
</main>
  )
}