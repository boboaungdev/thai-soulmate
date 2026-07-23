"use client"

import { Mail, MoreHorizontal, Printer, Trash } from "lucide-react"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
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

import { statuses } from "./columns"
import { useRouter } from "next/navigation"
import { RegisterInterest } from "@/lib/generated/prisma/client"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const task = row.original as RegisterInterest

  const handleDelete = async () => {
    try {
      await fetch(`/api/register-interest/${task.id}`, {
        method: "DELETE",
      })
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      await fetch(`/api/application-form/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

 const handlePrint = () => {
  window.open(`/dashboard/staff/register-interest/${task.id}/print`, "_blank")
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
        className="w-[160px]"
        onClick={(e) => e.stopPropagation()}
      >
       <DropdownMenuItem onClick={handlePrint}>
  <Printer className="mr-2 h-4 w-4" />
  Print
</DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          Sent mail to user
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
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
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
