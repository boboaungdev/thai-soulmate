"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { columns, ApplicationRow } from "./columns"
import { DataTable } from "./data-table"

async function getApplications(): Promise<ApplicationRow[]> {
  const res = await fetch("/api/application-form")

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    console.error("Failed to fetch applications:", res.status, error)
    throw new Error("Failed to fetch applications")
  }

  const data = await res.json()
  return data.applications || []
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getApplications()
      setApplications(data)
    } catch (error) {
      console.error("Fetch applications error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(fetchApplications)
  }, [fetchApplications])

  useEffect(() => {
    const handleUpdated = () => {
      fetchApplications()
    }

    window.addEventListener("application-form-updated", handleUpdated)
    return () => {
      window.removeEventListener("application-form-updated", handleUpdated)
    }
  }, [fetchApplications])

  const handleRowClick = (application: ApplicationRow) => {
    router.push(`/dashboard/application-form/${application.id}`)
  }

  if (loading) {
    return (
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
            <p className="text-sm text-muted-foreground">
              Matchmaking profile applications
            </p>
          </div>
        </div>
        <div className="rounded-md border">
          <div className="w-full space-y-4 p-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground">
            Matchmaking profile applications
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No applications found.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={applications}
          columns={columns}
          onRowClick={handleRowClick}
        />
      )}
    </main>
  )
}
