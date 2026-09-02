export type CalendarKind =
  "register_interest" | "google_meet" | "follow_up" | "event" | "holiday"

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
  meetUrl?: string
  phone?: string
  email?: string
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
    hint: "Meeting video calls & virtual dates",
    color: "#3b82f6",
    badge:
      "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
    dot: "bg-[#3b82f6]",
  },
  {
    value: "follow_up",
    label: "Follow Up",
    hint: "Matchmaking feedback, date review & follow-up calls",
    color: "#8b5cf6",
    badge:
      "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
    dot: "bg-[#8b5cf6]",
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
    description:
      "Preferred contact from the register interest form. Inquire about partner preferences and budget.",
    location: "Phone",
    phone: "+66812345678",
    email: "nalinee.s@example.com",
  },
  {
    id: "ri-2",
    title: "Intro call · James W.",
    start: localDateTime(tomorrowOffset, 10, 0),
    end: localDateTime(tomorrowOffset, 10, 45),
    kind: "register_interest",
    person: "James W.",
    description:
      "First introduction call after the interest form was received. Discuss verified membership tiers.",
    location: "Google Meet",
    meetUrl: "https://meet.google.com/tsm-intro-james",
    email: "james.w@example.com",
  },
  {
    id: "ri-3",
    title: "In-person Consultation · Somchai P.",
    start: localDateTime(thisWeekOffset(5), 16, 0),
    end: localDateTime(thisWeekOffset(5), 17, 0),
    kind: "register_interest",
    person: "Somchai P.",
    description:
      "Consultation booked at office. Document verification and photo portfolio session.",
    location: "Office · Suite 402",
    phone: "+66897654321",
    email: "somchai.p@example.com",
  },
  {
    id: "ri-4",
    title: "Follow-up · Emily R.",
    start: localDateTime(-2, 15, 30),
    end: localDateTime(-2, 16, 0),
    kind: "register_interest",
    person: "Emily R.",
    description:
      "Second contact after she requested evening hours. Review Bangkok dates availability.",
    location: "WhatsApp",
    phone: "+447911123456",
    email: "emily.r@example.co.uk",
  },
  {
    id: "meet-1",
    title: "Google Meet · Video Intro (Alex & Supansa)",
    start: localDateTime(0, 11, 0),
    end: localDateTime(0, 11, 30),
    kind: "google_meet",
    person: "Alex J. & Supansa T.",
    description:
      "Facilitated 1-to-1 video introduction call between matched candidates.",
    location: "Google Meet",
    meetUrl: "https://meet.google.com/tsm-intro-alex-supansa",
  },
  {
    id: "meet-2",
    title: "Meet Follow-up · Matching Recap",
    start: localDateTime(tomorrowOffset, 14, 0),
    end: localDateTime(tomorrowOffset, 14, 30),
    kind: "google_meet",
    person: "David M. & Nipa C.",
    description: "Send recap notes and coordinate first dinner date schedule.",
    location: "Google Meet",
    meetUrl: "https://meet.google.com/tsm-recap-david-nipa",
  },
  {
    id: "meet-3",
    title: "Candidate Verification Video Call",
    start: localDateTime(thisWeekOffset(4), 15, 0),
    end: localDateTime(thisWeekOffset(4), 15, 30),
    kind: "google_meet",
    person: "Michael B.",
    description:
      "Identity verification and background check interview via Google Meet.",
    location: "Google Meet",
    meetUrl: "https://meet.google.com/tsm-verify-michael",
  },
  {
    id: "fu-1",
    title: "1st Date Follow-up · Oliver & Siriporn",
    start: localDateTime(0, 16, 0),
    end: localDateTime(0, 16, 30),
    kind: "follow_up",
    person: "Oliver S. & Siriporn S.",
    description:
      "Post-meeting review call. Both attended their first dinner date in Thonglor yesterday. Check mutual impressions and chemistry.",
    location: "Phone / WhatsApp",
    phone: "+66819998888",
    email: "oliver.s@example.com",
  },
  {
    id: "fu-2",
    title: "Post-Meet Feedback · Marcus & Kanya",
    start: localDateTime(tomorrowOffset, 11, 30),
    end: localDateTime(tomorrowOffset, 12, 0),
    kind: "follow_up",
    person: "Marcus B. & Kanya R.",
    description:
      "Review 1st Google Meet impressions. Discuss second video date or in-person dinner plan.",
    location: "Google Meet",
    meetUrl: "https://meet.google.com/tsm-followup-marcus-kanya",
  },
  {
    id: "fu-3",
    title: "2nd Follow-up Check-in · Ethan & Nutcha",
    start: localDateTime(thisWeekOffset(3), 17, 0),
    end: localDateTime(thisWeekOffset(3), 17, 30),
    kind: "follow_up",
    person: "Ethan W. & Nutcha P.",
    description:
      "Check-in after 2nd Google Meet. Confirm next step preferences and private matchmaker advice.",
    location: "Phone / WhatsApp",
    phone: "+66845678901",
    email: "ethan.w@example.com",
  },
  {
    id: "event-1",
    title: "Weekly Matching Team Standup",
    start: localDateTime(0, 10, 0),
    end: localDateTime(0, 10, 45),
    kind: "event",
    description:
      "Staff sync on active matches, new applications, and Google Meet slots.",
    location: "Office · Meeting Room A",
  },
  {
    id: "event-2",
    title: "Exclusive Member Welcome Mixer",
    start: localDateTime(3, 18, 0),
    end: localDateTime(3, 20, 0),
    kind: "event",
    description:
      "Small cocktail introduction evening for verified executive members.",
    location: "Bangkok Lounge · Sukhumvit",
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
