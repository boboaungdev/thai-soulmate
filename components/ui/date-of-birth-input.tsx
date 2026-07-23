"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DateOfBirthInputProps {
  value: Date | undefined
  onSelect: (date: Date | undefined) => void
  disabled?: boolean
}

export function DateOfBirthInput({
  value,
  onSelect,
  disabled,
}: DateOfBirthInputProps) {
  const [day, setDay] = React.useState<string | undefined>(
    value ? String(value.getDate()) : undefined
  )
  const [month, setMonth] = React.useState<string | undefined>(
    value ? String(value.getMonth()) : undefined
  )
  const [year, setYear] = React.useState<string | undefined>(
    value ? String(value.getFullYear()) : undefined
  )
  const isMounted = React.useRef(false)

  React.useEffect(() => {
    if (isMounted.current) {
      if (day && month && year) {
        const selectedMonth = parseInt(month, 10)
        const selectedYear = parseInt(year, 10)
        const selectedDay = parseInt(day, 10)

        const date = new Date(selectedYear, selectedMonth, selectedDay)
        // Check if the constructed date is valid
        if (
          date.getFullYear() === selectedYear &&
          date.getMonth() === selectedMonth &&
          date.getDate() === selectedDay
        ) {
          if (!value || value.getTime() !== date.getTime()) {
            onSelect(date)
          }
        } else {
          // Handle invalid dates, e.g., Feb 30
          const lastDayOfMonth = new Date(
            selectedYear,
            selectedMonth + 1,
            0
          ).getDate()
          if (selectedDay > lastDayOfMonth) {
            setDay(String(lastDayOfMonth))
            const newDate = new Date(
              selectedYear,
              selectedMonth,
              lastDayOfMonth
            )
            if (!value || value.getTime() !== newDate.getTime()) {
              onSelect(newDate)
            }
          }
        }
      } else {
        if (value) {
          onSelect(undefined)
        }
      }
    } else {
      isMounted.current = true
    }
  }, [day, month, year, onSelect, value])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  const daysInMonth = (m: number, y: number) => {
    switch (m) {
      case 1: // February
        return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28
      case 3:
      case 5:
      case 8:
      case 10:
        return 30
      default:
        return 31
    }
  }

  const numDays =
    month && year ? daysInMonth(parseInt(month, 10), parseInt(year, 10)) : 31
  const days = Array.from({ length: numDays }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        value={day}
        onValueChange={setDay}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-8 rounded-lg border py-1 pr-2.5 pl-3 w-full justify-start border-input bg-background shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            !day && "text-muted-foreground"
          )}
        >
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="max-h-[10rem] overflow-y-auto">
          {days.map((d) => (
            <SelectItem key={d} value={String(d)}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={month}
        onValueChange={setMonth}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-8 rounded-lg border py-1 pr-2.5 pl-3 w-full justify-start border-input bg-background shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            !month && "text-muted-foreground"
          )}
        >
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="max-h-[10rem] overflow-y-auto">
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={year}
        onValueChange={setYear}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-8 rounded-lg border py-1 pr-2.5 pl-3 w-full justify-start border-input bg-background shadow-none ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            !year && "text-muted-foreground"
          )}
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-[10rem] overflow-y-auto">
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
