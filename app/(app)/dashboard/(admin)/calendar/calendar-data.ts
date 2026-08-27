export type CalendarKind =
  "register_interest" | "google_meet" | "event" | "holiday"

export type CalendarItem = {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  kind: CalendarKind
  description: string
  person?: string
  location?: string
}

export const BUSINESS_HOURS = {
  daysOfWeek: [1, 2, 3, 4, 5],
  startTime: "10:00",
  endTime: "20:00",
} as const

export const calendarKinds: {
  value: CalendarKind
  label: string
  hint: string
  color: string
  badge: string
  dot: string
}[] = [
  {
    value: "register_interest",
    label: "Register interest",
    hint: "Contact appointments from interest forms",
    color: "#cfa14f",
    badge:
      "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-[#cfa14f]",
  },
  {
    value: "google_meet",
    label: "Google Meet",
    hint: "Meeting follow-ups and video calls",
    color: "#3b82f6",
    badge:
      "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    dot: "bg-[#3b82f6]",
  },
  {
    value: "event",
    label: "Events",
    hint: "Team dates, mixers, and office events",
    color: "#cb5d7a",
    badge:
      "border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300",
    dot: "bg-[#cb5d7a]",
  },
  {
    value: "holiday",
    label: "Holidays",
    hint: "Christmas, public holidays, office closed",
    color: "#0f9f6e",
    badge:
      "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-[#0f9f6e]",
  },
]

function pad(value: number) {
  return String(value).padStart(2, "0")
}

export function startOfDay(date: Date) {
  const next = new Date(date)

  next.setHours(0, 0, 0, 0)

  return next
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)

  next.setDate(next.getDate() + days)

  return next
}

export function isWeekend(date: Date) {
  const day = date.getDay()

  return day === 0 || day === 6
}

export function nextBusinessDay(from: Date) {
  let next = addDays(from, 1)

  while (isWeekend(next)) {
    next = addDays(next, 1)
  }

  return startOfDay(next)
}

export function startOfWeekMonday(date: Date) {
  const next = startOfDay(date)

  const day = next.getDay()

  const offset = day === 0 ? -6 : 1 - day

  next.setDate(next.getDate() + offset)

  return next
}

export function endOfWeekSunday(date: Date) {
  const monday = startOfWeekMonday(date)

  return addDays(monday, 7)
}

export function isSameLocalDay(iso: string, date: Date) {
  const start = new Date(iso)

  return (
    start.getFullYear() === date.getFullYear() &&
    start.getMonth() === date.getMonth() &&
    start.getDate() === date.getDate()
  )
}

function localDate(daysFromToday: number) {
  const date = addDays(new Date(), daysFromToday)

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`
}

function localDateTime(daysFromToday: number, hour: number, minute = 0) {
  return `${localDate(daysFromToday)}T${pad(hour)}:${pad(minute)}:00`
}

function absoluteDate(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`
}

function daysFromToday(date: Date) {
  const today = startOfDay(new Date())

  return Math.round((startOfDay(date).getTime() - today.getTime()) / 86_400_000)
}

const tomorrowOffset = daysFromToday(nextBusinessDay(new Date()))

function thisWeekOffset(weekday: 1 | 2 | 3 | 4 | 5) {
  return daysFromToday(addDays(startOfWeekMonday(new Date()), weekday - 1))
}

export const mockCalendarItems: CalendarItem[] = [
  {
    id: "ri-1",
    title: "Callback · Nalinee S.",
    start: localDateTime(0, 13, 0),
    end: localDateTime(0, 13, 30),
    kind: "register_interest",
    person: "Nalinee S.",
    description: "Preferred contact from the register interest form.",
    location: "Phone",
  },

  {
    id: "ri-2",
    title: "Intro call · James W.",
    start: localDateTime(tomorrowOffset, 10, 0),
    end: localDateTime(tomorrowOffset, 10, 45),
    kind: "register_interest",
    person: "James W.",
    description:
      "First introduction call after the interest form was received.",
    location: "Google Meet",
  },

  {
    id: "ri-3",
    title: "In-person · Somchai P.",
    start: localDateTime(thisWeekOffset(5), 16, 0),
    end: localDateTime(thisWeekOffset(5), 17, 0),
    kind: "register_interest",
    person: "Somchai P.",
    description: "Consultation booked from preferred contact date and time.",
    location: "Office",
  },

  {
    id: "ri-4",
    title: "Follow-up · Emily R.",
    start: localDateTime(-2, 15, 30),
    end: localDateTime(-2, 16, 0),
    kind: "register_interest",
    person: "Emily R.",
    description: "Second contact after she requested evening hours.",
    location: "WhatsApp",
  },

  {
    id: "meet-1",
    title: "Meet follow-up · pairing notes",
    start: localDateTime(0, 11, 0),
    end: localDateTime(0, 11, 30),
    kind: "google_meet",
    description:
      "Write follow-up notes after this morning’s introduction call.",
    location: "Google Meet",
  },

  {
    id: "meet-2",
    title: "Meet follow-up · matching recap",
    start: localDateTime(tomorrowOffset, 14, 0),
    end: localDateTime(tomorrowOffset, 14, 30),
    kind: "google_meet",
    person: "James W. & Nalinee S.",
    description: "Send recap and next-step times after the video introduction.",
    location: "Google Meet",
  },

  {
    id: "meet-3",
    title: "Meet follow-up · tracking check",
    start: localDateTime(thisWeekOffset(4), 15, 0),
    end: localDateTime(thisWeekOffset(4), 15, 30),
    kind: "google_meet",
    description: "Confirm both members completed the post-meet feedback form.",
    location: "Office",
  },

  {
    id: "event-1",
    title: "Weekly matching standup",
    start: localDateTime(0, 10, 0),
    end: localDateTime(0, 10, 45),
    kind: "event",
    description: "Staff sync on active matches and Google Meet slots.",
    location: "Office · Meeting room",
  },

  {
    id: "event-2",
    title: "Member welcome mixer",
    start: localDateTime(3, 18, 0),
    end: localDateTime(3, 20, 0),
    kind: "event",
    description: "Small introduction evening for newly approved members.",
    location: "Bangkok lounge",
  },

  {
    id: "holiday-1",
    title: "Christmas Day",
    start: absoluteDate(2026, 12, 25),
    allDay: true,
    kind: "holiday",
    description: "Office closed for Christmas. No contact appointments.",
  },

  {
    id: "holiday-2",
    title: "New Year’s Day",
    start: absoluteDate(2027, 1, 1),
    allDay: true,
    kind: "holiday",
    description: "Public holiday — office closed.",
  },

  {
    id: "holiday-3",
    title: "Constitution Day",
    start: absoluteDate(2026, 12, 10),
    allDay: true,
    kind: "holiday",
    description: "Thai public holiday — no callback appointments.",
  },
]
