"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ApplicationForm } from "@/types/application-form"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  MapPin,
  Cake,
  Copy,
  Ruler,
  Weight,
  BookUser,
  Briefcase,
  GraduationCap,
  Languages,
  Church,
  Mail,
  Phone,
  FileText,
  MoreVertical,
  Loader2,
  Printer,
  Mars,
  Venus,
  Home,
  Send,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaWhatsapp } from "react-icons/fa"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

const ProfileInfo = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
)

const AboutSection = ({
  content,
  personalityTraits,
}: {
  content: string
  personalityTraits: string[] | undefined
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-gradient">About Me</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-muted-foreground">{content || "N/A"}</p>
      {personalityTraits && personalityTraits.length > 0 && (
        <div>
          <h3 className="font-semibold">Personality</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {personalityTraits.map((trait) => (
              <Badge key={trait} variant="secondary">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)

const DetailsSection = ({ profile }: { profile: ApplicationForm }) => {
  const { personalDetails, appearance, career } = profile
  const age =
    personalDetails?.dob && !isNaN(new Date(personalDetails.dob).getTime())
      ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
      : "N/A"

  const languageParts = []
  if (appearance?.thaiFluency?.[0] !== undefined) {
    languageParts.push(
      appearance.thaiFluency[0] === 100
        ? "Thai (Native Speaker)"
        : `Thai ${appearance.thaiFluency[0]}%`
    )
  }
  if (appearance?.englishFluency?.[0] !== undefined) {
    languageParts.push(
      appearance.englishFluency[0] === 100
        ? "English (Native Speaker)"
        : `English ${appearance.englishFluency[0]}%`
    )
  }

  const details = [
    {
      icon: <Cake className="h-5 w-5 text-muted-foreground" />,
      label: "Age",
      value: age,
    },
    {
      icon: <Ruler className="h-5 w-5 text-muted-foreground" />,
      label: "Height",
      value: appearance?.height ? `${appearance.height} cm` : "N/A",
    },
    {
      icon: <Weight className="h-5 w-5 text-muted-foreground" />,
      label: "Weight",
      value: appearance?.weight ? `${appearance.weight} kg` : "N/A",
    },
    {
      icon: <BookUser className="h-5 w-5 text-muted-foreground" />,
      label: "Nationality",
      value: personalDetails?.nationality || "N/A",
    },
    {
      icon: <Church className="h-5 w-5 text-muted-foreground" />,
      label: "Religion",
      value: appearance?.religion || "N/A",
    },
    {
      icon: <Briefcase className="h-5 w-5 text-muted-foreground" />,
      label: "Occupation",
      value: career?.occupation || "N/A",
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-muted-foreground" />,
      label: "Education",
      value: career?.education || "N/A",
    },
    {
      icon: <Languages className="h-5 w-5 text-muted-foreground" />,
      label: "Languages",
      value: languageParts.join(", ") || "N/A",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient">Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        {details.map((item) => (
          <ProfileInfo
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </CardContent>
    </Card>
  )
}

const LifestyleSection = ({ profile }: { profile: ApplicationForm }) => {
  const { lifestyle } = profile
  const lifestyleItems = [
    { label: "Smoking", value: lifestyle?.smoking || "N/A" },
    { label: "Drinking", value: lifestyle?.drinking || "N/A" },
    { label: "Exercise", value: lifestyle?.exercise || "N/A" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient">Lifestyle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lifestyleItems.map((item) => (
          <div key={item.label} className="flex justify-between">
            <p className="text-muted-foreground">{item.label}</p>
            <p className="font-semibold">{item.value}</p>
          </div>
        ))}
        <Separator />
        <div>
          <h3 className="font-semibold">Interests</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {lifestyle?.interests?.map((interest) => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            )) || <p className="text-sm text-muted-foreground">N/A</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const LookingForSection = ({ profile }: { profile: ApplicationForm }) => {
  const { relationshipGoals, personality, idealPartner } = profile
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient">Looking For</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Relationship Goals</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {relationshipGoals?.lookingFor?.map((goal) => (
              <Badge key={goal} variant="outline">
                {goal}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Qualities in a Partner</h3>
          <p className="text-muted-foreground">
            {personality?.lookingForQualities?.join(", ") || "N/A"}
          </p>
        </div>
        {idealPartner?.ageRange && (
          <div>
            <h3 className="font-semibold">Ideal Age Range</h3>
            <p className="text-muted-foreground">{idealPartner.ageRange}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const OverviewSection = ({ profile }: { profile: ApplicationForm }) => (
  <div className="space-y-6">
    <AboutSection
      content={profile.personality?.about || ""}
      personalityTraits={profile.personality?.personality}
    />
    <DetailsSection profile={profile} />
  </div>
)

export default function ProfilesDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const [profile, setProfile] = useState<ApplicationForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [sendToUsers, setSendToUsers] = useState<ApplicationForm[]>([])
  const [isFetchingSendToUsers, setIsFetchingSendToUsers] = useState(false)
  const [selectedUserIdToSend, setSelectedUserIdToSend] = useState<
    string | null
  >(null)
  const [isSendingProfile, setIsSendingProfile] = useState(false)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      if (!id) return
      try {
        const response = await fetch(`/api/gallery/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        setProfile(data.application)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  useEffect(() => {
    if (!isSendDialogOpen || !profile) return

    async function fetchSendToUsers() {
      setIsFetchingSendToUsers(true)
      try {
        const targetGender =
          profile?.personalDetails?.gender === "Male" ? "Female" : "Male"
        const response = await fetch(`/api/gallery?gender=${targetGender}`)
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
  }, [isSendDialogOpen, profile])

  const handleSendProfile = async (e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      const res = await fetch("/api/profiles/send-profile-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: profile?.id,
          email: profile?.personalDetails.email,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Profile sent")
      }
    } catch (error) {
      toast.error("Failed to send")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Skeleton className="mb-4 h-8 w-24" />
        <Card>
          <CardContent className="flex flex-col items-center pt-4">
            <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
            <Skeleton className="mt-4 h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
            <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 text-center">User not found.</div>
    )
  }

  const { personalDetails, photos, personality } = profile

  const age =
    personalDetails?.dob && !isNaN(new Date(personalDetails.dob).getTime())
      ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
      : "N/A"

  const mainPhoto =
    photos?.headshot || Object.values(photos || {}).find((p) => p)
  const galleryPhotos = Object.entries(photos || {})
    .filter(([, url]) => url) // Filter out entries with null/undefined URLs
    .map(([key, url]) => ({ key, url: url as string })) // Map to an array of objects

  const handleCopyId = () => {
    const idToCopy = String(profile.customId).padStart(4, "0")
    navigator.clipboard
      .writeText(idToCopy)
      .then(() => {
        toast.success("ID copied to clipboard!")
      })
      .catch(() => {
        toast.error("Failed to copy ID.")
      })
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={() => router.back()}
          className="flex items-center gap-1 p-0 text-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Dialog
            open={isSendDialogOpen}
            onOpenChange={(open) => {
              setIsSendDialogOpen(open)
              if (!open) setSelectedUserIdToSend(null) // Clear selected user when dialog closes
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Send Profile to{" "}
                {personalDetails?.gender === "Male" ? "Female" : "Male"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send Profile</DialogTitle>
                <DialogDescription>
                  Select a user to send {personalDetails?.prefix}{" "}
                  {personalDetails?.name}&apos;s profile to.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-select" className="text-right">
                    To
                  </Label>
                  <Popover
                    open={isComboboxOpen}
                    onOpenChange={setIsComboboxOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isComboboxOpen}
                        className="col-span-3 justify-between"
                        disabled={isFetchingSendToUsers}
                      >
                        {selectedUserIdToSend
                          ? sendToUsers.find(
                              (u) => u.id === selectedUserIdToSend
                            )?.personalDetails?.prefix +
                            " " +
                            sendToUsers.find(
                              (u) => u.id === selectedUserIdToSend
                            )?.personalDetails?.name
                          : "Select a user..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search user..." />
                        <CommandList>
                          <CommandEmpty>
                            {isFetchingSendToUsers
                              ? "Loading..."
                              : "No users found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {sendToUsers.map((u) =>
                              (() => {
                                const userAge =
                                  u.personalDetails?.dob &&
                                  !isNaN(
                                    new Date(u.personalDetails.dob).getTime()
                                  )
                                    ? new Date().getFullYear() -
                                      new Date(
                                        u.personalDetails.dob
                                      ).getFullYear()
                                    : "N/A"
                                return (
                                  <CommandItem
                                    key={u.id}
                                    value={`${u.personalDetails?.prefix || ""} ${
                                      u.personalDetails?.name || ""
                                    } ${String(u.customId).padStart(4, "0")}`}
                                    onSelect={() => {
                                      setSelectedUserIdToSend(u.id)
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
                                        ID:{" "}
                                        {String(u.customId).padStart(4, "0")},{" "}
                                        {userAge} years old
                                      </span>
                                    </div>
                                  </CommandItem>
                                )
                              })()
                            )}
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
                  onClick={() => {
                    setIsSendDialogOpen(false)
                    setSelectedUserIdToSend(null)
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
                  {isSendingProfile && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/application-form/${profile.id}`)
                }
              >
                <FileText className="mr-2 h-4 w-4" /> View Application
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/profiles/${profile.id}/print`)
                }
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BookUser className="mr-2 h-4 w-4" />
                  Contact
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <a href={`mailto:${personalDetails?.email}`}>
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`tel:${personalDetails?.phone}`}>
                      <Phone className="mr-2 h-4 w-4" /> Phone
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`https://wa.me/${personalDetails?.phone}`}>
                      <FaWhatsapp className="mr-2 h-4 w-4" /> WhatsApp
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center">
          <Avatar className="mx-auto mb-4 h-32 w-32 border-4 border-background">
            <AvatarImage src={mainPhoto} alt="Profile photo" />
            <AvatarFallback>
              {personalDetails?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-gradient text-3xl font-bold">
            {personalDetails?.prefix || ""} {personalDetails?.name || "User"}
            {personalDetails?.nickname &&
              personalDetails.name &&
              ` (${personalDetails.nickname})`}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4 text-muted-foreground">
            <div
              className="flex cursor-pointer items-center gap-1 hover:text-foreground"
              onClick={handleCopyId}
            >
              <p>ID: {String(profile.customId).padStart(4, "0")}</p>
              <Copy className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1">
              {personalDetails?.gender === "Male" ? (
                <Mars className="h-5 w-5 text-blue-500" />
              ) : personalDetails?.gender === "Female" ? (
                <Venus className="h-5 w-5 text-pink-500" />
              ) : null}
              <p>{age} years old</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-5 w-5" />
              <p>{personalDetails?.currentLocation || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1">
              <Home className="h-5 w-5" />
              <p>{personalDetails?.nationality || "N/A"}</p>
            </div>
          </div>

          <div className="mt-10 w-full space-y-6">
            <OverviewSection profile={profile} />
            <LifestyleSection profile={profile} />
            <LookingForSection profile={profile} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-gradient mb-4 text-2xl font-bold">Gallery</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {galleryPhotos.length > 0 ? (
            galleryPhotos.map(({ key, url }) => (
              <div
                key={key}
                className="relative aspect-square w-full overflow-hidden rounded-lg"
              >
                <Image
                  src={url}
                  alt={`Gallery photo ${key}`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No additional photos.</p>
          )}
        </div>
      </div>
    </div>
  )
}
