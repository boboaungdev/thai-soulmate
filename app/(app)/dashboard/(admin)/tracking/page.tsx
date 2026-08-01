"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import {
  PersonalDetails,
  Photos,
} from "@/types/application-form"
import { CheckCircle2, Circle } from "lucide-react"
import React, { useEffect, useState } from "react"

enum SoulmateStatus {
  INITIAL_CONNECT = "Initial Connect",
  MALE_PROFILE_SENT = "Male Profile Sent",
  FEMALE_PROFILE_SENT = "Female Profile Sent",
  PROFILES_ACCEPTED = "Profiles Accepted",
  FIRST_GOOGLE_MEET = "First Google Meet",
  SECOND_GOOGLE_MEET = "Second Google Meet",
  FOLLOW_UP = "Follow Up",
  MALE_REJECT = "Male Rejected",
  FEMALE_REJECT = "Female Rejected",
}

interface Soulmate {
  id: string
  maleId: string
  femaleId: string
  status: SoulmateStatus
  male: { personalDetails: PersonalDetails; photos: Photos }
  female: { personalDetails: PersonalDetails; photos: Photos }
}

const allSoulmateStatuses = [
  SoulmateStatus.INITIAL_CONNECT,
  SoulmateStatus.MALE_PROFILE_SENT,
  SoulmateStatus.FEMALE_PROFILE_SENT,
  SoulmateStatus.PROFILES_ACCEPTED,
  SoulmateStatus.FIRST_GOOGLE_MEET,
  SoulmateStatus.SECOND_GOOGLE_MEET,
  SoulmateStatus.FOLLOW_UP,
]

const getInitials = (name?: string) => {
  if (!name) return "TS"
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const SoulmateStatusLine: React.FC<{ currentStatus: Soulmate["status"] }> = ({
  currentStatus,
}) => {
  const currentIndex = allSoulmateStatuses.indexOf(currentStatus)

  return (
    <div className="flex items-center justify-between gap-1 text-xs">
      {allSoulmateStatuses.map((status, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex

        let textColorClass = "text-gray-500"
        let separatorColorClass = "bg-gray-300"

        if (isCompleted) {
          textColorClass = "text-green-700"
          separatorColorClass = "bg-green-500"
        } else if (isCurrent) {
          textColorClass = "text-blue-700 font-semibold"
        }

        const shouldShowSeparator = index < allSoulmateStatuses.length - 1

        return (
          <React.Fragment key={status}>
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <span title={status}>
                {isCompleted ? (
                  <CheckCircle2 className="size-4 text-green-500" />
                ) : isCurrent ? (
                  <Circle className="size-4 fill-blue-500 text-blue-500" />
                ) : (
                  <Circle className="size-4 fill-gray-300 text-gray-300" />
                )}
              </span>
              <span
                className={cn(
                  "mt-1 truncate text-center",
                  textColorClass,
                  "max-w-[70px] whitespace-normal"
                )}
              >
                {status}
              </span>
            </div>
            {shouldShowSeparator && (
              <div
                className={cn("h-1 flex-1", separatorColorClass, "mx-1")}
              ></div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function TrackingPage() {
  const [soulmates, setSoulmates] = useState<Soulmate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSoulmates = async () => {
      try {
        const response = await fetch("/api/soulmates")
        const data = await response.json()
        if (data.success) {
          setSoulmates(data.soulmates)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Failed to fetch soulmates.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSoulmates()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Soulmate Tracking</h1>

      {soulmates.map((soulmate) => (
        <Card key={soulmate.id} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={soulmate.male.photos?.headshot} />
                  <AvatarFallback>
                    {getInitials(soulmate.male.personalDetails?.name)}
                  </AvatarFallback>
                </Avatar>
                <span>{soulmate.male.personalDetails?.name}</span>
              </div>
              <span className="text-gray-400">&</span>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={soulmate.female.photos?.headshot} />
                  <AvatarFallback>
                    {getInitials(soulmate.female.personalDetails?.name)}
                  </AvatarFallback>
                </Avatar>
                <span>{soulmate.female.personalDetails?.name}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Current Status:</p>
              <p className="text-lg font-medium">{soulmate.status}</p>
            </div>
            <Separator className="my-4" />
            <SoulmateStatusLine currentStatus={soulmate.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
