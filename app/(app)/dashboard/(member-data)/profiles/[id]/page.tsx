"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ApplicationForm } from "@/types/application-form"
import {
  Note,
  Profile as PrismaProfile,
  User as PrismaUser,
} from "@/lib/generated/prisma/client"
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
  Camera,
  Download,
  Phone,
  FileText,
  MoreVertical,
  Loader2,
  Printer,
  Mars,
  Venus,
  Home,
  StickyNote,
  Pencil,
  Trash2,
  Shield,
  Users2,
  User2 as UserIcon,
  HardDrive,
} from "lucide-react"
import { ProfileStorageTab } from "@/components/dashboard/profiles/profile-storage-tab"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuthStore } from "@/stores/auth-store"
import { Textarea } from "@/components/ui/textarea"
import { formatDateTime } from "@/lib/date"

type NoteWithUser = Note & {
  user: Pick<PrismaUser, "name" | "avatar" | "email" | "role">
}

interface Profile extends PrismaProfile {
  applicationForm: ApplicationForm
  notes: NoteWithUser[]
}

const roleIcons: Record<string, React.ElementType> = {
  ADMIN: Shield,
  STAFF: Users2,
  MEMBER: UserIcon,
}

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

function PhotoGrid({
  photos,
  onImageClick,
  onDownloadClick,
  downloading,
}: {
  photos: ApplicationForm["photos"]
  onImageClick: (url: string, key: string) => void
  onDownloadClick: (url: string, imgKey: string) => void
  downloading: string | null
}) {
  const photoEntries = [
    ["headshot", "Headshot", photos?.headshot],
    ["fullLength", "Full Length", photos?.fullLength],
    ["casualLifestyle", "Casual Lifestyle", photos?.casualLifestyle],
  ].filter(([, , value]) => Boolean(value))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="text-muted-foreground">
          <Camera />
        </div>
        <CardTitle className="text-gradient">Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {photoEntries.map(([key, label, value]) => (
            <div key={key as string} className="flex flex-col gap-2">
              <div
                className="relative h-56 w-full cursor-pointer overflow-hidden rounded-md"
                onClick={() => onImageClick(value as string, key as string)}
              >
                <Image
                  src={value as string}
                  alt={label as string}
                  fill
                  className="rounded-md object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-center gap-10">
                <span className="text-center text-sm text-muted-foreground">
                  {label}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onDownloadClick(value as string, key as string)
                  }
                  className="text-muted-foreground"
                  disabled={!!downloading}
                >
                  {downloading === key ? (
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function NotesSection({
  profileId,
  initialNotes,
}: {
  profileId: string
  initialNotes: NoteWithUser[]
}) {
  const { user } = useAuthStore()
  const [notes, setNotes] = useState<NoteWithUser[]>(initialNotes)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<NoteWithUser | null>(null)
  const [editingNote, setEditingNote] = useState<NoteWithUser | null>(null)
  const [editedMessage, setEditedMessage] = useState("")

  const router = useRouter()
  const handleAddNote = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to add a note.")
      return
    }

    if (!message.trim()) {
      toast.error("Please enter a note.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/notes/${profileId}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: user.id }),
      })
      const result = await response.json()

      if (result.success) {
        setNotes([result.note, ...notes])
        setMessage("")
        toast.success("Note added successfully.")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to add note.")
      }
    } catch {
      toast.error("An unexpected error occurred while adding the note.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!noteToDelete) return

    try {
      const response = await fetch(`/api/notes/${noteToDelete.id}`, {
        method: "DELETE",
      })
      const result = await response.json()

      if (result.success) {
        setNotes(notes.filter((note) => note.id !== noteToDelete.id))
        toast.success("Note deleted successfully.")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete note.")
      }
    } catch {
      toast.error("An unexpected error occurred while deleting the note.")
    } finally {
      setNoteToDelete(null)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !editedMessage.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editedMessage }),
      })
      const result = await response.json()

      if (result.success) {
        setNotes(
          notes.map((note) => (note.id === editingNote.id ? result.note : note))
        )
        toast.success("Note updated successfully.")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update note.")
      }
    } catch {
      toast.error("An unexpected error occurred while updating the note.")
    } finally {
      setEditingNote(null)
      setEditedMessage("")
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="text-muted-foreground">
            <StickyNote />
          </div>
          <div>
            <CardTitle className="text-gradient">Notes</CardTitle>
            <CardDescription>
              Internal notes for this application.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="new-application-note">Add note</Label>
            <Textarea
              id="new-application-note"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Type your note here."
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddNote}
                disabled={isSubmitting || !message.trim()}
                className="btn-gradient"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Adding..." : "Add Note"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                No notes yet.
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={note.user.avatar || undefined} />
                    <AvatarFallback>{note.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{note.user.name}</p>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {roleIcons[note.user.role] &&
                              React.createElement(roleIcons[note.user.role], {
                                className: "h-3 w-3",
                              })}
                            <span>{note.user.role}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {note.user.email}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingNote(note)
                              setEditedMessage(note.message)
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setNoteToDelete(note)}
                            className="text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <div>Created: {formatDateTime(note.createdAt)}</div>
                      {note.updatedAt && note.updatedAt !== note.createdAt && (
                        <div>Updated: {formatDateTime(note.updatedAt)}</div>
                      )}
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-wrap">
                      {note.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} variant="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!editingNote}
        onOpenChange={(open) => {
          if (!open) {
            setEditingNote(null)
            setEditedMessage("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update the content of this application note.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editedMessage}
            onChange={(event) => setEditedMessage(event.target.value)}
            disabled={isSubmitting}
            rows={5}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingNote(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateNote}
              disabled={!editedMessage.trim() || isSubmitting}
              className="btn-gradient"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ProfilesDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewingImage, setViewingImage] = useState<{
    url: string
    key: string
  } | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      if (!id) return
      try {
        const response = await fetch(`/api/profiles/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        setProfile(data.profile)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleDownload = async (url: string, imgKey: string) => {
    setDownloading(imgKey)

    try {
      const key = new URL(url).pathname.slice(1)

      const response = await fetch(
        `/api/download?key=${encodeURIComponent(key)}`
      )

      if (!response.ok) {
        throw new Error("Download failed.")
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = objectUrl
      link.download = key.split("/").pop() ?? "photo"
      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(objectUrl)

      toast.success(`${imgKey.toUpperCase()} photo downloaded successfully.`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not download photo."
      )
    } finally {
      setDownloading(null)
    }
  }

  if (isLoading) {
    return (
      <main className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-9 w-24 rounded-lg" />

        {/* Header Card Skeleton */}
        <Card className="border-border/60 p-6 shadow-xs">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="flex flex-col items-center gap-5 md:flex-row">
              <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
              <div className="space-y-2.5">
                <Skeleton className="h-8 w-64" />
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </Card>

        {/* Tabs Skeleton */}
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />

        {/* Content Skeleton: About + Details + Photos */}
        <div className="space-y-6">
          {/* About Section Skeleton */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* Details Section Skeleton */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos Skeleton */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-56 w-full rounded-xl" />
                    <div className="flex items-center justify-between px-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="p-6 text-center text-muted-foreground">
        Profile not found.
      </main>
    )
  }

  const { personalDetails, photos } = profile.applicationForm

  const age =
    personalDetails?.dob && !isNaN(new Date(personalDetails.dob).getTime())
      ? new Date().getFullYear() - new Date(personalDetails.dob).getFullYear()
      : "N/A"
  const mainPhoto =
    photos?.headshot || Object.values(photos || {}).find((p) => p)

  const handleCopyId = () => {
    const idToCopy = String(profile.applicationForm.customId).padStart(4, "0")
    navigator.clipboard
      .writeText(idToCopy)
      .then(() => {
        toast.success("ID copied to clipboard!")
      })
      .catch(() => {
        toast.error("Failed to copy ID.")
      })
  }

  const photoLabels: Record<string, string> = {
    headshot: "Headshot",
    fullLength: "Full Length",
    casualLifestyle: "Casual Lifestyle",
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      {/* Photo Preview Dialog */}
      <Dialog
        open={!!viewingImage}
        onOpenChange={(open) => !open && setViewingImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
            <DialogDescription>
              {photoLabels[viewingImage?.key ?? ""] ?? viewingImage?.key}
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-4 h-[70vh] w-full">
            {viewingImage?.url && (
              <Image
                src={viewingImage.url}
                alt="Full size photo preview"
                fill
                className="object-contain"
              />
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setViewingImage(null)}>
              Close
            </Button>
            {viewingImage && (
              <Button
                variant="default"
                onClick={() =>
                  handleDownload(viewingImage.url, viewingImage.key)
                }
                className="btn-gradient"
                disabled={!!downloading}
              >
                {downloading === viewingImage.key ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-bounce" />
                    Downloading...
                  </>
                ) : (
                  "Download"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Back Button */}
      <Button
        variant="link"
        className="p-0 text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Avatar className="h-28 w-28 border-4 border-primary/20">
              <AvatarImage
                src={mainPhoto}
                alt="Profile photo"
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-[#8A2535] to-[#5A0816] text-2xl font-bold text-white">
                {personalDetails?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-gradient text-2xl font-bold">
                {personalDetails?.prefix || ""}{" "}
                {personalDetails?.name || "User"}
                {personalDetails?.nickname &&
                  personalDetails.name &&
                  ` (${personalDetails.nickname})`}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <Badge
                  variant="outline"
                  className="cursor-pointer gap-1 transition-colors hover:bg-muted"
                  onClick={handleCopyId}
                  title="Click to copy ID"
                >
                  <span>
                    ID:{" "}
                    {String(profile.applicationForm.customId).padStart(4, "0")}
                  </span>
                  <Copy className="h-3 w-3 text-muted-foreground" />
                </Badge>
                <Badge variant="outline" className="gap-1">
                  {personalDetails?.gender === "Male" ? (
                    <Mars className="h-3.5 w-3.5 text-blue-500" />
                  ) : personalDetails?.gender === "Female" ? (
                    <Venus className="h-3.5 w-3.5 text-pink-500" />
                  ) : null}
                  <span>{personalDetails?.gender || "N/A"}</span>
                </Badge>
                {age !== "N/A" && (
                  <Badge variant="secondary" className="gap-1">
                    <Cake className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{age} years old</span>
                  </Badge>
                )}
                {personalDetails?.nationality && (
                  <Badge variant="secondary" className="gap-1">
                    <Home className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{personalDetails.nationality}</span>
                  </Badge>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:justify-start">
                {age !== "N/A" && (
                  <span className="flex items-center gap-1.5">
                    <Cake className="h-4 w-4" />
                    {age} years old
                  </span>
                )}
                {personalDetails?.currentLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {personalDetails.currentLocation}
                  </span>
                )}
                {personalDetails?.nationality && (
                  <span className="flex items-center gap-1.5">
                    <Home className="h-4 w-4" />
                    {personalDetails.nationality}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons on Right Side of Header Card */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/application-form/${profile.applicationForm.id}`
                )
              }
            >
              <FileText className="mr-2 h-4 w-4" /> View Application
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/print/${profile.id}/profile?print=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Link>
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
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="profile" className="w-full space-y-6">
        <TabsList className="grid h-10 w-full max-w-md grid-cols-3 p-1">
          <TabsTrigger
            value="profile"
            variant="gradient"
            className="gap-2 text-sm font-medium"
          >
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            variant="gradient"
            className="gap-2 text-sm font-medium"
          >
            <StickyNote className="h-4 w-4" />
            <span>Notes</span>
            {profile.notes && profile.notes.length > 0 && (
              <span className="ml-1 rounded-full bg-black/15 px-1.5 py-0.5 text-[11px] font-semibold text-inherit dark:bg-white/20">
                {profile.notes.length}
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

        {/* Tab 1: Profile Details & Photos */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 items-start gap-6">
            <OverviewSection profile={profile.applicationForm} />
            <LifestyleSection profile={profile.applicationForm} />
            <LookingForSection profile={profile.applicationForm} />
            <PhotoGrid
              photos={photos}
              onImageClick={(url, key) => setViewingImage({ url, key })}
              onDownloadClick={handleDownload}
              downloading={downloading}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Notes */}
        <TabsContent value="notes">
          <NotesSection profileId={profile.id} initialNotes={profile.notes} />
        </TabsContent>

        {/* Tab 3: Storage */}
        <TabsContent value="storage">
          <ProfileStorageTab profileId={profile.id} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
