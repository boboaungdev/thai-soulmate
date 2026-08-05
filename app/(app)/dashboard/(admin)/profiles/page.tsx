"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useProfileStore } from "@/stores/profile-store"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { columns, ProfileRow } from "./columns"
import { DataTable } from "./data-table"

export default function ProfilesPage() {
  const router = useRouter()
  const {
    profiles,
    loading,
    columnVisibility,
    actions: { fetchProfiles, forceFetchProfiles, setColumnVisibility },
  } = useProfileStore()

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
            <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
            <p className="text-sm text-muted-foreground">
              Browse all our members profiles.
            </p>
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
          <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
          <p className="text-sm text-muted-foreground">
            Browse all our members profiles.
          </p>
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
          data={profiles || []}
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
