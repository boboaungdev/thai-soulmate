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
  hasError?: boolean
  className?: string
}

export function DateOfBirthInput({
  value,
  onSelect,
  disabled,
  hasError,
  className,
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

  // Sync external value changes
  React.useEffect(() => {
    if (value && !isNaN(value.getTime())) {
      const vDay = String(value.getDate())
      const vMonth = String(value.getMonth())
      const vYear = String(value.getFullYear())
      setDay((prev) => (prev !== vDay ? vDay : prev))
      setMonth((prev) => (prev !== vMonth ? vMonth : prev))
      setYear((prev) => (prev !== vYear ? vYear : prev))
    } else if (!value) {
      setDay(undefined)
      setMonth(undefined)
      setYear(undefined)
    }
  }, [value])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 85 }, (_, i) => currentYear - 18 - i)
  if (year && !years.includes(parseInt(year, 10))) {
    years.unshift(parseInt(year, 10))
    years.sort((a, b) => b - a)
  }

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
    month !== undefined && year !== undefined
      ? daysInMonth(parseInt(month, 10), parseInt(year, 10))
      : 31
  const days = Array.from({ length: numDays }, (_, i) => i + 1)

  const triggerUpdate = (
    newDay: string | undefined,
    newMonth: string | undefined,
    newYear: string | undefined
  ) => {
    if (newDay && newMonth && newYear) {
      const selectedYear = parseInt(newYear, 10)
      const selectedMonth = parseInt(newMonth, 10)
      let selectedDay = parseInt(newDay, 10)

      const maxDays = daysInMonth(selectedMonth, selectedYear)
      if (selectedDay > maxDays) {
        selectedDay = maxDays
        setDay(String(maxDays))
      }

      const constructed = new Date(selectedYear, selectedMonth, selectedDay)
      onSelect(constructed)
    } else {
      onSelect(undefined)
    }
  }

  const handleDayChange = (val: string) => {
    setDay(val)
    triggerUpdate(val, month, year)
  }

  const handleMonthChange = (val: string) => {
    setMonth(val)
    triggerUpdate(day, val, year)
  }

  const handleYearChange = (val: string) => {
    setYear(val)
    triggerUpdate(day, month, val)
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {/* Day */}
      <Select value={day} onValueChange={handleDayChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs sm:text-sm dark:bg-input/20",
            hasError && "border-destructive ring-1 ring-destructive",
            !day && "text-muted-foreground"
          )}
        >
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          {days.map((d) => (
            <SelectItem key={d} value={String(d)}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month */}
      <Select
        value={month}
        onValueChange={handleMonthChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs sm:text-sm dark:bg-input/20",
            hasError && "border-destructive ring-1 ring-destructive",
            !month && "text-muted-foreground"
          )}
        >
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select value={year} onValueChange={handleYearChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-xs sm:text-sm dark:bg-input/20",
            hasError && "border-destructive ring-1 ring-destructive",
            !year && "text-muted-foreground"
          )}
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
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
