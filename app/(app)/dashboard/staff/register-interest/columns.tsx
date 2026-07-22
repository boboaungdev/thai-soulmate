"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import {
  CircleCheck,
  CircleX,
  Clock,
  Mail,
  Phone,
} from "lucide-react"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { RegisterInterestStatus } from "@/lib/generated/prisma/enums"
import { RegisterInterest } from "@/lib/generated/prisma/client"

export const statuses: {
  value: RegisterInterestStatus
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
  },
  {
    value: "CONTACTED_EMAIL",
    label: "Contacted by email",
    icon: Mail,
  },
  {
    value: "CONTACTED_PHONE",
    label: "Contacted by phone",
    icon: Phone,
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: CircleCheck,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: CircleX,
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
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
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
            {row.getValue("phone")}
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
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
