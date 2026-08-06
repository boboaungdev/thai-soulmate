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
    accessorKey: "firstImpression",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Impression" />
    ),
    cell: ({ row }) => <div>{Number(row.getValue("firstImpression"))} / 5</div>,
  },
  {
    accessorKey: "easeOfUse",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ease of Use" />
    ),
    cell: ({ row }) => <div>{Number(row.getValue("easeOfUse"))} / 5</div>,
  },
  {
    accessorKey: "designBranding",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Design" />
    ),
    cell: ({ row }) => <div>{Number(row.getValue("designBranding"))} / 5</div>,
  },
  {
    accessorKey: "overallExperience",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Overall" />
    ),
    cell: ({ row }) => <div>{Number(row.getValue("overallExperience"))} / 5</div>,
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
