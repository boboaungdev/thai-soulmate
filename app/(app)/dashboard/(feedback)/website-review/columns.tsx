"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { WebsiteReview } from "@/lib/generated/prisma/client"
import { formatDateTime } from "@/lib/date"

export const getColumns = (
  onViewDetails: (item: WebsiteReview) => void
): ColumnDef<WebsiteReview>[] => [
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
    accessorKey: "designRating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Design Rating" />
    ),
    accessorFn: row => {
      const value = (row.designBranding as any)?.overallRating
      return value ? `${value} / 10` : 'N/A'
    },
  },
  {
    accessorKey: "formEaseRating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Form Ease Rating" />
    ),
    accessorFn: row => {
      const value = (row.registrationProcess as any)?.formEaseRating
      return value ? `${value} / 10` : 'N/A'
    },
  },
  {
    accessorKey: "easeOfUseRating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ease of Use Rating" />
    ),
    accessorFn: row => {
      const value = (row.easeOfUse as any)?.rating
      return value ? `${value} / 10` : 'N/A'
    },
  },
  {
    accessorKey: "overallExperienceRating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Overall Experience Rating" />
    ),
    accessorFn: row => {
      const value = (row.overallExperience as any)?.rating
      return value ? `${value} / 10` : 'N/A'
    },
  },
  {
    accessorKey: "wouldRecommend",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Would Recommend" />
    ),
    accessorFn: row => {
      const value = (row.overallExperience as any)?.wouldRecommend
      return value ? (value === 'yes' ? 'Yes' : 'No') : 'N/A'
    },
  },
  {
    accessorKey: "serviceUnderstood",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service Understood" />
    ),
    accessorFn: row => {
      const value = (row.understandingService as any)?.understood
      return value ? (value === 'yes' ? 'Yes' : 'No') : 'N/A'
    },
  },
  {
    accessorKey: "feltSafe",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Felt Safe" />
    ),
    accessorFn: row => {
      const value = (row.trustSafety as any)?.feelSafe
      return value ? (value === 'yes' ? 'Yes' : 'No') : 'N/A'
    },
  },
  {
    accessorKey: "easyEnglish",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Easy English" />
    ),
    accessorFn: row => {
      const value = (row.contentQuality as any)?.englishEasy
      return value ? (value === 'yes' ? 'Yes' : 'No') : 'N/A'
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted On" />
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
    cell: ({ row }) => (
      <DataTableRowActions row={row} onViewDetails={onViewDetails} />
    ),
  },
]
