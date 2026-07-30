"use client"

import { useCallback, useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { RegisterInterestDetails } from "./register-interest-details"
import { Skeleton } from "@/components/ui/skeleton"
import { RegisterInterest } from "@/lib/generated/prisma/client"

type RegisterInterestWithNotesCount = RegisterInterest & {
  _count: {
    notes: number
  }
}

async function getData(): Promise<RegisterInterestWithNotesCount[]> {
  const res = await fetch("/api/register-interest")

  if (!res.ok) {
    const error = await res.json()
    console.error("Failed to fetch data:", res.status, error)
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default function TaskPage() {
  const [data, setData] = useState<RegisterInterestWithNotesCount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] =
    useState<RegisterInterestWithNotesCount | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getData()
      setData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const handleUpdated = () => fetchData()
    window.addEventListener("register-interest-updated", handleUpdated)
    return () => {
      window.removeEventListener("register-interest-updated", handleUpdated)
    }
  }, [fetchData])
  const handleRowClick = (item: RegisterInterestWithNotesCount) => {
    setSelectedItem(item)
  }

  const handleCloseDetails = () => {
    setSelectedItem(null)
  }

  if (loading) {
    return (
      <div className="h-full flex-1 flex-col space-y-4 p-6 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Register Interest
            </h1>
            <p className="text-sm text-muted-foreground">
              Users2 who submitted matchmaking interest forms
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
              Users2 who submitted matchmaking interest forms
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable data={data} columns={columns} onRowClick={handleRowClick} />
      </div>
      <RegisterInterestDetails
        item={selectedItem}
        onClose={handleCloseDetails}
      />
    </>
  )
}
