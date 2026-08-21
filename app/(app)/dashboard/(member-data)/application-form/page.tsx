"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

import { useApplicationFormStore } from "@/stores/application-form-store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { columns, ApplicationRow } from "./columns"
import { DataTable } from "./data-table"
import { applicationStatuses } from "./statuses"

export default function ApplicationsPage() {
  const router = useRouter()
  const {
    applications,
    loading,
    actions: { fetchApplications, forceFetchApplications },
  } = useApplicationFormStore()

  const statusCounts = useMemo(() => {
    return applicationStatuses.map((status) => ({
      ...status,
      count: applications.filter((user) => user.status === status.value).length,
    }))
  }, [applications])

  useEffect(() => {
    void fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    const handleUpdated = () => {
      void forceFetchApplications()
    }

    window.addEventListener("application-form-updated", handleUpdated)
    return () => {
      window.removeEventListener("application-form-updated", handleUpdated)
    }
  }, [forceFetchApplications])

  const handleRowClick = (application: ApplicationRow) => {
    router.push(`/dashboard/application-form/${application.id}`)
  }

  if (loading && applications.length === 0) {
    return (
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Application</h1>
            <p className="text-sm text-muted-foreground">
              Matchmaking profile applications
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-sm font-semibold">
                Total: {applications.length}
              </Badge>
              {statusCounts.map((status) => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={status.badgeClassName}
                >
                  {status.label}: {status.count}
                </Badge>
              ))}
            </div>
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
          <h1 className="text-2xl font-bold tracking-tight">Application</h1>
          <p className="text-sm text-muted-foreground">
            Matchmaking profile applications
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-sm font-semibold">
              Total: {applications.length}
            </Badge>
            {statusCounts.map((status) => (
              <Badge
                key={status.value}
                variant="outline"
                className={status.badgeClassName}
              >
                {status.label}: {status.count}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {loading && applications.length === 0 ? (
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
          forceFetchApplications={forceFetchApplications}
        />
      )}
    </main>
  )
}
