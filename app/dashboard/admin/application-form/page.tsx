"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/application-form")

      const data = await res.json()

      setApplications(data.applications || [])

      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return <div className="p-10">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Applications</h1>

      {applications.map((app) => (
        <Card key={app.id}>
          <CardHeader>
            <CardTitle>{app.personalDetails?.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p>Email: {app.contact?.email}</p>

            <p>Phone: {app.contact?.phone}</p>

            <p>Location: {app.contact?.currentLocation}</p>

            <p>Occupation: {app.career?.occupation}</p>

            <p>Education: {app.career?.education}</p>

            <p>About: {app.personality?.about}</p>

            <div className="flex gap-3">
              {app.photos?.headshot && (
                <Image
                  src={app.photos.headshot}
                  width={120}
                  height={120}
                  alt="headshot"
                />
              )}

              {app.photos?.fullLength && (
                <Image
                  src={app.photos.fullLength}
                  width={120}
                  height={120}
                  alt="photo"
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
