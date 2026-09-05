"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  ApplicationForm,
  PersonalDetails,
  Photos,
} from "@/types/application-form"
import { useAuthStore } from "@/stores/auth-store"
import { Profile } from "@/lib/generated/prisma/client"

interface ProfileWithApplicationForm extends Profile {
  applicationForm: ApplicationForm
}

interface UserGalleryProps {
  layout?: "grid" | "scroll"
}

const getPersonalDetails = (
  profile: ProfileWithApplicationForm
): PersonalDetails => {
  if (!profile.applicationForm?.personalDetails) return {} as PersonalDetails
  if (typeof profile.applicationForm.personalDetails === "string") {
    try {
      return JSON.parse(profile.applicationForm.personalDetails)
    } catch {
      return {} as PersonalDetails
    }
  }
  return profile.applicationForm.personalDetails as PersonalDetails
}

const getPhotos = (profile: ProfileWithApplicationForm): Photos => {
  if (!profile.applicationForm?.photos) return {} as Photos
  if (typeof profile.applicationForm.photos === "string") {
    try {
      return JSON.parse(profile.applicationForm.photos)
    } catch {
      return {} as Photos
    }
  }
  return profile.applicationForm.photos as unknown as Photos
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

  const calculateAge = (dob?: string | Date) => {
    if (!dob) return "N/A"
    const birthDate = new Date(dob)
    if (isNaN(birthDate.getTime())) return "N/A"
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
              className="btn-gradient size-10 rounded-full p-0 shadow-md"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </Button>
          )}
        </div>
        <ScrollArea className="w-full pb-4" viewportRef={viewportRef}>
          <div ref={scrollContainerRef} className="flex w-full gap-6">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Card
                    key={index}
                    className="relative h-[390px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-border/70"
                  >
                    <Skeleton className="size-full" />
                  </Card>
                ))
              : users.map((profile) => {
                  const details = getPersonalDetails(profile)
                  const photos = getPhotos(profile)
                  const nickname = details?.nickname?.trim()

                  return (
                    <Link
                      href={getProfileLink(profile.id)}
                      key={profile.id}
                      className="group relative block h-[390px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-[2px] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/15"
                    >
                      <div className="relative size-full overflow-hidden rounded-[14px] bg-card">
                        {photos?.headshot ? (
                          <Image
                            src={photos.headshot}
                            alt={nickname || details?.name || "Member"}
                            fill
                            sizes="(max-width: 768px) 100vw, 280px"
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
                              <span className="text-[#D3A753]">
                                {nickname || "Member"}
                              </span>{" "}
                              <span className="text-xs font-normal text-white/70">
                                (ID-
                                {String(
                                  profile.applicationForm.customId
                                ).padStart(4, "0")}
                                )
                              </span>
                            </p>
                            <span className="shrink-0 rounded-md bg-[#E791A7]/25 px-2 py-0.5 text-xs font-semibold text-[#E791A7]">
                              {calculateAge(details?.dob)} yrs
                            </span>
                          </div>
                          <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                            <MapPin className="size-3 text-[#D3A753]" />
                            <span>
                              {details?.currentLocation || "Thailand"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="absolute inset-y-0 right-0 z-10 hidden items-center md:flex">
          {!isLoading && users.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              className="btn-gradient size-10 rounded-full p-0 shadow-md"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
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
        : users.map((profile) => {
            const details = getPersonalDetails(profile)
            const photos = getPhotos(profile)
            const nickname = details?.nickname?.trim()

            return (
              <Link
                href={getProfileLink(profile.id)}
                key={profile.id}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-[2px] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/15"
              >
                <div className="relative size-full overflow-hidden rounded-[14px] bg-card">
                  {photos?.headshot ? (
                    <Image
                      src={photos.headshot}
                      alt={nickname || details?.name || "Member"}
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
                        <span className="text-[#D3A753]">
                          {nickname || "Member"}
                        </span>{" "}
                        <span className="text-xs font-normal text-white/70">
                          (ID-
                          {String(profile.applicationForm.customId).padStart(
                            4,
                            "0"
                          )}
                          )
                        </span>
                      </p>
                      <span className="shrink-0 rounded-md bg-[#E791A7]/25 px-2 py-0.5 text-xs font-semibold text-[#E791A7]">
                        {calculateAge(details?.dob)} yrs
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                      <MapPin className="size-3 text-[#D3A753]" />
                      <span>{details?.currentLocation || "Thailand"}</span>
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}

      {!isLoading && users.length === 0 && (
        <div className="col-span-full rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#D3A753]/15 text-[#D3A753]">
            <ShieldCheck className="size-6" />
          </div>
          <p className="mt-4 text-base font-bold text-foreground">
            Member Profiles are Private & Confidential
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            To protect our members&apos; discretion, individual profiles are
            shared privately during your 1-2-1 matchmaking consultation.
          </p>
          <Button
            asChild
            size="sm"
            className="btn-gradient mt-5 font-semibold shadow-md"
          >
            <Link href="/#register-interest">Request Member Access</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
