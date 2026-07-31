"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableColumnHeader } from "./data-table-column-header"
import { getPaymentStatusMeta, PaymentStatus } from "./statuses" // Import getPaymentStatusMeta and PaymentStatus

export type Payment = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  status: PaymentStatus // Use the imported PaymentStatus type
  avatar: string
}

export const columns: ColumnDef<Payment>[] = [
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
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = getPaymentStatusMeta(row.original.status) // Use getPaymentStatusMeta
      return (
        <Badge variant="outline" className={status.badgeClassName}>
          <status.icon className="mr-1.5 h-3.5 w-3.5" /> {/* Display icon */}
          {status.label}
        </Badge>
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
