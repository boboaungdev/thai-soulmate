"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { calculateAge, formatDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import { PersonalDetails, Photos } from "@/types/application-form"
import {
  CheckCircle2,
  Circle,
  XCircle,
  Clock,
  MoreHorizontal,
  Loader2,
  NotebookPen,
  CircleX,
  Send,
  ChevronLeft,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

enum TrackingStatus {
  INITIAL_CONNECT = "INITIAL_CONNECT",
  BOTH_PROFILES_SENT = "BOTH_PROFILES_SENT",
  FEMALE_REVIEW = "FEMALE_REVIEW",
  FEMALE_THINKING = "FEMALE_THINKING",
  FEMALE_REJECTED = "FEMALE_REJECTED",
  FEMALE_ACCEPTED = "FEMALE_ACCEPTED",
  MALE_REVIEW = "MALE_REVIEW",
  MALE_THINKING = "MALE_THINKING",
  MALE_REJECTED = "MALE_REJECTED",
  MALE_ACCEPTED = "MALE_ACCEPTED",
  BOTH_PROFILES_ACCEPTED = "BOTH_PROFILES_ACCEPTED",
  FIRST_GOOGLE_MEET = "FIRST_GOOGLE_MEET",
  SECOND_GOOGLE_MEET = "SECOND_GOOGLE_MEET",
  FIRST_FOLLOW_UP = "FIRST_FOLLOW_UP",
  SECOND_FOLLOW_UP = "SECOND_FOLLOW_UP",
  THIRD_FOLLOW_UP = "THIRD_FOLLOW_UP",
  MATCHED = "MATCHED",
  CLOSED = "CLOSED",
}

const statusGroups = [
  {
    step: 1,
    name: "Initial Connect",
    statuses: [TrackingStatus.INITIAL_CONNECT],
  },
  {
    step: 2,
    name: "Profiles Sent",
    statuses: [TrackingStatus.BOTH_PROFILES_SENT],
  },
  {
    step: 3,
    name: "Female's Review",
    statuses: [
      TrackingStatus.FEMALE_REVIEW,
      TrackingStatus.FEMALE_THINKING,
      TrackingStatus.FEMALE_REJECTED,
      TrackingStatus.FEMALE_ACCEPTED,
    ],
  },
  {
    step: 4,
    name: "Male's Review",
    statuses: [
      TrackingStatus.MALE_REVIEW,
      TrackingStatus.MALE_THINKING,
      TrackingStatus.MALE_REJECTED,
      TrackingStatus.MALE_ACCEPTED,
    ],
  },
  {
    step: 5,
    name: "Both Accepted",
    statuses: [TrackingStatus.BOTH_PROFILES_ACCEPTED],
  },
  { step: 6, name: "First Google Meet", statuses: [TrackingStatus.FIRST_GOOGLE_MEET] },
  {
    step: 7,
    name: "Second Google Meet",
    statuses: [TrackingStatus.SECOND_GOOGLE_MEET],
  },
  {
    step: 8,
    name: "First Follow-up",
    statuses: [TrackingStatus.FIRST_FOLLOW_UP],
  },
  {
    step: 9,
    name: "Second Follow-up",
    statuses: [TrackingStatus.SECOND_FOLLOW_UP],
  },
  {
    step: 10,
    name: "Third Follow-up",
    statuses: [TrackingStatus.THIRD_FOLLOW_UP],
  },
  { step: 11, name: "Matched", statuses: [TrackingStatus.MATCHED] },
  {
    step: 12,
    name: "Closed",
    statuses: [TrackingStatus.CLOSED],
  },
]

interface SoulmateApplication {
  id: string
  customId: number
  personalDetails: PersonalDetails
  photos: Photos
}

interface Tracking {
  id: string
  maleId: string
  femaleId: string
  status: TrackingStatus
  male: SoulmateApplication
  female: SoulmateApplication
  notes: SoulmateNote[]
  createdAt: string
  updatedAt: string
  closedFromStatus?: TrackingStatus
  matchPercentage: number
}

interface SoulmateNote {
  id: string
  message: string
  type: string // SoulmateNoteType
  createdAt: string
  user: { name: string }
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

const SoulmateActions: React.FC<{
  tracking: Tracking
  isUpdating: boolean
  handleSendProfiles: (tracking: Tracking) => Promise<void>
  handleUpdateStatus: (
    trackingId: string,
    newStatus: TrackingStatus
  ) => Promise<void>
}> = ({ tracking, isUpdating, handleSendProfiles, handleUpdateStatus }) => {
  const canSendProfiles = tracking.status === TrackingStatus.INITIAL_CONNECT

  return (
    <div className="flex items-center gap-2">
      {canSendProfiles && (
        <Button
          className="btn-gradient h-8 px-3 text-sm"
          onClick={() => handleSendProfiles(tracking)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Both Profiles
            </>
          )}
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-max">
          <DropdownMenuItem onClick={() => alert("Add Note Clicked!")}>
            <NotebookPen className="mr-2 h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Add Note</span>
          </DropdownMenuItem>
          {tracking.status !== TrackingStatus.CLOSED && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  handleUpdateStatus(tracking.id, TrackingStatus.CLOSED)
                }
                variant="destructive"
              >
                <CircleX className="mr-2 h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Close Connection</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const SoulmateStatusLine: React.FC<{
  currentStatus: Tracking["status"]
  closedFromStatus?: Tracking["status"]
}> = ({ currentStatus, closedFromStatus }) => {
  const currentGroup = statusGroups.find((g) =>
    g.statuses.includes(currentStatus)
  )
  const currentStep = currentGroup?.step ?? 0
  if (currentStatus === TrackingStatus.CLOSED) {
    const closedAtGroupIndex = closedFromStatus
      ? statusGroups.findIndex((group) =>
          group.statuses.includes(closedFromStatus)
        )
      : -1

    return (
      <div className="flex items-center justify-between gap-1 text-xs">
        {statusGroups.map((group, index) => {
          const isClosedGroup = group.statuses.includes(TrackingStatus.CLOSED)

          let textColorClass = "text-gray-500"
          let separatorColorClass = "bg-gray-300"
          let icon = <XCircle className="size-4 text-red-500" />

          if (isClosedGroup) {
            textColorClass = "text-blue-700 font-semibold"
            icon = <CheckCircle2 className="size-4 text-blue-500" />
          } else {
            const wasCompletedBeforeClose =
              closedAtGroupIndex > -1 && index <= closedAtGroupIndex
            if (wasCompletedBeforeClose) {
              textColorClass = "text-green-700"
              separatorColorClass = "bg-green-500"
              icon = <CheckCircle2 className="size-4 text-green-500" />
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

  return (
    <div className="flex items-start justify-between gap-1 text-xs">
      {statusGroups.map((group, index) => {
        const isCompleted = currentStep > group.step
        const isCurrent = currentStep === group.step

        let textColorClass = "text-gray-500"
        let separatorColorClass = "bg-gray-300"
        let icon = <Circle className="size-4 fill-gray-300 text-gray-300" />

        if (currentStatus === TrackingStatus.INITIAL_CONNECT && isCurrent) {
          textColorClass = "text-green-700"
          separatorColorClass = "bg-gray-300"
          icon = <CheckCircle2 className="size-4 text-green-500" />
        } else if (isCompleted) {
          textColorClass = "text-green-700"
          separatorColorClass = "bg-green-500"
          icon = <CheckCircle2 className="size-4 text-green-500" />
        } else if (isCurrent) {
          if (
            currentStatus === TrackingStatus.FEMALE_REJECTED ||
            currentStatus === TrackingStatus.MALE_REJECTED
          ) {
            textColorClass = "text-red-700 font-semibold"
            icon = <XCircle className="size-4 fill-red-500 text-red-500" />
          } else if (
            currentStatus === TrackingStatus.FEMALE_THINKING ||
            currentStatus === TrackingStatus.MALE_THINKING
          ) {
            textColorClass = "text-yellow-700 font-semibold"
            icon = <Clock className="size-4 animate-spin text-yellow-500" />
          } else if (
            currentStatus === TrackingStatus.FEMALE_ACCEPTED ||
            currentStatus === TrackingStatus.MALE_ACCEPTED
          ) {
            textColorClass = "text-green-700 font-semibold"
            icon = <CheckCircle2 className="size-4 text-green-500" />
          } else if (currentStatus === TrackingStatus.BOTH_PROFILES_SENT) {
            textColorClass = "text-green-700"
            icon = <CheckCircle2 className="size-4 text-green-500" />
          } else {
            textColorClass = "text-blue-700 font-semibold"
            icon = <Circle className="size-4 fill-blue-500 text-blue-500" />
          }
        } else if (
          currentStatus === TrackingStatus.BOTH_PROFILES_SENT &&
          (group.step === 3 || group.step === 4)
        ) {
          // Special case for BOTH_PROFILES_SENT
          textColorClass = "text-yellow-700 font-semibold"
          icon = <Clock className="size-4 animate-spin text-yellow-500" />
          if (index < statusGroups.length - 1) {
            separatorColorClass = "bg-gray-300"
          } else {
            textColorClass = "text-blue-700 font-semibold"
            icon = <Circle className="size-4 fill-blue-500 text-blue-500" />
          }
        } else if (
          (currentStatus.startsWith("FEMALE_") && group.step === 4) ||
          (currentStatus.startsWith("MALE_") && group.step === 3)
        ) {
          // When one member has decided, show the other as still in review
          textColorClass = "text-yellow-700 font-semibold"
          icon = <Clock className="size-4 animate-spin text-yellow-500" />
          if (index < statusGroups.length - 1) {
            separatorColorClass = "bg-gray-300"
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
                {currentStatus === TrackingStatus.BOTH_PROFILES_SENT &&
                  (group.step === 3 || group.step === 4) && (
                    <span className="mt-1 block">(Review)</span>
                  )}
                {/* Explicitly show (Review) for current THINKING statuses */}
                {isCurrent &&
                  (currentStatus === TrackingStatus.FEMALE_THINKING ||
                    currentStatus === TrackingStatus.MALE_THINKING) && (
                    <span className="mt-1 block">(Review)</span>
                  )}
                {((currentStatus.startsWith("FEMALE_") && group.step === 4) ||
                  (currentStatus.startsWith("MALE_") && group.step === 3)) && (
                  <span className="mt-1 block">(Review)</span>
                )}
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

const ProfileCard: React.FC<{
  application: SoulmateApplication
}> = ({ application }) => {
  const personalDetails = application.personalDetails as PersonalDetails
  const photos = application.photos as Photos

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={photos?.headshot} alt={personalDetails.name} />
          <AvatarFallback>{getInitials(personalDetails.name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{personalDetails.name}</CardTitle>
          <CardDescription>
            {personalDetails.gender}, {calculateAge(personalDetails.dob)} years
            old
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Nationality:</strong> {personalDetails.nationality}
          </p>
          <p>
            <strong>Current Location:</strong> {personalDetails.currentLocation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SoulmateDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [tracking, setSoulmate] = useState<Tracking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchSoulmate = async () => {
      try {
        const response = await fetch(`/api/tracking/${id}`)
        const data = await response.json()
        if (data.success) {
          setSoulmate(data.tracking)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Failed to fetch tracking details.")
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSoulmate()
  }, [id])

  const handleUpdateStatus = async (
    trackingId: string,
    newStatus: TrackingStatus
  ) => {
    setUpdatingId(trackingId)
    const originalSoulmate = tracking

    if (tracking) {
      const optimisticUpdate = { ...tracking, status: newStatus }
      if (newStatus === TrackingStatus.CLOSED) {
        optimisticUpdate.closedFromStatus = tracking.status
      }
      setSoulmate(optimisticUpdate)
    }

    try {
      const response = await fetch(`/api/tracking/${trackingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      const updatedSoulmate = await response.json()
      if (tracking) {
        setSoulmate({ ...tracking, ...updatedSoulmate.tracking })
      }
    } catch (error) {
      console.error(error)
      if (originalSoulmate) {
        setSoulmate(originalSoulmate)
      }
      setError("Failed to update tracking status.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSendProfiles = async (tracking: Tracking) => {
    setUpdatingId(tracking.id)
    try {
      const response = await fetch(
        `/api/tracking/${tracking.id}/send-profiles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            male: tracking.male,
            female: tracking.female,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send profiles")
      }

      // The API now handles the status update, so we just need to refetch or update optimistically.
      // For simplicity, let's update the status optimistically and then fully update with the response from PATCH.
      await handleUpdateStatus(tracking.id, TrackingStatus.BOTH_PROFILES_SENT)
    } catch (error) {
      console.error(error)
      setError("Failed to send profile.")
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-full" />
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-500">
        <p>{error}</p>
        <Link href="/dashboard/tracking">
          <Button
            variant="link"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tracking
          </Button>
        </Link>
      </div>
    )
  }

  if (!tracking) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p>Tracking not found.</p>
        <Link href="/dashboard/tracking">
          <Button
            variant="link"
            className="text-muted-foreground hover:text-foreground hover:underline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tracking
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/tracking"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tracking
          </Link>
          <SoulmateActions
            tracking={tracking}
            isUpdating={updatingId === tracking.id}
            handleSendProfiles={handleSendProfiles}
            handleUpdateStatus={handleUpdateStatus}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tracking Connection Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Connected: {formatDateTime(tracking.createdAt)} | Last updated:{" "}
            {formatDateTime(tracking.updatedAt)}
          </p>
          <Badge
            className={cn(
              "mt-2 text-base",
              tracking.matchPercentage < 50 && "bg-red-100 text-red-800",
              tracking.matchPercentage >= 50 &&
                tracking.matchPercentage < 75 &&
                "bg-yellow-100 text-yellow-800",
              tracking.matchPercentage >= 75 && "bg-green-100 text-green-800"
            )}
          >
            Match Score: {tracking.matchPercentage}%
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <SoulmateStatusLine
            currentStatus={tracking.status}
            closedFromStatus={tracking.closedFromStatus}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <ProfileCard application={tracking.male} />
        <ProfileCard application={tracking.female} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status History & Notes</CardTitle>
          <CardDescription>
            All notes and status changes for this connection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tracking.notes.map((note) => (
              <div key={note.id} className="flex gap-4">
                <Avatar>
                  <AvatarFallback>{getInitials(note.user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{note.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(note.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {note.message}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {note.type}
                  </Badge>
                </div>
              </div>
            ))}
            {tracking.notes.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No notes for this connection yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
