"use client"

import { useMemo, useState, Fragment } from "react"
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
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
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
} from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Mock data for demonstration purposes
const maleUsers: any[] = [
  {
    id: "m1",
    personalDetails: {
      name: "John Doe",
      prefix: "Mr.",
      gender: "Male",
      dob: "1992-05-20T00:00:00.000Z",
      nationality: "American",
      currentLocation: "USA",
    },
    photos: { headshot: "/placeholder-user.jpg" },
    idealPartner: {
      ageRange: "29-35",
      height: '5.6"-5.11"',
      nationality: "ASIAN",
      location: "Thailand",
      education: "Bachelor's Degree",
      qualities: ["Honest", "Kind", "Family-Oriented"],
      personality: ["Easy Going", "Adventurous"],
    },
    createdAt: new Date("2024-01-15T09:30:00Z"),
  },
  {
    id: "m2",
    personalDetails: {
      name: "Peter Jones",
      prefix: "Mr.",
      gender: "Male",
      dob: "1996-08-10T00:00:00.000Z",
      nationality: "British",
      currentLocation: "UK",
    },
    photos: { headshot: "/placeholder-user.jpg" },
    idealPartner: {
      ageRange: "25-30",
      height: '5.6"-5.11"',
      nationality: "Thai",
      location: "Thailand",
      education: "Master's Degree",
      qualities: ["Intelligent", "Ambitious"],
      personality: ["Confident"],
    },
    createdAt: new Date("2024-02-20T14:00:00Z"),
  },
]

const femaleMatches: any[] = [
  {
    id: "f1",
    personalDetails: {
      name: "Jane Smith",
      dob: "1995-03-15T00:00:00.000Z",
      nationality: "Thai",
      currentLocation: "Thailand",
    },
    career: { education: "Bachelor's Degree" },
    appearance: { height: "170" }, // approx 5'7"
    personality: {
      personality: ["Easy Going", "Kind"],
      bestQualities: ["Honest", "Family-Oriented"],
    },
    photos: { headshot: "/placeholder-user.jpg" },
    isVip: true,
    createdAt: new Date("2024-03-10T08:45:00Z"),
  },
  {
    id: "f2",
    personalDetails: {
      name: "Emily White",
      dob: "1993-07-22T00:00:00.000Z",
      nationality: "Thai",
      currentLocation: "Thailand",
    },
    career: { education: "Master's Degree" },
    appearance: { height: "165" }, // approx 5'5"
    personality: {
      personality: ["Confident", "Ambitious"],
      bestQualities: ["Intelligent", "Loyal"],
    },
    photos: { headshot: "/placeholder-user.jpg" },
    isVip: false,
    createdAt: new Date("2024-03-12T11:20:00Z"),
  },
  {
    id: "f3",
    personalDetails: {
      name: "Sarah Green",
      dob: "1997-01-30T00:00:00.000Z",
      nationality: "Filipino",
      currentLocation: "Thailand",
    },
    career: { education: "High School" },
    appearance: { height: "160" }, // approx 5'3"
    personality: {
      personality: ["Adventurous"],
      bestQualities: ["Humorous", "Kind"],
    },
    photos: { headshot: "/placeholder-user.jpg" },
    isVip: true,
    createdAt: new Date("2024-03-18T16:10:00Z"),
  },
  {
    id: "f4",
    personalDetails: {
      name: "Lisa Brown",
      dob: "1991-11-05T00:00:00.000Z",
      nationality: "Thai",
      currentLocation: "Thailand",
    },
    career: { education: "Bachelor's Degree" },
    appearance: { height: "175" }, // approx 5'9"
    personality: {
      personality: ["Easy Going"],
      bestQualities: ["Honest", "Kind"],
    },
    photos: { headshot: "/placeholder-user.jpg" },
    isVip: false,
    createdAt: new Date("2024-04-01T10:00:00Z"),
  },
  {
    id: "f5",
    personalDetails: {
      name: "Cathy Blue",
      dob: "1994-02-14T00:00:00.000Z",
      nationality: "Thai",
      currentLocation: "USA",
    },
    career: { education: "Doctorate" },
    appearance: { height: "155" }, // approx 5'1"
    personality: {
      personality: ["Intelligent"],
      bestQualities: ["Ambitious"],
    },
    photos: { headshot: "/placeholder-user.jpg" },
    isVip: false,
    createdAt: new Date("2024-04-05T15:30:00Z"),
  },
]

