"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { ApplicationForm } from "@/types/application-form"
import { calculateAge, formatDateTime } from "@/lib/date"

export type ProfileRow = ApplicationForm & {
  membership?: {
    plan: string
    startsAt?: Date | string
    expiresAt?: Date | string
  } | null
}

export const columns: ColumnDef<ProfileRow>[] = [
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
    id: "plan",
    accessorFn: (row) => row.membership?.plan ?? "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[100px]">
        {row.original.membership?.plan || "-"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "createdAt",
    accessorFn: (row) => new Date(row.createdAt).getTime(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
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
