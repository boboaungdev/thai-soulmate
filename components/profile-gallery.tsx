"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ApplicationForm } from "@/types/application-form"
import { useAuthStore } from "@/stores/auth-store"
import { Profile } from "@/lib/generated/prisma/client"

interface ProfileWithApplicationForm extends Profile {
  applicationForm: ApplicationForm
}

interface UserGalleryProps {
  layout?: "grid" | "scroll"
}

export function ProfileGallery({ layout = "grid" }: UserGalleryProps) {
  const [users, setUsers] = useState<ProfileWithApplicationForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`/api/gallery?gender=female`)
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
  }, [layout])

  const scroll = (direction: "left" | "right") => {
    if (viewportRef.current && scrollContainerRef.current) {
      const card = scrollContainerRef.current.children[0] as HTMLElement
      if (!card) return

      const cardWidth = card.offsetWidth
      const scrollAmount = (cardWidth + 24) * (direction === "left" ? -1 : 1)
      viewportRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const calculateAge = (dob: string | Date) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getProfileLink = (profileId: string) => {
    if (!user) {
      return "/auth"
    }
    if (user.role === "MEMBER") {
      return `/dashboard/gallery/${profileId}`
    }
    return `/dashboard/profiles/${profileId}`
  }

  if (layout === "scroll") {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 -left-4 z-10 hidden items-center md:flex">
          {!isLoading && users.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              className="btn-gradient rounded-full shadow-md"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
        </div>
        <ScrollArea className="w-full pb-4" viewportRef={viewportRef}>
          <div ref={scrollContainerRef} className="flex w-full gap-6">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Card
                    key={index}
                    className="relative h-[380px] w-[280px] shrink-0 overflow-hidden"
                  >
                    <Skeleton className="size-full" />
                  </Card>
                ))
              : users.map((profile) => (
                  <Link
                    href={getProfileLink(profile.id)}
                    key={profile.id}
                    className="bg-gold block rounded-lg p-[2px]"
                  >
                    <Card className="group relative h-[380px] w-[280px] shrink-0 overflow-hidden rounded-md border-0 bg-background">
                      <Image
                        src={profile.applicationForm.photos.headshot}
                        alt={
                          profile.applicationForm.personalDetails.nickname ||
                          profile.applicationForm.personalDetails.name
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 280px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <p className="text-lg font-semibold">
                          <span className="text-gold">
                            ID-
                            {String(profile.applicationForm.customId).padStart(
                              4,
                              "0"
                            )}
                          </span>
                          ,{" "}
                          <span className="text-pink">
                            {calculateAge(
                              profile.applicationForm.personalDetails.dob
                            )}
                          </span>
                        </p>
                        <p className="flex items-center gap-1 text-sm">
                          <MapPin className="size-3" />
                          {
                            profile.applicationForm.personalDetails
                              .currentLocation
                          }
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="absolute inset-y-0 right-0 z-10 hidden items-center md:flex">
          {!isLoading && users.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              className="btn-gradient rounded-full shadow-md"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
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
        : users.map((profile) => (
            <Link
              href={getProfileLink(profile.id)}
              key={profile.id}
              className="bg-gold block w-[280px] rounded-lg p-[2px]"
            >
              <Card className="group relative h-[380px] w-full overflow-hidden rounded-md border-0 bg-background">
                <Image
                  src={profile.applicationForm.photos.headshot}
                  alt={
                    profile.applicationForm.personalDetails.nickname ||
                    profile.applicationForm.personalDetails.name
                  }
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-lg font-semibold">
                    <span className="text-gold">
                      ID-
                      {String(profile.applicationForm.customId).padStart(
                        4,
                        "0"
                      )}
                    </span>
                    ,{" "}
                    <span className="text-pink">
                      {calculateAge(
                        profile.applicationForm.personalDetails.dob
                      )}
                    </span>
                  </p>
                  <p className="flex items-center gap-1 text-sm">
                    <MapPin className="size-3" />
                    {profile.applicationForm.personalDetails.currentLocation}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
    </div>
  )
}