const calculateAge = (dob: string | Date) => {
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const calculateMatchScore = (
  male: any,
  female: any,
  activeCriteria: Record<string, boolean>
): number => {
  if (!male || !male.idealPartner) return 0

  let score = 0
  let totalCriteria = 0

  const { idealPartner } = male
  const femaleAge = calculateAge(female.personalDetails.dob)

  const checks = {
    "Ideal Partner Age Range": () => {
      if (!idealPartner.ageRange) return false
      const [min, max] = idealPartner.ageRange.split("-").map(Number)
      return femaleAge >= min && femaleAge <= max
    },
    "Ideal Partner Nationality": () =>
      idealPartner.nationality === female.personalDetails.nationality,
    "Ideal Partner Location": () =>
      idealPartner.location === female.personalDetails.currentLocation,
    "Ideal Partner Education": () =>
      idealPartner.education === female.career.education,
    "Ideal Partner Qualities": () =>
      idealPartner.qualities?.some((q: string) =>
        female.personality.bestQualities?.includes(q)
      ),
    "Ideal Partner Personality": () =>
      idealPartner.personality?.some((p: string) =>
        female.personality.personality?.includes(p)
      ),
    // Add more checks here for other criteria like height, income, etc.
  }

  for (const [criterion, check] of Object.entries(checks)) {
    if (activeCriteria[criterion]) {
      totalCriteria++
      if (check()) {
        score++
      }
    }
  }

  if (totalCriteria === 0) return 0

  return Math.round((score / totalCriteria) * 100)
}

const getMatchScoreBadgeClass = (score: number) => {
  if (score > 80) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  }
  if (score >= 50) {
    // This will now include scores up to 80
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  }
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

const matchingCriteria = {
  "Ideal Partner Age Range": [
    "29-35",
    "36-41",
    "42-47",
    "48-55",
    "56-63",
    "63-70",
    "70+",
  ],
  "Ideal Partner Height": ["under 5'", '5"-5.5"', '5.6"-5.11"', '6"+'],
  "Ideal Partner Nationality": [
    "USA",
    "UK",
    "AUS",
    "EUROPEAN",
    "ASIAN",
    "INDIAN",
    "AFRICAN",
    "OTHER",
  ],
  "Ideal Partner Location": [
    "USA",
    "UK",
    "AUS",
    "EUROPEAN",
    "ASIAN",
    "INDIAN",
    "AFRICAN",
    "OTHER",
  ],
  "Ideal Partner Education": [
    "High School",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Other",
  ],
  "Ideal Partner Qualities": [
    "Honest",
    "Family-Oriented",
    "Romantic",
    "Easy Going",
    "Financially Stable",
  ],
  "Ideal Partner Personality": [
    "Kind",
    "Ambitious",
    "Confident",
    "Spiritual",
    "Easy Going",
  ],
  "Deal Breakers": ["Smoker", "Poor", "Rich"],
  // General preferences that can be toggled
  "Income Preference": [],
  "Relocation Preference": [],
  "Smoking Preference": [],
  "Drinking Preference": [],
  "Children Preference": [],
  Hobbies: [
    "Travel",
    "Fitness",
    "Reading",
    "Cooking",
    "Fine Dining",
    "Music",
    "Movies",
    "Business",
    "Investing",
    "Golf",
    "Tennis",
    "Hiking",
    "Yoga",
    "Art",
    "Photography",
    "Volunteering",
    "Pets",
  ],
}

function MatchingCriteriaForm() {
  const [fluency, setFluency] = useState([50])

  return (
    <ScrollArea className="h-[calc(100vh-150px)]">
      <div className="space-y-8 p-1 pr-6">
        {Object.entries(matchingCriteria).map(([title, options]) => (
          <div key={title} className="space-y-3">
            <h4 className="font-medium">{title}</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={`${title}-${option}`} />
                  <Label
                    htmlFor={`${title}-${option}`}
                    className="text-sm font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <h4 className="font-medium">Languages Spoken %</h4>
          <div className="space-y-2">
            <Label>Thai/English Fluency ({fluency[0]}%)</Label>
            <Slider
              value={fluency}
              onValueChange={setFluency}
              max={100}
              step={10}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>None</span>
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Fluent</span>
              <span>Native</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

function CriteriaSection({
  title,
  isOn,
  onToggle,
}: {
  title: string
  isOn: boolean
  onToggle: (isOn: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={`criteria-${title}`} className="font-medium">
        {title}
      </Label>
      <Switch
        id={`criteria-${title}`}
        checked={isOn}
        onCheckedChange={onToggle}
      />
    </div>
  )
}

function MatchingCriteriaFormV2({
  criteriaState,
  onCriteriaChange,
}: {
  criteriaState: Record<string, boolean>
  onCriteriaChange: (title: string, value: boolean) => void
}) {
  const criteriaWithToggle = {
    ...matchingCriteria,
    "Languages Spoken %": [],
  }

  const initialCriteriaState = Object.keys(criteriaWithToggle).reduce(
    (acc, key) => {
      acc[key] = true
      return acc
    },
    {} as Record<string, boolean>
  )

  return (
    <ScrollArea className="h-[calc(100vh-150px)]">
      <div className="space-y-6 p-1 pr-6">
        {Object.keys(criteriaWithToggle).map((title) => (
          <CriteriaSection
            key={title}
            title={title}
            isOn={criteriaState[title] ?? false}
            onToggle={(value) => onCriteriaChange(title, value)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

const sortLabels: Record<string, string> = {
  matchScore: "Match %",
  age: "Age",
  createdAt: "Joined Date",
  id: "ID",
}

const sortOrderLabels: Record<string, string> = {
  asc: "Asc",
  desc: "Desc",
}

export default function MatchingPage() {
  const [selectedMale, setSelectedMale] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const [sortKey, setSortKey] = useState("matchScore") // 'matchScore', 'age', 'createdAt'
  const [sortOrder, setSortOrder] = useState("desc") // 'asc', 'desc'
  const [filterOption, setFilterOption] = useState("all") // 'all', 'vip', 'free'

  const initialCriteriaState = Object.keys({
    ...matchingCriteria,
    "Languages Spoken %": [],
  }).reduce(
    (acc, key) => {
      acc[key] = true // All on by default
      return acc
    },
    {} as Record<string, boolean>
  )

  const [criteriaState, setCriteriaState] =
    useState<Record<string, boolean>>(initialCriteriaState)

  const handleCriteriaChange = (title: string, value: boolean) => {
    setCriteriaState((prevState) => ({ ...prevState, [title]: value }))
  }

  const sortedAndFilteredMatches = useMemo(() => {
    let matches = femaleMatches.map((match) => ({
      ...match,
      age: calculateAge(match.personalDetails.dob),
      matchScore: selectedMale
        ? calculateMatchScore(selectedMale, match, criteriaState)
        : 0,
    }))

    // Filtering
    if (filterOption === "vip") {
      matches = matches.filter((match) => match.isVip)
    } else if (filterOption === "free") {
      matches = matches.filter((match) => !match.isVip)
    }

    // Sorting
    matches.sort((a, b) => {
      let valA: number | Date
      let valB: number | Date

      switch (sortKey) {
        case "id":
          valA = parseInt(a.id.replace(/\D/g, ""), 10)
          valB = parseInt(b.id.replace(/\D/g, ""), 10)
          break
        case "age":
          valA = a.age
          valB = b.age
          break
        case "createdAt":
          valA = a.createdAt.getTime()
          valB = b.createdAt.getTime()
          break
        case "matchScore":
        default:
          valA = a.matchScore
          valB = b.matchScore
          break
      }

      if (valA < valB) {
        return sortOrder === "asc" ? -1 : 1
      }
      if (valA > valB) {
        return sortOrder === "asc" ? 1 : -1
      }
      return 0
    })

    return matches
  }, [filterOption, sortKey, sortOrder, selectedMale, criteriaState])

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold md:text-2xl">Matching</h1>
        <p className="text-sm text-muted-foreground">
          Select a male user to view and compare potential female matches.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Male User</CardTitle>
            <CardDescription>
              Choose a male user to find potential matches for.
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
                    className="w-full justify-between md:w-[250px]"
                  >
                    {selectedMale
                      ? `${selectedMale.personalDetails.prefix} ${selectedMale.personalDetails.name}`
                      : "Select user..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 md:w-[250px]">
                  <Command>
                    <CommandInput placeholder="Search user..." />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {maleUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.personalDetails.prefix} ${user.personalDetails.name}`}
                          onSelect={() => {
                            setSelectedMale(user)
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
                              src={user.photos.headshot}
                              alt={user.personalDetails.name}
                            />
                            <AvatarFallback>
                              {user.personalDetails.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.personalDetails.prefix}{" "}
                              {user.personalDetails.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {calculateAge(user.personalDetails.dob)} years
                              old, {user.personalDetails.nationality} from{" "}
                              {user.personalDetails.currentLocation}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedMale && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMale(null)}
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
                    src={selectedMale.photos.headshot}
                    alt={selectedMale.personalDetails.name}
                  />
                  <AvatarFallback>
                    {selectedMale.personalDetails.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 grid gap-1">
                  <p className="text-lg font-semibold">
                    {selectedMale.personalDetails.prefix}{" "}
                    {selectedMale.personalDetails.name}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                    <Mars className="text-gold h-5 w-5" />
                    <span>
                      Age: {calculateAge(selectedMale.personalDetails.dob)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5" />
                      <span>{selectedMale.personalDetails.nationality}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {selectedMale.personalDetails.currentLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Joined: {selectedMale.createdAt.toLocaleDateString()}
                      </span>
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
              Female users who are potential matches for the selected male user.
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
                    Sort: {sortLabels[sortKey]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  {Object.entries(sortLabels).map(([key, label]) => {
                    const isSelected = sortKey === key
                    return (
                      <DropdownMenuItem
                        key={key}
                        onSelect={() => setSortKey(key)}
                      >
                        {label}
                        {isSelected && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] justify-between"
                  >
                    Order: {sortOrderLabels[sortOrder]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  {Object.entries(sortOrderLabels).map(([order, label]) => {
                    const isSelected = sortOrder === order
                    return (
                      <DropdownMenuItem
                        key={order}
                        onSelect={() => setSortOrder(order)}
                      >
                        {label}
                        {isSelected && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Sheet>
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
                      Configure matching parameters and criteria here.
                    </SheetDescription>
                  </SheetHeader>
                  <MatchingCriteriaFormV2
                    criteriaState={criteriaState}
                    onCriteriaChange={handleCriteriaChange}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedAndFilteredMatches.map((match) => (
            <Card
              key={match.id}
              className="relative flex flex-col items-center text-center"
            >
              {selectedMale && (
                <Badge
                  className={cn(
                    "absolute top-2 right-2 hover:bg-primary/80",
                    getMatchScoreBadgeClass(match.matchScore)
                  )}
                >
                  {match.matchScore}%
                </Badge>
              )}
              <CardHeader className="flex items-center justify-center p-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={match.photos.headshot}
                    alt={match.personalDetails.name}
                  />
                  <AvatarFallback>
                    {match.personalDetails.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 p-2">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <span>{match.personalDetails.name}</span>
                  {match.isVip && (
                    <Badge className="border-pink text-gradient">VIP</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  ID: {match.id.replace(/\D/g, "").padStart(4, "0")}
                </CardDescription>
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <Venus className="h-4 w-4 text-pink-500" />
                  <span>Age: {match.age}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Joined: {match.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" />
                    <span>{match.personalDetails.nationality}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{match.personalDetails.currentLocation}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex w-full flex-col gap-2 p-2 pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!selectedMale}
                >
                  Matching
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
