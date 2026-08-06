"use client"

import {
  MoreHorizontal,
  Trash,
  Eye,
} from "lucide-react"
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
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { WebsiteReview } from "@/lib/generated/prisma/client"
import { toast } from "sonner"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onViewDetails: (item: TData) => void
}

export function DataTableRowActions<TData>({
  row,
  onViewDetails,
}: DataTableRowActionsProps<TData>) {
  const review = row.original as WebsiteReview
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/website-review/${review.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast.success("Review deleted successfully.")
        setIsDeleteDialogOpen(false)
        window.dispatchEvent(new Event("website-review-updated"))
      } else {
        const result = await response.json()
        toast.error(result.error || "Failed to delete review.")
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred while deleting the review."
      )
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
        <DropdownMenuSeparator />
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
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
                review.
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
