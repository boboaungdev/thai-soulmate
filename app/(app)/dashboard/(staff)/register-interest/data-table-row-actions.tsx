"use client"

import {
  History,
  Mail,
  MoreHorizontal,
  Printer,
  Trash,
  FileText,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
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
import { APP_INFO } from "@/constants"
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
      await fetch(`/api/register-interest/${task.id}`, {
        method: "PATCH",
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
    router.push(`/dashboard/register-interest/${task.id}/print`)
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
          <History className="mr-2 h-4 w-4" />
          Activity Log
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileText className="mr-2 h-4 w-4" />
          Add Note
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Contact</DropdownMenuSubTrigger>
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
        <DropdownMenuItem variant="destructive" onClick={handleDelete} disabled>
          <Trash className="mr-2 h-4 w-4" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
