"use client"

import React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Accessibility,
  Baby,
  Briefcase,
  Building,
  Cake,
  CalendarDays,
  Camera,
  ChevronLeft,
  Dumbbell,
  Download,
  Flag,
  GlassWater,
  GraduationCap,
  Handshake,
  Heart,
  HeartCrack,
  HeartHandshake,
  Home,
  Languages,
  Loader2,
  LocateFixed,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  PersonStanding,
  Phone,
  Plane,
  Ruler,
  Scale,
  Smile,
  Shield,
  Sparkles,
  StickyNote,
  Sun,
  Target,
  Trash2,
  User2,
  Users2,
  Utensils,
  Waypoints,
  IdCard,
} from "lucide-react"
import Image from "next/image"
import { FaSmoking } from "react-icons/fa"
import { toast } from "sonner"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ApplicationForm } from "@/types/application-form"
import { Note, User as PrismaUser } from "@/lib/generated/prisma/client"
import { ApplicationFormStatus } from "@/lib/generated/prisma/enums"
import { useAuthStore } from "@/stores/auth-store"

import { applicationStatuses, getApplicationStatusMeta } from "../statuses"
import { calculateAge, formatDateTime } from "@/lib/date"

type NoteWithUser = Note & {
  user: Pick<PrismaUser, "name" | "avatar" | "email" | "role">
}

type ApplicationDetail = ApplicationForm & {
  status: ApplicationFormStatus
  notes?: NoteWithUser[]
}

const roleIcons: Record<string, React.ElementType> = {
  ADMIN: Shield,
  STAFF: Users2,
  MEMBER: User2,
}

const displayValue = (value: React.ReactNode) => {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "-"
  }

  return value === null || value === undefined || value === "" ? "-" : value
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="min-w-0 text-right text-muted-foreground">
        {displayValue(value)}
      </div>
    </div>
  )
}

function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const hasContent = React.Children.toArray(children).some(
    (child) => child !== null
  )
  if (!hasContent) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <CardTitle className="text-gradient">{title}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">{children}</CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: ApplicationFormStatus }) {
  const meta = getApplicationStatusMeta(status)

  return (
    <Badge variant="outline" className={meta.badgeClassName}>
      <meta.icon className="mr-1.5 h-3.5 w-3.5" />
      {meta.label}
    </Badge>
  )
}

