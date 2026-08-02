"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import {
  CircleCheck,
  CircleX,
  Clock,
  MailCheck,
  PhoneOutgoing,
  StickyNote,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { RegisterInterestStatus } from "@/lib/generated/prisma/enums"
import { RegisterInterest } from "@/lib/generated/prisma/client"
import { formatDateTime, formatDOB } from "@/lib/date"

type RegisterInterestWithNotesCount = RegisterInterest & {
  _count: {
    notes: number
  }
}

export const statuses: {
  value: RegisterInterestStatus
  label: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
  badgeClassName: string
}[] = [
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
    badgeClassName:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "CONTACTED_EMAIL",
    label: "Contacted Email",
    icon: MailCheck,
    color: "text-blue-500",
    badgeClassName:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: "CONTACTED_PHONE",
    label: "Contacted Phone",
    icon: PhoneOutgoing,
    color: "text-indigo-500",
    badgeClassName:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    value: "CONTACTED_WHATSAPP",
    label: "Contacted WhatsApp",
    icon: FaWhatsapp,
    color: "text-green-600",
    badgeClassName:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: CircleCheck,
    color: "text-green-500",
    badgeClassName:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "NOT_INTERESTED",
    label: "Not interested",
    icon: CircleX,
    color: "text-red-500",
    badgeClassName:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
]

export function getRegisterInterestStatusMeta(status?: string) {
  const foundStatus = statuses.find((item) => item.value === status)
  if (foundStatus) return foundStatus
  return {
    label: "Unknown",
    icon: StickyNote,
    badgeClassName: "",
  }
}

export const genders: {
  value: string
  label: string
}[] = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
]

export const columns: ColumnDef<RegisterInterestWithNotesCount>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.original.prefix} {row.getValue("name")}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string
      return <div className={`min-[80px]`}>{gender}</div>
    },
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nationality" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[80px] truncate">{row.getValue("nationality")}</div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.getValue("currentLocation")}
      </div>
    ),
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOB (Age)" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[120px]">
          {formatDOB(row.getValue("dob"), { showAge: true })}
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[140px] truncate font-medium">
            (+66) {row.getValue("phone")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "_count.notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      const notesCount = row.original._count.notes
      return (
        <div
          className={`flex items-center space-x-1 ${
            notesCount === 0 ? "text-muted-foreground" : ""
          }`}
        >
          <StickyNote className="h-4 w-4" />
          <span className="font-medium">{notesCount}</span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = getRegisterInterestStatusMeta(row.getValue("status"))

      return (
        <Badge variant="outline" className={status.badgeClassName}>
          <status.icon className="mr-1.5 h-3.5 w-3.5" />
          {status.label}
        </Badge>
      )
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registered On" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[150px] truncate font-medium">
            {formatDateTime(row.getValue("createdAt"))}
          </span>
        </div>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
