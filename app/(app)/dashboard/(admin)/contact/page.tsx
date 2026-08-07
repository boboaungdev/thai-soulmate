"use client"

import { useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { useContactStore } from "@/stores/contact-store"

export default function TaskPage() {
  const data = useContactStore((state) => state.contacts)
  const loading = useContactStore((state) => state.loading)
  const actions = useContactStore((state) => state.actions)

  useEffect(() => {
    actions.fetchContacts()
  }, [actions])

  if (loading && data.length === 0) {
    return (
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Contact Submissions
            </h1>
            <p className="text-sm text-muted-foreground">
              Here are the latest submissions from the contact form.
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
              Contact Submissions
            </h1>
            <p className="text-sm text-muted-foreground">
              Here are the latest submissions from the contact form.
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable
          data={data}
          columns={columns}
          forceFetchContacts={actions.forceFetchContacts}
        />
      </div>
    </>
  )
}
