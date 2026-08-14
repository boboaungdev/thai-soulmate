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
  Eye,
  Send,
  ArrowLeft,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

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

interface SoulmateApplication {
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
  male: SoulmateApplication
  female: SoulmateApplication
  notes: SoulmateNote[]
  createdAt: string
  updatedAt: string
  closedFromStatus?: SoulmateStatus
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

interface HandleSendProfileProps {
  soulmate: Soulmate
  application: SoulmateApplication
  to: SoulmateApplication
  newStatus: SoulmateStatus
}

const SoulmateActions: React.FC<{
  soulmate: Soulmate
  isUpdating: boolean
  handleSendProfile: (props: HandleSendProfileProps) => Promise<void>
  handleUpdateStatus: (
    soulmateId: string,
    newStatus: SoulmateStatus
  ) => Promise<void>
}> = ({ soulmate, isUpdating, handleSendProfile, handleUpdateStatus }) => {
  const canSendMaleProfileToFemale =
    soulmate.status === SoulmateStatus.INITIAL_CONNECT
  const canSendFemaleProfileToMale =
    soulmate.status === SoulmateStatus.FEMALE_ACCEPTED

  let sendProfileButton = null
  if (canSendMaleProfileToFemale) {
    sendProfileButton = (
      <Button
        className="btn-gradient h-8 px-3 text-sm"
        onClick={() =>
          handleSendProfile({
            soulmate,
            application: soulmate.male,
            to: soulmate.female,
            newStatus: SoulmateStatus.MALE_PROFILE_SENT_TO_FEMALE,
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
            soulmate,
            application: soulmate.female,
            to: soulmate.male,
            newStatus: SoulmateStatus.FEMALE_PROFILE_SENT_TO_MALE,
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
          <DropdownMenuItem onClick={() => alert("Add Note Clicked!")}>
            <NotebookPen className="mr-2 h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Add Note</span>
          </DropdownMenuItem>
          {soulmate.status !== SoulmateStatus.CLOSED && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  handleUpdateStatus(soulmate.id, SoulmateStatus.CLOSED)
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
  currentStatus: Soulmate["status"]
  closedFromStatus?: Soulmate["status"]
}> = ({ currentStatus, closedFromStatus }) => {
  if (currentStatus === SoulmateStatus.CLOSED) {
    const closedAtGroupIndex = closedFromStatus
      ? statusGroups.findIndex((group) =>
          group.statuses.includes(closedFromStatus)
        )
      : -1

    return (
      <div className="flex items-center justify-between gap-1 text-xs">
        {statusGroups.map((group, index) => {
          const isClosedGroup = group.statuses.includes(SoulmateStatus.CLOSED)

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
              icon = <Clock className="size-4 animate-spin text-yellow-500" />
            } else {
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

const ProfileCard: React.FC<{ application: SoulmateApplication }> = ({
  application,
}) => {
  const personalDetails = application.personalDetails as PersonalDetails
  const photos = application.photos as Photos

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
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
  const [soulmate, setSoulmate] = useState<Soulmate | null>(null)
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
          setSoulmate(data.soulmate)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Failed to fetch soulmate details.")
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSoulmate()
  }, [id])

  const handleUpdateStatus = async (
    soulmateId: string,
    newStatus: SoulmateStatus
  ) => {
    setUpdatingId(soulmateId)
    const originalSoulmate = soulmate

    if (soulmate) {
      const optimisticUpdate = { ...soulmate, status: newStatus }
      if (newStatus === SoulmateStatus.CLOSED) {
        optimisticUpdate.closedFromStatus = soulmate.status
      }
      setSoulmate(optimisticUpdate)
    }

    try {
      const response = await fetch(`/api/tracking/${soulmateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      const updatedSoulmate = await response.json()
      if (soulmate) {
        setSoulmate({ ...soulmate, ...updatedSoulmate.soulmate })
      }
    } catch (error) {
      console.error(error)
      if (originalSoulmate) {
        setSoulmate(originalSoulmate)
      }
      setError("Failed to update soulmate status.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSendProfile = async ({
    soulmate,
    application,
    to,
    newStatus,
  }: HandleSendProfileProps) => {
    setUpdatingId(soulmate.id)
    try {
      const response = await fetch(
        `/api/tracking/${soulmate.id}/send-profile`,
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

      await handleUpdateStatus(soulmate.id, newStatus)
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
        <Link href="/dashboard/soulmates">
          <Button variant="link">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Soulmates
          </Button>
        </Link>
      </div>
    )
  }

  if (!soulmate) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p>Soulmate not found.</p>
        <Link href="/dashboard/soulmates">
          <Button variant="link">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Soulmates
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Link
            href="/dashboard/soulmates"
            className="flex items-center text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Soulmates
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Soulmate Connection Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Connected: {formatDateTime(soulmate.createdAt)} | Last updated:{" "}
            {formatDateTime(soulmate.updatedAt)}
          </p>
        </div>
        <SoulmateActions
          soulmate={soulmate}
          isUpdating={updatingId === soulmate.id}
          handleSendProfile={handleSendProfile}
          handleUpdateStatus={handleUpdateStatus}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <SoulmateStatusLine
            currentStatus={soulmate.status}
            closedFromStatus={soulmate.closedFromStatus}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileCard application={soulmate.male} />
        <ProfileCard application={soulmate.female} />
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
            {soulmate.notes.map((note) => (
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
            {soulmate.notes.length === 0 && (
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
