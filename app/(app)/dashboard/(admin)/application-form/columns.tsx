"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { StickyNote } from "lucide-react"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { getApplicationStatusMeta } from "./statuses"
import { ApplicationFormStatus } from "@/lib/generated/prisma/enums"
import { ApplicationForm } from "@/types/application-form"
import { calculateAge, formatDateTime } from "@/lib/date"

export type ApplicationRow = ApplicationForm & {
  status: ApplicationFormStatus
  membership?: {
    type: string
  } | null
  notes?: {
    id: string
  }[]
}

export const columns: ColumnDef<ApplicationRow>[] = [
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
    id: "profile",
    accessorFn: (row) => row.personalDetails?.name ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant" />
    ),
    cell: ({ row }) => {
      const applicant = row.original
      const name = applicant.personalDetails?.name || "-"
      const nickname = applicant.personalDetails?.nickname

      return (
        <div className="flex min-w-[220px] items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={applicant.photos?.headshot}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {applicant.personalDetails?.prefix} {name}
            </div>
            <div className="text-xs text-muted-foreground">
              ID: {String(applicant.customId).padStart(4, "0")}
              {nickname ? ` · ${nickname}` : ""}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    id: "gender",
    accessorFn: (row) => row.personalDetails?.gender ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px]">
        {row.original.personalDetails?.gender || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: "nationality",
    accessorFn: (row) => row.personalDetails?.nationality ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nationality" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[100px] truncate">
        {row.original.personalDetails?.nationality || "-"}
      </div>
    ),
  },
  {
    id: "currentLocation",
    accessorFn: (row) => row.personalDetails?.currentLocation ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.original.personalDetails?.currentLocation || "-"}
      </div>
    ),
  },
  {
    id: "age",
    accessorFn: (row) => calculateAge(row.personalDetails?.dob),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {calculateAge(row.original.personalDetails?.dob)}
      </div>
    ),
  },
  {
    id: "occupation",
    accessorFn: (row) => row.career?.occupation ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Occupation" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[140px]">
        {row.original.career?.occupation || "-"}
      </div>
    ),
  },
  {
    id: "email",
    accessorFn: (row) => row.personalDetails?.email ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.original.personalDetails?.email || "-"}
      </div>
    ),
  },
  {
    id: "phone",
    accessorFn: (row) => row.personalDetails?.phone ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[140px] truncate font-medium">
        {row.original.personalDetails?.phone || "-"}
      </div>
    ),
  },
  {
    id: "notes",
    accessorFn: (row) => row.notes?.length ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      const notesCount = row.original.notes?.length ?? 0
      return (
        <div
          className={`flex w-[70px] items-center gap-1.5 ${
            notesCount === 0 ? "text-muted-foreground" : ""
          }`}
        >
          <StickyNote className="h-4 w-4" />
          <span className="font-medium">{notesCount}</span>
        </div>
      )
    },
  },

  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = getApplicationStatusMeta(row.original.status)
      return (
        <Badge variant="outline" className={status.badgeClassName}>
          <status.icon className="mr-1.5 h-3.5 w-3.5" />
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: "createdAt",
    accessorFn: (row) => new Date(row.createdAt).getTime(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate font-medium">
        {formatDateTime(row.original.createdAt)}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
