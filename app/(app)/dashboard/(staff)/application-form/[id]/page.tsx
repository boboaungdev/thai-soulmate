"use client"

import Link from "next/link"
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
  DollarSign,
  Dumbbell,
  Flag,
  GlassWater,
  GraduationCap,
  Handshake,
  Heart,
  HeartCrack,
  HeartHandshake,
  Home,
  Languages,
  LocateFixed,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plane,
  Ruler,
  Scale,
  Smile,
  Sparkles,
  StickyNote,
  Sun,
  Target,
  Trash2,
  User,
  Users,
  Utensils,
  Waypoints,
} from "lucide-react"
import { FaSmoking } from "react-icons/fa"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
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

dayjs.extend(localizedFormat)

type NoteWithUser = Note & {
  user: Pick<PrismaUser, "name" | "avatar" | "email" | "role">
}

type ApplicationDetail = ApplicationForm & {
  status: ApplicationFormStatus
  notes?: NoteWithUser[]
}

const calculateAge = (dob: string | Date) => {
  if (!dob) return 0
  return dayjs().diff(dayjs(dob), "year")
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
        <CardTitle>{title}</CardTitle>
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
            <CardTitle>Staff Notes</CardTitle>
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
                Add Note
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
                          <Badge variant="secondary">{note.user.role}</Badge>
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
                      Created:{" "}
                      {dayjs(note.createdAt).format("MMM D, YYYY h:mm A")}
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

function PhotoGrid({ photos }: { photos: ApplicationForm["photos"] }) {
  const photoEntries = [
    ["headshot", "Headshot", photos?.headshot],
    ["fullLength", "Full Length", photos?.fullLength],
    ["casualLifestyle", "Casual Lifestyle", photos?.casualLifestyle],
    ["recent", "Recent Photo", photos?.recent],
  ].filter(([, , value]) => Boolean(value))

  return (
    <ProfileSection title="Photos" icon={<Camera />}>
      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        {photoEntries.map(([key, label, value]) => (
          <div key={key} className="flex flex-col gap-2">
            <Avatar className="h-56 w-full rounded-md">
              <AvatarImage
                src={value as string}
                className="rounded-md object-cover"
              />
              <AvatarFallback className="rounded-md">Img</AvatarFallback>
            </Avatar>
            <span className="text-center text-sm text-muted-foreground">
              {label}
            </span>
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
  const age = calculateAge(personalDetails?.dob)

  return (
    <main className="space-y-6 p-4 md:p-6">
      <Button asChild variant="link" className="text-foreground">
        <Link href="/dashboard/application-form">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Link>
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
              <h1 className="text-2xl font-bold">
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
                <StatusBadge status={status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:justify-start">
                <span className="flex items-center gap-1.5">
                  <Cake className="h-4 w-4" />
                  {age} years old
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {personalDetails?.currentLocation}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Submitted {dayjs(createdAt).format("LL")}
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

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <ProfileSection title="Personal Details" icon={<User />}>
          <DetailRow
            icon={<User />}
            label="Prefix"
            value={personalDetails?.prefix}
          />
          <DetailRow
            icon={<User />}
            label="Name"
            value={personalDetails?.name}
          />
          <DetailRow
            icon={<Smile />}
            label="Nickname"
            value={personalDetails?.nickname}
          />
          <DetailRow
            icon={<User />}
            label="Gender"
            value={personalDetails?.gender}
          />
          <DetailRow
            icon={<Cake />}
            label="Date of Birth"
            value={
              personalDetails?.dob
                ? `${dayjs(personalDetails.dob).format("LL")} (${age} years old)`
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
            icon={<DollarSign />}
            label="Income"
            value={financial?.income}
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
            icon={<Users />}
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
              icon={<Users />}
              label="Children Count"
              value={personality?.childrenCount}
            />
          )}
        </ProfileSection>

        <ProfileSection title="Lifestyle & Interests" icon={<HeartHandshake />}>
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

      <PhotoGrid photos={photos} />

      <NotesSection applicationId={application.id} initialNotes={notes} />
    </main>
  )
}