function NotesSection({
  applicationId,
  initialNotes,
}: {
  applicationId: string
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
      const response = await fetch(
        `/api/notes/${applicationId}/application-form`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, userId: user.id }),
        }
      )
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
                            <MoreHorizontal className="h-4 w-4" />
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
    <ProfileSection title="Photos" icon={<Camera />}>
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
                onClick={() => onDownloadClick(value as string, key as string)}
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
    </ProfileSection>
  )
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)
  const [viewingImage, setViewingImage] = useState<{
    url: string
    key: string
  } | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    if (!params.id) return

    const loadApplication = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/application-form/${params.id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch application")
        }
        const data = await res.json()
        setApplication(data.application)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch application.")
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [params.id])

  const handleStatusChange = async (status: string) => {
    if (!application) return

    setIsStatusUpdating(true)
    try {
      const response = await fetch(`/api/application-form/${application.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      const result = await response.json()

      if (result.success) {
        setApplication({
          ...application,
          status: result.application.status,
        })
        toast.success("Application status updated.")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to update status.")
      }
    } catch {
      toast.error("An unexpected error occurred while updating status.")
    } finally {
      setIsStatusUpdating(false)
    }
  }

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

  if (loading) {
    return (
      <main className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </main>
    )
  }

  if (!application) {
    return <div className="p-6">Application not found</div>
  }

  const {
    customId,
    personalDetails,
    career,
    appearance,
    personality,
    lifestyle,
    relationshipGoals,
    idealPartner,
    financial,
    photos,
    createdAt,
    status,
    notes = [],
  } = application

  const photoLabels: Record<string, string> = {
    headshot: "Headshot",
    fullLength: "Full Length",
    casualLifestyle: "Casual Lifestyle",
  }

  return (
    <>
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
      <main className="space-y-6 p-4 md:p-6">
        <Button
          variant="link"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-6">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <Avatar className="h-28 w-28 border-4 border-primary/20">
                <AvatarImage src={photos?.headshot} className="object-cover" />
                <AvatarFallback>
                  {personalDetails?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-gradient text-2xl font-bold">
                  {personalDetails?.prefix} {personalDetails?.name}
                  {personalDetails?.nickname
                    ? ` (${personalDetails.nickname})`
                    : ""}
                </h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <Badge variant="outline">
                    ID: {String(customId).padStart(4, "0")}
                  </Badge>
                  <Badge variant="outline">{personalDetails?.gender}</Badge>
                  {application.membership?.plan && (
                    <Badge variant="outline">
                      {application.membership.plan}
                    </Badge>
                  )}
                  <StatusBadge status={status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Cake className="h-4 w-4" />
                    {calculateAge(personalDetails?.dob)} years old
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {personalDetails?.currentLocation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Submitted {formatDateTime(createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isStatusUpdating}>
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={status}
                  onValueChange={handleStatusChange}
                >
                  {applicationStatuses.map((item) => (
                    <DropdownMenuRadioItem
                      key={item.value}
                      value={item.value}
                      className={item.color}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        <div className="grid grid-cols-1 items-start gap-6">
          {application.membership && (
            <ProfileSection title="Membership Details" icon={<IdCard />}>
              <DetailRow
                icon={<Sparkles />}
                label="Plan"
                value={application.membership.plan}
              />
              <DetailRow
                icon={<CalendarDays />}
                label="Start Date"
                value={
                  application.membership.startsAt
                    ? formatDateTime(application.membership.startsAt)
                    : "-"
                }
              />
              <DetailRow
                icon={<CalendarDays />}
                label="End Date"
                value={
                  application.membership.expiresAt
                    ? formatDateTime(application.membership.expiresAt)
                    : "-"
                }
              />
            </ProfileSection>
          )}
          <ProfileSection title="Personal Details" icon={<User2 />}>
            <DetailRow
              icon={<User2 />}
              label="Name"
              value={`${personalDetails?.prefix} ${personalDetails?.name}`}
            />
            {personalDetails.gender === "Female" && (
              <DetailRow
                icon={<Smile />}
                label="Nickname"
                value={personalDetails?.nickname}
              />
            )}
            <DetailRow
              icon={<PersonStanding />}
              label="Gender"
              value={personalDetails?.gender}
            />
            <DetailRow
              icon={<Cake />}
              label="Date of Birth"
              value={
                personalDetails?.dob
                  ? `${formatDateTime(personalDetails.dob)} (${calculateAge(
                      personalDetails.dob
                    )} years old)`
                  : "-"
              }
            />
            <DetailRow
              icon={<Mail />}
              label="Email"
              value={personalDetails?.email}
            />
            <DetailRow
              icon={<Phone />}
              label="Phone"
              value={personalDetails?.phone}
            />
            <DetailRow
              icon={<Flag />}
              label="Nationality"
              value={personalDetails?.nationality}
            />
            <DetailRow
              icon={<LocateFixed />}
              label="Current Location"
              value={personalDetails?.currentLocation}
            />
          </ProfileSection>

          <ProfileSection title="Career & Financial" icon={<Briefcase />}>
            <DetailRow
              icon={<Briefcase />}
              label="Occupation"
              value={career?.occupation}
            />
            <DetailRow
              icon={<Building />}
              label="Company"
              value={career?.company}
            />
            <DetailRow
              icon={<GraduationCap />}
              label="Education"
              value={career?.education}
            />
            <DetailRow
              icon={<Home />}
              label="Owns Property"
              value={financial?.ownProperty}
            />
            <DetailRow
              icon={<Building />}
              label="Owns Business"
              value={financial?.ownBusiness}
            />
          </ProfileSection>

          <ProfileSection title="Appearance" icon={<Sparkles />}>
            <DetailRow
              icon={<Ruler />}
              label="Height"
              value={appearance?.height ? `${appearance.height} cm` : undefined}
            />
            <DetailRow
              icon={<Scale />}
              label="Weight"
              value={appearance?.weight ? `${appearance.weight} kg` : undefined}
            />
            <DetailRow
              icon={<Heart />}
              label="Religion"
              value={appearance?.religion}
            />
            <DetailRow
              icon={<Languages />}
              label="English Fluency"
              value={`${appearance?.englishFluency?.[0] ?? 0}%`}
            />
            <DetailRow
              icon={<Languages />}
              label="Thai Fluency"
              value={`${appearance?.thaiFluency?.[0] ?? 0}%`}
            />
          </ProfileSection>

          <ProfileSection title="Personality & Background" icon={<Smile />}>
            <DetailRow
              icon={<Smile />}
              label="About"
              value={personality?.about}
            />
            <DetailRow
              icon={<Smile />}
              label="Personality Traits"
              value={personality?.personality}
            />
            <DetailRow
              icon={<Sparkles />}
              label="Best Qualities"
              value={personality?.bestQualities}
            />
            <DetailRow
              icon={<Heart />}
              label="Looking For Qualities"
              value={personality?.lookingForQualities}
            />
            <DetailRow
              icon={<Users2 />}
              label="Marital Status"
              value={personality?.maritalStatus}
            />
            <DetailRow
              icon={<Baby />}
              label="Has Children"
              value={personality?.hasChildren}
            />
            {personality?.hasChildren === "Yes" && (
              <DetailRow
                icon={<Users2 />}
                label="Children Count"
                value={personality?.childrenCount}
              />
            )}
          </ProfileSection>

          <ProfileSection
            title="Lifestyle & Interests"
            icon={<HeartHandshake />}
          >
            <DetailRow
              icon={<Handshake />}
              label="Lifestyle"
              value={lifestyle?.lifestyle}
            />
            <DetailRow
              icon={<FaSmoking />}
              label="Smoking"
              value={lifestyle?.smoking}
            />
            <DetailRow
              icon={<GlassWater />}
              label="Drinking"
              value={lifestyle?.drinking}
            />
            <DetailRow
              icon={<Dumbbell />}
              label="Exercise"
              value={lifestyle?.exercise}
            />
            <DetailRow
              icon={<Target />}
              label="Interests"
              value={lifestyle?.interests}
            />
            <DetailRow
              icon={<Utensils />}
              label="Other Interest"
              value={lifestyle?.otherInterest}
            />
            <DetailRow
              icon={<Plane />}
              label="Travel Destinations"
              value={lifestyle?.travelDestinations}
            />
            <DetailRow
              icon={<Sun />}
              label="Weekend Activity"
              value={lifestyle?.weekendActivity}
            />
            <DetailRow
              icon={<HeartHandshake />}
              label="Family Importance"
              value={lifestyle?.familyImportance}
            />
            <DetailRow
              icon={<Baby />}
              label="Future Children"
              value={lifestyle?.futureChildren}
            />
            <DetailRow
              icon={<Handshake />}
              label="Values"
              value={lifestyle?.values}
            />
          </ProfileSection>

          <ProfileSection title="Relationship Goals" icon={<Heart />}>
            <DetailRow
              icon={<Waypoints />}
              label="Willing to Relocate"
              value={relationshipGoals?.relocate}
            />
            <DetailRow
              icon={<Heart />}
              label="Looking For"
              value={relationshipGoals?.lookingFor}
            />
            <DetailRow
              icon={<CalendarDays />}
              label="Settle Down Timeline"
              value={relationshipGoals?.settleDown}
            />
          </ProfileSection>

          <ProfileSection
            title="Ideal Partner Preferences"
            icon={<Accessibility />}
          >
            <DetailRow
              icon={<Cake />}
              label="Age Range"
              value={idealPartner?.ageRange}
            />
            <DetailRow
              icon={<Flag />}
              label="Nationality"
              value={idealPartner?.nationality}
            />
            <DetailRow
              icon={<MapPin />}
              label="Location"
              value={idealPartner?.location}
            />
            <DetailRow
              icon={<Ruler />}
              label="Height"
              value={idealPartner?.height}
            />
            <DetailRow
              icon={<GraduationCap />}
              label="Education"
              value={idealPartner?.education}
            />
            <DetailRow
              icon={<Smile />}
              label="Personality Traits"
              value={idealPartner?.personality}
            />
            <DetailRow
              icon={<Sparkles />}
              label="Desired Qualities"
              value={idealPartner?.qualities}
            />
            <DetailRow
              icon={<HeartCrack />}
              label="Deal Breakers"
              value={idealPartner?.dealBreakers}
            />
          </ProfileSection>
        </div>

        <PhotoGrid
          photos={photos}
          onImageClick={(url, key) => setViewingImage({ url, key })}
          onDownloadClick={handleDownload}
          downloading={downloading}
        />

        <NotesSection applicationId={application.id} initialNotes={notes} />
      </main>
    </>
  )
}
