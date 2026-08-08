"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { PersonalDetails, Photos } from "@/types/application-form"
import { CheckCircle2, Circle, XCircle, Clock } from "lucide-react"
import React, { useEffect, useState } from "react"

enum SoulmateStatus {
  INITIAL_CONNECT = "INITIAL_CONNECT",
  MALE_PROFILE_SENT_TO_FEMALE = "MALE_PROFILE_SENT_TO_FEMALE",
  FEMALE_THINKING = "FEMALE_THINKING",
  FEMALE_REJECT = "FEMALE_REJECT",
  FEMALE_ACCEPTED = "FEMALE_ACCEPTED",
  FEMALE_PROFILE_SENT_TO_MALE = "FEMALE_PROFILE_SENT_TO_MALE",
  MALE_THINKING = "MALE_THINKING",
  MALE_REJECT = "MALE_REJECT",
  MALE_ACCEPTED = "MALE_ACCEPTED",
  FIRST_GOOGLE_MEET = "FIRST_GOOGLE_MEET",
  REVIEW_FIRST_GOOGLE_MEET = "REVIEW_FIRST_GOOGLE_MEET",
  SECOND_GOOGLE_MEET = "SECOND_GOOGLE_MEET",
  REVIEW_SECOND_GOOGLE_MEET = "REVIEW_SECOND_GOOGLE_MEET",
  THIRD_GOOGLE_MEET = "THIRD_GOOGLE_MEET",
  REVIEW_THIRD_GOOGLE_MEET = "REVIEW_THIRD_GOOGLE_MEET",
  FINAL_MATCH = "FINAL_MATCH",
  CONNECTED = "CONNECTED",
  CLOSED = "CLOSED",
}

const statusGroups = [
  {
    name: "Initial Connect",
    statuses: [SoulmateStatus.INITIAL_CONNECT],
  },
  {
    name: "Female's Review",
    statuses: [
      SoulmateStatus.MALE_PROFILE_SENT_TO_FEMALE,
      SoulmateStatus.FEMALE_THINKING,
      SoulmateStatus.FEMALE_REJECT,
      SoulmateStatus.FEMALE_ACCEPTED,
    ],
  },
  {
    name: "Male's Review",
    statuses: [
      SoulmateStatus.FEMALE_PROFILE_SENT_TO_MALE,
      SoulmateStatus.MALE_THINKING,
      SoulmateStatus.MALE_REJECT,
      SoulmateStatus.MALE_ACCEPTED,
    ],
  },
  {
    name: "First Meet",
    statuses: [
      SoulmateStatus.FIRST_GOOGLE_MEET,
      SoulmateStatus.REVIEW_FIRST_GOOGLE_MEET,
    ],
  },
  {
    name: "Second Meet",
    statuses: [
      SoulmateStatus.SECOND_GOOGLE_MEET,
      SoulmateStatus.REVIEW_SECOND_GOOGLE_MEET,
    ],
  },
  {
    name: "Third Meet",
    statuses: [
      SoulmateStatus.THIRD_GOOGLE_MEET,
      SoulmateStatus.REVIEW_THIRD_GOOGLE_MEET,
    ],
  },
  {
    name: "Final Match",
    statuses: [SoulmateStatus.FINAL_MATCH, SoulmateStatus.CONNECTED],
  },
  {
    name: "Closed",
    statuses: [SoulmateStatus.CLOSED],
  },
]

interface SoulmateProfile {
  id: string
  customId: number
  personalDetails: PersonalDetails
  photos: Photos
}

interface Soulmate {
  id: string
  maleId: string
  femaleId: string
  status: SoulmateStatus
  male: SoulmateProfile
  female: SoulmateProfile
}

