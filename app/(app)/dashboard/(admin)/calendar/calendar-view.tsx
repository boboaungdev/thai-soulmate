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

import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Video,
  MapPin,
  Pencil,
  Trash2,
  Clock,
  User,
  Users2,
  CalendarDays,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { toast } from "sonner"
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
  visibleKinds: CalendarKind[],
  searchQuery: string
): EventInput[] {
  return items
    .filter((item) => visibleKinds.includes(item.kind))
    .filter((item) => {
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(query) ||
        (item.person && item.person.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.location && item.location.toLowerCase().includes(query))
      )
    })
    .map((item) => ({
      id: item.id,
      title: item.title,
      start: item.start,
      end: item.end,
      allDay: item.allDay,
      color: kindStyle[item.kind]?.color || "#cfa14f",
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
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const endTime = end
    ? end.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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
              className={cn("size-2 rounded-full", kindStyle[item.kind]?.dot)}
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

  // Live items state
  const [items, setItems] = useState<CalendarItem[]>(mockCalendarItems)
  const [searchQuery, setSearchQuery] = useState("")

  // Selected item for viewing details
  const [selected, setSelected] = useState<CalendarItem | null>(null)

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CalendarItem | null>(null)

  // Form states
  const [formTitle, setFormTitle] = useState("")
  const [formKind, setFormKind] = useState<CalendarKind>("register_interest")
  const [formDate, setFormDate] = useState("")
  const [formStartTime, setFormStartTime] = useState("10:00")
  const [formEndTime, setFormEndTime] = useState("10:45")
  const [formPerson, setFormPerson] = useState("")
  const [formLocation, setFormLocation] = useState("Google Meet")
  const [formMeetUrl, setFormMeetUrl] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formDescription, setFormDescription] = useState("")

  const today = startOfDay(new Date())
  const tomorrowFocus = nextBusinessDay(today)
  const tomorrowIsSkippedWeekend = isWeekend(addDays(today, 1))

  const events = useMemo(
    () => toCalendarEvents(items, visibleKinds, searchQuery),
    [items, visibleKinds, searchQuery]
  )

  const todayItems = useMemo(
    () => itemsOnDay(items, today, visibleKinds),
    [items, today, visibleKinds]
  )

  const tomorrowItems = useMemo(
    () => itemsOnDay(items, tomorrowFocus, visibleKinds),
    [items, tomorrowFocus, visibleKinds]
  )

  const weekItems = useMemo(() => {
    const start = startOfWeekMonday(today)
    const end = endOfWeekSunday(today)

    return items
      .filter((item) => visibleKinds.includes(item.kind))
      .filter((item) => {
        const when = startOfDay(new Date(item.start))
        return when >= start && when < end
      })
      .sort((a, b) => a.start.localeCompare(b.start))
  }, [items, today, visibleKinds])

  const counts = useMemo(() => {
    return calendarKinds.map((kind) => ({
      ...kind,
      count: items.filter((item) => item.kind === kind.value).length,
    }))
  }, [items])

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
    const item = items.find((entry) => entry.id === info.event.id)
    if (item) {
      setSelected(item)
    }
  }

  // Handle clicking empty slot on calendar
  function handleDateClick(info: { dateStr: string; allDay: boolean }) {
    const clickedDate = new Date(info.dateStr)
    const dateStr = clickedDate.toISOString().split("T")[0]
    setFormDate(dateStr)

    if (!info.allDay) {
      const hours = String(clickedDate.getHours()).padStart(2, "0")
      const mins = String(clickedDate.getMinutes()).padStart(2, "0")
      setFormStartTime(`${hours}:${mins}`)
      const endHours = String((clickedDate.getHours() + 1) % 24).padStart(2, "0")
      setFormEndTime(`${endHours}:${mins}`)
    } else {
      setFormStartTime("10:00")
      setFormEndTime("10:45")
    }

    setFormTitle("")
    setFormPerson("")
    setFormLocation("Google Meet")
    setFormMeetUrl("")
    setFormPhone("")
    setFormDescription("")
    setFormKind("google_meet")
    setIsCreateOpen(true)
  }

  function handleOpenCreate() {
    const todayStr = new Date().toISOString().split("T")[0]
    setFormDate(todayStr)
    setFormStartTime("10:00")
    setFormEndTime("10:45")
    setFormTitle("")
    setFormPerson("")
    setFormLocation("Google Meet")
    setFormMeetUrl("")
    setFormPhone("")
    setFormDescription("")
    setFormKind("register_interest")
    setIsCreateOpen(true)
  }

  function handleCreateEvent() {
    if (!formTitle.trim()) {
      toast.error("Please enter an event title.")
      return
    }
    if (!formDate) {
      toast.error("Please select a date.")
      return
    }

    const start = `${formDate}T${formStartTime}:00`
    const end = `${formDate}T${formEndTime}:00`

    const newItem: CalendarItem = {
      id: `custom-${Date.now()}`,
      title: formTitle.trim(),
      start,
      end,
      kind: formKind,
      person: formPerson.trim() || undefined,
      location: formLocation.trim() || undefined,
      meetUrl: formMeetUrl.trim() || undefined,
      phone: formPhone.trim() || undefined,
      description: formDescription.trim() || "Scheduled appointment",
    }

    setItems((prev) => [newItem, ...prev])
    toast.success(`Appointment "${newItem.title}" scheduled successfully!`)
    setIsCreateOpen(false)
  }

  function handleOpenEdit(item: CalendarItem) {
    setSelected(null)
    setFormTitle(item.title)
    setFormKind(item.kind)
    const startDate = new Date(item.start)
    setFormDate(startDate.toISOString().split("T")[0])
    setFormStartTime(
      startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    )
    if (item.end) {
      const endDate = new Date(item.end)
      setFormEndTime(
        endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      )
    } else {
      setFormEndTime("11:00")
    }
    setFormPerson(item.person || "")
    setFormLocation(item.location || "Google Meet")
    setFormMeetUrl(item.meetUrl || "")
    setFormPhone(item.phone || "")
    setFormDescription(item.description || "")
    setIsEditOpen(true)
  }

  function handleSaveEdit() {
    if (!selected) return
    if (!formTitle.trim()) {
      toast.error("Please enter an event title.")
      return
    }

    const start = `${formDate}T${formStartTime}:00`
    const end = `${formDate}T${formEndTime}:00`

    const updatedItem: CalendarItem = {
      ...selected,
      title: formTitle.trim(),
      start,
      end,
      kind: formKind,
      person: formPerson.trim() || undefined,
      location: formLocation.trim() || undefined,
      meetUrl: formMeetUrl.trim() || undefined,
      phone: formPhone.trim() || undefined,
      description: formDescription.trim(),
    }

    setItems((prev) => prev.map((item) => (item.id === selected.id ? updatedItem : item)))
    toast.success("Appointment updated successfully.")
    setIsEditOpen(false)
    setSelected(updatedItem)
  }

  function handleDeleteEvent() {
    if (!itemToDelete) return
    setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))
    toast.success(`"${itemToDelete.title}" deleted.`)
    if (selected?.id === itemToDelete.id) {
      setSelected(null)
    }
    setItemToDelete(null)
  }

  const tomorrowLabel = tomorrowIsSkippedWeekend ? "Monday" : "Tomorrow"

  // Metric stats
  const totalGoogleMeet = items.filter((i) => i.kind === "google_meet").length
  const totalRegisterInterest = items.filter((i) => i.kind === "register_interest").length

  return (
    <div className="space-y-6">
      {/* METRIC STATS OVERVIEW */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Today&apos;s Appointments</p>
              <h3 className="text-gradient mt-1 text-2xl font-bold">{todayItems.length}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarClock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {todayItems.length === 0 ? "No items scheduled today" : `${todayItems.length} active sessions today`}
          </p>
        </Card>

        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Google Meet Calls</p>
              <h3 className="mt-1 text-2xl font-bold text-blue-500">{totalGoogleMeet}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Video className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Candidate video consultations</p>
        </Card>

        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Interest Callbacks</p>
              <h3 className="mt-1 text-2xl font-bold text-amber-500">{totalRegisterInterest}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Users2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Inbound candidate follow-ups</p>
        </Card>

        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">This Week Total</p>
              <h3 className="mt-1 text-2xl font-bold text-rose-500">{weekItems.length}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Scheduled through Sunday</p>
        </Card>
      </div>

      {/* MAIN CALENDAR & SIDEBAR GRID */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* CALENDAR MAIN CARD */}
        <Card className="overflow-hidden py-0 shadow-sm">
          <CardHeader className="gap-4 border-b px-6 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Calendar</CardTitle>
                <CardDescription>
                  Business hours Monday–Friday, 10:00–20:00
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                {/* SEARCH INPUT */}
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search calendar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>

                {/* PREVIOUS / TODAY / NEXT */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => controller.prev()}
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium"
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
                    <ChevronRight className="h-4 w-4" />
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
                  <TabsList className="h-8">
                    {views.map((view) => (
                      <TabsTrigger key={view.value} value={view.value} className="h-7 text-xs px-2.5">
                        {view.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* NEW APPOINTMENT BUTTON */}
                <Button
                  size="sm"
                  className="btn-gradient h-8 gap-1 text-xs font-medium"
                  onClick={handleOpenCreate}
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Event
                </Button>
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
                slotMinTime="09:00:00"
                slotMaxTime="21:00:00"
                slotDuration="00:30:00"
                slotHeaderInterval="01:00"
                slotHeaderFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }}
                scrollTime="09:30:00"
                businessHours={BUSINESS_HOURS}
                selectable={true}
                dateClick={handleDateClick}
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
          {/* COLOR KEY & FILTERS */}
          <Card className="shadow-xs">
            <CardHeader className="px-6 pb-3 pt-5">
              <CardTitle className="text-sm font-semibold">Categories & Filters</CardTitle>
              <CardDescription className="text-xs">
                Click to filter categories on the calendar.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 px-6 pb-5">
              {counts.map((kind) => (
                <Toggle
                  key={kind.value}
                  pressed={visibleKinds.includes(kind.value)}
                  onPressedChange={() => toggleKind(kind.value)}
                  variant="outline"
                  className="h-auto w-full justify-start gap-3 px-3 py-2 text-left transition-all"
                >
                  <span className={cn("size-2.5 rounded-full", kind.dot)} />

                  <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                    <span className="text-xs font-semibold">{kind.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {kind.hint}
                    </span>
                  </span>

                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {kind.count}
                  </Badge>
                </Toggle>
              ))}
            </CardContent>
          </Card>

          {/* AGENDA ACCORDION */}
          <Card className="flex-1 shadow-xs">
            <CardHeader className="px-6 pb-3 pt-5">
              <CardTitle className="text-sm font-semibold">Agenda</CardTitle>
              <CardDescription className="text-xs">
                Quick review of today, tomorrow, and this week.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-5">
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
                  <AccordionTrigger className="py-2.5 hover:no-underline">
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                      <span className="flex flex-col items-start">
                        <span className="text-xs font-semibold">Today</span>
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {formatDayLabel(today)}
                        </span>
                      </span>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {todayItems.length}
                      </Badge>
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
                  <AccordionTrigger className="py-2.5 hover:no-underline">
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                      <span className="flex flex-col items-start">
                        <span className="text-xs font-semibold">{tomorrowLabel}</span>
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {tomorrowIsSkippedWeekend
                            ? `Next business day · ${formatDayLabel(tomorrowFocus)}`
                            : formatDayLabel(tomorrowFocus)}
                        </span>
                      </span>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {tomorrowItems.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <TaskList
                      items={tomorrowItems}
                      empty="No items on next business day."
                      onSelect={setSelected}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* THIS WEEK */}
                <AccordionItem
                  value="week"
                  className="rounded-xl border px-3 not-last:border-b-0"
                >
                  <AccordionTrigger className="py-2.5 hover:no-underline">
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                      <span className="flex flex-col items-start">
                        <span className="text-xs font-semibold">This week</span>
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {formatDayLabel(startOfWeekMonday(today))} –{" "}
                          {formatDayLabel(new Date(endOfWeekSunday(today).getTime() - 1))}
                        </span>
                      </span>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {weekItems.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <TaskList
                      items={weekItems}
                      empty="No items this week for selected types."
                      onSelect={setSelected}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EVENT DETAILS DIALOG */}
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          {selected && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("w-fit text-xs font-medium", kindStyle[selected.kind]?.badge)}
                  >
                    {kindStyle[selected.kind]?.label}
                  </Badge>
                </div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {formatItemWhen(selected)}
                </DialogDescription>
              </DialogHeader>

              {/* Details Body */}
              <div className="space-y-3 rounded-xl border bg-muted/20 p-3.5 text-xs">
                {selected.person && (
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-foreground">Candidate / Contact:</span>
                    <span className="text-muted-foreground">{selected.person}</span>
                  </div>
                )}

                {selected.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-foreground">Location / Channel:</span>
                    <span className="text-muted-foreground">{selected.location}</span>
                  </div>
                )}

                <div className="pt-1 text-muted-foreground leading-relaxed">
                  {selected.description}
                </div>
              </div>

              {/* Direct Action Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selected.meetUrl && (
                  <Button
                    size="sm"
                    className="btn-gradient gap-1.5 text-xs font-medium"
                    asChild
                  >
                    <a href={selected.meetUrl} target="_blank" rel="noopener noreferrer">
                      <Video className="h-3.5 w-3.5" /> Join Google Meet
                    </a>
                  </Button>
                )}

                {selected.phone && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs font-medium"
                  onClick={() => handleOpenEdit(selected)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    setItemToDelete(selected)
                    setSelected(null)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CREATE EVENT MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Schedule New Appointment</DialogTitle>
            <DialogDescription className="text-xs">
              Add a candidate consultation, Google Meet session, or team event.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Title *</label>
              <Input
                placeholder="e.g. Video Intro · Alex J. & Supansa T."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {calendarKinds.map((k) => (
                  <button
                    key={k.value}
                    type="button"
                    onClick={() => setFormKind(k.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-2 text-left transition-colors",
                      formKind === k.value
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <span className={cn("size-2 rounded-full", k.dot)} />
                    <span className="text-xs">{k.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Date</label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Start Time</label>
                <Input
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">End Time</label>
                <Input
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Candidate Name & Location */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Candidate / Contact</label>
                <Input
                  placeholder="e.g. Supansa Thanakit"
                  value={formPerson}
                  onChange={(e) => setFormPerson(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Location / Channel</label>
                <Input
                  placeholder="Google Meet, Phone, Office"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Google Meet Link & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Google Meet URL</label>
                <Input
                  placeholder="https://meet.google.com/..."
                  value={formMeetUrl}
                  onChange={(e) => setFormMeetUrl(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Phone / WhatsApp</label>
                <Input
                  placeholder="+66812345678"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Notes / Description</label>
              <Textarea
                placeholder="Add notes, candidate preferences, or meeting agenda..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button className="btn-gradient" onClick={handleCreateEvent}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT EVENT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Appointment</DialogTitle>
            <DialogDescription className="text-xs">
              Update appointment details, times, or notes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Title *</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Date</label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Start Time</label>
                <Input
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">End Time</label>
                <Input
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Candidate / Contact</label>
                <Input
                  value={formPerson}
                  onChange={(e) => setFormPerson(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Location / Channel</label>
                <Input
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Google Meet URL</label>
                <Input
                  value={formMeetUrl}
                  onChange={(e) => setFormMeetUrl(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Phone / WhatsApp</label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Notes / Description</label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button className="btn-gradient" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong className="font-semibold text-foreground">
                {itemToDelete?.title}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="hover:bg-destructive/90"
              onClick={handleDeleteEvent}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
