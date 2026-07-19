"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

type Application = {
  id: string

  personalDetails?: {
    name?: string
    gender?: string
    nationality?: string
  }

  contact?: {
    email?: string
    phone?: string
    currentLocation?: string
  }

  career?: {
    occupation?: string
    education?: string
  }

  personality?: {
    about?: string
  }

  photos?: {
    headshot?: string
    fullLength?: string
  }
}

export default function ApplicationsPage() {
  const router = useRouter()

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchApplications() {
    setLoading(true)

    try {
      const res = await fetch("/api/application-form")

      const data = await res.json()

      setApplications(data.applications || [])
    } catch (error) {
      console.error("Fetch applications error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Applications</h1>

        <p className="text-sm text-muted-foreground">
          Matchmaking profile applications
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({
            length: 5,
          }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No applications found.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop */}

          <div className="hidden rounded-lg border md:block">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>

                    <TableHead>Name</TableHead>

                    <TableHead>Gender</TableHead>

                    <TableHead>Nationality</TableHead>

                    <TableHead>Location</TableHead>

                    <TableHead>Email</TableHead>

                    <TableHead>Phone</TableHead>

                    <TableHead>Occupation</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {applications.map((app) => (
                    <TableRow
                      key={app.id}

                      className="cursor-pointer hover:bg-muted/50"

                      onClick={() =>
                        router.push(
                          `/dashboard/admin/application-form/${app.id}`
                        )
                      }
                    >
                      <TableCell>
                        {app.photos?.headshot ? (
                          <Image
                            src={app.photos.headshot}

                            width={45}

                            height={45}

                            alt="profile"

                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold uppercase">
                            {app.personalDetails?.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {app.personalDetails?.name || "-"}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {app.personalDetails?.gender || "-"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {app.personalDetails?.nationality || "-"}
                      </TableCell>

                      <TableCell>
                        {app.contact?.currentLocation || "-"}
                      </TableCell>

                      <TableCell>{app.contact?.email || "-"}</TableCell>

                      <TableCell>{app.contact?.phone || "-"}</TableCell>

                      <TableCell>{app.career?.occupation || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Mobile */}

          <div className="grid gap-4 md:hidden">
            {applications.map((app) => (
              <Card
                key={app.id}

                className="cursor-pointer"

                onClick={() =>
                  router.push(`/dashboard/admin/application-form/${app.id}`)
                }
              >
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    {app.photos?.headshot ? (
                      <Image
                        src={app.photos.headshot}

                        width={60}

                        height={60}

                        alt="profile"

                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-muted text-xl font-semibold uppercase">
                        {app.personalDetails?.name?.charAt(0) || "?"}
                      </div>
                    )}

                    <div>
                      <h2 className="font-semibold">
                        {app.personalDetails?.name}
                      </h2>

                      <Badge variant="outline">
                        {app.personalDetails?.gender}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>🌍 {app.personalDetails?.nationality}</p>

                    <p>📍 {app.contact?.currentLocation}</p>

                    <p>✉️ {app.contact?.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