const getInitials = (name?: string) => {
  if (!name) return "TS"
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const formatStatus = (status: string) => {
  return status
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

const SoulmateStatusLine: React.FC<{ currentStatus: Soulmate["status"] }> = ({
  currentStatus,
}) => {
  const currentGroupIndex = statusGroups.findIndex((group) =>
    group.statuses.includes(currentStatus)
  )

  const isRejected =
    currentStatus === SoulmateStatus.FEMALE_REJECT ||
    currentStatus === SoulmateStatus.MALE_REJECT

  return (
    <div className="flex items-center justify-between gap-1 text-xs">
      {statusGroups.map((group, index) => {
        const isCompleted = currentGroupIndex > -1 && index < currentGroupIndex
        const isCurrent = index === currentGroupIndex

        let textColorClass = "text-gray-500"
        let separatorColorClass = "bg-gray-300"
        let icon = <Circle className="size-4 fill-gray-300 text-gray-300" />

        if (isCompleted) {
          textColorClass = "text-green-700"
          separatorColorClass = "bg-green-500"
          icon = <CheckCircle2 className="size-4 text-green-500" />
        } else if (isCurrent) {
          if (isRejected) {
            textColorClass = "text-red-700 font-semibold"
            icon = <XCircle className="size-4 fill-red-500 text-red-500" />
          } else {
            // This is the "current" status that is not rejected.
            // The user wants blue for 'INITIAL_CONNECT' and a yellow spinning icon for 'REVIEW' and 'THINKING' statuses.
            const isReviewStatus = group.statuses.some((status) =>
              status.startsWith("REVIEW_")
            )
            const isThinkingStatus =
              group.statuses.includes(SoulmateStatus.FEMALE_THINKING) ||
              group.statuses.includes(SoulmateStatus.MALE_THINKING)

            if (currentStatus === SoulmateStatus.INITIAL_CONNECT) {
              textColorClass = "text-blue-700 font-semibold"
              icon = <Circle className="size-4 fill-blue-500 text-blue-500" />
            } else if (isReviewStatus || isThinkingStatus) {
              textColorClass = "text-yellow-700 font-semibold"
              icon = <Clock className="size-4 animate-spin text-yellow-500" /> // Using Clock icon with spin for "thinking" and "review"
            } else {
              // Default to blue circle for other non-rejected current statuses
              textColorClass = "text-blue-700 font-semibold"
              icon = <Circle className="size-4 fill-blue-500 text-blue-500" />
            }
          }
        }

        const shouldShowSeparator = index < statusGroups.length - 1

        return (
          <React.Fragment key={group.name}>
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <span title={group.name}>{icon}</span>
              <span
                className={cn(
                  "mt-1 truncate text-center",
                  textColorClass,
                  "max-w-[70px] whitespace-normal"
                )}
              >
                {group.name}
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
  const [updatingId, setUpdatingId] = useState<string | null>(null)

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
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSoulmates()
  }, [])

  const handleUpdateStatus = async (
    soulmateId: string,
    newStatus: SoulmateStatus
  ) => {
    setUpdatingId(soulmateId)
    const originalSoulmates = [...soulmates]

    const optimisticUpdate = soulmates.map((s) =>
      s.id === soulmateId ? { ...s, status: newStatus } : s
    )
    setSoulmates(optimisticUpdate)

    try {
      const response = await fetch(`/api/soulmates/${soulmateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      const updatedSoulmate = await response.json()
      setSoulmates((currentSoulmates) =>
        currentSoulmates.map((s) =>
          s.id === updatedSoulmate.id ? { ...s, ...updatedSoulmate } : s
        )
      )
    } catch (error) {
      console.error(error)
      setSoulmates(originalSoulmates)
      setError("Failed to update soulmate status.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSendProfile = async (
    soulmate: Soulmate,
    profile: SoulmateProfile,
    to: SoulmateProfile,
    newStatus: SoulmateStatus
  ) => {
    setUpdatingId(soulmate.id)
    try {
      const response = await fetch(
        `/api/soulmates/${soulmate.id}/send-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            to: {
              name: to.personalDetails.name,
              email: to.personalDetails.email,
              gender: to.personalDetails.gender,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to send profile")
      }

      await handleUpdateStatus(soulmate.id, newStatus)
    } catch (error) {
      console.error(error)
      setError("Failed to send profile.")
    } finally {
      setUpdatingId(null)
    }
  }

  const renderActionButton = (soulmate: Soulmate) => {
    const isUpdating = updatingId === soulmate.id

    switch (soulmate.status) {
      case SoulmateStatus.INITIAL_CONNECT:
        return (
          <Button
            className="btn-gradient"
            onClick={() =>
              handleSendProfile(
                soulmate,
                soulmate.male,
                soulmate.female,
                SoulmateStatus.MALE_PROFILE_SENT_TO_FEMALE
              )
            }
            disabled={isUpdating}
          >
            {isUpdating ? <Spinner /> : "Send Male Profile to Female"}
          </Button>
        )
      case SoulmateStatus.MALE_PROFILE_SENT_TO_FEMALE:
      case SoulmateStatus.FEMALE_THINKING:
      case SoulmateStatus.FEMALE_REJECT:
        return (
          <Button disabled className="btn-gradient">
            {formatStatus(soulmate.status)}
          </Button>
        )
      case SoulmateStatus.FEMALE_ACCEPTED:
        return (
          <Button
            className="btn-gradient"
            onClick={() =>
              handleSendProfile(
                soulmate,
                soulmate.female,
                soulmate.male,
                SoulmateStatus.FEMALE_PROFILE_SENT_TO_MALE
              )
            }
            disabled={isUpdating}
          >
            {isUpdating ? <Spinner /> : "Send Female Profile to Male"}
          </Button>
        )
      case SoulmateStatus.FEMALE_PROFILE_SENT_TO_MALE:
      case SoulmateStatus.MALE_THINKING:
      case SoulmateStatus.MALE_REJECT:
        return (
          <Button disabled className="btn-gradient">
            {formatStatus(soulmate.status)}
          </Button>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Soulmate Tracking
            </h1>
            <p className="text-sm text-muted-foreground">
              Track the progress of soulmate connections.
            </p>
          </div>
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <span className="text-gray-400">&</span>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-6 w-48" />
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between gap-1 text-xs">
                {Array.from({ length: 8 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex min-w-0 flex-1 flex-col items-center">
                      <Skeleton className="size-4 rounded-full" />
                      <Skeleton className="mt-1 h-4 w-12" />
                    </div>
                    {index < 7 && <Skeleton className="mx-1 h-1 flex-1" />}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-48 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </main>
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
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Soulmate Tracking
          </h1>
          <p className="text-sm text-muted-foreground">
            Track the progress of soulmate connections.
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>

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
              <p className="text-lg font-medium">
                {formatStatus(soulmate.status)}
              </p>
            </div>
            <Separator className="my-4" />
            <SoulmateStatusLine currentStatus={soulmate.status} />
          </CardContent>
          <CardFooter>{renderActionButton(soulmate)}</CardFooter>
        </Card>
      ))}
    </main>
  )
}
