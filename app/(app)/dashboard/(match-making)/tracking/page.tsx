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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Search,
  X,
  Users,
  Activity,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import React, { useEffect, useState, useMemo, useCallback } from "react"
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
  updatedAt?: string
  closedFromStatus?: TrackingStatus
  matchPercentage: number
}

const statusRank: Record<TrackingStatus, number> = {
  [TrackingStatus.INITIAL_CONNECT]: 1,
  [TrackingStatus.BOTH_PROFILES_SENT]: 2,
  [TrackingStatus.FEMALE_REVIEW]: 3,
  [TrackingStatus.FEMALE_THINKING]: 4,
  [TrackingStatus.FEMALE_ACCEPTED]: 5,
  [TrackingStatus.FEMALE_REJECTED]: 6,
  [TrackingStatus.MALE_REVIEW]: 7,
  [TrackingStatus.MALE_THINKING]: 8,
  [TrackingStatus.MALE_ACCEPTED]: 9,
  [TrackingStatus.MALE_REJECTED]: 10,
  [TrackingStatus.BOTH_PROFILES_ACCEPTED]: 11,
  [TrackingStatus.FIRST_GOOGLE_MEET]: 12,
  [TrackingStatus.SECOND_GOOGLE_MEET]: 13,
  [TrackingStatus.FIRST_FOLLOW_UP]: 14,
  [TrackingStatus.SECOND_FOLLOW_UP]: 15,
  [TrackingStatus.THIRD_FOLLOW_UP]: 16,
  [TrackingStatus.MATCHED]: 17,
  [TrackingStatus.CLOSED]: 18,
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
  handleUpdateStatus: (
    trackingId: string,
    newStatus: TrackingStatus
  ) => Promise<void>
  handleSendProfiles: (tracking: Tracking) => Promise<void>
}> = ({ tracking, isUpdating, handleUpdateStatus, handleSendProfiles }) => {
  const canSendProfiles = tracking.status === TrackingStatus.INITIAL_CONNECT
  const nextAction = getNextStatus(tracking.status)

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
          } else if (group.step === 3) {
            // Female Review in closed connection
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
            // Male Review in closed connection
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

const getPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  pages.push(1)

  if (currentPage > 3) {
    pages.push("...")
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 2) {
    pages.push("...")
  }

  pages.push(totalPages)
  return pages
}

export interface MemberOption {
  id: string
  name: string
  prefix?: string
  customId: number
  gender: "Male" | "Female"
  headshot?: string
}

