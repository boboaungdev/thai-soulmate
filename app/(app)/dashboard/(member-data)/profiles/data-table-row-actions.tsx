import {
  Copy,
  Eye,
  MoreHorizontal,
  Printer,
  Loader2,
  CheckCircle2,
  FileEdit,
  Clock,
  Trash2,
  FileText,
} from "lucide-react"
import { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ProfileStatus } from "@/lib/generated/prisma/enums"
import { useAuthStore } from "@/stores/auth-store"
import { Textarea } from "@/components/ui/textarea"
import { ProfileRow } from "./columns"
import { EditProfileSheet } from "./edit-profile-sheet"

const profileStatuses = [
  {
    value: ProfileStatus.PENDING,
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    value: ProfileStatus.COMPLETED,
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
]

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const user = row.original as ProfileRow
  const { user: authUser } = useAuthStore()
  const [message, setMessage] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation()
    const idToCopy = String(user.customId).padStart(4, "0")
    navigator.clipboard.writeText(idToCopy)
    toast.success(`Copied ID: ${idToCopy}`)
  }

  const handleViewProfile = () => {
    router.push(`/dashboard/profiles/${user.id}`)
  }

  const handleStatusChange = async (status: ProfileStatus) => {
    setIsUpdatingStatus(true)
    const promise = fetch(`/api/profiles/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })

    toast.promise(promise, {
      loading: "Updating status...",
      success: () => {
        setIsUpdatingStatus(false)
        window.dispatchEvent(new Event("profile-updated"))
        return "Status updated successfully"
      },
      error: () => {
        setIsUpdatingStatus(false)
        return "Failed to update status"
      },
    })
  }

  const handleAddNote = async () => {
    if (!authUser?.id) {
      toast.error("You must be logged in to add a note.")
      return
    }

    if (!message.trim()) {
      toast.error("Please enter a note.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/notes/${user.id}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: authUser.id }),
      })

      if (res.ok) {
        toast.success("Note added successfully.")
        setMessage("")
        setIsNoteDialogOpen(false)
        window.dispatchEvent(new Event("profile-updated"))
      } else {
        const { message: errorMessage, error } = await res.json()
        toast.error(errorMessage || error || "Failed to add note.")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={(e) => {
              // Stop propagation to prevent the row's onClick from firing.
              e.stopPropagation()
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[180px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem onClick={handleViewProfile}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              setIsEditSheetOpen(true)
            }}
          >
            <FileEdit className="mr-2 h-4 w-4" />
            Edit Profile
          </DropdownMenuItem>
          <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <FileText className="mr-2 h-4 w-4" />
                Add Note
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
                <DialogDescription>
                  Add a note to this profile record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                <Label htmlFor="profile-note">Note</Label>
                <Textarea
                  id="profile-note"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  placeholder="Type your note here."
                  disabled={isLoading}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsNoteDialogOpen(false)}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={isLoading || !message.trim()}
                  className="btn-gradient"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? "Adding..." : "Add Note"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span>Change Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {profileStatuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdatingStatus || user.status === status.value}
                  className={cn(status.color)}
                >
                  {isUpdatingStatus && user.status !== status.value ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <status.icon
                      className={cn("mr-2 h-4 w-4", {
                        "opacity-40": user.status === status.value,
                      })}
                    />
                  )}
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy ID</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/print/profile/${user.id}?print=true`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProfileSheet
        isOpen={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        profile={user}
      />
    </>
  )
}
