"use client"

import { useEffect, useState } from "react"
import { ApplicationForm } from "@/lib/generated/prisma"
import { UserCard } from "@/components/user-card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GalleryPage() {
  const [users, setUsers] = useState<ApplicationForm[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">User Gallery</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Card
                key={index}
                className="relative h-[380px] w-[280px] overflow-hidden"
              >
                <Skeleton className="size-full" />
              </Card>
            ))
          : users.map((user) => <UserCard key={user.id} user={user} />)}
      </div>
    </div>
  )
}
