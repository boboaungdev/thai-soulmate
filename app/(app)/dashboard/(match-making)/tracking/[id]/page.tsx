"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { calculateAge, formatDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import {
  PersonalDetails,
  Photos,
  Career,
  Appearance,
  Personality,
  Lifestyle,
  RelationshipGoals,
  IdealPartner,
} from "@/types/application-form"
import {
  CheckCircle2,
  Circle,
  XCircle,
  MoreHorizontal,
  Loader2,
  CircleX,
  Send,
  ChevronLeft,
  Users,
  StickyNote,
  HardDrive,
  MapPin,
  Cake,
  Briefcase,
  Mail,
  Phone,
  Mars,
  Venus,
  Home,
  FileText,
  User as UserIcon,
  MoreVertical,
  Camera,
  Download,
  Ruler,
  Weight,
  BookUser,
  GraduationCap,
  Languages,
  Church,
  Heart,
  Sparkles,
  Compass,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"
import { TrackingStorageTab } from "@/components/dashboard/tracking/tracking-storage-tab"
import {
  TrackingNotesTab,
  TrackingNoteWithUser,
} from "@/components/dashboard/tracking/tracking-notes-tab"

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
  career?: Career
  appearance?: Appearance
  personality?: Personality
  lifestyle?: Lifestyle
  relationshipGoals?: RelationshipGoals
  idealPartner?: IdealPartner
  photos: Photos
  profile?: { id: string } | null
}

