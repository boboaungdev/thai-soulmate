"use client"

import React, { useState } from "react"
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

const roleIcons: Record<string, React.ElementType> = {
  ADMIN: Shield,
  STAFF: Users2,
  DEV: Shield,
  MEMBER: UserIcon,
}

export function TrackingNotesTab({
  trackingId,
  initialNotes = [],
  onNotesChange,
}: {
  trackingId: string
  initialNotes: TrackingNoteWithUser[]
  onNotesChange?: (notes: TrackingNoteWithUser[]) => void
}) {
  const router = useRouter()
  const { user } = useAuthStore()

  const [notes, setNotes] = useState<TrackingNoteWithUser[]>(initialNotes)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingNote, setEditingNote] = useState<TrackingNoteWithUser | null>(
    null
  )
  const [editedMessage, setEditedMessage] = useState("")
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
          type: "MANUAL",
        }),
      })
      const result = await response.json()

      if (result.success) {
        const updated = [result.note, ...notes]
        setNotes(updated)
        setMessage("")
        toast.success("Note added successfully.")
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
          body: JSON.stringify({ message: editedMessage }),
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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="text-muted-foreground">
            <StickyNote className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Tracking Notes
            </CardTitle>
            <CardDescription>
              Internal discussion, progress updates, and activity notes for this
              matchmaking journey.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Note Section */}
          <div className="grid gap-2">
            <Label htmlFor="new-tracking-note" className="text-sm font-medium">
              Add note
            </Label>
            <Textarea
              id="new-tracking-note"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Record notes from calls, meetings, feedback, or internal observations..."
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

          {/* Notes List */}
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No notes for this tracking connection yet.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={note.user.avatar || undefined} />
                    <AvatarFallback>
                      {note.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold">
                            {note.user.name}
                          </p>
                          {note.user.role && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 px-1.5 py-0 text-[11px]"
                            >
                              {roleIcons[note.user.role] &&
                                React.createElement(roleIcons[note.user.role], {
                                  className: "h-3 w-3",
                                })}
                              <span>{note.user.role}</span>
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className="px-1.5 py-0 font-mono text-[10px] uppercase"
                          >
                            {note.type}
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

                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Created: {formatDateTime(note.createdAt)}</span>
                      {note.updatedAt && note.updatedAt !== note.createdAt && (
                        <span>• Updated: {formatDateTime(note.updatedAt)}</span>
                      )}
                    </div>

                    <p className="mt-2 text-sm whitespace-pre-wrap text-foreground">
                      {note.message}
                    </p>
                  </div>
                </div>
              ))
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
              This action cannot be undone. This will permanently delete the
              note from this tracking connection.
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update the content of this tracking note.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            disabled={isSubmitting}
            rows={5}
            placeholder="Edit your note message..."
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
              {isSubmitting ? "Updating..." : "Update Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
