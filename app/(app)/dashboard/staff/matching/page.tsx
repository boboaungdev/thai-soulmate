"use client"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for demonstration purposes
const maleUsers = [
  {
    id: "m1",
    name: "John Doe",
    age: 32,
    imageUrl: "/placeholder-user.jpg",
    bio: "Loves hiking and reading.",
  },
  {
    id: "m2",
    name: "Peter Jones",
    age: 28,
    imageUrl: "/placeholder-user.jpg",
    bio: "Enjoys cooking and traveling.",
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
  },
  {
    id: "f2",
    name: "Emily White",
    age: 31,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 88,
    bio: "Adores animals and outdoor activities.",
  },
  {
    id: "f3",
    name: "Sarah Green",
    age: 27,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 85,
    bio: "Tech enthusiast and movie lover.",
  },
  {
    id: "f4",
    name: "Lisa Brown",
    age: 33,
    imageUrl: "/placeholder-user.jpg",
    matchScore: 95,
    bio: "Fitness and wellness advocate.",
  },
]

export default function MatchingPage() {
  // In a real application, you would use state (e.g., useState) to manage the selected user.
  const selectedMale = maleUsers[0]

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold md:text-2xl">Matching</h1>
        <p className="text-sm text-muted-foreground">
          Select a male user and compare with potential female matches.
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
            <Select defaultValue={selectedMale.id}>
              <SelectTrigger
                id="male-user-select"
                aria-label="Select male user"
              >
                <SelectValue placeholder="Select a male user" />
              </SelectTrigger>
              <SelectContent>
                {maleUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedMale && (
              <div className="flex items-center gap-4 rounded-lg border p-4 md:col-span-2">
                <Avatar className="hidden h-16 w-16 sm:flex">
                  <AvatarImage
                    src={selectedMale.imageUrl}
                    alt={selectedMale.name}
                  />
                  <AvatarFallback>{selectedMale.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-lg font-semibold">
                    {selectedMale.name}, {selectedMale.age}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMale.bio}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {femaleMatches.map((match) => (
            <Card
              key={match.id}
              className="flex flex-col items-center p-4 text-center"
            >
              <CardHeader className="flex items-center justify-center p-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={match.imageUrl} alt={match.name} />
                  <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 p-2">
                <CardTitle className="text-lg">{match.name}</CardTitle>
                <CardDescription>
                  ID: {match.id.replace(/\D/g, "").padStart(4, "0")}
                </CardDescription>
                <CardDescription>Age: {match.age}</CardDescription>
                <Badge variant="secondary">Female</Badge>
              </CardContent>
              <CardFooter className="flex w-full flex-col gap-2 p-2">
                <Badge>Match: {match.matchScore}%</Badge>
                <Button variant="outline" className="w-full">
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
