"use client"

import {
  Mail,
  MoreHorizontal,
  Printer,
  Trash,
  FileText,
  Loader2,
  FileEdit,
  Contact2,
  Eye, // Added Loader2
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { Row } from "@tanstack/react-table"
import { useState } from "react"

import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { statuses } from "./columns"
import { useRouter } from "next/navigation"
import { APP_INFO } from "@/constants"
import { RegisterInterest } from "@/lib/generated/prisma/client"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth-store"
// import { Spinner } from "@/components/ui/spinner" // Spinner is no longer needed if Loader2 is used

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onViewDetails: (item: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  onViewDetails,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const task = row.original as RegisterInterest
  const [message, setMessage] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Added isLoading state
  const { user } = useAuthStore()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/register-interest/${task.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast.success("Interest record deleted successfully.")
        setIsDeleteDialogOpen(false)
        window.dispatchEvent(new Event("register-interest-updated"))
      } else {
        const result = await response.json()
        toast.error(result.error || "Failed to delete interest record.")
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred while deleting the interest record."
      )
    }
  }

  const handleStatusChange = async (status: string) => {
    const promise = fetch(`/api/register-interest/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    toast.promise(promise, {
      loading: "Updating status...",
      success: async (response) => {
        if (!response.ok) {
          const result = await response.json()
          throw new Error(result.error || "Failed to update status.")
        }
        window.dispatchEvent(new Event("register-interest-updated"))
        return "Status updated successfully."
      },
      error: (error) => error.message || "Failed to update status.",
    })
  }

  const handlePrint = () => {
    router.push(`/dashboard/register-interest/${task.id}/print`)
  }

  const handleAddNote = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to add a note.")
      return
    }

    if (!message.trim()) {
      toast.error("Please enter a note.")
      return
    }

    setIsLoading(true) // Set loading to true
    try {
      const res = await fetch(`/api/notes/${task.id}/register-interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: user.id }),
      })

      if (res.ok) {
        toast.success("Note added successfully.")
        setMessage("")
        setIsNoteDialogOpen(false)
        window.dispatchEvent(new Event("register-interest-updated"))
      } else {
        const { message: errorMessage } = await res.json()
        toast.error(errorMessage || "Failed to add note.")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.")
    } finally {
      setIsLoading(false) // Set loading to false in finally block
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
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
        <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>
        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <FileText className="mr-2 h-4 w-4" />
              Add Note
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
              <DialogDescription>
                Add a note to this record. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Type your note here."
                disabled={isLoading} // Disabled textarea
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsNoteDialogOpen(false)}
                variant="outline"
                disabled={isLoading} // Disabled cancel button
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={isLoading || !message.trim()}
                className="btn-gradient"
              >
                {" "}
                {/* Disabled save button */}
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Used Loader2
                ) : null}
                {isLoading ? "Adding..." : "Add Note"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Contact2 className="mr-2 h-4 w-4" />
            <span>Contact</span>
          </DropdownMenuSubTrigger>{" "}
          <DropdownMenuSubContent>
            <DropdownMenuItem asChild>
              <a
                href={`mailto:${task.email}?subject=[${APP_INFO.name}] Regarding your interest`}
                target="_blank"
                rel="noreferrer"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send email
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`https://wa.me/${task.phoneCountry.replace("+", "")}${
                  task.phone
                }`}
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FileEdit className="mr-2 h-4 w-4" />
            <span>Change Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={task.status}
              onValueChange={handleStatusChange}
            >
              {statuses.map((status) => (
                <DropdownMenuRadioItem
                  key={status.value}
                  value={status.value}
                  className={status.color}
                >
                  {status.icon && <status.icon className="mr-2 h-4 w-4" />}
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
              disabled
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete this
                record.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
