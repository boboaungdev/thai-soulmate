"use client"

import {
  Search,
  MoreVertical,
  Eye,
  Send,
  Printer,
  Copy,
  Calendar,
  Home,
  MapPin,
  Venus,
  Mars,
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ApplicationForm } from "@/types/application-form"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function SendProfileDialog({
  isOpen,
  onOpenChange,
  user,
}: {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  user: ApplicationForm
}) {
  const [sendToUsers, setSendToUsers] = useState<ApplicationForm[]>([])
  const [isFetchingSendToUsers, setIsFetchingSendToUsers] = useState(false)
  const [selectedUserIdToSend, setSelectedUserIdToSend] = useState<
    string | null
  >(null)
  const [selectedUserToSend, setSelectedUserToSend] =
    useState<ApplicationForm | null>(null)
  const [isSendingProfile, setIsSendingProfile] = useState(false)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  const personalDetails =
    typeof user.personalDetails === "string"
      ? JSON.parse(user.personalDetails)
      : user.personalDetails || {}

  useEffect(() => {
    if (!isOpen || !user) return

    async function fetchSendToUsers() {
      setIsFetchingSendToUsers(true)
      try {
        const targetGender =
          personalDetails?.gender === "Male" ? "Female" : "Male"
        const response = await fetch(`/api/profiles?gender=${targetGender}`)
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setSendToUsers(data.data)
      } catch (error) {
        console.error(error)
        toast.error("Could not fetch users to send profile to.")
      } finally {
        setIsFetchingSendToUsers(false)
      }
    }

    fetchSendToUsers()
  }, [isOpen, user, personalDetails?.gender])

  const handleSendProfile = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSendingProfile(true)

    try {
      const res = await fetch("/api/profiles/send-profile-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: user?.id,
          profile: personalDetails,
          to: selectedUserToSend?.personalDetails,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Profile sent")
        onOpenChange(false)
        setSelectedUserIdToSend(null)
        setSelectedUserToSend(null)
      }
    } catch (error) {
      toast.error("Failed to send")
    } finally {
      setIsSendingProfile(false)
      setSelectedUserIdToSend(null)
      setSelectedUserToSend(null)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setSelectedUserIdToSend(null)
          setSelectedUserToSend(null)
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Profile</DialogTitle>
          <DialogDescription>
            Select a user to send {personalDetails?.prefix}{" "}
            {personalDetails?.name}
            &apos;s profile to.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-select" className="text-right">
              To
            </Label>
            <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isComboboxOpen}
                  className="col-span-3 justify-between"
                  disabled={isFetchingSendToUsers || isSendingProfile}
                >
                  {selectedUserIdToSend
                    ? sendToUsers.find((u) => u.id === selectedUserIdToSend)
                        ?.personalDetails?.prefix +
                      " " +
                      sendToUsers.find((u) => u.id === selectedUserIdToSend)
                        ?.personalDetails?.name
                    : "Select a user..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search user..." />
                  <CommandList>
                    <CommandEmpty>
                      {isFetchingSendToUsers ? "Loading..." : "No users found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {sendToUsers.map((u) => {
                        const userAge =
                          u.personalDetails?.dob &&
                          !isNaN(new Date(u.personalDetails.dob).getTime())
                            ? new Date().getFullYear() -
                              new Date(u.personalDetails.dob).getFullYear()
                            : "N/A"
                        return (
                          <CommandItem
                            key={u.id}
                            value={`${u.personalDetails?.prefix || ""} ${
                              u.personalDetails?.name || ""
                            } ${String(u.customId).padStart(4, "0")}`}
                            onSelect={() => {
                              setSelectedUserIdToSend(u.id)
                              setSelectedUserToSend(u)
                              setIsComboboxOpen(false)
                            }}
                            className="flex items-center gap-3"
                          >
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedUserIdToSend === u.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.photos?.headshot} />
                              <AvatarFallback>
                                {u.personalDetails?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {u.personalDetails.prefix}{" "}
                                {u.personalDetails?.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ID: {String(u.customId).padStart(4, "0")},{" "}
                                {userAge} years old
                              </span>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSendingProfile}
            onClick={() => {
              onOpenChange(false)
              setSelectedUserIdToSend(null)
              setSelectedUserToSend(null)
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSendProfile}
            disabled={isSendingProfile || !selectedUserIdToSend}
            className="btn-gradient"
          >
            {isSendingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSendingProfile ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function UserCard({ user }: { user: ApplicationForm }) {
  const router = useRouter()
  const isVip = user.membership?.type === "VIP"
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)

  const personalDetails =
    typeof user.personalDetails === "string"
      ? JSON.parse(user.personalDetails)
      : user.personalDetails || {}

  const photos =
    typeof user.photos === "string"
      ? JSON.parse(user.photos)
      : user.photos || {}

  const age = personalDetails.dob
    ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
    : "N/A"

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation()
    const idToCopy = String(user.customId).padStart(4, "0")
    navigator.clipboard.writeText(idToCopy)
    toast.success(`Copied ID: ${idToCopy}`)
  }

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/dashboard/profiles/${user.id}/print`)
  }

  const handleSendProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSendDialogOpen(true)
  }

  const handleViewProfile = () => {
    router.push(`/dashboard/profiles/${user.id}`)
  }

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div onClick={handleViewProfile} className="cursor-pointer">
          <div className="relative aspect-[3/4] overflow-hidden">
            {photos?.headshot ? (
              <Image
                src={photos.headshot}
                alt={personalDetails.name}
                fill
                className="object-cover transition duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                No Image
              </div>
            )}

            <Badge className="absolute top-3 left-3 bg-card text-muted-foreground">
              ID-{String(user.customId).padStart(4, "0")}
            </Badge>

            {isVip && (
              <Badge className="absolute top-3 right-3 bg-pink-500">VIP</Badge>
            )}
          </div>
          <CardContent className="flex-grow space-y-3 p-4">
            <div>
              <h3 className="line-clamp-1 text-lg font-semibold">
                {personalDetails.name}
                {personalDetails.nickname && (
                  <span className="text-muted-foreground">
                    {" "}
                    ({personalDetails.nickname})
                  </span>
                )}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {personalDetails.gender === "Male" ? (
                <Mars className="h-4 w-4 text-blue-500" />
              ) : (
                <Venus className="h-4 w-4 text-pink-500" />
              )}

              <span>{age} years old</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              {personalDetails.nationality}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {personalDetails.currentLocation}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Joined {formatDate(user.createdAt)}
            </div>
          </CardContent>
        </div>

        <CardFooter className="flex items-center gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleViewProfile}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewProfile}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSendProfile}>
                <Send className="mr-2 h-4 w-4" />
                <span>Send Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyId}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy ID</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Button className="w-full" variant="outline">
            View Profile
          </Button> */}
        </CardFooter>
      </Card>
      <SendProfileDialog
        isOpen={isSendDialogOpen}
        onOpenChange={setIsSendDialogOpen}
        user={user}
      />
    </>
  )
}

export default function ProfilesPage() {
  const [users, setUsers] = useState<ApplicationForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // State for search term
  const [gender, setGender] = useState("All")
  const [sortBy, setSortBy] = useState("customId")
  const [sortOrder, setSortOrder] = useState("asc")
  const [nickname, setNickname] = useState("")
  const [customId, setCustomId] = useState("")

  const isIdSearch = /^\d/.test(searchTerm) && searchTerm.length > 0

  useEffect(() => {
    async function fetchUsers() {
      try {
        const params = new URLSearchParams()

        if (gender) params.append("gender", gender)
        if (sortBy) params.append("sortBy", sortBy)
        if (sortOrder) params.append("sortOrder", sortOrder)
        if (nickname) params.append("nickname", nickname)
        if (customId) params.append("customId", customId)

        const response = await fetch(`/api/gallery?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [gender, sortBy, sortOrder, name, customId])

  const filteredUsers = users?.filter((user) => {
    if (!searchTerm) return true
    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    const id = String(user.customId).padStart(4, "0")
    const name = user.personalDetails?.name?.toLowerCase() || ""
    const nickname = user.personalDetails?.nickname?.toLowerCase() || ""
    const nationality = user.personalDetails?.nationality?.toLowerCase() || ""
    const currentLocation =
      user.personalDetails?.currentLocation?.toLowerCase() || ""
    return (
      name.includes(lowerCaseSearchTerm) ||
      nickname.includes(lowerCaseSearchTerm) ||
      id.includes(lowerCaseSearchTerm) ||
      nationality.includes(lowerCaseSearchTerm) ||
      currentLocation.includes(lowerCaseSearchTerm)
    )
  })

  const sortedUsers = filteredUsers?.slice().sort((a, b) => {
    const aValue =
      sortBy === "customId" ? a.customId : a.personalDetails?.name || ""
    const bValue =
      sortBy === "customId" ? b.customId : b.personalDetails?.name || ""

    if (sortBy === "customId") {
      const valA = aValue as number
      const valB = bValue as number
      if (sortOrder === "asc") {
        return valA - valB
      } else {
        return valB - valA
      }
    } else {
      // sort by name
      const valA = aValue as string
      const valB = bValue as string
      if (sortOrder === "asc") {
        return valA.localeCompare(valB)
      } else {
        return valB.localeCompare(valA)
      }
    }
  })

  return (
    <div className="container mx-auto px-6 py-4 lg:py-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Profiles</h1>
        <p className="text-sm text-muted-foreground">
          Browse all our members profiles.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by ID, name, location, etc..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value
                // If the input starts with a digit, enforce ID search rules
                if (/^\d/.test(value)) {
                  // Allow only numbers and limit to 4 digits
                  const numericValue = value.replace(/\D/g, "").slice(0, 4)
                  setSearchTerm(numericValue)
                } else {
                  setSearchTerm(value)
                }
              }}
              className="pl-9"
            />
            {isIdSearch && (
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                Searching with ID
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-8 min-w-[130px] gap-1 bg-card">
                <span className="text-muted-foreground">Gender:</span>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 min-w-[150px] gap-1 bg-card">
                <span className="text-muted-foreground">Sort:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customId">ID</SelectItem>
                <SelectItem value="name">Nickname</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-8 w-auto gap-1 bg-card sm:w-[120px]">
                <span className="text-muted-foreground">Order:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Card
                key={index}
                className="mx-auto w-full max-w-[280px] overflow-hidden"
              >
                <Skeleton className="aspect-[3/4] w-full" />
              </Card>
            ))
          : sortedUsers?.map((user) => <UserCard key={user.id} user={user} />)}
      </div>
    </div>
  )
}