interface Tracking {
  id: string
  maleId: string
  femaleId: string
  status: TrackingStatus
  completedStatuses: TrackingStatus[]
  male: SoulmateApplication
  female: SoulmateApplication
  notes: TrackingNoteWithUser[]
  createdAt: string
  updatedAt: string
  closedFromStatus?: TrackingStatus
  matchPercentage: number
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

const getNextStatus = (
  status: TrackingStatus
): { next: TrackingStatus; label: string } | null => {
  switch (status) {
    case TrackingStatus.BOTH_PROFILES_ACCEPTED:
      return {
        next: TrackingStatus.FIRST_GOOGLE_MEET,
        label: "Start 1st Meet",
      }
    case TrackingStatus.FIRST_GOOGLE_MEET:
      return {
        next: TrackingStatus.SECOND_GOOGLE_MEET,
        label: "Start 2nd Meet",
      }
    case TrackingStatus.SECOND_GOOGLE_MEET:
      return {
        next: TrackingStatus.FIRST_FOLLOW_UP,
        label: "1st Follow-up",
      }
    case TrackingStatus.FIRST_FOLLOW_UP:
      return {
        next: TrackingStatus.SECOND_FOLLOW_UP,
        label: "2nd Follow-up",
      }
    case TrackingStatus.SECOND_FOLLOW_UP:
      return {
        next: TrackingStatus.THIRD_FOLLOW_UP,
        label: "3rd Follow-up",
      }
    case TrackingStatus.THIRD_FOLLOW_UP:
      return {
        next: TrackingStatus.MATCHED,
        label: "Mark Matched 🎉",
      }
    default:
      return null
  }
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
  const nextAction = getNextStatus(tracking.status)

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

      {nextAction && (
        <Button
          className="btn-gradient h-8 px-3 text-sm"
          onClick={() => handleUpdateStatus(tracking.id, nextAction.next)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {nextAction.label}
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
          {tracking.status !== TrackingStatus.CLOSED && (
            <DropdownMenuItem
              onClick={() =>
                handleUpdateStatus(tracking.id, TrackingStatus.CLOSED)
              }
              variant="destructive"
            >
              <CircleX className="mr-2 h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Close Connection</span>
            </DropdownMenuItem>
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

  return (
    <div className="flex items-start justify-between gap-1 text-xs">
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
          } else if (group.step === 3) {
            if (completedStatuses.includes(TrackingStatus.FEMALE_ACCEPTED)) {
              icon = <CheckCircle2 className="size-4 text-green-500" />
              textColorClass = "text-green-700 dark:text-green-400 font-medium"
              label = "Female Accepted"
              isCompleted = true
            } else if (
              completedStatuses.includes(TrackingStatus.FEMALE_REJECTED) ||
              closedFromStatus === TrackingStatus.FEMALE_REJECTED
            ) {
              icon = <XCircle className="size-4 fill-red-500/10 text-red-500" />
              textColorClass = "text-red-600 dark:text-red-400 font-semibold"
              label = "Female Rejected"
            } else if (closedFromStep > 0 && group.step <= closedFromStep) {
              icon = <CheckCircle2 className="size-4 text-green-500" />
              textColorClass = "text-green-700 dark:text-green-400 font-medium"
              isCompleted = true
            } else {
              icon = <XCircle className="size-4 text-red-500/70" />
              textColorClass = "text-muted-foreground line-through"
            }
          } else if (group.step === 4) {
            if (completedStatuses.includes(TrackingStatus.MALE_ACCEPTED)) {
              icon = <CheckCircle2 className="size-4 text-green-500" />
              textColorClass = "text-green-700 dark:text-green-400 font-medium"
              label = "Male Accepted"
              isCompleted = true
            } else if (
              completedStatuses.includes(TrackingStatus.MALE_REJECTED) ||
              closedFromStatus === TrackingStatus.MALE_REJECTED
            ) {
              icon = <XCircle className="size-4 fill-red-500/10 text-red-500" />
              textColorClass = "text-red-600 dark:text-red-400 font-semibold"
              label = "Male Rejected"
            } else if (closedFromStep > 0 && group.step <= closedFromStep) {
              icon = <CheckCircle2 className="size-4 text-green-500" />
              textColorClass = "text-green-700 dark:text-green-400 font-medium"
              isCompleted = true
            } else {
              icon = <XCircle className="size-4 text-red-500/70" />
              textColorClass = "text-muted-foreground line-through"
            }
          } else if (
            group.statuses.some((s) => completedStatuses.includes(s)) ||
            (closedFromStep > 0 && group.step <= closedFromStep)
          ) {
            icon = <CheckCircle2 className="size-4 text-green-500" />
            textColorClass = "text-green-700 dark:text-green-400 font-medium"
            isCompleted = true
          } else {
            icon = <XCircle className="size-4 text-red-500/70" />
            textColorClass = "text-muted-foreground line-through"
          }
        } else {
          if (group.step === 1) {
            isCompleted = completedStatuses.includes(
              TrackingStatus.INITIAL_CONNECT
            )
          } else if (group.step === 2) {
            isCompleted = completedStatuses.includes(
              TrackingStatus.BOTH_PROFILES_SENT
            )
          } else if (group.step === 3) {
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

          if (isCompleted) {
            icon = <CheckCircle2 className="size-4 text-green-500" />
            textColorClass = "text-green-700 dark:text-green-400 font-medium"
            separatorColorClass = "bg-green-500/50"
          } else if (group.statuses.includes(currentStatus)) {
            if (
              currentStatus === TrackingStatus.FEMALE_REJECTED ||
              currentStatus === TrackingStatus.MALE_REJECTED
            ) {
              icon = <XCircle className="size-4 fill-red-500/10 text-red-500" />
              textColorClass = "text-red-600 dark:text-red-400 font-semibold"
            } else if (
              currentStatus === TrackingStatus.FEMALE_THINKING ||
              currentStatus === TrackingStatus.MALE_THINKING
            ) {
              icon = <Loader2 className="size-4 animate-spin text-amber-500" />
              textColorClass = "text-amber-600 dark:text-amber-400 font-medium"
            } else {
              icon = <Circle className="size-4 fill-primary/20 text-primary" />
              textColorClass = "text-primary font-semibold"
            }
          }
        }

        return (
          <React.Fragment key={group.step}>
            <div className="flex min-w-0 flex-1 flex-col items-center text-center">
              {icon}
              <span
                className={cn(
                  "mt-1 max-w-[65px] truncate text-[10px] leading-tight sm:max-w-none sm:text-xs",
                  textColorClass
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

/* -------------------------------------------------------------
   MEMBER HEADER CARD (Gold for Male, Pink for Female)
   ------------------------------------------------------------- */
const MemberHeaderCard: React.FC<{
  application: SoulmateApplication
  genderRole: "Male" | "Female"
  onPhotoClick: (url: string, key: string, name?: string) => void
}> = ({ application, genderRole, onPhotoClick }) => {
  const personalDetails = application.personalDetails as PersonalDetails
  const photos = application.photos as Photos
  const age = calculateAge(personalDetails?.dob)
  const isMale = genderRole === "Male"

  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden border transition-all hover:shadow-xs">
      <CardHeader className="flex h-full flex-col gap-4 bg-muted/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              className={cn(
                "h-20 w-20 cursor-pointer border-[3px] shadow-sm transition-transform hover:scale-105",
                isMale
                  ? "border-[#D3A753] ring-2 ring-[#D3A753]/30"
                  : "border-pink-400 ring-2 ring-pink-400/30"
              )}
              onClick={() => {
                if (photos?.headshot) {
                  onPhotoClick(
                    photos.headshot,
                    "headshot",
                    personalDetails?.name
                  )
                }
              }}
            >
              <AvatarImage
                src={photos?.headshot}
                alt={personalDetails?.name}
                className="object-cover"
              />
              <AvatarFallback className="text-base font-bold">
                {getInitials(personalDetails?.name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ring-2 ring-background",
                isMale ? "bg-[#D3A753]" : "bg-pink-500"
              )}
            >
              {isMale ? (
                <Mars className="h-3 w-3" />
              ) : (
                <Venus className="h-3 w-3" />
              )}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle
                className={cn(
                  "text-lg font-bold",
                  isMale
                    ? "text-[#b48735] dark:text-[#E5BE6C]"
                    : "text-pink-600 dark:text-pink-400"
                )}
              >
                {personalDetails?.prefix ? `${personalDetails.prefix} ` : ""}
                {personalDetails?.name}
              </CardTitle>
              {personalDetails?.nickname && (
                <span className="text-xs font-medium text-muted-foreground">
                  (&quot;{personalDetails.nickname}&quot;)
                </span>
              )}
              <Badge variant="outline" className="font-mono text-xs">
                #{String(application.customId).padStart(4, "0")}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 px-1.5 py-0 text-[11px] font-semibold",
                  isMale
                    ? "bg-[#D3A753]/15 text-[#9E7321] dark:text-[#E5BE6C]"
                    : "bg-pink-500/15 text-pink-700 dark:text-pink-300"
                )}
              >
                {isMale ? (
                  <Mars className="h-3 w-3 text-[#D3A753]" />
                ) : (
                  <Venus className="h-3 w-3 text-pink-500" />
                )}
                <span>{genderRole} Member</span>
              </Badge>
              {typeof age === "number" && !isNaN(age) && age > 0 && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-1.5 py-0 text-[11px] font-medium"
                >
                  <Cake className="h-3 w-3 text-muted-foreground" />
                  <span>{age} yrs</span>
                </Badge>
              )}
              {personalDetails?.nationality && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-1.5 py-0 text-[11px] font-medium"
                >
                  <Home className="h-3 w-3 text-muted-foreground" />
                  <span>{personalDetails.nationality}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Button: View Application Form + Contact dropdown */}
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/application-form/${application.id}`}>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              <span>View Application Form</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {application.profile?.id && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/profiles/${application.profile.id}`}>
                    <UserIcon className="mr-2 h-4 w-4" /> View Member Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/application-form/${application.id}`}>
                  <FileText className="mr-2 h-4 w-4" /> View Full Application
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {personalDetails?.email && (
                <DropdownMenuItem asChild>
                  <a href={`mailto:${personalDetails.email}`}>
                    <Mail className="mr-2 h-4 w-4" /> Send Email
                  </a>
                </DropdownMenuItem>
              )}
              {personalDetails?.phone && (
                <>
                  <DropdownMenuItem asChild>
                    <a href={`tel:${personalDetails.phone}`}>
                      <Phone className="mr-2 h-4 w-4" /> Call Phone
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`https://wa.me/${personalDetails.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="mr-2 h-4 w-4 text-green-500" />{" "}
                      WhatsApp
                    </a>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
    </Card>
  )
}

/* -------------------------------------------------------------
   ROW-ALIGNED FULL PROFILE COMPARISON VIEW
   ------------------------------------------------------------- */
const SynchronizedProfilesView: React.FC<{
  male: SoulmateApplication
  female: SoulmateApplication
  onPhotoClick: (url: string, key: string, name?: string) => void
}> = ({ male, female, onPhotoClick }) => {
  const malePersonal = male.personalDetails as PersonalDetails
  const femalePersonal = female.personalDetails as PersonalDetails

  const maleCareer = male.career as Career | undefined
  const femaleCareer = female.career as Career | undefined

  const maleAppearance = male.appearance as Appearance | undefined
  const femaleAppearance = female.appearance as Appearance | undefined

  const malePersonality = male.personality as Personality | undefined
  const femalePersonality = female.personality as Personality | undefined

  const maleLifestyle = male.lifestyle as Lifestyle | undefined
  const femaleLifestyle = female.lifestyle as Lifestyle | undefined

  const maleGoals = male.relationshipGoals as RelationshipGoals | undefined
  const femaleGoals = female.relationshipGoals as RelationshipGoals | undefined

  const maleIdeal = male.idealPartner as IdealPartner | undefined
  const femaleIdeal = female.idealPartner as IdealPartner | undefined

  const malePhotos = male.photos as Photos
  const femalePhotos = female.photos as Photos

  const formatLanguages = (app?: Appearance) => {
    const parts = []
    if (app?.thaiFluency?.[0] !== undefined) {
      parts.push(
        app.thaiFluency[0] === 100
          ? "Thai (Native)"
          : `Thai ${app.thaiFluency[0]}%`
      )
    }
    if (app?.englishFluency?.[0] !== undefined) {
      parts.push(
        app.englishFluency[0] === 100
          ? "English (Native)"
          : `English ${app.englishFluency[0]}%`
      )
    }
    return parts.join(" • ")
  }

  const getPhotoEntries = (photos?: Photos) => {
    return [
      ["headshot", "Headshot", photos?.headshot],
      ["fullLength", "Full Length", photos?.fullLength],
      ["casualLifestyle", "Casual Lifestyle", photos?.casualLifestyle],
    ].filter(([, , value]) => Boolean(value))
  }

  const malePhotoEntries = getPhotoEntries(malePhotos)
  const femalePhotoEntries = getPhotoEntries(femalePhotos)

  return (
    <div className="space-y-6">
      {/* ROW 1: Profile Headers */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <MemberHeaderCard
          application={male}
          genderRole="Male"
          onPhotoClick={onPhotoClick}
        />
        <MemberHeaderCard
          application={female}
          genderRole="Female"
          onPhotoClick={onPhotoClick}
        />
      </div>

      {/* ROW 2: About Me (Equal Height on both sides with responsive flex) */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48735] uppercase dark:text-[#E5BE6C]">
              <Sparkles className="h-3.5 w-3.5 text-[#D3A753]" />
              About {malePersonal?.name || "Male Member"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-4">
            <div className="flex min-h-[90px] flex-1 flex-col justify-between rounded-lg border border-border/40 bg-muted/20 p-3.5 text-sm leading-relaxed text-foreground/90">
              <p className="whitespace-pre-line">
                {malePersonality?.about || "No bio provided."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-pink-600 uppercase dark:text-pink-400">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              About {femalePersonal?.name || "Female Member"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-4">
            <div className="flex min-h-[90px] flex-1 flex-col justify-between rounded-lg border border-border/40 bg-muted/20 p-3.5 text-sm leading-relaxed text-foreground/90">
              <p className="whitespace-pre-line">
                {femalePersonality?.about || "No bio provided."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: Personality Traits */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="text-xs font-semibold tracking-wider text-[#b48735] uppercase dark:text-[#E5BE6C]">
              Personality Traits (Male)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 items-center p-4">
            {malePersonality?.personality &&
            malePersonality.personality.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {malePersonality.personality.map((trait) => (
                  <Badge
                    key={trait}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                None listed
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="text-xs font-semibold tracking-wider text-pink-600 uppercase dark:text-pink-400">
              Personality Traits (Female)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 items-center p-4">
            {femalePersonality?.personality &&
            femalePersonality.personality.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {femalePersonality.personality.map((trait) => (
                  <Badge
                    key={trait}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                None listed
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ROW 4: Key Details & Career */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48735] uppercase dark:text-[#E5BE6C]">
              <BookUser className="h-3.5 w-3.5 text-[#D3A753]" />
              Key Details & Career (Male)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2.5 text-xs sm:grid-cols-3">
              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Occupation</span>
                </div>
                <p className="truncate font-semibold">
                  {maleCareer?.occupation || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Education</span>
                </div>
                <p className="truncate font-semibold">
                  {maleCareer?.education || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Location</span>
                </div>
                <p className="truncate font-semibold">
                  {malePersonal?.currentLocation || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Ruler className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Height</span>
                </div>
                <p className="font-semibold">
                  {maleAppearance?.height
                    ? `${maleAppearance.height} cm`
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Weight className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Weight</span>
                </div>
                <p className="font-semibold">
                  {maleAppearance?.weight
                    ? `${maleAppearance.weight} kg`
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Church className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Religion</span>
                </div>
                <p className="truncate font-semibold">
                  {maleAppearance?.religion || "N/A"}
                </p>
              </div>
            </div>

            {formatLanguages(maleAppearance) && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-2.5 text-xs">
                <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Languages:
                  </span>
                  <span className="font-semibold">
                    {formatLanguages(maleAppearance)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-pink-600 uppercase dark:text-pink-400">
              <BookUser className="h-3.5 w-3.5 text-pink-500" />
              Key Details & Career (Female)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2.5 text-xs sm:grid-cols-3">
              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Occupation</span>
                </div>
                <p className="truncate font-semibold">
                  {femaleCareer?.occupation || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Education</span>
                </div>
                <p className="truncate font-semibold">
                  {femaleCareer?.education || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Location</span>
                </div>
                <p className="truncate font-semibold">
                  {femalePersonal?.currentLocation || "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Ruler className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Height</span>
                </div>
                <p className="font-semibold">
                  {femaleAppearance?.height
                    ? `${femaleAppearance.height} cm`
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Weight className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Weight</span>
                </div>
                <p className="font-semibold">
                  {femaleAppearance?.weight
                    ? `${femaleAppearance.weight} kg`
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <div className="mb-0.5 flex items-center gap-1 text-muted-foreground">
                  <Church className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase">Religion</span>
                </div>
                <p className="truncate font-semibold">
                  {femaleAppearance?.religion || "N/A"}
                </p>
              </div>
            </div>

            {formatLanguages(femaleAppearance) && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-2.5 text-xs">
                <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Languages:
                  </span>
                  <span className="font-semibold">
                    {formatLanguages(femaleAppearance)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ROW 5: Lifestyle & Habits */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48735] uppercase dark:text-[#E5BE6C]">
              <Compass className="h-3.5 w-3.5 text-[#D3A753]" />
              Lifestyle & Habits (Male)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-muted/20 p-2">
                <span className="block text-[10px] text-muted-foreground">
                  Smoking
                </span>
                <span className="font-medium">
                  {maleLifestyle?.smoking || "N/A"}
                </span>
              </div>
              <div className="rounded-lg bg-muted/20 p-2">
                <span className="block text-[10px] text-muted-foreground">
                  Drinking
                </span>
                <span className="font-medium">
                  {maleLifestyle?.drinking || "N/A"}
                </span>
              </div>
              <div className="rounded-lg bg-muted/20 p-2">
                <span className="block text-[10px] text-muted-foreground">
                  Exercise
                </span>
                <span className="font-medium">
                  {maleLifestyle?.exercise || "N/A"}
                </span>
              </div>
            </div>

            {maleLifestyle?.interests && maleLifestyle.interests.length > 0 && (
              <div className="pt-1">
                <span className="mb-1 block text-[11px] text-muted-foreground">
                  Interests:
                </span>
                <div className="flex flex-wrap gap-1">
                  {maleLifestyle.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="py-0 text-[11px]"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-pink-600 uppercase dark:text-pink-400">
              <Compass className="h-3.5 w-3.5 text-pink-500" />
              Lifestyle & Habits (Female)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-muted/20 p-2">
                <span className="block text-[10px] text-muted-foreground">
                  Smoking
                </span>
                <span className="font-medium">
                  {femaleLifestyle?.smoking || "N/A"}
                </span>
              </div>
              <div className="rounded-lg bg-muted/20 p-2">
                <span className="block text-[10px] text-muted-foreground">
                  Drinking
                </span>
                <span className="font-medium">
                  {femaleLifestyle?.drinking || "N/A"}
                </span>
              </div>
              <div className="rounded-lg bg-muted/20 p-2">
                <span className="block text-[10px] text-muted-foreground">
                  Exercise
                </span>
                <span className="font-medium">
                  {femaleLifestyle?.exercise || "N/A"}
                </span>
              </div>
            </div>

            {femaleLifestyle?.interests &&
              femaleLifestyle.interests.length > 0 && (
                <div className="pt-1">
                  <span className="mb-1 block text-[11px] text-muted-foreground">
                    Interests:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {femaleLifestyle.interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="py-0 text-[11px]"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* ROW 6: Looking For & Goals */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48735] uppercase dark:text-[#E5BE6C]">
              <Heart className="h-3.5 w-3.5 text-[#D3A753]" />
              Looking For & Goals (Male)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 p-4 text-xs">
            {maleGoals?.lookingFor && maleGoals.lookingFor.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="min-w-[90px] text-muted-foreground">
                  Goals:
                </span>
                <div className="flex flex-wrap gap-1">
                  {maleGoals.lookingFor.map((goal) => (
                    <Badge
                      key={goal}
                      variant="secondary"
                      className="text-[11px]"
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {maleIdeal?.ageRange && (
              <div className="flex items-center gap-2">
                <span className="min-w-[90px] text-muted-foreground">
                  Age Range:
                </span>
                <span className="font-semibold">{maleIdeal.ageRange}</span>
              </div>
            )}
            {malePersonality?.lookingForQualities &&
              malePersonality.lookingForQualities.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="min-w-[90px] shrink-0 text-muted-foreground">
                    Qualities:
                  </span>
                  <span className="font-medium text-foreground">
                    {malePersonality.lookingForQualities.join(", ")}
                  </span>
                </div>
              )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-pink-600 uppercase dark:text-pink-400">
              <Heart className="h-3.5 w-3.5 text-pink-500" />
              Looking For & Goals (Female)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 p-4 text-xs">
            {femaleGoals?.lookingFor && femaleGoals.lookingFor.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="min-w-[90px] text-muted-foreground">
                  Goals:
                </span>
                <div className="flex flex-wrap gap-1">
                  {femaleGoals.lookingFor.map((goal) => (
                    <Badge
                      key={goal}
                      variant="secondary"
                      className="text-[11px]"
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {femaleIdeal?.ageRange && (
              <div className="flex items-center gap-2">
                <span className="min-w-[90px] text-muted-foreground">
                  Age Range:
                </span>
                <span className="font-semibold">{femaleIdeal.ageRange}</span>
              </div>
            )}
            {femalePersonality?.lookingForQualities &&
              femalePersonality.lookingForQualities.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="min-w-[90px] shrink-0 text-muted-foreground">
                    Qualities:
                  </span>
                  <span className="font-medium text-foreground">
                    {femalePersonality.lookingForQualities.join(", ")}
                  </span>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* ROW 7: Photos Gallery */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#b48735] uppercase dark:text-[#E5BE6C]">
              <Camera className="h-3.5 w-3.5 text-[#D3A753]" />
              Attached Photos ({malePhotoEntries.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            {malePhotoEntries.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {malePhotoEntries.map(([key, label, value]) => (
                  <div
                    key={key as string}
                    className="group relative flex cursor-pointer flex-col gap-1"
                    onClick={() =>
                      onPhotoClick(
                        value as string,
                        key as string,
                        `${malePersonal?.name} - ${label}`
                      )
                    }
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-xl border bg-muted shadow-2xs transition-all duration-300 group-hover:scale-[1.03] group-hover:border-[#D3A753] sm:h-36">
                      <Image
                        src={value as string}
                        alt={label as string}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <Badge
                          variant="secondary"
                          className="text-[10px] shadow-sm"
                        >
                          Zoom
                        </Badge>
                      </div>
                    </div>
                    <span className="text-center text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No attached photos
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col overflow-hidden border">
          <CardHeader className="border-b bg-muted/10 pb-3">
            <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-pink-600 uppercase dark:text-pink-400">
              <Camera className="h-3.5 w-3.5 text-pink-500" />
              Attached Photos ({femalePhotoEntries.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            {femalePhotoEntries.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {femalePhotoEntries.map(([key, label, value]) => (
                  <div
                    key={key as string}
                    className="group relative flex cursor-pointer flex-col gap-1"
                    onClick={() =>
                      onPhotoClick(
                        value as string,
                        key as string,
                        `${femalePersonal?.name} - ${label}`
                      )
                    }
                  >
                    <div className="relative h-28 w-full overflow-hidden rounded-xl border bg-muted shadow-2xs transition-all duration-300 group-hover:scale-[1.03] group-hover:border-pink-400 sm:h-36">
                      <Image
                        src={value as string}
                        alt={label as string}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <Badge
                          variant="secondary"
                          className="text-[10px] shadow-sm"
                        >
                          Zoom
                        </Badge>
                      </div>
                    </div>
                    <span className="text-center text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No attached photos
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SoulmateDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [tracking, setSoulmate] = useState<Tracking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Photo Preview Dialog State
  const [viewingPhoto, setViewingPhoto] = useState<{
    url: string
    key: string
    title?: string
  } | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

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
        console.error(err)
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

      await handleUpdateStatus(tracking.id, TrackingStatus.BOTH_PROFILES_SENT)
    } catch (error) {
      console.error(error)
      setError("Failed to send profile.")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDownloadPhoto = async (url: string, key: string) => {
    try {
      setDownloading(key)
      const res = await fetch(url)
      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = `${key}-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    } catch (e) {
      console.error(e)
      toast.error("Failed to download image.")
    } finally {
      setDownloading(null)
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
          </CardContent>
        </Card>
        <Skeleton className="h-10 w-80 rounded-lg" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
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
      {/* Header Bar */}
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

      {/* Status Progression Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <SoulmateStatusLine
            currentStatus={tracking.status}
            completedStatuses={tracking.completedStatuses}
            closedFromStatus={tracking.closedFromStatus}
          />
        </CardContent>
      </Card>

      {/* Tabs Section: Profiles, Notes, Storage */}
      <Tabs defaultValue="profiles" className="w-full space-y-6">
        <TabsList className="grid h-10 w-full max-w-md grid-cols-3 p-1">
          <TabsTrigger
            value="profiles"
            variant="gradient"
            className="gap-2 text-sm font-medium"
          >
            <Users className="h-4 w-4" />
            <span>Profiles</span>
          </TabsTrigger>

          <TabsTrigger
            value="notes"
            variant="gradient"
            className="gap-2 text-sm font-medium"
          >
            <StickyNote className="h-4 w-4" />
            <span>Notes</span>
            {tracking.notes && tracking.notes.length > 0 && (
              <span className="ml-1 rounded-full bg-black/15 px-1.5 py-0.5 text-[11px] font-semibold text-inherit dark:bg-white/20">
                {tracking.notes.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="storage"
            variant="gradient"
            className="gap-2 text-sm font-medium"
          >
            <HardDrive className="h-4 w-4" />
            <span>Storage</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Full Profiles Comparison (Side-by-Side Equal Row Heights) */}
        <TabsContent value="profiles" className="space-y-6">
          <SynchronizedProfilesView
            male={tracking.male}
            female={tracking.female}
            onPhotoClick={(url, key, title) =>
              setViewingPhoto({ url, key, title })
            }
          />
        </TabsContent>

        {/* Tab 2: Notes */}
        <TabsContent value="notes">
          <TrackingNotesTab
            trackingId={tracking.id}
            initialNotes={tracking.notes}
            onNotesChange={(newNotes) =>
              setSoulmate({ ...tracking, notes: newNotes })
            }
          />
        </TabsContent>

        {/* Tab 3: Storage */}
        <TabsContent value="storage">
          <TrackingStorageTab trackingId={tracking.id} />
        </TabsContent>
      </Tabs>

      {/* Full Size Photo Preview Dialog */}
      <Dialog
        open={!!viewingPhoto}
        onOpenChange={(open) => !open && setViewingPhoto(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingPhoto?.title || "Photo Preview"}</DialogTitle>
            <DialogDescription>
              {viewingPhoto?.key === "headshot"
                ? "Headshot Photo"
                : viewingPhoto?.key === "fullLength"
                  ? "Full Length Photo"
                  : viewingPhoto?.key === "casualLifestyle"
                    ? "Casual Lifestyle Photo"
                    : "Profile Photo"}
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-2 flex h-[68vh] w-full items-center justify-center overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
            {viewingPhoto?.url && (
              <Image
                src={viewingPhoto.url}
                alt="Photo preview"
                fill
                className="object-contain"
              />
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setViewingPhoto(null)}>
              Close
            </Button>
            {viewingPhoto && (
              <Button
                variant="default"
                onClick={() =>
                  handleDownloadPhoto(viewingPhoto.url, viewingPhoto.key)
                }
                className="btn-gradient"
                disabled={!!downloading}
              >
                {downloading === viewingPhoto.key ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
