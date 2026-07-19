"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ApplicationForm } from "@/lib/generated/prisma/client"

// Assuming the JSON fields have these structures
interface PersonalDetails {
  name: string
  dob: string
}
interface Contact {
  currentLocation: string
}
interface Photos {
  headshot: string
  fullLength: string
  casualLifestyle: string
  recent: string
}

interface UserCardProps {
  user: ApplicationForm
}

export function UserCard({ user }: UserCardProps) {
  const personalDetails: PersonalDetails =
    user.personalDetails && typeof user.personalDetails === "string"
      ? JSON.parse(user.personalDetails)
      : user.personalDetails || {}
  const contact: Contact =
    user.contact && typeof user.contact === "string"
      ? JSON.parse(user.contact)
      : user.contact || {}
  const photos: Photos =
    user.photos && typeof user.photos === "string"
      ? JSON.parse(user.photos)
      : (user.photos as unknown as Photos) || {}

  const age = personalDetails.dob
    ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
    : "N/A"

  return (
    <Link
      href={`/dashboard/gallery/${user.id}`}
      className="bg-gold block w-[280px] rounded-lg p-[2px]"
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
              ID-{user.id.slice(0, 4).toUpperCase()}
            </span>
            , <span className="text-pink">{age}</span>
          </p>
          <p className="flex items-center gap-1 text-sm">
            <MapPin className="size-3" />
            {contact?.currentLocation || "N/A"}
          </p>
        </div>
      </Card>
    </Link>
  )
}
