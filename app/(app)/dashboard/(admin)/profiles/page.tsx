"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { VisibilityState } from "@tanstack/react-table"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApplicationForm } from "@/types/application-form"

import { columns, ProfileRow } from "./columns"
import { DataTable } from "./data-table"

export default function ProfilesPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<ApplicationForm[]>([])
  const [loading, setLoading] = useState(true)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/profiles`)
      if (!response.ok) {
        throw new Error("Failed to fetch profiles")
      }
      const data = await response.json()
      setProfiles(data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const forceFetch = async () => {
    await fetchProfiles()
  }

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

      {!loading && profiles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No profiles found.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={profiles}
          columns={columns}
          onRowClick={handleRowClick}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          forceFetch={forceFetch}
        />
      )}
    </main>
  )
}
