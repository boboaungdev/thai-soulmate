"use client"

import { useEffect, useState } from "react"
import { getColumns } from "./columns"
import { DataTable } from "./data-table"
import { RegisterInterestDetails } from "./register-interest-details"
import { Skeleton } from "@/components/ui/skeleton"
import { RegisterInterest } from "@/lib/generated/prisma/client"
import { useRegisterInterestStore } from "@/stores/register-interest-store"

type RegisterInterestWithNotesCount = RegisterInterest & {
  _count: {
    notes: number
  }
}

export default function TaskPage() {
  const data = useRegisterInterestStore((state) => state.users)
  const loading = useRegisterInterestStore((state) => state.loading)
  const actions = useRegisterInterestStore((state) => state.actions)

  const [selectedItem, setSelectedItem] =
    useState<RegisterInterestWithNotesCount | null>(null)

  useEffect(() => {
    actions.fetchUsers()
  }, [actions])

  useEffect(() => {
    const handleUpdated = () => actions.forceFetchUsers()
    window.addEventListener("register-interest-updated", handleUpdated)
    return () => {
      window.removeEventListener("register-interest-updated", handleUpdated)
    }
  }, [actions])

  const handleRowClick = (item: RegisterInterestWithNotesCount) => {
    setSelectedItem(item)
  }

  const handleCloseDetails = () => {
    setSelectedItem(null)
  }

  if (loading && data.length === 0) {
    return (
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Register Interest
            </h1>
            <p className="text-sm text-muted-foreground">
              Users who submitted matchmaking interest forms
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <div className="rounded-md border">
          <div className="w-full space-y-4 p-4">
            <Skeleton className="h-10 w-full" /> {/* Table header */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" /> /* Table rows */
              ))}
            </div>
            <Skeleton className="h-8 w-full" /> {/* Pagination */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Register Interest
            </h1>
            <p className="text-sm text-muted-foreground">
              Users who submitted matchmaking interest forms
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable
          data={data}
          columns={getColumns}
          onRowClick={handleRowClick}
          forceFetchApplications={actions.forceFetchUsers}
        />
      </div>
      <RegisterInterestDetails
        item={selectedItem}
        onClose={handleCloseDetails}
      />
    </>
  )
}
