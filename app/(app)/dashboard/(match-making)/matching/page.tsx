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
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  Settings,
  XCircle,
  Loader2,
} from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"

// Types
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

const matchingCriteria = {
  "Ideal Partner Age Range": true,
  "Ideal Partner Height": true,
  "Ideal Partner Nationality": true,
  "Ideal Partner Location": true,
  "Ideal Partner Education": true,
  "Ideal Partner Qualities": true,
  "Ideal Partner Personality": true,
  "Deal Breakers": true,
  "Relocation Preference": true,
  "Smoking Preference": true,
  "Drinking Preference": true,
  "Children Preference": true,
  Hobbies: true,
  "Languages Spoken %": true,
}

// Matching criteria settings component
function MatchingCriteriaFormV2({
  criteriaState,
  onCriteriaChange,
}: {
  criteriaState: Record<string, boolean>
  onCriteriaChange: (title: string, value: boolean) => void
}) {
  return (
    <ScrollArea className="h-[calc(100vh-150px)]">
      <div className="space-y-6 p-1 pr-6">
        {Object.keys(criteriaState).map((title) => (
          <div key={title} className="flex items-center justify-between">
            <Label htmlFor={`criteria-${title}`} className="font-medium">
              {title}
            </Label>
            <Switch
              id={`criteria-${title}`}
              checked={criteriaState[title]}
              onCheckedChange={(value) => onCriteriaChange(title, value)}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
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
  "90-100": "100% - 90%",
  "80-90": "90% - 80%",
  "70-80": "80% - 70%",
  "60-70": "70% - 60%",
  "50-60": "60% - 50%",
  "40-50": "50% - 40%",
  "30-40": "40% - 30%",
  "20-30": "30% - 20%",
  "10-20": "20% - 10%",
  "0-10": "10% - 0%",
}
// Safely parse JSON properties
const parseApplicantData = (applicant: any) => {
  const safeParse = (json: string | object) => {
    if (!json) return {}
    if (typeof json === "object") return json
    try {
      return JSON.parse(json)
    } catch {
      return {}
    }
  }

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

  const [criteriaState, setCriteriaState] =
    useState<Record<string, boolean>>(matchingCriteria)

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
        url.searchParams.set("criteria", JSON.stringify(criteriaState))
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
            applicant: parseApplicantData(match.applicant),
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
  }, [
    selectedMale,
    criteriaState,
    filterOption,
    sortKey,
    sortOrder,
    matchRange,
  ])

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
              {/* commanded setting for now */}
              {/* <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-4">
                  <SheetHeader>
                    <SheetTitle>Matching Settings</SheetTitle>
                    <SheetDescription>
                      Enable or disable criteria for matching. This will be sent
                      to the matching API.
                    </SheetDescription>
                  </SheetHeader>
                  <MatchingCriteriaFormV2
                    criteriaState={criteriaState}
                    onCriteriaChange={(title, value) =>
                      setCriteriaState((prev) => ({ ...prev, [title]: value }))
                    }
                  />
                </SheetContent>
              </Sheet> */}
            </div>
          </div>
        </div>
        {isLoadingMatches ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex items-center justify-center p-2">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </CardHeader>
                <CardContent className="flex-1 space-y-2 p-2">
                  <Skeleton className="mx-auto h-5 w-3/4" />
                  <Skeleton className="mx-auto h-4 w-1/2" />
                  <Skeleton className="mx-auto h-4 w-1/4" />
                </CardContent>
                <CardFooter className="p-2 pt-4">
                  <Skeleton className="h-10 w-full" />
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
            {displayedMatches.map(({ applicant, score }) => (
              <Card
                key={applicant.id}
                className="relative flex flex-col items-center text-center"
              >
                <div className="flex h-full w-full flex-col">
                  {selectedMale && (
                    <Badge
                      className={cn(
                        "absolute top-2 right-2 hover:bg-primary/80",
                        getMatchScoreBadgeClass(score)
                      )}
                    >
                      {score}%
                    </Badge>
                  )}
                  <CardHeader className="flex items-center justify-center p-2">
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
                        <Badge className="border-pink text-gradient">VIP</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>ID: {applicant.customId}</CardDescription>
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
                  </CardContent>
                  <CardFooter className="flex w-full flex-col gap-2 p-2 pt-4">
                    <Button
                      variant="outline"
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
                        "Match"
                      ) : (
                        "Choose Male User"
                      )}
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
