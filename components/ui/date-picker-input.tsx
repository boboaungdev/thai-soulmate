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
  disabled?: boolean
}

export function DatePickerInput({
  value,
  onSelect,
  disabled,
}: DatePickerInputProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (date: Date | undefined) => {
    if (onSelect) {
      onSelect(date)
    }
    setIsOpen(false)
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="input-group-control"
          variant={"ghost"}
          className={cn(
            "w-full flex-1 justify-start border-0 text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value ? (
            `${format(value, "MM/dd/yyyy")} (Age: ${calculateAge(value)})`
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
