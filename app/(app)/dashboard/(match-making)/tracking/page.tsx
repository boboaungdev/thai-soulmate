"use client"

import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateTime } from "@/lib/date"
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
  Eye,
  Send,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  {
    step: 6,
    name: "First Google Meet",
    statuses: [TrackingStatus.FIRST_GOOGLE_MEET],
  },
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
  { step: 12, name: "Closed", statuses: [TrackingStatus.CLOSED] },
]

interface TrackingApplication {
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
  completedStatuses: TrackingStatus[]
  male: TrackingApplication
  female: TrackingApplication
  notes: TrackingNote[]
  createdAt: string
  closedFromStatus?: TrackingStatus
  matchPercentage: number
}

interface TrackingNote {
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

const getMatchPercentageVariant = (percentage: number) => {
  if (percentage >= 80) {
    return "success"
  }
  if (percentage >= 60) {
    return "pending"
  }
  if (percentage >= 40) {
    return "destructive"
  }
  return "error"
}

const SoulmateActions: React.FC<{
  tracking: Tracking
  isUpdating: boolean
  handleUpdateStatus: (
    trackingId: string,
    newStatus: TrackingStatus
  ) => Promise<void>
  handleSendProfiles: (tracking: Tracking) => Promise<void>
}> = ({ tracking, isUpdating, handleUpdateStatus, handleSendProfiles }) => {
  const canSendProfiles = tracking.status === TrackingStatus.INITIAL_CONNECT

  return (
    <div className="flex shrink-0 items-center gap-2">
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
              Sent profiles
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
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/tracking/${tracking.id}`}>
              <Eye className="mr-2 h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">View details</span>
            </Link>
          </DropdownMenuItem>

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
  completedStatuses?: Tracking["completedStatuses"]
  closedFromStatus?: Tracking["status"]
}> = ({
  currentStatus,
  completedStatuses = [TrackingStatus.INITIAL_CONNECT],
  closedFromStatus,
}) => {
  const isClosed = currentStatus === TrackingStatus.CLOSED
  const closedFromGroup = statusGroups.find(
    (g) => closedFromStatus && g.statuses.includes(closedFromStatus)
  )
  const closedFromStep = closedFromGroup?.step ?? 0

  const getStatusLabel = (status: TrackingStatus): string => {
    const words = status.toLowerCase().split("_")
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex items-center justify-between gap-1 text-xs">
      {statusGroups.map((group, index) => {
        let isCompleted = false
        let label = group.name
        let textColorClass = "text-muted-foreground"
        let separatorColorClass = "bg-border/60"
        let icon: React.ReactNode = (
          <Circle className="size-4 fill-muted text-muted-foreground/40" />
        )

        if (isClosed) {
          if (group.statuses.includes(TrackingStatus.CLOSED)) {
            icon = <CheckCircle2 className="size-4 text-blue-500" />
            textColorClass = "text-blue-700 dark:text-blue-400 font-semibold"
            isCompleted = true
          } else if (
            (group.step === 3 &&
              (completedStatuses.includes(TrackingStatus.FEMALE_REJECTED) ||
                closedFromStatus === TrackingStatus.FEMALE_REJECTED)) ||
            (group.step === 4 &&
              (completedStatuses.includes(TrackingStatus.MALE_REJECTED) ||
                closedFromStatus === TrackingStatus.MALE_REJECTED))
          ) {
            icon = <XCircle className="size-4 fill-red-500/10 text-red-500" />
            textColorClass = "text-red-600 dark:text-red-400 font-semibold"
          } else if (
            group.statuses.some((s) => completedStatuses.includes(s)) ||
            (closedFromStep > 0 && group.step <= closedFromStep)
          ) {
            icon = <CheckCircle2 className="size-4 text-green-500" />
            textColorClass = "text-green-700 dark:text-green-400 font-medium"
            isCompleted = true
          } else {
            icon = <XCircle className="size-4 text-red-500" />
            textColorClass = "text-muted-foreground line-through"
          }
        } else {
          // Check step-specific completion from completedStatuses
          if (group.step === 1) {
            isCompleted = completedStatuses.includes(
              TrackingStatus.INITIAL_CONNECT
            )
          } else if (group.step === 2) {
            isCompleted = completedStatuses.includes(
              TrackingStatus.BOTH_PROFILES_SENT
            )
          } else if (group.step === 3) {
            // Female Review
            if (
              completedStatuses.includes(TrackingStatus.FEMALE_ACCEPTED) ||
              completedStatuses.includes(TrackingStatus.BOTH_PROFILES_ACCEPTED)
            ) {
              isCompleted = true
              label = "Female Accepted"
            } else if (
              completedStatuses.includes(TrackingStatus.FEMALE_REJECTED) ||
              currentStatus === TrackingStatus.FEMALE_REJECTED
            ) {
              label = "Female Rejected"
            } else if (
              completedStatuses.includes(TrackingStatus.FEMALE_THINKING) ||
              currentStatus === TrackingStatus.FEMALE_THINKING
            ) {
              label = "Female Thinking"
            } else if (
              completedStatuses.includes(TrackingStatus.BOTH_PROFILES_SENT)
            ) {
              label = "Female (Review)"
            }
          } else if (group.step === 4) {
            // Male Review
            if (
              completedStatuses.includes(TrackingStatus.MALE_ACCEPTED) ||
              completedStatuses.includes(TrackingStatus.BOTH_PROFILES_ACCEPTED)
            ) {
              isCompleted = true
              label = "Male Accepted"
            } else if (
              completedStatuses.includes(TrackingStatus.MALE_REJECTED) ||
              currentStatus === TrackingStatus.MALE_REJECTED
            ) {
              label = "Male Rejected"
            } else if (
              completedStatuses.includes(TrackingStatus.MALE_THINKING) ||
              currentStatus === TrackingStatus.MALE_THINKING
            ) {
              label = "Male Thinking"
            } else if (
              completedStatuses.includes(TrackingStatus.BOTH_PROFILES_SENT)
            ) {
              label = "Male (Review)"
            }
          } else if (group.step === 5) {
            isCompleted = completedStatuses.includes(
              TrackingStatus.BOTH_PROFILES_ACCEPTED
            )
          } else {
            isCompleted = group.statuses.some((s) =>
              completedStatuses.includes(s)
            )
          }

          const isCurrent = group.statuses.includes(currentStatus)

          if (isCompleted) {
            icon = <CheckCircle2 className="size-4 text-green-500" />
            textColorClass = "text-green-700 dark:text-green-400 font-medium"
          } else if (
            (currentStatus === TrackingStatus.FEMALE_REJECTED &&
              group.step === 3) ||
            (completedStatuses.includes(TrackingStatus.FEMALE_REJECTED) &&
              group.step === 3)
          ) {
            icon = <XCircle className="size-4 fill-red-500/10 text-red-500" />
            textColorClass = "text-red-600 dark:text-red-400 font-semibold"
            label = "Female Rejected"
          } else if (
            (currentStatus === TrackingStatus.MALE_REJECTED &&
              group.step === 4) ||
            (completedStatuses.includes(TrackingStatus.MALE_REJECTED) &&
              group.step === 4)
          ) {
            icon = <XCircle className="size-4 fill-red-500/10 text-red-500" />
            textColorClass = "text-red-600 dark:text-red-400 font-semibold"
            label = "Male Rejected"
          } else if (
            (currentStatus === TrackingStatus.FEMALE_THINKING &&
              group.step === 3) ||
            (currentStatus === TrackingStatus.MALE_THINKING && group.step === 4)
          ) {
            icon = <Clock className="size-4 animate-spin text-amber-500" />
            textColorClass = "text-amber-600 dark:text-amber-400 font-semibold"
          } else if (
            completedStatuses.includes(TrackingStatus.BOTH_PROFILES_SENT) &&
            (group.step === 3 || group.step === 4) &&
            !isCompleted
          ) {
            icon = <Clock className="size-4 animate-spin text-amber-500" />
            textColorClass = "text-amber-600 dark:text-amber-400 font-semibold"
          } else if (isCurrent) {
            icon = (
              <Circle className="size-4 animate-pulse fill-primary text-primary" />
            )
            textColorClass = "text-primary font-bold"
            label = getStatusLabel(currentStatus)
          }
        }

        // Check if next step is reached/completed
        const nextGroup = statusGroups[index + 1]
        const isNextCompletedOrActive =
          nextGroup &&
          (nextGroup.statuses.some((s) => completedStatuses.includes(s)) ||
            nextGroup.statuses.includes(currentStatus))

        if (isCompleted && isNextCompletedOrActive) {
          separatorColorClass = "bg-green-500"
        }

        return (
          <React.Fragment key={group.name}>
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <span title={group.name}>{icon}</span>
              <span
                className={cn(
                  "mt-1 truncate text-center text-[10px] leading-tight sm:text-xs",
                  textColorClass,
                  "max-w-[70px] whitespace-normal"
                )}
              >
                {label}
              </span>
            </div>
            {index < statusGroups.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 transition-colors",
                  separatorColorClass,
                  "mx-1"
                )}
              ></div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function SoulmateTrackingPage() {
  const [trackings, setTrackings] = useState<Tracking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchSoulmates = async () => {
      try {
        const response = await fetch("/api/tracking")
        const data = await response.json()
        if (data.success) {
          setTrackings(data.trackings)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Failed to fetch trackings.")
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSoulmates()
  }, [])

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

      // If emails are sent successfully, update the status
      await handleUpdateStatus(tracking.id, TrackingStatus.BOTH_PROFILES_SENT)
    } catch (error) {
      console.error(error)
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    } finally {
      // setUpdatingId(null) is called inside handleUpdateStatus
    }
  }

  const handleUpdateStatus = async (
    trackingId: string,
    newStatus: TrackingStatus
  ) => {
    setUpdatingId(trackingId)
    const originalSoulmates = [...trackings]

    const soulmateToUpdate = trackings.find((s) => s.id === trackingId)

    const optimisticUpdate = trackings.map((s) => {
      if (s.id === trackingId) {
        const updated = { ...s, status: newStatus }
        if (newStatus === TrackingStatus.CLOSED && soulmateToUpdate) {
          updated.closedFromStatus = soulmateToUpdate.status
        }
        return updated
      }
      return s
    })
    setTrackings(optimisticUpdate)

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
      setTrackings((currentSoulmates) =>
        currentSoulmates.map((s) =>
          s.id === updatedSoulmate.tracking.id
            ? { ...s, ...updatedSoulmate.tracking }
            : s
        )
      )
    } catch (error) {
      console.error(error)
      setTrackings(originalSoulmates)
      setError("Failed to update tracking status.")
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Track the progress of tracking connections.
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
                {Array.from({ length: 11 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex min-w-0 flex-1 flex-col items-center">
                      <Skeleton className="size-4 rounded-full" />
                      <Skeleton className="mt-1 h-4 w-12" />
                    </div>
                    {index < 10 && <Skeleton className="mx-1 h-1 flex-1" />}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
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
          <h1 className="text-2xl font-bold tracking-tight">Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Track the progress of tracking connections.
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>

      {trackings.map((tracking) => (
        <Card key={tracking.id} className="w-full">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-y-2">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-4 text-xl">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={tracking.male.photos?.headshot} />
                    <AvatarFallback>
                      {getInitials(tracking.male.personalDetails?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">
                    {tracking.male.personalDetails?.name}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Badge
                    variant={getMatchPercentageVariant(
                      tracking.matchPercentage
                    )}
                  >
                    {tracking.matchPercentage}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={tracking.female.photos?.headshot} />
                    <AvatarFallback>
                      {getInitials(tracking.female.personalDetails?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">
                    {tracking.female.personalDetails?.name}
                  </span>
                </div>
              </CardTitle>
              <CardDescription>
                Connected: {formatDateTime(tracking.createdAt)}
              </CardDescription>
            </div>
            <SoulmateActions
              tracking={tracking}
              isUpdating={updatingId === tracking.id}
              handleUpdateStatus={handleUpdateStatus}
              handleSendProfiles={handleSendProfiles}
            />
          </CardHeader>
          <CardContent>
            <SoulmateStatusLine
              currentStatus={tracking.status}
              completedStatuses={tracking.completedStatuses}
              closedFromStatus={tracking.closedFromStatus}
            />
            <div className="mt-4">
              <h4 className="text-sm font-medium">Notes</h4>
              <CardDescription>
                Latest notes for this connection.
              </CardDescription>
              <div className="mt-2 space-y-2">
                {tracking.notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="text-sm text-muted-foreground">
                    <p className="font-semibold">
                      {note.user.name}:{" "}
                      <span className="font-normal">{note.message}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </main>
  )
}
