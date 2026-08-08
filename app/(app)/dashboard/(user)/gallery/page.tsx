"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
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
import { MapPin } from "lucide-react"
import {
  ApplicationForm,
  PersonalDetails,
  Photos,
} from "@/types/application-form"

interface Profile {
  id: string
  applicationForm: ApplicationForm
}

function UserCard({ profile }: { profile: Profile }) {
  const personalDetails: PersonalDetails =
    profile.applicationForm.personalDetails &&
    typeof profile.applicationForm.personalDetails === "string"
      ? JSON.parse(profile.applicationForm.personalDetails as string)
      : profile.applicationForm.personalDetails || {}
  const photos: Photos =
    profile.applicationForm.photos &&
    typeof profile.applicationForm.photos === "string"
      ? JSON.parse(profile.applicationForm.photos as string)
      : (profile.applicationForm.photos as unknown as Photos) || {}

  const age = personalDetails.dob
    ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
    : "N/A"

  return (
    <Link
      href={`/dashboard/gallery/${profile.id}`}
      className="bg-gold block w-full rounded-lg p-[2px]"
    >
      <Card className="group relative h-[380px] w-full overflow-hidden rounded-md border-0 bg-background">
        {photos?.headshot ? (
          <Image
            src={photos.headshot}
            alt={personalDetails?.name || "User"}
            fill
            sizes="280px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-lg font-semibold">
            <span className="text-gold">
              ID-{String(profile.applicationForm.customId).padStart(4, "0")} (
              {personalDetails?.nickname || personalDetails.name})
            </span>
            , <span className="text-pink">{age}</span>
          </p>
          <p className="flex items-center gap-1 text-sm">
            <MapPin className="size-3" />
            {personalDetails?.currentLocation || "N/A"}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export default function GalleryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // State for search term
  const [gender, setGender] = useState("Female")
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
        setProfiles(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [gender, sortBy, sortOrder, nickname, customId])

  const filteredProfiles = profiles?.filter((profile) => {
    if (!searchTerm) return true
    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    const id = String(profile.applicationForm.customId).padStart(4, "0")
    const name = profile.applicationForm.personalDetails?.name?.toLowerCase() || ""
    const nickname =
      profile.applicationForm.personalDetails?.nickname?.toLowerCase() || ""
    const nationality =
      profile.applicationForm.personalDetails?.nationality?.toLowerCase() || ""
    const currentLocation =
      profile.applicationForm.personalDetails?.currentLocation?.toLowerCase() || ""
    return (
      name.includes(lowerCaseSearchTerm) ||
      nickname.includes(lowerCaseSearchTerm) ||
      id.includes(lowerCaseSearchTerm) ||
      nationality.includes(lowerCaseSearchTerm) ||
      currentLocation.includes(lowerCaseSearchTerm)
    )
  })

  const sortedProfiles = filteredProfiles?.slice().sort((a, b) => {
    const aValue =
      sortBy === "customId"
        ? a.applicationForm.customId
        : a.applicationForm.personalDetails?.name || ""
    const bValue =
      sortBy === "customId"
        ? b.applicationForm.customId
        : b.applicationForm.personalDetails?.name || ""

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
                className="h-[380px] w-full overflow-hidden rounded-md border-0"
              >
                <Skeleton className="h-full w-full" />
              </Card>
            ))
          : sortedProfiles?.map((profile) => (
              <UserCard key={profile.id} profile={profile} />
            ))}
      </div>
    </div>
  )
}
