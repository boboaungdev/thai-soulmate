"use client"
import { useRouter } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import { useMatchingStore } from "@/stores/matching-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Check,
  ChevronsUpDown,
  Mars,
  Venus,
  Home,
  MapPin,
  XCircle,
  Loader2,
  GitMerge,
  Activity,
  UserX,
  HeartHandshake,
  Eye,
  Sparkles,
} from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"

// Types
export interface TrackingStats {
  totalTrackings: number
  activeTrackings: number
  rejectedByHim: number
  rejectedByHer: number
  matchedSuccess: number
}

export interface PairHistory {
  hasExistingTracking: boolean
  matchCount: number
  hasActiveTracking: boolean
  activeTrackingId: string | null
  latestTrackingId: string | null
  latestStatus: string | null
  latestClosedFromStatus: string | null
  latestCompletedStatuses: string[]
  latestDate: string | null
}

interface Match {
  applicant: any
  score: number
}

// Helper to calculate age
const calculateAge = (dob: string | Date) => {
  if (!dob) return 0
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Helper for badge class
const getMatchScoreBadgeClass = (score: number) => {
  if (score > 80) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  }
  if (score >= 50) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  }
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

const formatStatusLabel = (status?: string | null) => {
  if (!status) return "N/A"
  switch (status) {
    case "INITIAL_CONNECT":
      return "Initial Connect"
    case "BOTH_PROFILES_SENT":
      return "Profiles Sent"
    case "FEMALE_REVIEW":
      return "Female Review"
    case "FEMALE_THINKING":
      return "Female Thinking"
    case "FEMALE_REJECTED":
      return "Female Rejected"
    case "FEMALE_ACCEPTED":
      return "Female Accepted"
    case "MALE_REVIEW":
      return "Male Review"
    case "MALE_THINKING":
      return "Male Thinking"
    case "MALE_REJECTED":
      return "Male Rejected"
    case "MALE_ACCEPTED":
      return "Male Accepted"
    case "BOTH_PROFILES_ACCEPTED":
      return "Both Accepted"
    case "FIRST_GOOGLE_MEET":
      return "1st Google Meet"
    case "SECOND_GOOGLE_MEET":
      return "2nd Google Meet"
    case "FIRST_FOLLOW_UP":
      return "1st Follow-up"
    case "SECOND_FOLLOW_UP":
      return "2nd Follow-up"
    case "THIRD_FOLLOW_UP":
      return "3rd Follow-up"
    case "MATCHED":
      return "Matched 🎉"
    case "CLOSED":
      return "Closed"
    default:
      return status
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
  }
}

const sortLabels: Record<string, string> = {
  score: "Match %",
  age: "Age",
  createdAt: "Joined Date",
  customId: "ID",
}

const sortOrderLabels: Record<string, string> = {
  asc: "Asc",
  desc: "Desc",
}

const matchRangeLabels: Record<string, string> = {
  all: "All Ranges",
  "80-100": "100% - 80%",
  "60-80": "80% - 60%",
  "40-60": "60% - 40%",
  "20-40": "40% - 20%",
  "0-20": "20% - 0%",
}

const computeTrackingStats = (trackings: any[]): TrackingStats => {
  const list = trackings || []
  const totalTrackings = list.length
  const activeTrackings = list.filter((t) => t.status !== "CLOSED").length
  const rejectedByHim = list.filter(
    (t) =>
      (t.completedStatuses || []).includes("MALE_REJECTED") ||
      t.status === "MALE_REJECTED" ||
      (t.status === "CLOSED" && t.closedFromStatus === "MALE_REJECTED")
  ).length
  const rejectedByHer = list.filter(
    (t) =>
      (t.completedStatuses || []).includes("FEMALE_REJECTED") ||
      t.status === "FEMALE_REJECTED" ||
      (t.status === "CLOSED" && t.closedFromStatus === "FEMALE_REJECTED")
  ).length
  const matchedSuccess = list.filter(
    (t) =>
      (t.completedStatuses || []).includes("MATCHED") ||
      t.status === "MATCHED" ||
      (t.completedStatuses || []).includes("BOTH_PROFILES_ACCEPTED")
  ).length

  return {
    totalTrackings,
    activeTrackings,
    rejectedByHim,
    rejectedByHer,
    matchedSuccess,
  }
}

