"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Link from "next/link"
import Image from "next/image"
import { ApplicationForm } from "@/types/application-form"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Home, MapPin, Venus, Mars } from "lucide-react"

function UserCard({ user }: { user: ApplicationForm }) {
  const isVip = user.membership?.type === "VIP"

  const personalDetails =
    typeof user.personalDetails === "string"
      ? JSON.parse(user.personalDetails)
      : user.personalDetails || {}

  const photos =
    typeof user.photos === "string"
      ? JSON.parse(user.photos)
      : user.photos || {}

  const age = personalDetails.dob
    ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
    : "N/A"

  return (
    <Link href={`/dashboard/gallery/${user.id}`}>
      <Card className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {photos?.headshot ? (
            <Image
              src={photos.headshot}
              alt={personalDetails.name}
              fill
              className="object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              No Image
            </div>
          )}

          <Badge className="absolute top-3 left-3 bg-card text-muted-foreground">
            ID-{String(user.customId).padStart(4, "0")}
          </Badge>

          {isVip && (
            <Badge className="absolute top-3 right-3 bg-pink-500">VIP</Badge>
          )}
        </div>

        {/* Info */}
        <CardContent className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold">
              {personalDetails.name}
              {personalDetails.nickname && (
                <span className="text-muted-foreground">
                  {" "}
                  ({personalDetails.nickname})
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {personalDetails.gender === "Male" ? (
              <Mars className="h-4 w-4 text-blue-500" />
            ) : (
              <Venus className="h-4 w-4 text-pink-500" />
            )}

            <span>{age} years old</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            {personalDetails.nationality}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {personalDetails.currentLocation}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="outline">
            View Profile
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default function ProfilesPage() {
  const [users, setUsers] = useState<ApplicationForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // State for search term
  const [gender, setGender] = useState("All")
  const [sortBy, setSortBy] = useState("customId")
  const [sortOrder, setSortOrder] = useState("asc")
  const [nickname, setNickname] = useState("")
  const [customId, setCustomId] = useState("")

  const isIdSearch = /^\d/.test(searchTerm) && searchTerm.length > 0

  useEffect(() => {
    async function fetchUsers() {
      try {
        const params = new URLSearchParams()

        if (gender) params.append("gender", gender)
        if (sortBy) params.append("sortBy", sortBy)
        if (sortOrder) params.append("sortOrder", sortOrder)
        if (nickname) params.append("nickname", nickname)
        if (customId) params.append("customId", customId)

        const response = await fetch(`/api/gallery?${params.toString()}`)

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
  }, [gender, sortBy, sortOrder, name, customId])

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
        <h1 className="text-lg font-semibold md:text-2xl">Profiles</h1>
        <p className="text-sm text-muted-foreground">
          Browse all our members profiles.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md flex-1">
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
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-8 min-w-[130px] gap-1 bg-card">
                <span className="text-muted-foreground">Gender:</span>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 min-w-[150px] gap-1 bg-card">
                <span className="text-muted-foreground">Sort:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customId">ID</SelectItem>
                <SelectItem value="name">Nickname</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-8 w-auto gap-1 bg-card sm:w-[120px]">
                <span className="text-muted-foreground">Order:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Card
                key={index}
                className="mx-auto w-full max-w-[280px] overflow-hidden"
              >
                <Skeleton className="aspect-[3/4] w-full" />
              </Card>
            ))
          : sortedUsers?.map((user) => <UserCard key={user.id} user={user} />)}
      </div>
    </div>
  )
}