export default function SoulmateTrackingPage() {
  const [trackings, setTrackings] = useState<Tracking[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [membersList, setMembersList] = useState<MemberOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedMember, setSelectedMember] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortKey, setSortKey] = useState("updatedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const selectedMemberObj = useMemo(
    () => membersList.find((m) => m.id === selectedMember),
    [membersList, selectedMember]
  )

  // Debounce search query input by 300ms before sending to server
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset to page 1 whenever any filter/search/sort criteria changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedMember, selectedStatus, sortKey, sortOrder])

  const fetchSoulmates = useCallback(
    async (showFullLoading = false) => {
      if (showFullLoading) setIsLoading(true)
      else setIsFetching(true)

      try {
        const url = new URL("/api/tracking", window.location.origin)
        if (debouncedSearch.trim()) {
          url.searchParams.set("search", debouncedSearch.trim())
        }
        if (selectedMember !== "all") {
          url.searchParams.set("memberId", selectedMember)
        }
        if (selectedStatus !== "all") {
          url.searchParams.set("status", selectedStatus)
        }
        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortOrder", sortOrder)
        url.searchParams.set("page", String(currentPage))
        url.searchParams.set("pageSize", String(pageSize))

        const response = await fetch(url.toString())
        const data = await response.json()
        if (data.success) {
          setTrackings(data.trackings)
          if (typeof data.totalCount === "number") {
            setTotalCount(data.totalCount)
          }
          if (typeof data.filteredCount === "number") {
            setFilteredCount(data.filteredCount)
          }
          if (typeof data.totalPages === "number") {
            setTotalPages(data.totalPages)
          }
          if (Array.isArray(data.allMembers)) {
            setMembersList(data.allMembers)
          }
          setError(null)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Failed to fetch trackings.")
        console.error(err)
      } finally {
        setIsLoading(false)
        setIsFetching(false)
      }
    },
    [
      debouncedSearch,
      selectedMember,
      selectedStatus,
      sortKey,
      sortOrder,
      currentPage,
      pageSize,
    ]
  )

  useEffect(() => {
    fetchSoulmates(trackings.length === 0 && isLoading)
  }, [fetchSoulmates])

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedMember !== "all" ||
    selectedStatus !== "all" ||
    sortKey !== "updatedAt" ||
    sortOrder !== "desc"

  const resetFilters = () => {
    setSearchQuery("")
    setDebouncedSearch("")
    setSelectedMember("all")
    setSelectedStatus("all")
    setSortKey("updatedAt")
    setSortOrder("desc")
    setCurrentPage(1)
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
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage ongoing soulmate matching journeys.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar Skeleton */}
        <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-3 shadow-2xs">
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-0.5">
            {/* Search Input Skeleton */}
            <Skeleton className="h-8 w-[260px] min-w-[200px] shrink-0 rounded-lg sm:w-[320px] md:w-[360px]" />

            {/* Filter Dropdowns Skeleton */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Skeleton className="h-8 w-[170px] rounded-lg sm:w-[195px]" />
              <Skeleton className="h-8 w-[140px] rounded-lg sm:w-[155px]" />
              <Skeleton className="h-8 w-[130px] rounded-lg sm:w-[140px]" />
              <Skeleton className="h-8 w-14 rounded-lg" />
            </div>
          </div>

          {/* Counter Strip Skeleton */}
          <div className="flex items-center justify-between border-t border-border/40 pt-2">
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>

        {/* Tracking Cards Skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-y-2">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                </div>
                <Skeleton className="h-3.5 w-44" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              {/* Status Timeline Skeleton */}
              <div className="flex items-center justify-between gap-1 text-xs">
                {Array.from({ length: 12 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex min-w-0 flex-1 flex-col items-center">
                      <Skeleton className="size-4 rounded-full" />
                      <Skeleton className="mt-1 h-3 w-10 sm:w-12" />
                    </div>
                    {index < 11 && <Skeleton className="mx-1 h-0.5 flex-1" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Notes Skeleton */}
              <div className="mt-5 space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-36" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Bottom Pagination Skeleton */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage ongoing soulmate matching journeys.
          </p>
        </div>
      </div>

      {/* Server-Side Search, Filter & Sort Controls - Single Row */}
      <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-3 shadow-2xs">
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-0.5">
          {/* Search Input (Left Side - Wider) */}
          <div className="relative w-[260px] min-w-[200px] shrink-0 sm:w-[320px] md:w-[360px]">
            <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search member name, ID, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pr-8 pl-8 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute top-2 right-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter & Sort Controls (Right Side) */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {/* Filter by Member (Server-Side) */}
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="h-8 w-[170px] shrink-0 rounded-lg border-input bg-transparent text-xs shadow-none hover:bg-muted/40 sm:w-[195px] dark:bg-input/30">
                {selectedMember === "all" || !selectedMemberObj ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>All Members</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 truncate">
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={selectedMemberObj.headshot} />
                      <AvatarFallback className="text-[8px]">
                        {getInitials(selectedMemberObj.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium">
                      {selectedMemberObj.prefix
                        ? `${selectedMemberObj.prefix} `
                        : ""}
                      {selectedMemberObj.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      (ID: {String(selectedMemberObj.customId).padStart(4, "0")}
                      )
                    </span>
                  </div>
                )}
              </SelectTrigger>
              <SelectContent className="min-w-[240px]">
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>All Members</span>
                  </div>
                </SelectItem>
                <SelectSeparator />
                {membersList.map((m) => {
                  const prefixName = m.prefix ? `${m.prefix} ${m.name}` : m.name
                  const idStr = `(ID: ${String(m.customId).padStart(4, "0")})`

                  return (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2 py-0.5">
                        <Avatar className="h-5 w-5 shrink-0">
                          <AvatarImage src={m.headshot} />
                          <AvatarFallback className="text-[9px]">
                            {getInitials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium">
                          {prefixName}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {idStr}
                        </span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {/* Filter by Status (Server-Side) */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-8 w-[140px] shrink-0 rounded-lg border-input bg-transparent text-xs shadow-none hover:bg-muted/40 sm:w-[155px] dark:bg-input/30">
                <Activity className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">🟢 Active Only</SelectItem>
                <SelectItem value="closed">🔴 Closed Only</SelectItem>
                <SelectSeparator />
                <SelectItem value={TrackingStatus.INITIAL_CONNECT}>
                  1. Initial Connect
                </SelectItem>
                <SelectItem value={TrackingStatus.BOTH_PROFILES_SENT}>
                  2. Profiles Sent
                </SelectItem>
                <SelectItem value={TrackingStatus.FEMALE_REVIEW}>
                  3. Female Review
                </SelectItem>
                <SelectItem value={TrackingStatus.MALE_REVIEW}>
                  4. Male Review
                </SelectItem>
                <SelectItem value={TrackingStatus.BOTH_PROFILES_ACCEPTED}>
                  5. Both Accepted
                </SelectItem>
                <SelectItem value={TrackingStatus.FIRST_GOOGLE_MEET}>
                  6. 1st Google Meet
                </SelectItem>
                <SelectItem value={TrackingStatus.SECOND_GOOGLE_MEET}>
                  7. 2nd Google Meet
                </SelectItem>
                <SelectItem value={TrackingStatus.FIRST_FOLLOW_UP}>
                  8. 1st Follow-up
                </SelectItem>
                <SelectItem value={TrackingStatus.SECOND_FOLLOW_UP}>
                  9. 2nd Follow-up
                </SelectItem>
                <SelectItem value={TrackingStatus.THIRD_FOLLOW_UP}>
                  10. 3rd Follow-up
                </SelectItem>
                <SelectItem value={TrackingStatus.MATCHED}>
                  11. Matched 🎉
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Key (Server-Side) */}
            <Select value={sortKey} onValueChange={setSortKey}>
              <SelectTrigger className="h-8 w-[130px] shrink-0 rounded-lg border-input bg-transparent text-xs shadow-none hover:bg-muted/40 sm:w-[140px] dark:bg-input/30">
                <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="status">Tracking Stage</SelectItem>
                <SelectItem value="matchPercentage">Match %</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order Button (Server-Side) */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0 rounded-lg border-input bg-transparent px-2.5 text-xs shadow-none hover:bg-muted/40 dark:bg-input/30"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              {sortOrder === "desc" ? (
                <>
                  <ArrowDownWideNarrow className="mr-1 h-3.5 w-3.5" />
                  <span>Desc</span>
                </>
              ) : (
                <>
                  <ArrowUpNarrowWide className="mr-1 h-3.5 w-3.5" />
                  <span>Asc</span>
                </>
              )}
            </Button>

            {/* Reset Button */}
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Counter Strip */}
        <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong>{trackings.length}</strong>
              {filteredCount > 0 && ` of ${filteredCount}`} tracking connections
              {totalCount > filteredCount && ` (filtered from ${totalCount})`}
            </span>
            {isFetching && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            )}
          </div>
          {isFiltered && (
            <span className="text-[11px] font-medium text-primary">
              Server filters active
            </span>
          )}
        </div>
      </div>

      {trackings.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center shadow-2xs">
          <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">
            No tracking connections found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {isFiltered
              ? "No trackings matched your search or filter criteria on the server. Try clearing or adjusting filters."
              : "There are no tracking connections created yet."}
          </p>
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={resetFilters}
            >
              Reset all filters
            </Button>
          )}
        </div>
      ) : (
        <>
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
                    {tracking.updatedAt && (
                      <span className="ml-2 text-xs opacity-75">
                        • Updated: {formatDateTime(tracking.updatedAt)}
                      </span>
                    )}
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
                      <div
                        key={note.id}
                        className="text-sm text-muted-foreground"
                      >
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

          {/* Bottom Pagination Controls */}
          {filteredCount > 0 && (
            <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Showing{" "}
                  <strong>
                    {Math.min((currentPage - 1) * pageSize + 1, filteredCount)}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {Math.min(currentPage * pageSize, filteredCount)}
                  </strong>{" "}
                  of <strong>{filteredCount}</strong> trackings
                </span>

                <div className="flex items-center gap-1.5">
                  <span>Per page:</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(val) => {
                      setPageSize(Number(val))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-7 w-[65px] rounded-lg border-input bg-transparent text-xs shadow-none hover:bg-muted/40 dark:bg-input/30">
                      <SelectValue placeholder={String(pageSize)} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage <= 1 || isFetching}
                  title="First Page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1 || isFetching}
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Numbered Page Buttons */}
                <div className="flex items-center gap-1">
                  {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground"
                        >
                          ...
                        </span>
                      )
                    }

                    const pageNum = Number(p)
                    const isActive = pageNum === currentPage

                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 min-w-[32px] px-2 text-xs",
                          isActive &&
                            "btn-gradient font-bold text-white shadow-xs"
                        )}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isFetching}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages || isFetching}
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage >= totalPages || isFetching}
                  title="Last Page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
