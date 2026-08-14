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
    statuses: [TrackingStatus.INITIAL_CONNECT],
  },
  {
    name: "Female's Review",
    statuses: [
      TrackingStatus.MALE_PROFILE_SENT_TO_FEMALE,
      TrackingStatus.FEMALE_THINKING,
      TrackingStatus.FEMALE_REJECT,
      TrackingStatus.FEMALE_ACCEPTED,
    ],
  },
  {
    name: "Male's Review",
    statuses: [
      TrackingStatus.FEMALE_PROFILE_SENT_TO_MALE,
      TrackingStatus.MALE_THINKING,
      TrackingStatus.MALE_REJECT,
      TrackingStatus.MALE_ACCEPTED,
    ],
  },
  {
    name: "First Meet",
    statuses: [
      TrackingStatus.FIRST_GOOGLE_MEET,
      TrackingStatus.REVIEW_FIRST_GOOGLE_MEET,
    ],
  },
  {
    name: "Second Meet",
    statuses: [
      TrackingStatus.SECOND_GOOGLE_MEET,
      TrackingStatus.REVIEW_SECOND_GOOGLE_MEET,
    ],
  },
  {
    name: "Third Meet",
    statuses: [
      TrackingStatus.THIRD_GOOGLE_MEET,
      TrackingStatus.REVIEW_THIRD_GOOGLE_MEET,
    ],
  },
  {
    name: "Final Match",
    statuses: [TrackingStatus.FINAL_MATCH, TrackingStatus.CONNECTED],
  },
  {
    name: "Closed",
    statuses: [TrackingStatus.CLOSED],
  },
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

interface HandleSendProfileProps {
  tracking: Tracking
  application: TrackingApplication
  to: TrackingApplication
  newStatus: TrackingStatus
}

const SoulmateActions: React.FC<{
  tracking: Tracking
  isUpdating: boolean
  handleSendProfile: (props: HandleSendProfileProps) => Promise<void>
  handleUpdateStatus: (
    trackingId: string,
    newStatus: TrackingStatus
  ) => Promise<void>
}> = ({ tracking, isUpdating, handleSendProfile, handleUpdateStatus }) => {
  const canSendMaleProfileToFemale =
    tracking.status === TrackingStatus.INITIAL_CONNECT
  const canSendFemaleProfileToMale =
    tracking.status === TrackingStatus.FEMALE_ACCEPTED

  let sendProfileButton = null
  if (canSendMaleProfileToFemale) {
    sendProfileButton = (
      <Button
        className="btn-gradient h-8 px-3 text-sm"
        onClick={() =>
          handleSendProfile({
            tracking,
            application: tracking.male,
            to: tracking.female,
            newStatus: TrackingStatus.MALE_PROFILE_SENT_TO_FEMALE,
          })
        }
        disabled={isUpdating}
      >
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Male Profile
          </>
        )}
      </Button>
    )
  } else if (canSendFemaleProfileToMale) {
    sendProfileButton = (
      <Button
        className="btn-gradient h-8 px-3 text-sm"
        onClick={() =>
          handleSendProfile({
            tracking,
            application: tracking.female,
            to: tracking.male,
            newStatus: TrackingStatus.FEMALE_PROFILE_SENT_TO_MALE,
          })
        }
        disabled={isUpdating}
      >
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Female Profile
          </>
        )}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {sendProfileButton}

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
  closedFromStatus?: Tracking["status"]
}> = ({ currentStatus, closedFromStatus }) => {
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
              closedAtGroupIndex > -1 && index < closedAtGroupIndex
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
  const currentGroupIndex = statusGroups.findIndex((group) =>
    group.statuses.includes(currentStatus)
  )

  const isRejected =
    currentStatus === TrackingStatus.FEMALE_REJECT ||
    currentStatus === TrackingStatus.MALE_REJECT

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
              group.statuses.includes(TrackingStatus.FEMALE_THINKING) ||
              group.statuses.includes(TrackingStatus.MALE_THINKING)

            if (currentStatus === TrackingStatus.INITIAL_CONNECT) {
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

  const handleSendProfile = async ({
    tracking,
    application,
    to,
    newStatus,
  }: HandleSendProfileProps) => {
    setUpdatingId(tracking.id)
    try {
      const response = await fetch(
        `/api/tracking/${tracking.id}/send-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            application,
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

      await handleUpdateStatus(tracking.id, newStatus)
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
          <CardHeader className="flex flex-row items-start justify-between">
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
              handleSendProfile={handleSendProfile}
              handleUpdateStatus={handleUpdateStatus}
            />
          </CardHeader>
          <CardContent>
            <SoulmateStatusLine
              currentStatus={tracking.status}
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
