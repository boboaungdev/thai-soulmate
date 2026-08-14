"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useApplicationFormStore } from "@/stores/application-form-store"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { columns, ApplicationRow } from "./columns"
import { DataTable } from "./data-table"

export default function ApplicationsPage() {
  const router = useRouter()
  const {
    applications,
    loading,
    columnVisibility,
    actions: { fetchApplications, forceFetchApplications, setColumnVisibility },
  } = useApplicationFormStore()

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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Application</h1>
              <span className="text-sm font-semibold text-muted-foreground">
                ({applications.length})
              </span>
            </div>
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Application</h1>
            <span className="text-sm font-semibold text-muted-foreground">
              ({applications.length})
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Matchmaking profile applications
          </p>
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
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          forceFetchApplications={forceFetchApplications}
        />
      )}
    </main>
  )
}
