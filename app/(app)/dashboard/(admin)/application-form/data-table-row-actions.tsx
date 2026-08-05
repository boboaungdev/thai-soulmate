"use client"

import {
  Contact2,
  Eye,
  FileEdit,
  FileText,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
} from "lucide-react"
import { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { FaWhatsapp } from "react-icons/fa"
import { useState } from "react"
import { toast } from "sonner"

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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/stores/auth-store"

import { ApplicationRow } from "./columns"
import { applicationStatuses } from "./statuses"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const application = row.original as ApplicationRow
  const { user } = useAuthStore()
  const [message, setMessage] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const goToDetails = () => {
    router.push(`/dashboard/application-form/${application.id}`)
  }

  const handleStatusChange = async (status: string) => {
    const promise = fetch(`/api/application-form/${application.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    toast.promise(promise, {
      loading: "Updating application status...",
      success: async (response) => {
        if (!response.ok) throw new Error("Failed to update status.")
        window.dispatchEvent(new Event("application-form-updated"))
        return "Application status updated."
      },
      error: async (error) => {
        const result = await error.response?.json()
        return result?.message || result?.error || "Failed to update status."
      },
    })
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

    setIsLoading(true)
    try {
      const res = await fetch(`/api/notes/${application.id}/application-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, userId: user.id }),
      })

      if (res.ok) {
        toast.success("Note added successfully.")
        setMessage("")
        setIsNoteDialogOpen(false)
        window.dispatchEvent(new Event("application-form-updated"))
        router.refresh()
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[180px]"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem onClick={goToDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View details
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
                Add a staff note to this application.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <Label htmlFor="application-note">Note</Label>
              <Textarea
                id="application-note"
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
              <Contact2 className="mr-2 h-4 w-4" />
              <span>Contact</span>
            </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem asChild>
              <a
                href={`mailto:${application.personalDetails?.email}`}
                target="_blank"
                rel="noreferrer"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`tel:${application.personalDetails?.phone}`}>
                <Phone className="mr-2 h-4 w-4" />
                Phone
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`https://wa.me/${application.personalDetails?.phone?.replace(/\D/g, "")}`}
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
            value={application.status}
            onValueChange={handleStatusChange}
          >
            {applicationStatuses.map((status) => (
              <DropdownMenuRadioItem
                key={status.value}
                value={status.value}
                className={status.color}
                disabled={status.value === application.status}
              >
                <status.icon className="mr-2 h-4 w-4" />
                {status.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
