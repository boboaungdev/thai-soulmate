"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area"

interface RandomUser {
  login: {
    uuid: string
  }
  name: {
    first: string
    last: string
  }
  dob: {
    age: number
  }
  location: {
    city: string
    country: string
  }
  picture: {
    large: string
  }
}

interface UserGalleryProps {
  layout?: "grid" | "scroll"
}

export function UserGallery({ layout = "grid" }: UserGalleryProps) {
  const [users, setUsers] = useState<RandomUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchUsers() {
      const userCount = layout === "grid" ? 18 : 20
      try {
        const response = await fetch(
          `https://randomuser.me/api/?results=${userCount}&gender=female&nat=us,gb,au,ca,nz,ie`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data.results)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [layout])

  const scroll = (direction: "left" | "right") => {
    if (viewportRef.current) {
      const scrollAmount =
        direction === "left"
          ? -viewportRef.current.clientWidth
          : viewportRef.current.clientWidth
      viewportRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (layout === "scroll") {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 -left-4 z-10 hidden items-center md:flex">
          {!isLoading && users.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-md"
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
              : users.map((user) => (
                  <Link
                    href="/auth?mode=signup"
                    key={user.login.uuid}
                    className="block p-[2px] bg-gradient-to-br from-[#cfa14f] via-[#cb5d7a] to-[#cb5d7a] rounded-lg"
                  >
                    <Card className="group relative h-[380px] w-[280px] shrink-0 overflow-hidden bg-background">
                      <Image
                        src={user.picture.large}
                        alt={`${user.name.first} ${user.name.last}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 280px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <p className="text-lg font-semibold">
                          ID-{user.login.uuid.slice(0, 4).toUpperCase()}, {user.dob.age}
                        </p>
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="size-3" />
                          {user.location.city}, {user.location.country}
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
              size="icon"
              className="rounded-full shadow-md"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {isLoading
        ? Array.from({ length: 18 }).map((_, index) => (
            <Card
              key={index}
              className="relative h-[380px] w-full overflow-hidden"
            >
              <Skeleton className="size-full" />
            </Card>
          ))
        : users.map((user) => (
            <Link
              href="/auth?mode=signup"
              key={user.login.uuid}
              className="block p-[2px] bg-gradient-to-br from-[#cfa14f] via-[#cb5d7a] to-[#cb5d7a] rounded-lg"
            >
              <Card className="group relative h-[380px] w-full overflow-hidden bg-background">
                <Image
                  src={user.picture.large}
                  alt={`${user.name.first} ${user.name.last}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-lg font-semibold">
                    ID-{user.login.uuid.slice(0, 4).toUpperCase()}, {user.dob.age}
                  </p>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="size-3" />
                    {user.location.city}, {user.location.country}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
    </div>
  )
}
