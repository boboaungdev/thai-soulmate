"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  StickyNote,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  Shield,
  Users2,
  User2 as UserIcon,
  PhoneCall,
  MessageSquareQuote,
  Video,
  Clock,
  Send,
  Heart,
  CheckCircle2,
  XCircle,
  Filter,
  Plus,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { toast } from "sonner"
import { formatDateTime } from "@/lib/date"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

export interface TrackingNoteWithUser {
  id: string
  message: string
  type: string
  createdAt: string
  updatedAt?: string
  user: {
    name: string
    avatar?: string | null
    email?: string
    role?: string
  }
}

export const NOTE_TYPE_CONFIG: Record<
  string,
  {
    label: string
    group: "Categories" | "Journey Stages"
    color: string
    icon: React.ElementType
  }
> = {
  // Categories
  MANUAL: {
    label: "General Note",
    group: "Categories",
    color:
      "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
    icon: StickyNote,
  },
  CALL_LOG: {
    label: "Call Log",
    group: "Categories",
    color:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: PhoneCall,
  },
  FEEDBACK: {
    label: "Member Feedback",
    group: "Categories",
    color:
      "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    icon: MessageSquareQuote,
  },

  // Journey Stages
  INITIAL_CONNECT: {
    label: "Initial Connect",
    group: "Journey Stages",
    color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    icon: Users2,
  },
  BOTH_PROFILES_SENT: {
    label: "Both Profiles Sent",
    group: "Journey Stages",
    color:
      "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
    icon: Send,
  },
  MALE_PROFILE_SENT_TO_FEMALE: {
    label: "Male Profile Sent to Female",
    group: "Journey Stages",
    color:
      "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
    icon: Send,
  },
  FEMALE_PROFILE_SENT_TO_MALE: {
    label: "Female Profile Sent to Male",
    group: "Journey Stages",
    color:
      "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
    icon: Send,
  },
  FEMALE_REVIEW: {
    label: "Female Reviewing",
    group: "Journey Stages",
    color: "bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/30",
    icon: Clock,
  },
  FEMALE_THINKING: {
    label: "Female Thinking",
    group: "Journey Stages",
    color: "bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/30",
    icon: Clock,
  },
  FEMALE_ACCEPTED: {
    label: "Female Accepted",
    group: "Journey Stages",
    color:
      "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
  FEMALE_REJECTED: {
    label: "Female Rejected",
    group: "Journey Stages",
    color: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    icon: XCircle,
  },
  MALE_REVIEW: {
    label: "Male Reviewing",
    group: "Journey Stages",
    color:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  MALE_THINKING: {
    label: "Male Thinking",
    group: "Journey Stages",
    color:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  MALE_ACCEPTED: {
    label: "Male Accepted",
    group: "Journey Stages",
    color:
      "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
  MALE_REJECTED: {
    label: "Male Rejected",
    group: "Journey Stages",
    color: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    icon: XCircle,
  },
  BOTH_PROFILES_ACCEPTED: {
    label: "Both Profiles Accepted",
    group: "Journey Stages",
    color:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  FIRST_GOOGLE_MEET: {
    label: "1st Google Meet",
    group: "Journey Stages",
    color: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    icon: Video,
  },
  SECOND_GOOGLE_MEET: {
    label: "2nd Google Meet",
    group: "Journey Stages",
    color: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    icon: Video,
  },
  THIRD_GOOGLE_MEET: {
    label: "3rd Google Meet",
    group: "Journey Stages",
    color: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30",
    icon: Video,
  },
  FIRST_FOLLOW_UP: {
    label: "1st Follow Up",
    group: "Journey Stages",
    color: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    icon: Clock,
  },
  SECOND_FOLLOW_UP: {
    label: "2nd Follow Up",
    group: "Journey Stages",
    color: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    icon: Clock,
  },
  THIRD_FOLLOW_UP: {
    label: "3rd Follow Up",
    group: "Journey Stages",
    color: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    icon: Clock,
  },
  FINAL_MATCH: {
    label: "Final Match",
    group: "Journey Stages",
    color: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
    icon: Heart,
  },
  MATCHED: {
    label: "Matched",
    group: "Journey Stages",
    color:
      "bg-emerald-600/20 text-emerald-800 dark:text-emerald-300 border-emerald-600/40",
    icon: Heart,
  },
  CLOSED: {
    label: "Closed",
    group: "Journey Stages",
    color: "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30",
    icon: XCircle,
  },
}

const roleIcons: Record<string, React.ElementType> = {
  ADMIN: Shield,
  STAFF: Users2,
  DEV: Shield,
  MEMBER: UserIcon,
}

export function TrackingNotesTab({
  trackingId,
  initialNotes = [],
  currentStatus,
  onNotesChange,
}: {
  trackingId: string
  initialNotes: TrackingNoteWithUser[]
  currentStatus?: string
  onNotesChange?: (notes: TrackingNoteWithUser[]) => void
}) {
  const router = useRouter()
  const { user } = useAuthStore()

  const [notes, setNotes] = useState<TrackingNoteWithUser[]>(initialNotes)
  const [message, setMessage] = useState("")
  const [selectedType, setSelectedType] = useState<string>(
    currentStatus && NOTE_TYPE_CONFIG[currentStatus] ? currentStatus : "MANUAL"
  )
  const [filterType, setFilterType] = useState<string>("ALL")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingNote, setEditingNote] = useState<TrackingNoteWithUser | null>(
    null
  )
  const [editedMessage, setEditedMessage] = useState("")
  const [editedType, setEditedType] = useState<string>("MANUAL")
  const [noteToDelete, setNoteToDelete] = useState<TrackingNoteWithUser | null>(
    null
  )

  const handleAddNote = async () => {
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/tracking/${trackingId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          userId: user?.id,
          type: selectedType,
        }),
      })
      const result = await response.json()

      if (result.success) {
        const updated = [result.note, ...notes]
        setNotes(updated)
        setMessage("")
        toast.success("Note saved successfully.")
        onNotesChange?.(updated)
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

  const handleUpdateNote = async () => {
    if (!editingNote || !editedMessage.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `/api/tracking/${trackingId}/notes/${editingNote.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: editedMessage,
            type: editedType,
          }),
        }
      )
      const result = await response.json()

      if (result.success) {
        const updated = notes.map((note) =>
          note.id === editingNote.id ? result.note : note
        )
        setNotes(updated)
        toast.success("Note updated successfully.")
        onNotesChange?.(updated)
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

  const handleDeleteNote = async () => {
    if (!noteToDelete) return

    try {
      const response = await fetch(
        `/api/tracking/${trackingId}/notes/${noteToDelete.id}`,
        {
          method: "DELETE",
        }
      )
      const result = await response.json()

      if (result.success) {
        const updated = notes.filter((note) => note.id !== noteToDelete.id)
        setNotes(updated)
        toast.success("Note deleted successfully.")
        onNotesChange?.(updated)
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

  const filteredNotes = useMemo(() => {
    if (filterType === "ALL") return notes
    if (filterType === "CATEGORIES") {
      return notes.filter((n) =>
        ["MANUAL", "CALL_LOG", "FEEDBACK"].includes(n.type)
      )
    }
    if (filterType === "STAGES") {
      return notes.filter(
        (n) => !["MANUAL", "CALL_LOG", "FEEDBACK"].includes(n.type)
      )
    }
    return notes.filter((n) => n.type === filterType)
  }, [notes, filterType])

  const categoryOptions = Object.entries(NOTE_TYPE_CONFIG).filter(
    ([, conf]) => conf.group === "Categories"
  )
  const stageOptions = Object.entries(NOTE_TYPE_CONFIG).filter(
    ([, conf]) => conf.group === "Journey Stages"
  )

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="text-muted-foreground">
            <StickyNote className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Tracking Notes
            </CardTitle>
            <CardDescription>
              Record internal discussions, stage updates, call logs, and member
              feedback for this journey.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Note Section */}
          <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <Label
                htmlFor="new-tracking-note"
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                Add New Tracking Note
              </Label>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <span className="text-xs font-medium whitespace-nowrap text-muted-foreground">
                  Note Stage / Type:
                </span>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-9 w-full rounded-lg border border-border bg-background text-xs font-medium transition-colors hover:bg-muted hover:text-foreground sm:w-[250px] dark:border-input dark:bg-input/30 dark:hover:bg-input/50">
                    <div className="flex items-center gap-2 truncate">
                      {NOTE_TYPE_CONFIG[selectedType] ? (
                        <>
                          {React.createElement(
                            NOTE_TYPE_CONFIG[selectedType].icon,
                            {
                              className:
                                "h-3.5 w-3.5 text-muted-foreground shrink-0",
                            }
                          )}
                          <span className="truncate font-semibold text-foreground">
                            {NOTE_TYPE_CONFIG[selectedType].label}
                          </span>
                        </>
                      ) : (
                        <SelectValue placeholder="Select type..." />
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-80 border border-border/80 bg-popover shadow-lg">
                    <SelectGroup>
                      <SelectLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                        General Categories
                      </SelectLabel>
                      {categoryOptions.map(([key, conf]) => {
                        const Icon = conf.icon
                        return (
                          <SelectItem key={key} value={key} className="text-xs">
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{conf.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                        Journey Stages & Statuses
                      </SelectLabel>
                      {stageOptions.map(([key, conf]) => {
                        const Icon = conf.icon
                        return (
                          <SelectItem key={key} value={key} className="text-xs">
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{conf.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Textarea
              id="new-tracking-note"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Record notes from phone calls, Google Meet sessions, partner reviews, or next steps..."
              disabled={isSubmitting}
              className="bg-background text-sm"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {NOTE_TYPE_CONFIG[selectedType] && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 py-0.5 text-[11px] font-medium",
                      NOTE_TYPE_CONFIG[selectedType].color
                    )}
                  >
                    {React.createElement(NOTE_TYPE_CONFIG[selectedType].icon, {
                      className: "h-3 w-3",
                    })}
                    <span>
                      Saving under: {NOTE_TYPE_CONFIG[selectedType].label}
                    </span>
                  </Badge>
                )}
              </div>
              <Button
                onClick={handleAddNote}
                disabled={isSubmitting || !message.trim()}
                className="btn-gradient h-9 px-4 text-xs font-semibold"
              >
                {isSubmitting && (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>

          {/* Filter & Count Header */}
          <div className="flex flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">
                Notes Feed ({filteredNotes.length}
                {filteredNotes.length !== notes.length
                  ? ` of ${notes.length}`
                  : ""}
                )
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="mr-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Filter className="h-3 w-3" /> Filter:
              </span>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-7 rounded-full px-3 text-xs font-medium transition-all",
                  filterType === "ALL"
                    ? "btn-gradient border-transparent font-semibold text-white shadow-xs"
                    : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                )}
                onClick={() => setFilterType("ALL")}
              >
                All ({notes.length})
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-7 rounded-full px-3 text-xs font-medium transition-all",
                  filterType === "STAGES"
                    ? "btn-gradient border-transparent font-semibold text-white shadow-xs"
                    : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                )}
                onClick={() => setFilterType("STAGES")}
              >
                Stages
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-7 rounded-full px-3 text-xs font-medium transition-all",
                  filterType === "CALL_LOG"
                    ? "btn-gradient border-transparent font-semibold text-white shadow-xs"
                    : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                )}
                onClick={() => setFilterType("CALL_LOG")}
              >
                Call Logs
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-7 rounded-full px-3 text-xs font-medium transition-all",
                  filterType === "FEEDBACK"
                    ? "btn-gradient border-transparent font-semibold text-white shadow-xs"
                    : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                )}
                onClick={() => setFilterType("FEEDBACK")}
              >
                Feedback
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-7 rounded-full px-3 text-xs font-medium transition-all",
                  filterType === "MANUAL"
                    ? "btn-gradient border-transparent font-semibold text-white shadow-xs"
                    : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                )}
                onClick={() => setFilterType("MANUAL")}
              >
                General
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3.5">
            {filteredNotes.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No tracking notes found for this filter.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const conf = NOTE_TYPE_CONFIG[note.type] || {
                  label: note.type,
                  group: "Categories",
                  color: "bg-muted text-muted-foreground border-border",
                  icon: StickyNote,
                }
                const NoteIcon = conf.icon

                return (
                  <div
                    key={note.id}
                    className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-2xs"
                  >
                    <Avatar className="h-10 w-10 border shadow-2xs">
                      <AvatarImage src={note.user.avatar || undefined} />
                      <AvatarFallback className="text-xs font-semibold">
                        {note.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {note.user.name}
                            </span>
                            {note.user.role && (
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1 px-1.5 py-0 text-[10px] font-medium"
                              >
                                {roleIcons[note.user.role] &&
                                  React.createElement(
                                    roleIcons[note.user.role],
                                    {
                                      className: "h-3 w-3",
                                    }
                                  )}
                                <span>{note.user.role}</span>
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={cn(
                                "flex items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold shadow-2xs",
                                conf.color
                              )}
                            >
                              <NoteIcon className="h-3 w-3" />
                              <span>{conf.label}</span>
                            </Badge>
                          </div>
                          {note.user.email && (
                            <p className="text-xs text-muted-foreground">
                              {note.user.email}
                            </p>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingNote(note)
                                setEditedMessage(note.message)
                                setEditedType(note.type)
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Note
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

                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Created: {formatDateTime(note.createdAt)}</span>
                        {note.updatedAt &&
                          note.updatedAt !== note.createdAt && (
                            <span>
                              • Updated: {formatDateTime(note.updatedAt)}
                            </span>
                          )}
                      </div>

                      <p className="mt-2.5 rounded-lg border border-border/40 bg-muted/15 p-3 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                        {note.message}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              note from the tracking connection.
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

      {/* Edit Note Dialog */}
      <Dialog
        open={!!editingNote}
        onOpenChange={(open) => {
          if (!open) {
            setEditingNote(null)
            setEditedMessage("")
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Tracking Note</DialogTitle>
            <DialogDescription>
              Update the message or change the stage/type for this tracking
              note.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Note Stage / Type</Label>
              <Select
                value={editedType}
                onValueChange={setEditedType}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-9 w-full rounded-lg border border-border bg-background text-xs font-medium transition-colors hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50">
                  <div className="flex items-center gap-2 truncate">
                    {NOTE_TYPE_CONFIG[editedType] ? (
                      <>
                        {React.createElement(
                          NOTE_TYPE_CONFIG[editedType].icon,
                          {
                            className:
                              "h-3.5 w-3.5 text-muted-foreground shrink-0",
                          }
                        )}
                        <span className="truncate font-semibold text-foreground">
                          {NOTE_TYPE_CONFIG[editedType].label}
                        </span>
                      </>
                    ) : (
                      <SelectValue placeholder="Select type..." />
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-72 border border-border/80 bg-popover shadow-lg">
                  <SelectGroup>
                    <SelectLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      General Categories
                    </SelectLabel>
                    {categoryOptions.map(([key, conf]) => {
                      const Icon = conf.icon
                      return (
                        <SelectItem key={key} value={key} className="text-xs">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{conf.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                      Journey Stages & Statuses
                    </SelectLabel>
                    {stageOptions.map(([key, conf]) => {
                      const Icon = conf.icon
                      return (
                        <SelectItem key={key} value={key} className="text-xs">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{conf.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Note Message</Label>
              <Textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                disabled={isSubmitting}
                rows={5}
                placeholder="Edit your note message..."
                className="text-sm"
              />
            </div>
          </div>
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
              {isSubmitting ? "Updating..." : "Update Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
