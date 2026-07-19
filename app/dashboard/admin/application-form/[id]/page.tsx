"use client"

import { useEffect, useState } from "react"

import { useParams } from "next/navigation"

import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

export default function ApplicationDetailPage() {
  const params = useParams()

  const [application, setApplication] = useState<any>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/application-form/${params.id}`)

      const data = await res.json()

      setApplication(data.application)

      setLoading(false)
    }

    load()
  }, [params.id])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!application) {
    return <div className="p-6">Application not found</div>
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold">
          {application.personalDetails?.name}
        </h1>

        <Badge variant="outline">{application.personalDetails?.gender}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4">
          {application.photos?.headshot && (
            <Image
              src={application.photos.headshot}
              width={150}
              height={150}
              alt="headshot"
              className="rounded-lg object-cover"
            />
          )}

          {application.photos?.fullLength && (
            <Image
              src={application.photos.fullLength}
              width={150}
              height={150}
              alt="full"
              className="rounded-lg object-cover"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>Name: {application.personalDetails?.name}</p>

          <p>Nationality: {application.personalDetails?.nationality}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>Email: {application.contact?.email}</p>

          <p>Phone: {application.contact?.phone}</p>

          <p>Location: {application.contact?.currentLocation}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Career</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p>Occupation: {application.career?.occupation}</p>

          <p>Education: {application.career?.education}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>

        <CardContent>{application.personality?.about || "-"}</CardContent>
      </Card>
    </main>
  )
}
