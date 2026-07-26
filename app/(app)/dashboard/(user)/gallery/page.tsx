"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { UserCard } from "@/components/user-card"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { ApplicationForm } from "@/types/application-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function GalleryPage() {
  const [users, setUsers] = useState<ApplicationForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // State for search term
  const [sortBy, setSortBy] = useState("customId")
  const [sortOrder, setSortOrder] = useState("asc")

  const isIdSearch = /^\d/.test(searchTerm) && searchTerm.length > 0

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/gallery")
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

  const filteredUsers = users?.filter((user) => {
    if (!searchTerm) return true
    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    const id = String(user.customId).padStart(4, "0")
    const name = user.personalDetails?.name?.toLowerCase() || ""
    const nickname = user.personalDetails?.nickname?.toLowerCase() || ""
    const nationality = user.personalDetails?.nationality?.toLowerCase() || ""
    const currentLocation =
      user.personalDetails?.currentLocation?.toLowerCase() || ""
    return (
      name.includes(lowerCaseSearchTerm) ||
      nickname.includes(lowerCaseSearchTerm) ||
      id.includes(lowerCaseSearchTerm) ||
      nationality.includes(lowerCaseSearchTerm) ||
      currentLocation.includes(lowerCaseSearchTerm)
    )
  })

  const sortedUsers = filteredUsers?.slice().sort((a, b) => {
    const aValue =
      sortBy === "customId" ? a.customId : a.personalDetails?.name || ""
    const bValue =
      sortBy === "customId" ? b.customId : b.personalDetails?.name || ""

    if (sortBy === "customId") {
      const valA = aValue as number
      const valB = bValue as number
      if (sortOrder === "asc") {
        return valA - valB
      } else {
        return valB - valA
      }
    } else {
      // sort by name
      const valA = aValue as string
      const valB = bValue as string
      if (sortOrder === "asc") {
        return valA.localeCompare(valB)
      } else {
        return valB.localeCompare(valA)
      }
    }
  })

  return (
    <div className="container mx-auto px-6 py-4 lg:py-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">User Gallery</h1>
        <p className="text-sm text-muted-foreground">
          Browse through a curated selection of profiles.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by ID, name, location, etc..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value
                // If the input starts with a digit, enforce ID search rules
                if (/^\d/.test(value)) {
                  // Allow only numbers and limit to 4 digits
                  const numericValue = value.replace(/\D/g, "").slice(0, 4)
                  setSearchTerm(numericValue)
                } else {
                  setSearchTerm(value)
                }
              }}
              className="pl-9"
            />
            {isIdSearch && (
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                Searching with ID
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-[120px] bg-card">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customId">ID</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-8 w-[120px] bg-card">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
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
          : sortedUsers?.map((user) => <UserCard key={user.id} user={user} />)}
      </div>
    </div>
  )
}
