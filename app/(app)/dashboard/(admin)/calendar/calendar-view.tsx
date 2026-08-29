"use client"

import { useMemo, useState } from "react"
import { useTheme } from "next-themes"

import FullCalendar, {
  useCalendarController,
  type EventClickInfo,
  type EventDisplayInfo,
  type EventInput,
} from "@fullcalendar/react"

import themePlugin from "@fullcalendar/react/themes/monarch"
import dayGridPlugin from "@fullcalendar/react/daygrid"
import timeGridPlugin from "@fullcalendar/react/timegrid"
import interactionPlugin from "@fullcalendar/react/interaction"

import "@fullcalendar/react/skeleton.css"
import "@fullcalendar/react/themes/monarch/theme.css"
import "@fullcalendar/react/themes/monarch/palettes/yellow.css"

import "./calendar.css"

import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

import {
  BUSINESS_HOURS,
  calendarKinds,
  addDays,
  endOfWeekSunday,
  isSameLocalDay,
  isWeekend,
  mockCalendarItems,
  nextBusinessDay,
  startOfDay,
  startOfWeekMonday,
  type CalendarItem,
  type CalendarKind,
} from "./calendar-data"

const views = [
  {
    value: "timeGridDay",
    label: "Day",
  },
  {
    value: "timeGridWeek",
    label: "Week",
  },
  {
    value: "dayGridMonth",
    label: "Month",
  },
] as const

const kindStyle = Object.fromEntries(
  calendarKinds.map((kind) => [kind.value, kind])
) as Record<CalendarKind, (typeof calendarKinds)[number]>

function toCalendarEvents(
  items: CalendarItem[],
  visibleKinds: CalendarKind[]
): EventInput[] {
  return items
    .filter((item) => visibleKinds.includes(item.kind))
    .map((item) => ({
      id: item.id,
      title: item.title,
      start: item.start,
      end: item.end,
      allDay: item.allDay,
      color: kindStyle[item.kind].color,
      extendedProps: item,
    }))
}

function formatItemWhen(item: CalendarItem) {
  const start = new Date(item.start)

  if (item.allDay) {
    return start.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const end = item.end ? new Date(item.end) : null

  const dateLabel = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  const startTime = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })

  const endTime = end
    ? end.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : null

  return endTime
    ? `${dateLabel} · ${startTime} – ${endTime}`
    : `${dateLabel} · ${startTime}`
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function renderEventContent(info: EventDisplayInfo) {
  return (
    <div className="fc-event-chip">
      {info.timeText ? (
        <span className="fc-event-chip-time">{info.timeText}</span>
      ) : null}

      <span className="fc-event-chip-title">{info.event.title}</span>
    </div>
  )
}

function itemsOnDay(
  items: CalendarItem[],
  date: Date,
  visibleKinds: CalendarKind[]
) {
  return items
    .filter((item) => visibleKinds.includes(item.kind))
    .filter((item) => isSameLocalDay(item.start, date))
    .sort((a, b) => a.start.localeCompare(b.start))
}

function TaskList({
  items,
  empty,
  onSelect,
}: {
  items: CalendarItem[]
  empty: string
  onSelect: (item: CalendarItem) => void
}) {
  if (items.length === 0) {
    return <p className="pb-1 text-sm text-muted-foreground">{empty}</p>
  }

  return (
    <div className="flex flex-col gap-2 pb-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="rounded-xl border bg-background p-3 text-left transition-colors hover:bg-muted/60"
          onClick={() => onSelect(item)}
        >
          <div className="mb-1 flex items-center gap-2">
            <span
              className={cn("size-2 rounded-full", kindStyle[item.kind].dot)}
            />

            <span className="text-sm font-medium">{item.title}</span>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5" />

            {formatItemWhen(item)}
          </p>
        </button>
      ))}
    </div>
  )
}

