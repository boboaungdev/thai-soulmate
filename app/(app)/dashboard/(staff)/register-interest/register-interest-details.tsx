"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import { Note, RegisterInterest, User } from "@/lib/generated/prisma/client"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat)

type NoteWithUser = Note & {
  user: Pick<User, "name" | "avatar" | "email" | "role">
}

interface RegisterInterestDetailsProps {
  item: RegisterInterest | null
  onClose: () => void
}

export function RegisterInterestDetails({
  item,
  onClose,
}: RegisterInterestDetailsProps) {
  const [notes, setNotes] = useState<NoteWithUser[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<NoteWithUser | null>(null)
  const [editingNote, setEditingNote] = useState<NoteWithUser | null>(null)
  const [editedMessage, setEditedMessage] = useState("")

  useEffect(() => {
    if (item) {
      const fetchNotes = async () => {
        setIsLoadingNotes(true)
        try {
          const response = await fetch(
            `/api/notes/${item.id}/register-interest`
          )
          const result = await response.json()
          if (result.success) {
            setNotes(result.notes)
          } else {
            toast.error(result.error || "Failed to fetch notes.")
          }
        } catch (error) {
          toast.error("An unexpected error occurred while fetching notes.")
          console.error(error)
        } finally {
          setIsLoadingNotes(false)
        }
      }
      fetchNotes()
    } else {
      setNotes([])
    }
  }, [item])

  useEffect(() => {
    if (editingNote) {
      setEditedMessage(editingNote.message)
    }
  }, [editingNote])

  if (!item) {
    return null
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
      } else {
        toast.error(result.error || "Failed to delete note.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred while deleting the note.")
      console.error(error)
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
      } else {
        toast.error(result.error || "Failed to update note.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating the note.")
      console.error(error)
    } finally {
      setEditingNote(null)
      setEditedMessage("")
      setIsSubmitting(false)
    }
  }

  const age = dayjs().diff(item.dob, "year")

  return (
    <>
      <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle className="text-xl">
              {item.prefix} {item.name}
            </SheetTitle>
            <SheetDescription>
              Full details of the registered interest.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] px-6">
            <div className="grid gap-6 py-6 pr-4">
              <DetailItem label="Gender" value={item.gender} />
              <DetailItem
                label="Date of Birth"
                value={`${dayjs(item.dob).format("LL")} (${age} years old)`}
              />
              <DetailItem label="Nationality" value={item.nationality} />
              <DetailItem
                label="Current Location"
                value={item.currentLocation}
              />
              <DetailItem label="Email" value={item.email} />
              <DetailItem
                label="Phone"
                value={`(${item.phoneCountry}) ${item.phone}`}
              />
              <DetailItem label="Source" value={item.source} />
              {item.otherSource && (
                <DetailItem label="Other Source" value={item.otherSource} />
              )}
              <DetailItem label="Status" value={item.status} />
              <DetailItem
                label="Registered On"
                value={dayjs(item.createdAt).format("LLL")}
              />
            </div>

            <div className="mt-6 space-y-6">
              <h3 className="text-lg font-medium">Notes</h3>
              <div className="space-y-4 pr-4">
                {isLoadingNotes ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-[150px]" />
                              <Skeleton className="h-3 w-[100px]" />
                            </div>
                          </div>
                          <Skeleton className="h-3 w-[200px]" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={note.user.avatar || undefined} />
                        <AvatarFallback>
                          {note.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{note.user.name}</p>
                              <Badge variant="secondary">
                                {note.user.role}
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
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => setEditingNote(note)}
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
                          <p>
                            Created:{" "}
                            {dayjs(note.createdAt).format("MMM D, YYYY h:mm A")}
                          </p>
                          {dayjs(note.updatedAt).isAfter(
                            dayjs(note.createdAt)
                          ) && (
                            <p>
                              Updated:{" "}
                              {dayjs(note.updatedAt).format(
                                "MMM D, YYYY h:mm A"
                              )}
                            </p>
                          )}
                        </div>
                        <p className="mt-1 text-sm">{note.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
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
        onOpenChange={(open) => !open && setEditingNote(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update the content of this note.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="break-all sm:col-span-2">{value}</span>
    </div>
  )
}
