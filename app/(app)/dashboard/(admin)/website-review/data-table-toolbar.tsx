"use client"

import { RefreshCw, Search, XCircle } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  forceFetch: () => Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  forceFetch,
}: DataTableToolbarProps<TData>) {
  const isFiltered = !!table.getState().globalFilter

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <InputGroup className="h-8 w-[150px] lg:w-[250px]">
          <InputGroupText>
            <Search className="h-4 w-4 ml-2" />
          </InputGroupText>
          <InputGroupInput
            placeholder="Search"
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
        </InputGroup>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.setGlobalFilter("")}
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
