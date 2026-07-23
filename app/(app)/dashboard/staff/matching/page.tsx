"use client"

import { useMemo, useState } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  ChevronsUpDown,
  Mars,
  Venus,
  Globe,
  MapPin,
} from "lucide-react"

// Mock data for demonstration purposes
const maleUsers = [
  {
    id: "m1",
    prefix: "Mr.",
    name: "John Doe",
    age: 32,
    gender: "Male",
    imageUrl: "/placeholder-user.jpg",
    nationality: "American",
    currentLocation: "USA",
    bio: "Loves hiking and reading.",
    createdAt: new Date("2024-01-15T09:30:00Z"),
  },
  {
    id: "m2",
    prefix: "Mr.",
    name: "Peter Jones",
    age: 28,
    gender: "Male",
    imageUrl: "/placeholder-user.jpg",
    nationality: "British",
    currentLocation: "UK",
    bio: "Enjoys cooking and traveling.",
    createdAt: new Date("2024-02-20T14:00:00Z"),
  },
]

const femaleMatches = [
  {
    id: "f1",
    name: "Jane Smith",
    age: 29,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 92,
    bio: "Passionate about art and music.",
    isVip: true,
    createdAt: new Date("2024-03-10T08:45:00Z"),
  },
  {
    id: "f2",
    name: "Emily White",
    age: 31,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 80,
    bio: "Adores animals and outdoor activities.",
    isVip: false,
    createdAt: new Date("2024-03-12T11:20:00Z"),
  },
  {
    id: "f3",
    name: "Sarah Green",
    age: 27,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 79,
    bio: "Tech enthusiast and movie lover.",
    isVip: true,
    createdAt: new Date("2024-03-18T16:10:00Z"),
  },
  {
    id: "f4",
    name: "Lisa Brown",
    age: 33,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 75,
    bio: "Fitness and wellness advocate.",
    isVip: false,
    createdAt: new Date("2024-04-01T10:00:00Z"),
  },
  {
    id: "f5",
    name: "Cathy Blue",
    age: 30,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 45,
    bio: "Loves to read sci-fi.",
    isVip: false,
    createdAt: new Date("2024-04-05T15:30:00Z"),
  },
  {
    id: "f6",
    name: "Maria Garcia",
    age: 28,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 88,
    bio: "Loves to dance salsa and travel.",
    isVip: true,
    createdAt: new Date("2024-04-08T11:00:00Z"),
  },
  {
    id: "f7",
    name: "Olivia Martinez",
    age: 35,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 65,
    bio: "Enjoys photography and long walks on the beach.",
    isVip: false,
    createdAt: new Date("2024-04-10T14:20:00Z"),
  },
  {
    id: "f8",
    name: "Sophia Rodriguez",
    age: 26,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 95,
    bio: "A foodie who loves trying new restaurants.",
    isVip: true,
    createdAt: new Date("2024-04-11T18:00:00Z"),
  },
  {
    id: "f9",
    name: "Isabella Lee",
    age: 30,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 72,
    bio: "Yoga instructor and mindfulness practitioner.",
    isVip: false,
    createdAt: new Date("2024-04-15T09:00:00Z"),
  },
  {
    id: "f10",
    name: "Mia Hernandez",
    age: 34,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 85,
    bio: "Entrepreneur and avid reader.",
    isVip: true,
    createdAt: new Date("2024-04-18T13:45:00Z"),
  },
  {
    id: "f11",
    name: "Amelia Lopez",
    age: 25,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 68,
    bio: "Student and part-time musician.",
    isVip: false,
    createdAt: new Date("2024-04-20T10:15:00Z"),
  },
  {
    id: "f12",
    name: "Charlotte Gonzalez",
    age: 32,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 90,
    bio: "Loves painting and visiting art galleries.",
    isVip: true,
    createdAt: new Date("2024-04-22T12:00:00Z"),
  },
]

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

const sortLabels: Record<string, string> = {
  matchScore: "Match %",
  age: "Age",
  createdAt: "Joined Date",
}

const sortOrderLabels: Record<string, string> = {
  asc: "Asc",
  desc: "Desc",
}

export default function MatchingPage() {
  const [selectedMale, setSelectedMale] = useState<
    (typeof maleUsers)[0] | null
  >(null)
  const [open, setOpen] = useState(false)
  const [sortKey, setSortKey] = useState("matchScore") // 'matchScore', 'age', 'createdAt'
  const [sortOrder, setSortOrder] = useState("desc") // 'asc', 'desc'
  const [filterOption, setFilterOption] = useState("all") // 'all', 'vip', 'free'

  const sortedAndFilteredMatches = useMemo(() => {
    let matches = [...femaleMatches]

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
  }, [filterOption, sortKey, sortOrder])

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
          <CardContent className="grid gap-6 md:grid-cols-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between md:w-[250px]"
                >
                  {selectedMale ? selectedMale.name : "Select user..."}
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
                        value={`${user.prefix} ${user.name}`}
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
                          <AvatarImage src={user.imageUrl} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.prefix} {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.age} years old, {user.nationality} from{" "}
                            {user.currentLocation}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedMale && (
              <div className="flex flex-col items-center rounded-lg border p-4 text-center md:col-span-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={selectedMale.imageUrl}
                    alt={selectedMale.name}
                  />
                  <AvatarFallback>{selectedMale.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="mt-4 grid gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {selectedMale.prefix} {selectedMale.name},{" "}
                      {selectedMale.age}
                    </p>
                    <Mars className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedMale.bio}
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{selectedMale.nationality}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{selectedMale.currentLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Joined: {selectedMale.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedAndFilteredMatches.map((match) => (
            <Card
              key={match.id}
              className="relative flex flex-col items-center text-center"
            >
              <Badge
                className={cn(
                  "absolute top-2 right-2 hover:bg-primary/80",
                  getMatchScoreBadgeClass(match.matchScore)
                )}
              >
                {match.matchScore}%
              </Badge>
              <CardHeader className="flex items-center justify-center p-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={match.imageUrl} alt={match.name} />
                  <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 p-2">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <span>{match.name}</span>
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
              </CardContent>
              <CardFooter className="flex w-full flex-col gap-2 p-2 pt-4">
                <Button variant="outline" className="w-full">
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