export function CalendarView() {
  const { resolvedTheme } = useTheme()

  const controller = useCalendarController()

  const [title, setTitle] = useState("Calendar")

  const [viewType, setViewType] = useState("timeGridDay")

  const [visibleKinds, setVisibleKinds] = useState<CalendarKind[]>(
    calendarKinds.map((kind) => kind.value)
  )

  const [selected, setSelected] = useState<CalendarItem | null>(null)

  const today = startOfDay(new Date())

  const tomorrowFocus = nextBusinessDay(today)

  const tomorrowIsSkippedWeekend = isWeekend(addDays(today, 1))

  const events = useMemo(
    () => toCalendarEvents(mockCalendarItems, visibleKinds),
    [visibleKinds]
  )

  const todayItems = useMemo(
    () => itemsOnDay(mockCalendarItems, today, visibleKinds),
    [today, visibleKinds]
  )

  const tomorrowItems = useMemo(
    () => itemsOnDay(mockCalendarItems, tomorrowFocus, visibleKinds),
    [tomorrowFocus, visibleKinds]
  )

  const weekItems = useMemo(() => {
    const start = startOfWeekMonday(today)

    const end = endOfWeekSunday(today)

    return mockCalendarItems
      .filter((item) => visibleKinds.includes(item.kind))
      .filter((item) => {
        const when = startOfDay(new Date(item.start))

        return when >= start && when < end
      })
      .sort((a, b) => a.start.localeCompare(b.start))
  }, [today, visibleKinds])

  const counts = useMemo(() => {
    return calendarKinds.map((kind) => ({
      ...kind,

      count: mockCalendarItems.filter((item) => item.kind === kind.value)
        .length,
    }))
  }, [])

  function toggleKind(kind: CalendarKind) {
    setVisibleKinds((current) => {
      if (current.includes(kind)) {
        return current.length === 1
          ? current
          : current.filter((value) => value !== kind)
      }

      return [...current, kind]
    })
  }

  function handleEventClick(info: EventClickInfo) {
    info.jsEvent.preventDefault()

    const item = mockCalendarItems.find((entry) => entry.id === info.event.id)

    if (item) {
      setSelected(item)
    }
  }

  const tomorrowLabel = tomorrowIsSkippedWeekend ? "Monday" : "Tomorrow"

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      {/* CALENDAR */}
      <Card className="overflow-hidden py-0">
        <CardHeader className="gap-4 border-b px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{title}</CardTitle>

              <CardDescription>
                Business hours Monday–Friday, 10:00–20:00
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              {/* PREVIOUS / TODAY / NEXT */}
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => controller.prev()}
                  aria-label="Previous"
                >
                  <ChevronLeft />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => controller.today()}
                >
                  Today
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => controller.next()}
                  aria-label="Next"
                >
                  <ChevronRight />
                </Button>
              </div>

              {/* DAY / WEEK / MONTH */}
              <Tabs
                value={viewType}
                onValueChange={(value) => {
                  controller.changeView(value)
                  setViewType(value)
                }}
              >
                <TabsList>
                  {views.map((view) => (
                    <TabsTrigger key={view.value} value={view.value}>
                      {view.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            className="calendar-shell p-3 sm:p-5"
            data-color-scheme={resolvedTheme === "dark" ? "dark" : "light"}
          >
            <FullCalendar
              controller={controller}
              plugins={[
                themePlugin,
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
              initialView="timeGridDay"
              headerToolbar={false}

              height="auto"
              contentHeight="auto"

              nowIndicator
              dayMaxEvents={false}
              firstDay={1}

              slotMinTime="10:00:00"
              slotMaxTime="20:30:00"
              slotDuration="00:30:00"

              slotHeaderInterval="01:00"
              slotHeaderFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}

              businessHours={BUSINESS_HOURS}

              events={events}
              eventContent={renderEventContent}
              eventClick={handleEventClick}

              datesSet={(info) => {
                setTitle(info.view.title)
                setViewType(info.view.type)
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SIDEBAR */}
      <div className="flex flex-col gap-6">
        {/* COLOR KEY */}
        <Card>
          <CardHeader className="px-6">
            <CardTitle>Color key</CardTitle>

            <CardDescription>
              Each type stays on its own color so the team can scan the board
              quickly.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-2 px-6">
            {counts.map((kind) => (
              <Toggle
                key={kind.value}
                pressed={visibleKinds.includes(kind.value)}
                onPressedChange={() => toggleKind(kind.value)}
                variant="outline"
                className="h-auto w-full justify-start gap-3 px-3 py-2.5"
              >
                <span className={cn("size-2.5 rounded-full", kind.dot)} />

                <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                  <span className="text-sm font-medium">{kind.label}</span>

                  <span className="text-xs text-muted-foreground">
                    {kind.hint}
                  </span>
                </span>

                <Badge variant="outline">{kind.count}</Badge>
              </Toggle>
            ))}
          </CardContent>
        </Card>

        {/* AGENDA */}
        <Card className="flex-1">
          <CardHeader className="px-6">
            <CardTitle>Agenda</CardTitle>

            <CardDescription>
              Open one list at a time. If tomorrow is a weekend, Monday is shown
              instead.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6">
            <Accordion
              type="single"
              collapsible
              defaultValue="today"
              className="gap-3"
            >
              {/* TODAY */}
              <AccordionItem
                value="today"
                className="rounded-xl border px-3 not-last:border-b-0"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                    <span className="flex flex-col items-start">
                      <span>Today</span>

                      <span className="text-xs font-normal text-muted-foreground">
                        {formatDayLabel(today)}
                      </span>
                    </span>

                    <Badge variant="outline">{todayItems.length}</Badge>
                  </span>
                </AccordionTrigger>

                <AccordionContent>
                  <TaskList
                    items={todayItems}
                    empty="No items scheduled today."
                    onSelect={setSelected}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* TOMORROW */}
              <AccordionItem
                value="tomorrow"
                className="rounded-xl border px-3 not-last:border-b-0"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                    <span className="flex flex-col items-start">
                      <span>{tomorrowLabel}</span>

                      <span className="text-xs font-normal text-muted-foreground">
                        {tomorrowIsSkippedWeekend
                          ? `Next business day · ${formatDayLabel(
                              tomorrowFocus
                            )}`
                          : formatDayLabel(tomorrowFocus)}
                      </span>
                    </span>

                    <Badge variant="outline">{tomorrowItems.length}</Badge>
                  </span>
                </AccordionTrigger>

                <AccordionContent>
                  <TaskList
                    items={tomorrowItems}
                    empty="No items on the next business day."
                    onSelect={setSelected}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* THIS WEEK */}
              <AccordionItem
                value="week"
                className="rounded-xl border px-3 not-last:border-b-0"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                    <span className="flex flex-col items-start">
                      <span>This week</span>

                      <span className="text-xs font-normal text-muted-foreground">
                        {formatDayLabel(startOfWeekMonday(today))}

                        {" – "}

                        {formatDayLabel(
                          new Date(endOfWeekSunday(today).getTime() - 1)
                        )}
                      </span>
                    </span>

                    <Badge variant="outline">{weekItems.length}</Badge>
                  </span>
                </AccordionTrigger>

                <AccordionContent>
                  <TaskList
                    items={weekItems}
                    empty="No items this week for the selected types."
                    onSelect={setSelected}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* EVENT DIALOG */}
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {selected ? (
            <>
              <DialogHeader>
                <Badge
                  variant="outline"
                  className={cn("w-fit", kindStyle[selected.kind].badge)}
                >
                  {kindStyle[selected.kind].label}
                </Badge>

                <DialogTitle>{selected.title}</DialogTitle>

                <DialogDescription>
                  {formatItemWhen(selected)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <p>{selected.description}</p>

                {selected.person ? (
                  <p className="text-muted-foreground">
                    Contact: {selected.person}
                  </p>
                ) : null}

                {selected.location ? (
                  <p className="text-muted-foreground">
                    Location: {selected.location}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
