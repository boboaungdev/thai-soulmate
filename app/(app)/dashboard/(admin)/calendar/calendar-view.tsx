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
  ChevronsUpDown,
  Plus,
  Search,
  Video,
  MapPin,
  Pencil,
  PenLine,
  Trash2,
  Clock,
  User,
  Users2,
  CalendarDays,
  PhoneCall,
  Palmtree,
  type LucideIcon,
  Calendar as CalendarIcon,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
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

// Business hours 10:00 to 20:00 (30 min slots)
export const TIME_SLOTS_30MIN = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
]

export const END_TIME_OPTIONS = [
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
]

// Mock logic for booked dates vs available dates
export function isDateBookedMock(date: Date): boolean {
  const day = date.getDay()
  // Saturday (6) and Sunday (0) are closed / auto red (Mon to Fri business days)
  if (day === 0 || day === 6) return true

  // For weekdays (Mon-Fri), mock occasional high-demand fully booked dates
  const dateNum = date.getDate()
  return dateNum % 8 === 4
}

export function isDateAvailableMock(date: Date): boolean {
  const today = startOfDay(new Date())
  if (date < today) return false
  return !isDateBookedMock(date)
}

export function get30MinEndTime(startTime: string): string {
  if (!startTime) return ""
  const [h, m] = startTime.split(":").map(Number)
  if (isNaN(h) || isNaN(m)) return "10:30"
  let endM = m + 30
  let endH = h
  if (endM >= 60) {
    endM -= 60
    endH += 1
  }
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`
}

export function isTimeSlotBookedMock(dateStr: string, time: string): boolean {
  if (!dateStr) return false
  const dateNum = new Date(dateStr + "T00:00:00").getDate()
  if (dateNum % 2 === 0) {
    return time === "11:00" || time === "14:00" || time === "16:30"
  } else {
    return time === "10:30" || time === "13:30" || time === "17:00"
  }
}

const TIME_OPTIONS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
]

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

export const kindIcons: Record<CalendarKind, LucideIcon> = {
  register_interest: Users2,
  google_meet: Video,
  follow_up: PhoneCall,
  event: CalendarDays,
  holiday: Palmtree,
}

export interface MatchedPairOption {
  id: string
  trackingId: string
  status: string
  lastCompletedStatus: string
  completedAt: string
  completedDate: string
  male: {
    name: string
    prefix: string
    avatar?: string
  }
  female: {
    name: string
    prefix: string
    avatar?: string
  }
  meetTitle: string
}

export const mockMatchedPairs: MatchedPairOption[] = [
  {
    id: "match-4",
    trackingId: "TRK-2026-115",
    status: "Ready for First Google Meet",
    lastCompletedStatus: "Both Profiles Accepted",
    completedAt: "30 Aug 2026, 16:45",
    completedDate: "2026-08-30T16:45:00",
    male: {
      prefix: "Mr.",
      name: "Marcus Bennett",
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    },
    female: {
      prefix: "Ms.",
      name: "Kanya Rattana",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    },
    meetTitle: "Google Meet · Marcus B. & Kanya R.",
  },
  {
    id: "match-3",
    trackingId: "TRK-2026-104",
    status: "Ready for Second Google Meet",
    lastCompletedStatus: "First Google Meet",
    completedAt: "31 Aug 2026, 11:00",
    completedDate: "2026-08-31T11:00:00",
    male: {
      prefix: "Mr.",
      name: "David Miller",
      avatar:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    },
    female: {
      prefix: "Ms.",
      name: "Nipa Charoensuk",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80",
    },
    meetTitle: "Google Meet · David M. & Nipa C.",
  },
  {
    id: "match-2",
    trackingId: "TRK-2026-092",
    status: "Ready for First Google Meet",
    lastCompletedStatus: "Both Profiles Accepted",
    completedAt: "01 Sep 2026, 17:15",
    completedDate: "2026-09-01T17:15:00",
    male: {
      prefix: "Mr.",
      name: "Alex Johnson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    female: {
      prefix: "Ms.",
      name: "Supansa Thanakit",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    },
    meetTitle: "Google Meet · Alex J. & Supansa T.",
  },
  {
    id: "match-1",
    trackingId: "TRK-2026-081",
    status: "Ready for First Google Meet",
    lastCompletedStatus: "Both Profiles Accepted",
    completedAt: "02 Sep 2026, 14:30",
    completedDate: "2026-09-02T14:30:00",
    male: {
      prefix: "Mr.",
      name: "John Doe",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    female: {
      prefix: "Ms.",
      name: "Pornyaporn Watashi",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    meetTitle: "Google Meet · John Doe & Pornyaporn Watashi",
  },
]

export const kindIconBg: Record<CalendarKind, string> = {
  register_interest:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
  google_meet:
    "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25",
  follow_up:
    "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25",
  event:
    "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25",
  holiday:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
}

export const kindIconColor: Record<CalendarKind, string> = {
  register_interest: "text-amber-500 dark:text-amber-400",
  google_meet: "text-blue-500 dark:text-blue-400",
  follow_up: "text-purple-500 dark:text-purple-400",
  event: "text-rose-500 dark:text-rose-400",
  holiday: "text-emerald-500 dark:text-emerald-400",
}

export function CategoryIcon({
  kind,
  className,
}: {
  kind: CalendarKind
  className?: string
}) {
  const Icon = kindIcons[kind] || CalendarDays
  return <Icon className={className} />
}

const kindStyle = Object.fromEntries(
  calendarKinds.map((kind) => [kind.value, kind])
) as Record<CalendarKind, (typeof calendarKinds)[number]>

const kindActiveToggle: Record<CalendarKind, string> = {
  register_interest:
    "data-[state=on]:bg-amber-500/12 data-[state=on]:border-amber-500/40 data-[state=on]:shadow-2xs",
  google_meet:
    "data-[state=on]:bg-blue-500/12 data-[state=on]:border-blue-500/40 data-[state=on]:shadow-2xs",
  follow_up:
    "data-[state=on]:bg-purple-500/12 data-[state=on]:border-purple-500/40 data-[state=on]:shadow-2xs",
  event:
    "data-[state=on]:bg-rose-500/12 data-[state=on]:border-rose-500/40 data-[state=on]:shadow-2xs",
  holiday:
    "data-[state=on]:bg-emerald-500/12 data-[state=on]:border-emerald-500/40 data-[state=on]:shadow-2xs",
}

const kindCardBg: Record<CalendarKind, string> = {
  register_interest:
    "bg-amber-500/8 hover:bg-amber-500/15 border-amber-500/25 dark:bg-amber-500/10",
  google_meet:
    "bg-blue-500/8 hover:bg-blue-500/15 border-blue-500/25 dark:bg-blue-500/10",
  follow_up:
    "bg-purple-500/8 hover:bg-purple-500/15 border-purple-500/25 dark:bg-purple-500/10",
  event:
    "bg-rose-500/8 hover:bg-rose-500/15 border-rose-500/25 dark:bg-rose-500/10",
  holiday:
    "bg-emerald-500/8 hover:bg-emerald-500/15 border-emerald-500/25 dark:bg-emerald-500/10",
}

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
  const item = info.event.extendedProps as CalendarItem | undefined
  const kind = item?.kind
  return (
    <div className="fc-event-chip">
      {kind && (
        <CategoryIcon kind={kind} className="size-3 shrink-0 opacity-90" />
      )}
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
    <div className="flex flex-col gap-2.5 pb-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={cn(
            "rounded-xl border p-3 text-left shadow-2xs transition-all hover:shadow-xs",
            kindCardBg[item.kind] ||
              "border-border bg-muted/40 hover:bg-muted/70"
          )}
          onClick={() => onSelect(item)}
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md",
                  kindIconBg[item.kind]
                )}
              >
                <CategoryIcon kind={item.kind} className="size-3.5" />
              </div>
              <span className="truncate text-sm font-semibold text-foreground">
                {item.title}
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 px-1.5 py-0 text-[10px] font-semibold",
                kindStyle[item.kind]?.badge
              )}
            >
              {kindStyle[item.kind]?.label}
            </Badge>
          </div>

          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarClock className="size-3.5 text-muted-foreground/80" />
            {formatItemWhen(item)}
          </p>
        </button>
      ))}
    </div>
  )
}

interface FormErrors {
  title?: string
  kind?: string
  date?: string
  startTime?: string
  endTime?: string
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
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<CalendarItem | null>(null)

  // Popover open states
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isTrackingMembersOpen, setIsTrackingMembersOpen] = useState(false)
  const [isEditTrackingMembersOpen, setIsEditTrackingMembersOpen] =
    useState(false)
  const [isEditDateOpen, setIsEditDateOpen] = useState(false)

  // Form states
  const [formTitle, setFormTitle] = useState("")
  const [formKind, setFormKind] = useState<CalendarKind>("google_meet")
  const [selectedMatchedPair, setSelectedMatchedPair] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formStartTime, setFormStartTime] = useState("")
  const [formEndTime, setFormEndTime] = useState("")
  const [formPerson, setFormPerson] = useState("")
  const [formLocation, setFormLocation] = useState("Google Meet")
  const [formMeetUrl, setFormMeetUrl] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formErrors, setFormErrors] = useState<FormErrors>({})

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
    const today = startOfDay(new Date())

    if (clickedDate < today) {
      toast.error("Cannot book appointments on past dates.")
      return
    }

    if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) {
      toast.error("Appointments are available Monday to Friday only.")
      return
    }

    if (isDateBookedMock(clickedDate)) {
      toast.error("This date is fully booked. Please select an available date.")
      return
    }

    const dateStr = clickedDate.toISOString().split("T")[0]
    setFormDate(dateStr)

    if (!info.allDay) {
      const hours = String(clickedDate.getHours()).padStart(2, "0")
      const mins = String(clickedDate.getMinutes()).padStart(2, "0")
      const slotTime = `${hours}:${mins}`
      if (hours >= "10" && hours < "20") {
        setFormStartTime(slotTime)
        setFormEndTime(get30MinEndTime(slotTime))
      } else {
        setFormStartTime("10:00")
        setFormEndTime("10:30")
      }
    } else {
      setFormStartTime("10:00")
      setFormEndTime("10:30")
    }

    setFormTitle("")
    setFormPerson("")
    setFormLocation("Google Meet")
    setFormMeetUrl("")
    setFormPhone("")
    setFormDescription("")
    setFormKind("google_meet")
    setSelectedMatchedPair("")
    setFormErrors({})
    setIsDateOpen(false)
    setIsCreateOpen(true)
  }

  function handleOpenCreate() {
    setFormDate("")
    setFormStartTime("")
    setFormEndTime("")
    setFormTitle("")
    setFormPerson("")
    setFormLocation("Google Meet")
    setFormMeetUrl("")
    setFormPhone("")
    setFormDescription("")
    setFormKind("google_meet")
    setSelectedMatchedPair("")
    setFormErrors({})
    setIsCreateOpen(true)
  }

  function validateForm(): boolean {
    const errors: FormErrors = {}
    if (!formTitle.trim()) {
      errors.title = "Appointment title is required"
    }
    if (!formKind) {
      errors.kind = "Category is required"
    }
    if (!formDate.trim()) {
      errors.date = "Please pick a date"
    }
    if (!formStartTime.trim()) {
      errors.startTime = "Start time is required"
    }
    if (!formEndTime.trim()) {
      errors.endTime = "End time is required"
    } else if (
      formStartTime.trim() &&
      formEndTime.localeCompare(formStartTime) <= 0
    ) {
      errors.endTime = "End time must be after start time"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return false
    }

    setFormErrors({})
    return true
  }

  function handleCreateEvent() {
    if (!validateForm()) return

    const start = `${formDate}T${formStartTime}:00`
    const end = `${formDate}T${formEndTime}:00`

    const newItem: CalendarItem = {
      id: `custom-${Date.now()}`,
      title: formTitle.trim(),
      start,
      end,
      kind: formKind,
      description: formDescription.trim() || "Scheduled appointment",
    }

    setItems((prev) => [newItem, ...prev])
    toast.success(`Appointment "${newItem.title}" scheduled successfully!`)
    setIsCreateOpen(false)
  }

  function handleOpenEdit(item: CalendarItem) {
    setSelected(null)
    setEditingItem(item)
    setFormTitle(item.title)
    setFormKind(item.kind)
    const startDate = new Date(item.start)
    setFormDate(startDate.toISOString().split("T")[0])
    setFormStartTime(
      startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    )
    if (item.end) {
      const endDate = new Date(item.end)
      setFormEndTime(
        endDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
    } else {
      setFormEndTime("10:45")
    }
    setFormPerson(item.person || "")
    setFormLocation(item.location || "Google Meet")
    setFormMeetUrl(item.meetUrl || "")
    setFormPhone(item.phone || "")
    setFormDescription(item.description || "")
    setFormErrors({})
    setIsEditDateOpen(false)
    setIsEditOpen(true)
  }

  function handleSaveEdit() {
    if (!editingItem) return
    if (!validateForm()) return

    const start = `${formDate}T${formStartTime}:00`
    const end = `${formDate}T${formEndTime}:00`

    const updatedItem: CalendarItem = {
      ...editingItem,
      title: formTitle.trim(),
      start,
      end,
      kind: formKind,
      description: formDescription.trim() || "Scheduled appointment",
    }

    setItems((prev) =>
      prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
    )
    toast.success("Appointment updated successfully.")
    setIsEditOpen(false)
    setEditingItem(null)
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
  const totalRegisterInterest = items.filter(
    (i) => i.kind === "register_interest"
  ).length

  return (
    <div className="space-y-6">
      {/* METRIC STATS OVERVIEW */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Today&apos;s Appointments
              </p>
              <h3 className="text-gradient mt-1 text-2xl font-bold">
                {todayItems.length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarClock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {todayItems.length === 0
              ? "No items scheduled today"
              : `${todayItems.length} active sessions today`}
          </p>
        </Card>

        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Google Meet Calls
              </p>
              <h3 className="mt-1 text-2xl font-bold text-blue-500">
                {totalGoogleMeet}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Video className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Candidate video consultations
          </p>
        </Card>

        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Interest Callbacks
              </p>
              <h3 className="mt-1 text-2xl font-bold text-amber-500">
                {totalRegisterInterest}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Users2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Inbound candidate follow-ups
          </p>
        </Card>

        <Card className="border-border/60 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                This Week Total
              </p>
              <h3 className="mt-1 text-2xl font-bold text-rose-500">
                {weekItems.length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Scheduled through Sunday
          </p>
        </Card>
      </div>

      {/* MAIN CALENDAR & SIDEBAR GRID */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* CALENDAR MAIN CARD */}
        <Card className="overflow-hidden py-0 shadow-sm">
          <CardHeader className="gap-3.5 border-b px-6 py-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Calendar</CardTitle>
              <CardDescription className="text-sm">
                Manage consultations, Google Meet video dates, and follow-up
                schedules.
              </CardDescription>
            </div>

            {/* CONTROLS ROW UNDER SUBTITLE */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              {/* SEARCH INPUT */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search calendar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                    className="h-9 px-3 text-sm font-medium"
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
                  <TabsList className="h-9">
                    {views.map((view) => (
                      <TabsTrigger
                        key={view.value}
                        value={view.value}
                        variant="gradient"
                        className="h-7 px-2.5 text-xs font-medium"
                      >
                        {view.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* NEW APPOINTMENT BUTTON */}
                <Button
                  size="sm"
                  className="btn-gradient h-9 gap-1.5 px-3.5 text-sm font-medium"
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
            <CardHeader className="px-6 pt-5 pb-3">
              <CardTitle className="text-base font-semibold">
                Categories & Filters
              </CardTitle>
              <CardDescription className="text-sm">
                Click to filter categories on the calendar.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 px-6 pb-5">
              {counts.map((kind) => {
                const isSelected = visibleKinds.includes(kind.value)
                return (
                  <Toggle
                    key={kind.value}
                    pressed={isSelected}
                    onPressedChange={() => toggleKind(kind.value)}
                    variant="outline"
                    className={cn(
                      "h-auto w-full justify-start gap-3 p-3 text-left transition-all",
                      "border-border/60 bg-card/40 hover:border-border hover:bg-muted/40",
                      "data-[state=off]:opacity-55 hover:data-[state=off]:bg-muted/30 hover:data-[state=off]:opacity-90",
                      kindActiveToggle[kind.value]
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                        isSelected
                          ? kindIconBg[kind.value]
                          : "border border-border/40 bg-muted/60 text-muted-foreground"
                      )}
                    >
                      <CategoryIcon kind={kind.value} className="size-4" />
                    </div>

                    <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                      <span className="text-sm font-semibold text-foreground">
                        {kind.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {kind.hint}
                      </span>
                    </span>

                    <Badge
                      variant="secondary"
                      className={cn(
                        "px-2 py-0.5 font-mono text-xs font-bold transition-all",
                        isSelected
                          ? "border-transparent bg-foreground/10 text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {kind.count}
                    </Badge>
                  </Toggle>
                )
              })}
            </CardContent>
          </Card>

          {/* AGENDA ACCORDION */}
          <Card className="flex-1 shadow-xs">
            <CardHeader className="px-6 pt-5 pb-3">
              <CardTitle className="text-base font-semibold">Agenda</CardTitle>
              <CardDescription className="text-sm">
                Quick review of today, tomorrow, and this week.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-5">
              <Accordion
                type="single"
                collapsible
                defaultValue="today"
                className="space-y-3"
              >
                {/* TODAY */}
                <AccordionItem
                  value="today"
                  className="rounded-xl border bg-card px-3.5 shadow-2xs transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/15"
                >
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                      <span className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-foreground">
                          Today
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {formatDayLabel(today)}
                        </span>
                      </span>
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 font-mono text-xs font-bold"
                      >
                        {todayItems.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-3">
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
                  className="rounded-xl border bg-card px-3.5 shadow-2xs transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/15"
                >
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                      <span className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-foreground">
                          {tomorrowLabel}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {tomorrowIsSkippedWeekend
                            ? `Next business day · ${formatDayLabel(tomorrowFocus)}`
                            : formatDayLabel(tomorrowFocus)}
                        </span>
                      </span>
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 font-mono text-xs font-bold"
                      >
                        {tomorrowItems.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-3">
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
                  className="rounded-xl border bg-card px-3.5 shadow-2xs transition-all data-[state=open]:border-primary/40 data-[state=open]:bg-muted/15"
                >
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                      <span className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-foreground">
                          This week
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {formatDayLabel(startOfWeekMonday(today))} –{" "}
                          {formatDayLabel(
                            new Date(endOfWeekSunday(today).getTime() - 1)
                          )}
                        </span>
                      </span>
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 font-mono text-xs font-bold"
                      >
                        {weekItems.length}
                      </Badge>
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-3">
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
                    className={cn(
                      "w-fit gap-1.5 px-2.5 py-1 text-xs font-semibold",
                      kindStyle[selected.kind]?.badge
                    )}
                  >
                    <CategoryIcon kind={selected.kind} className="size-3.5" />
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
              {selected.description && (
                <div className="space-y-2 rounded-xl border bg-muted/20 p-4 text-sm">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Note
                  </span>
                  <p className="leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {selected.description}
                  </p>
                </div>
              )}

              {/* Direct Action Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selected.meetUrl && (
                  <Button
                    size="sm"
                    className="btn-gradient h-9 gap-1.5 px-3.5 text-sm font-medium"
                    asChild
                  >
                    <a
                      href={selected.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-3.5 w-3.5" /> Join Google Meet
                    </a>
                  </Button>
                )}

                {selected.phone && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 gap-1.5 px-3.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
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
                  className="h-9 gap-1.5 px-3.5 text-sm font-medium"
                  onClick={() => handleOpenEdit(selected)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 text-sm font-semibold text-muted-foreground hover:text-destructive"
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-lg font-bold">
              Schedule New Appointment
            </DialogTitle>
            <DialogDescription className="text-sm">
              Add a candidate consultation, Google Meet session, or follow-up
              note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2 text-sm">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  formErrors.title ? "text-destructive" : "text-foreground"
                )}
              >
                Title *
              </label>
              <div className="relative">
                <PenLine
                  className={cn(
                    "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors",
                    formErrors.title
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                />
                <Input
                  placeholder="e.g. Video Intro · Alex J. & Supansa T."
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value)
                    if (formErrors.title) {
                      setFormErrors((prev) => ({ ...prev, title: undefined }))
                    }
                  }}
                  aria-invalid={Boolean(formErrors.title)}
                  className={cn(
                    "h-10 pl-9 text-sm",
                    formErrors.title &&
                      "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
              </div>
              {formErrors.title && (
                <p className="text-xs font-medium text-destructive">
                  {formErrors.title}
                </p>
              )}
            </div>

            {/* Category Select Dropdown */}
            <div className="flex flex-col gap-2">
              <label
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  formErrors.kind ? "text-destructive" : "text-foreground"
                )}
              >
                Category *
              </label>
              <Select
                value={formKind}
                onValueChange={(val) => {
                  setFormKind(val as CalendarKind)
                  if (formErrors.kind) {
                    setFormErrors((prev) => ({ ...prev, kind: undefined }))
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "h-10 text-sm",
                    formErrors.kind && "border-destructive text-destructive"
                  )}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {calendarKinds.map((k) => (
                    <SelectItem
                      key={k.value}
                      value={k.value}
                      disabled={k.value === "register_interest"}
                      className="text-sm"
                    >
                      <div className="flex w-full items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-md",
                              kindIconBg[k.value]
                            )}
                          >
                            <CategoryIcon kind={k.value} className="size-3.5" />
                          </div>
                          <span className="font-medium text-foreground">
                            {k.label}
                          </span>
                        </div>
                        {k.value === "register_interest" && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                            Auto-booked
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.kind && (
                <p className="text-xs font-medium text-destructive">
                  {formErrors.kind}
                </p>
              )}
            </div>

            {/* Tracking Members Selection for Google Meet (Searchable Combobox) */}
            {formKind === "google_meet" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold tracking-tight text-foreground">
                  Tracking Members
                </label>

                <Popover
                  open={isTrackingMembersOpen}
                  onOpenChange={setIsTrackingMembersOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={isTrackingMembersOpen}
                      className={cn(
                        "h-auto min-h-12 w-full justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-left text-sm font-normal hover:bg-muted/40 dark:bg-input/30",
                        !selectedMatchedPair && "text-muted-foreground"
                      )}
                    >
                      {selectedMatchedPair ? (
                        (() => {
                          const pair = mockMatchedPairs.find(
                            (p) => p.id === selectedMatchedPair
                          )
                          if (!pair)
                            return "Select tracking members for Google Meet..."
                          return (
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex items-center gap-2">
                                <Avatar className="size-7 shrink-0 border border-[#D3A753] shadow-xs">
                                  <AvatarImage src={pair.male.avatar} />
                                  <AvatarFallback className="text-xs font-semibold">
                                    {pair.male.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate text-sm font-semibold text-foreground">
                                  {pair.male.prefix} {pair.male.name}
                                </span>
                              </div>
                              <span className="px-0.5 text-sm font-bold text-muted-foreground">
                                &
                              </span>
                              <div className="flex items-center gap-2">
                                <Avatar className="size-7 shrink-0 border border-[#E791A7] shadow-xs">
                                  <AvatarImage src={pair.female.avatar} />
                                  <AvatarFallback className="text-xs font-semibold">
                                    {pair.female.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate text-sm font-semibold text-foreground">
                                  {pair.female.prefix} {pair.female.name}
                                </span>
                              </div>
                            </div>
                          )
                        })()
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users2 className="size-4" />
                          <span>
                            Select tracking members for Google Meet...
                          </span>
                        </div>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0"
                    align="start"
                  >
                    <Command
                      filter={(value, search) => {
                        const pair = mockMatchedPairs.find(
                          (p) => p.id === value
                        )
                        if (!pair) return 0
                        const query = search.toLowerCase()
                        const textToMatch =
                          `${pair.male.name} ${pair.male.prefix} ${pair.female.name} ${pair.female.prefix} ${pair.lastCompletedStatus} ${pair.completedAt} ${pair.trackingId}`.toLowerCase()
                        return textToMatch.includes(query) ? 1 : 0
                      }}
                    >
                      <CommandInput placeholder="Search by male, female, or status..." />
                      <CommandList className="max-h-72">
                        <CommandEmpty>No tracking members found.</CommandEmpty>
                        <CommandGroup>
                          {[...mockMatchedPairs]
                            .sort(
                              (a, b) =>
                                new Date(a.completedDate).getTime() -
                                new Date(b.completedDate).getTime()
                            )
                            .map((pair) => (
                              <CommandItem
                                key={pair.id}
                                value={pair.id}
                                onSelect={(val) => {
                                  setSelectedMatchedPair(val)
                                  setFormTitle(pair.meetTitle)
                                  setFormPerson(
                                    `${pair.male.prefix} ${pair.male.name} & ${pair.female.prefix} ${pair.female.name}`
                                  )
                                  setFormMeetUrl(
                                    `https://meet.google.com/tsm-${pair.trackingId.toLowerCase()}`
                                  )
                                  setIsTrackingMembersOpen(false)
                                  if (formErrors.title) {
                                    setFormErrors((prev) => ({
                                      ...prev,
                                      title: undefined,
                                    }))
                                  }
                                }}
                                className="cursor-pointer px-3 py-2.5"
                              >
                                <div className="flex w-full flex-col gap-1.5 text-left">
                                  {/* Row 1: Avatars + Member Names */}
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="size-7.5 shrink-0 border border-[#D3A753] shadow-xs">
                                        <AvatarImage src={pair.male.avatar} />
                                        <AvatarFallback className="text-xs font-semibold">
                                          {pair.male.name
                                            .slice(0, 2)
                                            .toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="truncate text-sm font-semibold text-foreground">
                                        {pair.male.prefix} {pair.male.name}
                                      </span>
                                    </div>

                                    <span className="px-0.5 text-sm font-bold text-muted-foreground">
                                      &
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <Avatar className="size-7.5 shrink-0 border border-[#E791A7] shadow-xs">
                                        <AvatarImage src={pair.female.avatar} />
                                        <AvatarFallback className="text-xs font-semibold">
                                          {pair.female.name
                                            .slice(0, 2)
                                            .toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="truncate text-sm font-semibold text-foreground">
                                        {pair.female.prefix} {pair.female.name}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Row 2: Last Completed Status (left) & Date Time (end right) */}
                                  <div className="flex w-full items-center justify-between gap-2 pl-0.5 text-xs">
                                    <div className="flex min-w-0 items-center gap-1.5">
                                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                                      <span className="truncate font-semibold text-emerald-600 dark:text-emerald-400">
                                        {pair.lastCompletedStatus}
                                      </span>
                                    </div>
                                    <span className="shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                                      {pair.completedAt}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Date (One full row) */}
            <div className="flex flex-col gap-2">
              <label
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  formErrors.date ? "text-destructive" : "text-foreground"
                )}
              >
                Date *{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Mon – Fri)
                </span>
              </label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-10 w-full justify-start rounded-lg border border-input bg-transparent px-3 text-left text-sm font-normal hover:bg-muted/40 dark:bg-input/30",
                      !formDate && "text-muted-foreground",
                      formErrors.date &&
                        "border-destructive text-destructive focus-visible:ring-destructive/20"
                    )}
                  >
                    <CalendarIcon
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        formErrors.date
                          ? "text-destructive"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="truncate">
                      {formDate
                        ? format(
                            new Date(formDate + "T00:00:00"),
                            "EEEE, dd MMMM yyyy"
                          )
                        : "Pick appointment date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-1.5" align="start">
                  <div>
                    <CalendarPicker
                      mode="single"
                      selected={
                        formDate ? new Date(formDate + "T00:00:00") : undefined
                      }
                      disabled={[
                        { before: startOfDay(new Date()) },
                        (date) => isDateBookedMock(date),
                      ]}
                      modifiers={{
                        available: (date) => isDateAvailableMock(date),
                        booked: (date) =>
                          isDateBookedMock(date) &&
                          date >= startOfDay(new Date()),
                      }}
                      modifiersClassNames={{
                        available:
                          "[&>button]:text-emerald-600 [&>button]:dark:text-emerald-400 [&>button]:font-semibold relative after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-emerald-500",
                        booked:
                          "[&>button]:text-rose-500 [&>button]:dark:text-rose-400 [&>button]:line-through relative after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-rose-500",
                      }}
                      onSelect={(d) => {
                        if (d) {
                          setFormDate(format(d, "yyyy-MM-dd"))
                          setFormStartTime("")
                          setFormEndTime("")
                          if (formErrors.date) {
                            setFormErrors((prev) => ({
                              ...prev,
                              date: undefined,
                            }))
                          }
                        }
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              {formErrors.date && (
                <p className="text-xs font-medium text-destructive">
                  {formErrors.date}
                </p>
              )}
            </div>

            {/* Times (One row with 2 columns: Start Time & End Time) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Start Time */}
              <div className="flex flex-col gap-2">
                <label
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    formErrors.startTime
                      ? "text-destructive"
                      : "text-foreground"
                  )}
                >
                  Start Time *{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (10:00 – 20:00)
                  </span>
                </label>
                <Select
                  value={formStartTime}
                  disabled={!formDate}
                  onValueChange={(val) => {
                    setFormStartTime(val)
                    const autoEnd = get30MinEndTime(val)
                    setFormEndTime(autoEnd)
                    if (formErrors.startTime || formErrors.endTime) {
                      setFormErrors((prev) => ({
                        ...prev,
                        startTime: undefined,
                        endTime: undefined,
                      }))
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "h-10 font-mono text-sm",
                      formErrors.startTime &&
                        "border-destructive text-destructive",
                      !formDate && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock
                        className={cn(
                          "size-4 shrink-0",
                          formErrors.startTime
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      />
                      <SelectValue
                        placeholder={
                          !formDate ? "Pick date first" : "Select start"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <div className="mb-1 flex items-center justify-between border-b px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" />
                        <span>Business Hours: </span>
                      </span>
                      <span className="font-bold text-foreground">
                        10:00 – 20:00
                      </span>
                    </div>
                    {TIME_SLOTS_30MIN.map((time) => {
                      const isBooked = isTimeSlotBookedMock(formDate, time)
                      return (
                        <SelectItem
                          key={time}
                          value={time}
                          disabled={isBooked}
                          className="font-mono text-sm"
                        >
                          <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                              <span className="font-semibold">{time}</span>
                            </div>
                            {isBooked ? (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-rose-500">
                                <span className="size-1.5 rounded-full bg-rose-500" />{" "}
                                Full
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500" />{" "}
                                Available
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {formErrors.startTime && (
                  <p className="text-xs font-medium text-destructive">
                    {formErrors.startTime}
                  </p>
                )}
              </div>

              {/* End Time / Duration Selection */}
              <div className="flex flex-col gap-2">
                <label
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    formErrors.endTime ? "text-destructive" : "text-foreground"
                  )}
                >
                  End Time *{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (30m slot)
                  </span>
                </label>
                <Select
                  value={formEndTime}
                  disabled={!formDate || !formStartTime}
                  onValueChange={(val) => {
                    setFormEndTime(val)
                    if (formErrors.endTime) {
                      setFormErrors((prev) => ({ ...prev, endTime: undefined }))
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "h-10 font-mono text-sm",
                      formErrors.endTime &&
                        "border-destructive text-destructive",
                      (!formDate || !formStartTime) &&
                        "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock
                        className={cn(
                          "size-4 shrink-0",
                          formErrors.endTime
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      />
                      <SelectValue
                        placeholder={
                          !formStartTime ? "Select start first" : "Select end"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <div className="mb-1 flex items-center gap-1.5 border-b px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">
                      <Clock className="size-3.5 text-primary" />
                      <span>
                        Business Hours:{" "}
                        <strong className="text-foreground">
                          10:00 – 20:00
                        </strong>
                      </span>
                    </div>
                    {END_TIME_OPTIONS.filter(
                      (time) =>
                        !formStartTime || time.localeCompare(formStartTime) > 0
                    ).map((time) => {
                      const [sh, sm] = (formStartTime || "10:00")
                        .split(":")
                        .map(Number)
                      const [eh, em] = time.split(":").map(Number)
                      const durationMins = eh * 60 + em - (sh * 60 + sm)
                      const durationLabel =
                        durationMins === 30
                          ? "30 min"
                          : `${durationMins / 60} hr`

                      return (
                        <SelectItem
                          key={time}
                          value={time}
                          className="font-mono text-sm"
                        >
                          <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                              <span className="font-semibold">{time}</span>
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground">
                              ({durationLabel})
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {formErrors.endTime && (
                  <p className="text-xs font-medium text-destructive">
                    {formErrors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Note Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold tracking-tight text-foreground">
                Note{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Optional)
                </span>
              </label>
              <Textarea
                placeholder="Add notes, agenda, or reminders for this appointment..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                className="min-h-[100px] resize-none text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3">
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-lg font-bold">
              Edit Appointment
            </DialogTitle>
            <DialogDescription className="text-sm">
              Update appointment title, category, date, time, or note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2 text-sm">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  formErrors.title ? "text-destructive" : "text-foreground"
                )}
              >
                Title *
              </label>
              <div className="relative">
                <PenLine
                  className={cn(
                    "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors",
                    formErrors.title
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                />
                <Input
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value)
                    if (formErrors.title) {
                      setFormErrors((prev) => ({ ...prev, title: undefined }))
                    }
                  }}
                  aria-invalid={Boolean(formErrors.title)}
                  className={cn(
                    "h-10 pl-9 text-sm",
                    formErrors.title &&
                      "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
              </div>
              {formErrors.title && (
                <p className="text-xs font-medium text-destructive">
                  {formErrors.title}
                </p>
              )}
            </div>

            {/* Category Select Dropdown */}
            <div className="flex flex-col gap-2">
              <label
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  formErrors.kind ? "text-destructive" : "text-foreground"
                )}
              >
                Category *
              </label>
              <Select
                value={formKind}
                onValueChange={(val) => {
                  setFormKind(val as CalendarKind)
                  if (formErrors.kind) {
                    setFormErrors((prev) => ({ ...prev, kind: undefined }))
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "h-10 text-sm",
                    formErrors.kind && "border-destructive text-destructive"
                  )}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {calendarKinds.map((k) => (
                    <SelectItem
                      key={k.value}
                      value={k.value}
                      disabled={k.value === "register_interest"}
                      className="text-sm"
                    >
                      <div className="flex w-full items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-md",
                              kindIconBg[k.value]
                            )}
                          >
                            <CategoryIcon kind={k.value} className="size-3.5" />
                          </div>
                          <span className="font-medium text-foreground">
                            {k.label}
                          </span>
                        </div>
                        {k.value === "register_interest" && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                            Auto-booked
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.kind && (
                <p className="text-xs font-medium text-destructive">
                  {formErrors.kind}
                </p>
              )}
            </div>

            {/* Tracking Members Selection for Google Meet (Searchable Combobox) */}
            {formKind === "google_meet" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold tracking-tight text-foreground">
                  Tracking Members
                </label>

                <Popover
                  open={isTrackingMembersOpen}
                  onOpenChange={setIsTrackingMembersOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={isTrackingMembersOpen}
                      className={cn(
                        "h-auto min-h-12 w-full justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-left text-sm font-normal hover:bg-muted/40 dark:bg-input/30",
                        !selectedMatchedPair && "text-muted-foreground"
                      )}
                    >
                      {selectedMatchedPair ? (
                        (() => {
                          const pair = mockMatchedPairs.find(
                            (p) => p.id === selectedMatchedPair
                          )
                          if (!pair)
                            return "Select tracking members for Google Meet..."
                          return (
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div className="flex items-center gap-2">
                                <Avatar className="size-7 shrink-0 border border-[#D3A753] shadow-xs">
                                  <AvatarImage src={pair.male.avatar} />
                                  <AvatarFallback className="text-xs font-semibold">
                                    {pair.male.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate text-sm font-semibold text-foreground">
                                  {pair.male.prefix} {pair.male.name}
                                </span>
                              </div>
                              <span className="px-0.5 text-sm font-bold text-muted-foreground">
                                &
                              </span>
                              <div className="flex items-center gap-2">
                                <Avatar className="size-7 shrink-0 border border-[#E791A7] shadow-xs">
                                  <AvatarImage src={pair.female.avatar} />
                                  <AvatarFallback className="text-xs font-semibold">
                                    {pair.female.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate text-sm font-semibold text-foreground">
                                  {pair.female.prefix} {pair.female.name}
                                </span>
                              </div>
                            </div>
                          )
                        })()
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users2 className="size-4" />
                          <span>
                            Select tracking members for Google Meet...
                          </span>
                        </div>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0"
                    align="start"
                  >
                    <Command
                      filter={(value, search) => {
                        const pair = mockMatchedPairs.find(
                          (p) => p.id === value
                        )
                        if (!pair) return 0
                        const query = search.toLowerCase()
                        const textToMatch =
                          `${pair.male.name} ${pair.male.prefix} ${pair.female.name} ${pair.female.prefix} ${pair.lastCompletedStatus} ${pair.completedAt} ${pair.trackingId}`.toLowerCase()
                        return textToMatch.includes(query) ? 1 : 0
                      }}
                    >
                      <CommandInput placeholder="Search by male, female, or status..." />
                      <CommandList className="max-h-72">
                        <CommandEmpty>No tracking members found.</CommandEmpty>
                        <CommandGroup>
                          {[...mockMatchedPairs]
                            .sort(
                              (a, b) =>
                                new Date(a.completedDate).getTime() -
                                new Date(b.completedDate).getTime()
                            )
                            .map((pair) => (
                              <CommandItem
                                key={pair.id}
                                value={pair.id}
                                onSelect={(val) => {
                                  setSelectedMatchedPair(val)
                                  setFormTitle(pair.meetTitle)
                                  setFormPerson(
                                    `${pair.male.prefix} ${pair.male.name} & ${pair.female.prefix} ${pair.female.name}`
                                  )
                                  setFormMeetUrl(
                                    `https://meet.google.com/tsm-${pair.trackingId.toLowerCase()}`
                                  )
                                  setIsTrackingMembersOpen(false)
                                  if (formErrors.title) {
                                    setFormErrors((prev) => ({
                                      ...prev,
                                      title: undefined,
                                    }))
                                  }
                                }}
                                className="cursor-pointer px-3 py-2.5"
                              >
                                <div className="flex w-full flex-col gap-1.5 text-left">
                                  {/* Row 1: Avatars + Member Names */}
                                  <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="size-7.5 shrink-0 border border-[#D3A753] shadow-xs">
                                        <AvatarImage src={pair.male.avatar} />
                                        <AvatarFallback className="text-xs font-semibold">
                                          {pair.male.name
                                            .slice(0, 2)
                                            .toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="truncate text-sm font-semibold text-foreground">
                                        {pair.male.prefix} {pair.male.name}
                                      </span>
                                    </div>

                                    <span className="px-0.5 text-sm font-bold text-muted-foreground">
                                      &
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <Avatar className="size-7.5 shrink-0 border border-[#E791A7] shadow-xs">
                                        <AvatarImage src={pair.female.avatar} />
                                        <AvatarFallback className="text-xs font-semibold">
                                          {pair.female.name
                                            .slice(0, 2)
                                            .toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="truncate text-sm font-semibold text-foreground">
                                        {pair.female.prefix} {pair.female.name}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Row 2: Last Completed Status (left) & Date Time (end right) */}
                                  <div className="flex w-full items-center justify-between gap-2 pl-0.5 text-xs">
                                    <div className="flex min-w-0 items-center gap-1.5">
                                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                                      <span className="truncate font-semibold text-emerald-600 dark:text-emerald-400">
                                        {pair.lastCompletedStatus}
                                      </span>
                                    </div>
                                    <span className="shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                                      {pair.completedAt}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Date (One full row) */}
            <div className="flex flex-col gap-2">
              <label
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  formErrors.date ? "text-destructive" : "text-foreground"
                )}
              >
                Date *{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Mon – Fri)
                </span>
              </label>
              <Popover open={isEditDateOpen} onOpenChange={setIsEditDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-10 w-full justify-start rounded-lg border border-input bg-transparent px-3 text-left text-sm font-normal hover:bg-muted/40 dark:bg-input/30",
                      !formDate && "text-muted-foreground",
                      formErrors.date &&
                        "border-destructive text-destructive focus-visible:ring-destructive/20"
                    )}
                  >
                    <CalendarIcon
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        formErrors.date
                          ? "text-destructive"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="truncate">
                      {formDate
                        ? format(
                            new Date(formDate + "T00:00:00"),
                            "EEEE, dd MMMM yyyy"
                          )
                        : "Pick appointment date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-1.5" align="start">
                  <div>
                    <CalendarPicker
                      mode="single"
                      selected={
                        formDate ? new Date(formDate + "T00:00:00") : undefined
                      }
                      disabled={[
                        { before: startOfDay(new Date()) },
                        (date) => isDateBookedMock(date),
                      ]}
                      modifiers={{
                        available: (date) => isDateAvailableMock(date),
                        booked: (date) =>
                          isDateBookedMock(date) &&
                          date >= startOfDay(new Date()),
                      }}
                      modifiersClassNames={{
                        available:
                          "[&>button]:text-emerald-600 [&>button]:dark:text-emerald-400 [&>button]:font-semibold relative after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-emerald-500",
                        booked:
                          "[&>button]:text-rose-500 [&>button]:dark:text-rose-400 [&>button]:line-through relative after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-rose-500",
                      }}
                      onSelect={(d) => {
                        if (d) {
                          setFormDate(format(d, "yyyy-MM-dd"))
                          setFormStartTime("")
                          setFormEndTime("")
                          if (formErrors.date) {
                            setFormErrors((prev) => ({
                              ...prev,
                              date: undefined,
                            }))
                          }
                        }
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              {formErrors.date && (
                <p className="text-xs font-medium text-destructive">
                  {formErrors.date}
                </p>
              )}
            </div>

            {/* Times (One row with 2 columns: Start Time & End Time) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Start Time */}
              <div className="flex flex-col gap-2">
                <label
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    formErrors.startTime
                      ? "text-destructive"
                      : "text-foreground"
                  )}
                >
                  Start Time *{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (10:00 – 20:00)
                  </span>
                </label>
                <Select
                  value={formStartTime}
                  disabled={!formDate}
                  onValueChange={(val) => {
                    setFormStartTime(val)
                    const autoEnd = get30MinEndTime(val)
                    setFormEndTime(autoEnd)
                    if (formErrors.startTime || formErrors.endTime) {
                      setFormErrors((prev) => ({
                        ...prev,
                        startTime: undefined,
                        endTime: undefined,
                      }))
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "h-10 font-mono text-sm",
                      formErrors.startTime &&
                        "border-destructive text-destructive",
                      !formDate && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock
                        className={cn(
                          "size-4 shrink-0",
                          formErrors.startTime
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      />
                      <SelectValue
                        placeholder={
                          !formDate ? "Pick date first" : "Select start"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-52">
                    {TIME_SLOTS_30MIN.map((time) => {
                      const isBooked = isTimeSlotBookedMock(formDate, time)
                      return (
                        <SelectItem
                          key={time}
                          value={time}
                          disabled={isBooked}
                          className="font-mono text-sm"
                        >
                          <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                              <span className="font-semibold">{time}</span>
                            </div>
                            {isBooked ? (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-rose-500">
                                <span className="size-1.5 rounded-full bg-rose-500" />{" "}
                                Full
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="size-1.5 rounded-full bg-emerald-500" />{" "}
                                Available
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {formErrors.startTime && (
                  <p className="text-xs font-medium text-destructive">
                    {formErrors.startTime}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div className="flex flex-col gap-2">
                <label
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    formErrors.endTime ? "text-destructive" : "text-foreground"
                  )}
                >
                  End Time *{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (30m slot)
                  </span>
                </label>
                <Select
                  value={formEndTime}
                  disabled={!formDate || !formStartTime}
                  onValueChange={(val) => {
                    setFormEndTime(val)
                    if (formErrors.endTime) {
                      setFormErrors((prev) => ({ ...prev, endTime: undefined }))
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "h-10 font-mono text-sm",
                      formErrors.endTime &&
                        "border-destructive text-destructive",
                      (!formDate || !formStartTime) &&
                        "cursor-not-allowed opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock
                        className={cn(
                          "size-4 shrink-0",
                          formErrors.endTime
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      />
                      <SelectValue
                        placeholder={
                          !formStartTime ? "Select start first" : "Select end"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-52">
                    {END_TIME_OPTIONS.filter(
                      (time) =>
                        !formStartTime || time.localeCompare(formStartTime) > 0
                    ).map((time) => {
                      const [sh, sm] = (formStartTime || "10:00")
                        .split(":")
                        .map(Number)
                      const [eh, em] = time.split(":").map(Number)
                      const durationMins = eh * 60 + em - (sh * 60 + sm)
                      const durationLabel =
                        durationMins === 30
                          ? "30 min"
                          : `${durationMins / 60} hr`

                      return (
                        <SelectItem
                          key={time}
                          value={time}
                          className="font-mono text-sm"
                        >
                          <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                              <span className="font-semibold">{time}</span>
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground">
                              ({durationLabel})
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {formErrors.endTime && (
                  <p className="text-xs font-medium text-destructive">
                    {formErrors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Note Textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold tracking-tight text-foreground">
                Note{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Optional)
                </span>
              </label>
              <Textarea
                placeholder="Add notes, agenda, or reminders for this appointment..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                className="min-h-[100px] resize-none text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3">
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
              <strong className="text-sm font-semibold text-foreground">
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
