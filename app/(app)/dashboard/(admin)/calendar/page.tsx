"use client"

import { CalendarView } from "./calendar-view"

export default function Calendar() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Tasks, events, register-interest appointments and all other
            schedules.
          </p>
        </div>
      </div>

      <CalendarView />
    </div>
  )
}