const computePairHistory = (
  femaleTrackings: any[],
  maleId: string | null
): PairHistory => {
  if (!maleId) {
    return {
      hasExistingTracking: false,
      matchCount: 0,
      hasActiveTracking: false,
      activeTrackingId: null,
      latestTrackingId: null,
      latestStatus: null,
      latestClosedFromStatus: null,
      latestCompletedStatuses: [],
      latestDate: null,
    }
  }

  const pairTrackings = (femaleTrackings || [])
    .filter((t: any) => t.maleId === maleId)
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const hasExistingTracking = pairTrackings.length > 0
  const activeTracking = pairTrackings.find((t: any) => t.status !== "CLOSED")
  const latest = pairTrackings[0]

  return {
    hasExistingTracking,
    matchCount: pairTrackings.length,
    hasActiveTracking: !!activeTracking,
    activeTrackingId: activeTracking ? activeTracking.id : null,
    latestTrackingId: latest ? latest.id : null,
    latestStatus: latest ? latest.status : null,
    latestClosedFromStatus: latest ? latest.closedFromStatus : null,
    latestCompletedStatuses: latest ? latest.completedStatuses || [] : [],
    latestDate: latest ? latest.createdAt : null,
  }
}

// Safely parse JSON properties
const parseApplicantData = (applicant: any, selectedMaleId?: string | null) => {
  const safeParse = (json: string | object) => {
    if (!json) return {}
    if (typeof json === "object") return json
    try {
      return JSON.parse(json)
    } catch {
      return {}
    }
  }

  const asMale = applicant.asMale || []
  const asFemale = applicant.asFemale || []
  const trackings =
    applicant.personalDetails?.gender === "Male" ? asMale : asFemale

  return {
    ...applicant,
    personalDetails: safeParse(applicant.personalDetails),
    career: safeParse(applicant.career),
    appearance: safeParse(applicant.appearance),
    personality: safeParse(applicant.personality),
    lifestyle: safeParse(applicant.lifestyle),
    relationshipGoals: safeParse(applicant.relationshipGoals),
    financial: safeParse(applicant.financial),
    photos: safeParse(applicant.photos),
    idealPartner: safeParse(applicant.idealPartner),
    isVip: applicant.isVip ?? applicant.membership?.type === "VIP",
    trackingStats: applicant.trackingStats || computeTrackingStats(trackings),
    pairHistory:
      applicant.pairHistory ||
      computePairHistory(asFemale, selectedMaleId || null),
  }
}

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
export default function MatchingPage() {
  const router = useRouter()
  const { selectedMaleId, setSelectedMaleId } = useMatchingStore()
  const [maleUsers, setMaleUsers] = useState<any[]>([])
  const [matches, setMatches] = useState<Match[]>([])

  const [isMatching, setIsMatching] = useState<string | null>(null)
  const [isLoadingMales, setIsLoadingMales] = useState(true)
  const [isLoadingMatches, setIsLoadingMatches] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [sortKey, setSortKey] = useState("score")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterOption, setFilterOption] = useState("all")
  const [matchRange, setMatchRange] = useState("all")

  const selectedMale = useMemo(() => {
    if (!selectedMaleId) return null
    return maleUsers.find((u) => u.id === selectedMaleId) ?? null
  }, [selectedMaleId, maleUsers])

  useEffect(() => {
    const fetchMaleUsers = async () => {
      setIsLoadingMales(true)
      try {
        const response = await fetch("/api/application-form")
        if (!response.ok) throw new Error("Failed to fetch applicants")
        const data = await response.json()
        if (data && Array.isArray(data.applications)) {
          const males = data.applications
            .map(parseApplicantData)
            .filter(
              (applicant: any) => applicant.personalDetails?.gender === "Male"
            )
          setMaleUsers(males)
        } else {
          throw new Error("API response is missing 'applications' array.")
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoadingMales(false)
      }
    }
    fetchMaleUsers()
  }, [])

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoadingMatches(true)
      setError(null)
      try {
        const url = new URL(`/api/matching`, window.location.origin)
        url.searchParams.set("filter", filterOption)
        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortOrder", sortOrder)
        url.searchParams.set("matchRange", matchRange)

        if (selectedMale) {
          url.searchParams.set("userId", selectedMale.id)
        }

        const response = await fetch(url.toString())

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})) // Try to get more specific error
          throw new Error(errorData.error || "Failed to fetch matches")
        }
        const data = await response.json()

        if (Array.isArray(data)) {
          const finalMatches = data.map((match: Match) => ({
            ...match,
            applicant: parseApplicantData(match.applicant, selectedMale?.id),
          }))
          setMatches(finalMatches)
        } else {
          throw new Error("API did not return an array of matches.")
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoadingMatches(false)
      }
    }
    fetchMatches()
  }, [selectedMale, filterOption, sortKey, sortOrder, matchRange])

  const displayedMatches = useMemo(
    () =>
      matches.map((match) => ({
        ...match,
        applicant: {
          ...match.applicant,
          age: calculateAge(match.applicant.personalDetails?.dob),
        },
      })),
    [matches]
  )

  const handleSortChange = (newSortKey: string) => {
    setSortKey(newSortKey)
    if (newSortKey === "score") {
      setSortOrder("desc")
    } else {
      setSortOrder("asc")
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold md:text-2xl">Matching</h1>
        <p className="text-sm text-muted-foreground">
          Start with all female applications, then select a male user to
          calculate matches.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Male User</CardTitle>
            <CardDescription>
              Male is the main profile for matching. Leave this empty to browse
              all female applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select male user"
                    className="w-full justify-between md:w-[250px]"
                    disabled={isLoadingMales}
                  >
                    {isLoadingMales
                      ? "Loading males..."
                      : selectedMale
                        ? `${selectedMale.personalDetails.prefix} ${selectedMale.personalDetails.name}`
                        : "Select a male"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 md:w-[250px]">
                  <Command>
                    <CommandInput placeholder="Search user..." />
                    <CommandList>
                      <CommandEmpty>
                        {isLoadingMales ? "Loading..." : "No user found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {maleUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.personalDetails.prefix} ${user.personalDetails.name}`}
                            onSelect={() => {
                              setSelectedMaleId(user.id)
                              setOpen(false)
                            }}
                            className="flex cursor-pointer items-center gap-3"
                          >
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedMale?.id === user.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={user.photos?.headshot}
                                alt={user.personalDetails?.name}
                              />
                              <AvatarFallback>
                                {user.personalDetails?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {user.personalDetails?.prefix}{" "}
                                {user.personalDetails?.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {calculateAge(user.personalDetails?.dob)} years
                                old, {user.personalDetails?.nationality} from{" "}
                                {user.personalDetails?.currentLocation}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedMale && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMaleId(null)}
                  aria-label="Clear selected male"
                  className="h-8 w-8"
                >
                  <XCircle className="h-4 w-4" />
                  <span className="sr-only">Remove selected user</span>
                </Button>
              )}
            </div>
            {selectedMale && (
              <Card
                className="flex flex-col items-center p-4 text-center ring-0 md:w-full"
                size="default"
              >
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={selectedMale.photos?.headshot}
                    alt={selectedMale.personalDetails?.name}
                  />
                  <AvatarFallback>
                    {selectedMale.personalDetails?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 grid gap-1">
                  <p className="text-lg font-semibold">
                    {selectedMale.personalDetails?.prefix}{" "}
                    {selectedMale.personalDetails?.name}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                    <Mars className="text-gold h-5 w-5" />
                    <span>
                      Age: {calculateAge(selectedMale.personalDetails?.dob)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5" />
                      <span>{selectedMale.personalDetails?.nationality}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {selectedMale.personalDetails?.currentLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Joined: {formatDate(selectedMale.createdAt)}</span>
                    </div>
                  </div>

                  {/* Tracking Statistics Strip */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t pt-3 text-xs">
                    <div className="flex items-center gap-1.5 rounded-md bg-muted/70 px-2.5 py-1 font-medium">
                      <GitMerge className="h-3.5 w-3.5 text-primary" />
                      <span>
                        Total Matched:{" "}
                        <strong className="text-foreground">
                          {selectedMale.trackingStats?.totalTrackings ??
                            (selectedMale.asMale?.length || 0)}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1 font-medium text-blue-700 dark:text-blue-400">
                      <Activity className="h-3.5 w-3.5" />
                      <span>
                        Active:{" "}
                        <strong>
                          {selectedMale.trackingStats?.activeTrackings ?? 0}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-2.5 py-1 font-medium text-red-700 dark:text-red-400">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>
                        Rejected by Him:{" "}
                        <strong>
                          {selectedMale.trackingStats?.rejectedByHim ?? 0}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 font-medium text-amber-700 dark:text-amber-400">
                      <UserX className="h-3.5 w-3.5" />
                      <span>
                        Rejected by Her:{" "}
                        <strong>
                          {selectedMale.trackingStats?.rejectedByHer ?? 0}
                        </strong>
                      </span>
                    </div>
                    {(selectedMale.trackingStats?.matchedSuccess ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5 rounded-md bg-green-500/10 px-2.5 py-1 font-medium text-green-700 dark:text-green-400">
                        <HeartHandshake className="h-3.5 w-3.5" />
                        <span>
                          Success:{" "}
                          <strong>
                            {selectedMale.trackingStats.matchedSuccess}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Potential Matches</h2>
            <p className="text-sm text-muted-foreground">
              {selectedMale
                ? "Female applications scored against the selected male profile."
                : "All female applications. Select a male to start match calculation."}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <ToggleGroup
              type="single"
              defaultValue="all"
              value={filterOption}
              onValueChange={(value) => value && setFilterOption(value)}
              aria-label="Filter matches"
            >
              <ToggleGroupItem value="all" aria-label="All">
                All
              </ToggleGroupItem>
              <ToggleGroupItem value="vip" aria-label="VIP">
                VIP
              </ToggleGroupItem>
              <ToggleGroupItem value="free" aria-label="Free">
                Free
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-between"
                  >
                    <span className="text-muted-foreground">Sort:</span>
                    {sortLabels[sortKey]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      onSelect={() => handleSortChange(key)}
                    >
                      {label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          sortKey === key ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-between"
                    disabled={!selectedMale}
                  >
                    <span className="text-muted-foreground">Range:</span>
                    {matchRangeLabels[matchRange]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  {Object.entries(matchRangeLabels).map(([range, label]) => (
                    <DropdownMenuItem
                      key={range}
                      onSelect={() => setMatchRange(range)}
                    >
                      {label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          matchRange === range ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-between"
                  >
                    <span className="text-muted-foreground">Order:</span>
                    {sortOrderLabels[sortOrder]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  {Object.entries(sortOrderLabels).map(([order, label]) => (
                    <DropdownMenuItem
                      key={order}
                      onSelect={() => setSortOrder(order)}
                    >
                      {label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          sortOrder === order ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {isLoadingMatches ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="relative flex flex-col items-center p-2 text-center"
              >
                {/* Top Badge Placeholders */}
                <div className="flex w-full items-center justify-between px-1 pt-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>

                {/* Avatar */}
                <CardHeader className="flex items-center justify-center p-2 pt-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </CardHeader>

                {/* Card Info */}
                <CardContent className="w-full flex-1 space-y-2.5 p-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>

                  {/* Pair / Status Box Skeleton */}
                  <div className="mt-2 w-full space-y-1.5 rounded-md border border-border/40 p-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* 3-Col Stats Skeleton */}
                  <div className="mt-2 grid grid-cols-3 gap-1 rounded-md bg-muted/40 p-1.5">
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-2.5 w-8" />
                      <Skeleton className="h-3.5 w-5" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-2.5 w-10" />
                      <Skeleton className="h-3.5 w-5" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-2.5 w-10" />
                      <Skeleton className="h-3.5 w-5" />
                    </div>
                  </div>
                </CardContent>

                {/* Action Buttons Skeleton */}
                <CardFooter className="w-full p-2 pt-2">
                  <div className="grid w-full grid-cols-2 gap-1.5">
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : displayedMatches.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-12 shadow-sm">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                {selectedMale
                  ? "No potential matches found"
                  : "No female users found"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedMale
                  ? "Try adjusting your filters or criteria to find more results."
                  : "There are no female applicants to display at the moment."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedMatches.map(({ applicant, score }) => {
              const pair = applicant.pairHistory as PairHistory | undefined
              const stats = applicant.trackingStats as TrackingStats | undefined

              return (
                <Card
                  key={applicant.id}
                  className={cn(
                    "relative flex flex-col items-center text-center transition-all",
                    pair?.hasActiveTracking &&
                      "ring-2 ring-blue-500/50 dark:ring-blue-400/50"
                  )}
                >
                  <div className="flex h-full w-full flex-col">
                    {/* Top Status & Score Badges */}
                    <div className="pointer-events-none absolute top-2 right-2 left-2 flex items-center justify-between">
                      {selectedMale &&
                        (pair?.hasActiveTracking ? (
                          <Badge className="pointer-events-auto animate-pulse bg-blue-600 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-600">
                            In Active Tracking
                          </Badge>
                        ) : pair?.hasExistingTracking ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              "pointer-events-auto text-[10px] font-medium shadow-xs",
                              pair.latestClosedFromStatus?.includes("REJECTED")
                                ? "border-red-400/60 bg-red-500/10 text-red-700 dark:text-red-300"
                                : "border-amber-400/60 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                            )}
                          >
                            Matched {pair.matchCount}x (
                            {formatStatusLabel(
                              pair.latestClosedFromStatus || pair.latestStatus
                            )}
                            )
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="pointer-events-auto border-muted bg-muted/60 text-[10px] text-muted-foreground"
                          >
                            New Match
                          </Badge>
                        ))}
                      {selectedMale && (
                        <Badge
                          className={cn(
                            "pointer-events-auto ml-auto",
                            getMatchScoreBadgeClass(score)
                          )}
                        >
                          {score}%
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="flex items-center justify-center p-2 pt-8">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={applicant.photos?.headshot}
                          alt={applicant.personalDetails?.name}
                        />
                        <AvatarFallback>
                          {applicant.personalDetails?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2 p-2">
                      <CardTitle className="flex items-center justify-center gap-2 text-lg">
                        <span>{applicant.personalDetails?.name}</span>
                        {applicant.isVip && (
                          <Badge className="border-pink text-gradient">
                            VIP
                          </Badge>
                        )}
                      </CardTitle>
                      {applicant.personalDetails?.nickname && (
                        <CardDescription>
                          Nickname: {applicant.personalDetails.nickname}
                        </CardDescription>
                      )}
                      <CardDescription>
                        ID: {String(applicant.customId).padStart(4, "0")}
                      </CardDescription>
                      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                        <Venus className="h-4 w-4 text-pink-500" />
                        <span>Age: {applicant.age}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Joined: {formatDate(applicant.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Home className="h-3.5 w-3.5" />
                          <span>{applicant.personalDetails?.nationality}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>
                            {applicant.personalDetails?.currentLocation}
                          </span>
                        </div>
                      </div>

                      {/* With Selected Male: Specific Pair Tracking History */}
                      {selectedMale && pair?.hasExistingTracking && (
                        <div className="mt-2 w-full rounded-md border border-border/60 bg-muted/40 p-2 text-left text-xs">
                          <div className="flex items-center justify-between font-medium">
                            <span className="text-muted-foreground">
                              Pair History:
                            </span>
                            <span className="font-semibold text-primary">
                              Matched {pair.matchCount} time
                              {pair.matchCount > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">
                              Last Status:
                            </span>
                            <span
                              className={cn(
                                "font-semibold",
                                pair.hasActiveTracking
                                  ? "text-blue-600 dark:text-blue-400"
                                  : pair.latestClosedFromStatus?.includes(
                                        "REJECTED"
                                      )
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-muted-foreground"
                              )}
                            >
                              {formatStatusLabel(
                                pair.latestClosedFromStatus || pair.latestStatus
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Overall Female Candidate Tracking Statistics */}
                      <div className="mt-2 grid w-full grid-cols-3 gap-1 rounded-md bg-muted/50 p-1.5 text-center text-[11px]">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground">
                            Trackings
                          </span>
                          <span className="font-semibold">
                            {stats?.totalTrackings ?? 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground">
                            ♀ Reject
                          </span>
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {stats?.rejectedByHer ?? 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground">
                            ♂ Reject
                          </span>
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {stats?.rejectedByHim ?? 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex w-full p-2 pt-3">
                      {pair?.hasActiveTracking ? (
                        <div className="grid w-full grid-cols-2 gap-1.5">
                          <Button
                            className="btn-gradient h-9 w-full px-2 text-xs"
                            onClick={() =>
                              router.push(
                                `/dashboard/tracking/${pair.activeTrackingId}`
                              )
                            }
                          >
                            <Eye className="mr-1 h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">View Tracking</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-9 w-full px-2 text-xs"
                            onClick={() => {
                              if (selectedMale) {
                                router.push(
                                  `/dashboard/matching/${selectedMale.id}/${applicant.id}`
                                )
                              }
                            }}
                          >
                            <span className="truncate">Review Match</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant={
                            pair?.hasExistingTracking ? "secondary" : "outline"
                          }
                          className="w-full"
                          disabled={!selectedMale || !!isMatching}
                          onClick={() => {
                            if (selectedMale) {
                              setIsMatching(applicant.id)
                              router.push(
                                `/dashboard/matching/${selectedMale.id}/${applicant.id}`
                              )
                            }
                          }}
                        >
                          {isMatching === applicant.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Matching...
                            </>
                          ) : selectedMale ? (
                            pair?.hasExistingTracking ? (
                              "Match Again"
                            ) : (
                              "Match"
                            )
                          ) : (
                            "Choose Male User"
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
