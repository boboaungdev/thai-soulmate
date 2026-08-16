"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

import { useProfileStore } from "@/stores/profile-store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { columns, ProfileRow, profileStatuses } from "./columns"
import { DataTable } from "./data-table"

export default function ProfilesPage() {
  const router = useRouter()
  const {
    profiles,
    loading,
    columnVisibility,
    actions: { fetchProfiles, forceFetchProfiles, setColumnVisibility },
  } = useProfileStore()

  const statusCounts = useMemo(() => {
    return profileStatuses.map((status) => ({
      ...status,
      count: profiles.filter((user) => user.status === status.value).length,
      badgeClassName:
        status.value === "COMPLETED"
          ? "border-green-500/80 text-green-500 dark:text-green-400"
          : "border-yellow-500/80 text-yellow-500 dark:text-yellow-400",
    }))
  }, [profiles])

  useEffect(() => {
    void fetchProfiles()
  }, [fetchProfiles])

  useEffect(() => {
    const handleUpdated = () => {
      void forceFetchProfiles()
    }
    window.addEventListener("profile-updated", handleUpdated)
    return () => window.removeEventListener("profile-updated", handleUpdated)
  }, [forceFetchProfiles])

  const handleRowClick = (profile: ProfileRow) => {
    router.push(`/dashboard/profiles/${profile.id}`)
  }

  if (loading && profiles.length === 0) {
    return (
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Browse all our members profiles.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-sm font-semibold">
                Total: {profiles.length}
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
              {Array.from({ length: 10 }).map((_, index) => (
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
            <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Browse all our members profiles.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-sm font-semibold">
              Total: {profiles.length}
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

      {!loading && profiles?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No profiles found.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={(profiles as ProfileRow[]) || []}
          columns={columns}
          onRowClick={handleRowClick}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          forceFetch={forceFetchProfiles}
        />
      )}
    </main>
  )
}
