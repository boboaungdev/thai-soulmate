"use client"

import * as React from "react"
import { format } from "date-fns"

import { cn, calculateAge } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerInputProps {
  value: Date | undefined
  onSelect: ((date: Date | undefined) => void) | undefined
}

export function DatePickerInput({ value, onSelect }: DatePickerInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-slot="input-group-control"
          variant={"ghost"}
          className={cn(
            "w-full flex-1 justify-start text-left font-normal border-0",
            !value && "text-muted-foreground"
          )}
        >
          {value ? `${format(value, "MM/dd/yyyy")} (Age: ${calculateAge(value)})` : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}

          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
