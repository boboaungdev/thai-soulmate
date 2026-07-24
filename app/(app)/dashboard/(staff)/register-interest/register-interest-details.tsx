"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "sonner"

import { Note, RegisterInterest, User } from "@/lib/generated/prisma/client"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat)

type NoteWithUser = Note & {
  user: Pick<User, "name" | "avatar">
}

interface RegisterInterestDetailsProps {
  item: RegisterInterest | null
  onClose: () => void
}

export function RegisterInterestDetails({
  item,
  onClose,
}: RegisterInterestDetailsProps) {
  const { user } = useAuthStore()
  const [noteMessage, setNoteMessage] = useState("")
  const [notes, setNotes] = useState<NoteWithUser[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)

  useEffect(() => {
    if (item) {
      const fetchNotes = async () => {
        setIsLoadingNotes(true)
        try {
          const response = await fetch(
            `/api/notes/register-interest/${item.id}`
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

  if (!item) {
    return null
  }

  const handleSaveNote = async () => {
    if (!noteMessage.trim() || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/notes/register-interest/${item.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: noteMessage,
          userId: user.id,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setNotes([result.note, ...notes])
        setNoteMessage("")
        toast.success("Note added successfully.")
      } else {
        toast.error(result.error || "Failed to add note.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const age = dayjs().diff(item.dob, "year")

  return (
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a new note..."
                    value={noteMessage}
                    onChange={(e) => setNoteMessage(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button
                    onClick={handleSaveNote}
                    disabled={!noteMessage.trim() || isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Note"}
                  </Button>
                </div>
                <div className="space-y-4">
                  {isLoadingNotes ? (
                    <p>Loading notes...</p>
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
                            <p className="font-semibold">{note.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {dayjs(note.createdAt).format(
                                "MMM D, YYYY h:mm A"
                              )}
                            </p>
                          </div>
                          <p className="text-sm">{note.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </SheetContent>
    </Sheet>
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