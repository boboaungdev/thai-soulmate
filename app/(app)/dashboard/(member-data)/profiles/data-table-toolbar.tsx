"use client"

import { RefreshCw, Search, XCircle } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import {
  MembershipPlan,
  ProfileStatus,
} from "@/lib/generated/prisma/enums"

const membershipPlans = Object.values(MembershipPlan).map(plan => ({
  label: plan.replace(/_/g, " "), // Replace underscores with spaces for readability
  value: plan,
}))

const statuses = Object.values(ProfileStatus).map(status => ({
  label: status.replace(/_/g, " "),
  value: status,
}))

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  forceFetch: () => Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  forceFetch,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <InputGroup className="h-8 w-[150px] lg:w-[250px]">
          <InputGroupText>
            <Search className="ml-2 h-4 w-4" />
          </InputGroupText>
          <InputGroupInput
            placeholder="Search profiles..."
            value={table.getState().globalFilter ?? ""}
            onChange={event => table.setGlobalFilter(event.target.value)}
          />
        </InputGroup>
        {table.getColumn("gender") && (
          <DataTableFacetedFilter
            column={table.getColumn("gender")}
            title="Gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("plan") && (
          <DataTableFacetedFilter
            column={table.getColumn("plan")}
            title="Plan"
            options={membershipPlans}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter("")
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8"
          onClick={() => forceFetch()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
