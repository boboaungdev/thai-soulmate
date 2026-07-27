"use client"

import { useState } from "react"
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Row } from "@tanstack/react-table"
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
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/auth-store"

// Duplicating User type because it's not exported from auth-store
interface User {
  id: string
  name: string
  email: string
  role: string
}
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends User>({
  row,
}: DataTableRowActionsProps<TData>) {
  const userToDelete = row.original
  const { user: currentUser } = useAuthStore()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!currentUser) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success("User deleted successfully.")
        // A common pattern is to trigger a refetch of the data.
        // For simplicity here, we'll reload the page.
        window.location.reload()
      } else {
        toast.error(data.error || "Failed to delete user.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      console.error(error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const cannotDelete =
    !currentUser ||
    userToDelete.id === currentUser.id ||
    userToDelete.role === "ADMIN"

  return (
    <>
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
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
            disabled={cannotDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(event) => event.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
