"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import {
  CircleCheck,
  CircleX,
  Clock,
  MailCheck,
  PhoneOutgoing,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"

dayjs.extend(localizedFormat)

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { RegisterInterestStatus } from "@/lib/generated/prisma/enums"
import { RegisterInterest } from "@/lib/generated/prisma/client"

export const statuses: {
  value: RegisterInterestStatus
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}[] = [
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    value: "CONTACTED_EMAIL",
    label: "Contacted by email",
    icon: MailCheck,
    color: "text-blue-500",
  },
  {
    value: "CONTACTED_PHONE",
    label: "Contacted by phone",
    icon: PhoneOutgoing,
    color: "text-indigo-500",
  },
  {
    value: "CONTACTED_WHATSAPP",
    label: "Contacted by WhatsApp",
    icon: FaWhatsapp,
    color: "text-green-600",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: CircleCheck,
    color: "text-green-500",
  },
  {
    value: "NOT_INTERESTED",
    label: "Not interested",
    icon: CircleX,
    color: "text-red-500",
  },
]

export const columns: ColumnDef<RegisterInterest>[] = [
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
      <div className="w-[150px]">
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
      return <div className={`w-[80px]`}>{gender}</div>
    },
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nationality" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("nationality")}</div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("currentLocation")}</div>
    ),
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DOB (Age)" />
    ),
    cell: ({ row }) => {
      const dob = dayjs(row.getValue("dob") as string)
      const age = dayjs().diff(dob, "year")
      return (
        <div className="w-[120px]">
          {dob.format("L")} ({age})
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
          <span className="max-w-[500px] truncate font-medium">
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
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registered On" />
    ),
    cell: ({ row }) => {
      const createdAt = dayjs(row.getValue("createdAt") as string)
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {createdAt.format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className={`flex w-fit items-center ${status.color}`}>
          {status.icon && <status.icon className="h-5 w-5" />}
        </div>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
