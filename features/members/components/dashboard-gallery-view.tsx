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
import { motion } from "framer-motion"
import { MapPin, Briefcase, ShieldCheck } from "lucide-react"
import {
  ApplicationForm,
  PersonalDetails,
  Photos,
  Career,
} from "@/types/application-form"
import { getGalleryProfilesAction } from "@/features/members"

interface Profile {
  id: string
  applicationForm: ApplicationForm
}

const safeParse = <T,>(json: unknown, fallback: T): T => {
  if (!json) return fallback
  if (typeof json === "object") return json as T
  try {
    return JSON.parse(String(json)) as T
  } catch {
    return fallback
  }
}

const calculateAge = (dob?: string | Date) => {
  if (!dob) return 25
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return 25
  const diff = Date.now() - birth.getTime()
  return Math.abs(new Date(diff).getUTCFullYear() - 1970)
}

function UserCard({ profile }: { profile: Profile }) {
  const personalDetails: PersonalDetails = safeParse(
    profile.applicationForm.personalDetails,
    {} as PersonalDetails
  )
  const photos: Photos = safeParse(profile.applicationForm.photos, {} as Photos)
  const career: Career = safeParse(profile.applicationForm.career, {} as Career)

  const age = calculateAge(personalDetails?.dob)
  const nickname = personalDetails?.nickname?.trim()

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Link
        href={`/dashboard/gallery/${profile.id}`}
        className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-[2px] shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/15"
      >
        <div className="relative size-full overflow-hidden rounded-[14px] bg-card">
          {photos?.headshot ? (
            <Image
              src={photos.headshot}
              alt={nickname || personalDetails?.name || "Member"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-secondary/50 text-xs text-muted-foreground">
              No Photo Available
            </div>
          )}

          {/* Top Verified Pill */}
          <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#D3A753]/30 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-[#D3A753] backdrop-blur-md">
            <ShieldCheck className="size-3" />
            <span>Verified</span>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Member Info */}
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-base font-bold text-white sm:text-lg">
                <span className="text-[#D3A753]">{nickname || "Member"}</span>{" "}
                <span className="text-xs font-normal text-white/70">
                  (ID-
                  {String(profile.applicationForm.customId).padStart(4, "0")})
                </span>
              </p>
              <span className="shrink-0 rounded-md bg-[#E791A7]/25 px-2 py-0.5 text-xs font-semibold text-[#E791A7]">
                {age} yrs
              </span>
            </div>

            <div className="mt-1 space-y-0.5 text-xs">
              {career?.occupation && (
                <p className="flex items-center gap-1.5 text-white/90">
                  <Briefcase className="size-3 shrink-0 text-[#E791A7]" />
                  <span className="truncate">{career.occupation}</span>
                </p>
              )}
              <p className="flex items-center gap-1.5 text-white/80">
                <MapPin className="size-3 shrink-0 text-[#D3A753]" />
                <span className="truncate">
                  {personalDetails?.currentLocation || "Thailand"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function DashboardGalleryView() {
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
        const data = await getGalleryProfilesAction({
          gender,
          sortBy,
          sortOrder: sortOrder as "asc" | "desc",
          nickname,
          customId,
        })

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch users")
        }

        setProfiles((data.data || []) as any)
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
    const personal = safeParse(
      profile.applicationForm.personalDetails,
      {} as PersonalDetails
    )
    const name = personal?.name?.toLowerCase() || ""
    const nickname = personal?.nickname?.toLowerCase() || ""
    const nationality = personal?.nationality?.toLowerCase() || ""
    const currentLocation = personal?.currentLocation?.toLowerCase() || ""
    return (
      name.includes(lowerCaseSearchTerm) ||
      nickname.includes(lowerCaseSearchTerm) ||
      id.includes(lowerCaseSearchTerm) ||
      nationality.includes(lowerCaseSearchTerm) ||
      currentLocation.includes(lowerCaseSearchTerm)
    )
  })

  const sortedProfiles = filteredProfiles?.slice().sort((a, b) => {
    const personalA = safeParse(
      a.applicationForm.personalDetails,
      {} as PersonalDetails
    )
    const personalB = safeParse(
      b.applicationForm.personalDetails,
      {} as PersonalDetails
    )
    const aValue =
      sortBy === "customId" ? a.applicationForm.customId : personalA?.name || ""
    const bValue =
      sortBy === "customId" ? b.applicationForm.customId : personalB?.name || ""

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
    <div className="container mx-auto px-4 py-4 sm:px-6 lg:py-6">
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            User Gallery
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Browse through curated verified member profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
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

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/70"
              >
                <Skeleton className="size-full" />
              </Card>
            ))
          : sortedProfiles?.map((profile) => (
              <UserCard key={profile.id} profile={profile} />
            ))}
      </div>

      {!isLoading && sortedProfiles?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 py-16 text-center">
          <p className="text-base font-semibold text-foreground">
            No members found
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search query or filters.
          </p>
        </div>
      )}
    </div>
  )
}
