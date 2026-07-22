"use client"

import { useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { RegisterInterest } from "@/lib/generated/prisma/client"

async function getData(): Promise<RegisterInterest[]> {
  const res = await fetch("/api/register-interest")

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default function TaskPage() {
  const [data, setData] = useState<RegisterInterest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData()
        setData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Register Interest
            </h2>
            <p className="text-muted-foreground">
              Users who submitted matchmaking interest forms
            </p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable data={data} columns={columns} />
      </div>
    </>
  )
}
