"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Video,
  Clock,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Send,
  Heart,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  MoreHorizontal,
  MessageSquare,
  Mail,
  CalendarDays,
  LayoutGrid,
  List,
  Flame,
  Clock4,
  Smile,
  Frown,
  Meh,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

type GoogleMeetStage = "FIRST_GOOGLE_MEET" | "SECOND_GOOGLE_MEET"
type GoogleMeetStatus = "SCHEDULED" | "TODAY" | "PENDING_LINK" | "COMPLETED" | "CANCELLED"

interface GoogleMeetItem {
  id: string
  trackingId: string
  stage: GoogleMeetStage
  status: GoogleMeetStatus
  scheduledDate: string
  scheduledTime: string
  timeZone: string
  durationMinutes: number
  meetUrl: string
  hostMatchmaker: string
  matchScore: number
  emailInviteSent: boolean
  emailInviteSentAt?: string
  male: {
    name: string
    prefix: string
    age: number
    location: string
    nationality: string
    avatar?: string
    email: string
    phone: string
  }
  female: {
    name: string
    prefix: string
    age: number
    location: string
    nationality: string
    avatar?: string
    email: string
    phone: string
  }
  notes?: string
  outcome?: {
    maleFeedback?: "interested" | "neutral" | "not_interested"
    femaleFeedback?: "interested" | "neutral" | "not_interested"
    summary?: string
  }
}

// Sample Data representing active and past Google Meets for matched pairs
const INITIAL_MEETINGS: GoogleMeetItem[] = [
  {
    id: "meet-1",
    trackingId: "trk-001",
    stage: "FIRST_GOOGLE_MEET",
    status: "TODAY",
    scheduledDate: "2026-09-02",
    scheduledTime: "19:00 - 19:45",
    timeZone: "GMT+7 (Bangkok)",
    durationMinutes: 45,
    meetUrl: "https://meet.google.com/abc-defg-hij",
    hostMatchmaker: "Sarah Jenkins (Senior Matchmaker)",
    matchScore: 92,
    emailInviteSent: true,
    emailInviteSentAt: "1 Sep 2026, 14:20",
    male: {
      name: "Alex Johnson",
      prefix: "Mr.",
      age: 34,
      location: "Bangkok, Thailand",
      nationality: "British",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      email: "alex.j@example.com",
      phone: "+66 81 234 5678",
    },
    female: {
      name: "Supansa Thanakit",
      prefix: "Miss",
      age: 29,
      location: "Bangkok, Thailand",
      nationality: "Thai",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      email: "supansa.t@example.com",
      phone: "+66 89 876 5432",
    },
    notes: "Both candidates speak fluent English. Alex loves Thai culinary culture, Supansa is excited about international travel.",
  },
  {
    id: "meet-2",
    trackingId: "trk-002",
    stage: "SECOND_GOOGLE_MEET",
    status: "SCHEDULED",
    scheduledDate: "2026-09-04",
    scheduledTime: "20:00 - 20:45",
    timeZone: "GMT+7 (Bangkok)",
    durationMinutes: 45,
    meetUrl: "https://meet.google.com/xyz-uvwx-rst",
    hostMatchmaker: "Nathalie Wong",
    matchScore: 88,
    emailInviteSent: true,
    emailInviteSentAt: "30 Aug 2026, 11:15",
    male: {
      name: "David Miller",
      prefix: "Mr.",
      age: 38,
      location: "Phuket, Thailand",
      nationality: "Australian",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      email: "david.m@example.com",
      phone: "+66 82 345 6789",
    },
    female: {
      name: "Ploy Charoensuk",
      prefix: "Miss",
      age: 31,
      location: "Chiang Mai, Thailand",
      nationality: "Thai",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      email: "ploy.c@example.com",
      phone: "+66 86 123 4567",
    },
    notes: "1st meet went very well. 2nd meet will discuss lifestyle preferences and relocation possibilities.",
  },
  {
    id: "meet-3",
    trackingId: "trk-003",
    stage: "FIRST_GOOGLE_MEET",
    status: "PENDING_LINK",
    scheduledDate: "2026-09-05",
    scheduledTime: "18:30 - 19:15",
    timeZone: "GMT+7 (Bangkok)",
    durationMinutes: 45,
    meetUrl: "",
    hostMatchmaker: "Sarah Jenkins",
    matchScore: 85,
    emailInviteSent: false,
    male: {
      name: "Marcus Becker",
      prefix: "Mr.",
      age: 36,
      location: "Bangkok, Thailand",
      nationality: "German",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      email: "marcus.b@example.com",
      phone: "+66 83 456 7890",
    },
    female: {
      name: "Kanya Rattana",
      prefix: "Miss",
      age: 28,
      location: "Bangkok, Thailand",
      nationality: "Thai",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
      email: "kanya.r@example.com",
      phone: "+66 87 654 3210",
    },
    notes: "Both accepted profiles yesterday. Need to create Google Meet link and send email invites.",
  },
  {
    id: "meet-4",
    trackingId: "trk-004",
    stage: "FIRST_GOOGLE_MEET",
    status: "COMPLETED",
    scheduledDate: "2026-08-30",
    scheduledTime: "19:00 - 19:45",
    timeZone: "GMT+7 (Bangkok)",
    durationMinutes: 45,
    meetUrl: "https://meet.google.com/qwe-rtyu-iop",
    hostMatchmaker: "Nathalie Wong",
    matchScore: 94,
    emailInviteSent: true,
    emailInviteSentAt: "28 Aug 2026, 16:00",
    male: {
      name: "Ethan Wright",
      prefix: "Mr.",
      age: 32,
      location: "Bangkok, Thailand",
      nationality: "American",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      email: "ethan.w@example.com",
      phone: "+66 84 567 8901",
    },
    female: {
      name: "Nutcha Prasert",
      prefix: "Miss",
      age: 27,
      location: "Bangkok, Thailand",
      nationality: "Thai",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      email: "nutcha.p@example.com",
      phone: "+66 88 765 4321",
    },
    notes: "Great chemistry! Both requested a Second Google Meet session.",
    outcome: {
      maleFeedback: "interested",
      femaleFeedback: "interested",
      summary: "High enthusiasm from both sides. Recommended for 2nd Google Meet.",
    },
  },
]

// Couples who both accepted profiles and are ready to have their 1st Google Meet scheduled
const READY_PAIRS_QUEUE = [
  {
    trackingId: "trk-ready-1",
    matchScore: 95,
    acceptedDate: "Today, 14:30",
    male: {
      name: "Oliver Smith",
      prefix: "Mr.",
      age: 35,
      nationality: "Australian",
      location: "Bangkok",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    female: {
      name: "Siriporn Somchai",
      prefix: "Miss",
      age: 30,
      nationality: "Thai",
      location: "Bangkok",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  },
  {
    trackingId: "trk-ready-2",
    matchScore: 89,
    acceptedDate: "Yesterday",
    male: {
      name: "Sebastian Klein",
      prefix: "Mr.",
      age: 40,
      nationality: "German",
      location: "Phuket",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
    female: {
      name: "Wannisa Sripai",
      prefix: "Miss",
      age: 33,
      nationality: "Thai",
      location: "Phuket",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  },
]

export default function GoogleMeetPage() {
  const [meetings, setMeetings] = useState<GoogleMeetItem[]>(INITIAL_MEETINGS)
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<"ALL" | GoogleMeetStage>("ALL")
  const [statusFilter, setStatusFilter] = useState<"ALL" | GoogleMeetStatus>("ALL")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  // Modals state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isEmailInviteOpen, setIsEmailInviteOpen] = useState(false)
  const [isOutcomeOpen, setIsOutcomeOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<GoogleMeetItem | null>(null)

  // New Meeting Form State
  const [formData, setFormData] = useState({
    trackingId: "",
    stage: "FIRST_GOOGLE_MEET" as GoogleMeetStage,
    date: "2026-09-08",
    time: "19:00",
    duration: "45",
    meetUrl: "",
    host: "Sarah Jenkins (Senior Matchmaker)",
    notes: "",
    sendEmailNow: true,
  })

  // Outcome Form State
  const [outcomeData, setOutcomeData] = useState({
    maleFeedback: "interested" as "interested" | "neutral" | "not_interested",
    femaleFeedback: "interested" as "interested" | "neutral" | "not_interested",
    summary: "",
    nextStep: "SECOND_GOOGLE_MEET",
  })

  // Copy helper
  const handleCopy = (text: string, label = "Link") => {
    if (!text) {
      toast.error("No link available to copy")
      return
    }
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  // Filter logic
  const filteredMeetings = useMemo(() => {
    return meetings.filter((item) => {
      // Search
      const search = searchQuery.toLowerCase()
      const matchesSearch =
        !search ||
        item.male.name.toLowerCase().includes(search) ||
        item.female.name.toLowerCase().includes(search) ||
        item.trackingId.toLowerCase().includes(search) ||
        item.hostMatchmaker.toLowerCase().includes(search) ||
        item.meetUrl.toLowerCase().includes(search)

      // Stage Filter
      const matchesStage = stageFilter === "ALL" || item.stage === stageFilter

      // Status Filter
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter

      return matchesSearch && matchesStage && matchesStatus
    })
  }, [meetings, searchQuery, stageFilter, statusFilter])

  // Counts for KPIs
  const stats = useMemo(() => {
    const total = meetings.length
    const today = meetings.filter((m) => m.status === "TODAY").length
    const scheduled = meetings.filter((m) => m.status === "SCHEDULED" || m.status === "TODAY").length
    const pendingLink = meetings.filter((m) => m.status === "PENDING_LINK").length
    const completed = meetings.filter((m) => m.status === "COMPLETED").length
    const firstMeets = meetings.filter((m) => m.stage === "FIRST_GOOGLE_MEET").length
    const secondMeets = meetings.filter((m) => m.stage === "SECOND_GOOGLE_MEET").length

    return { total, today, scheduled, pendingLink, completed, firstMeets, secondMeets }
  }, [meetings])

  // Handlers
  const handleGenerateLink = () => {
    const randomChars = () => Math.random().toString(36).substring(2, 5)
    const newMeetUrl = `https://meet.google.com/${randomChars()}-${randomChars()}-${randomChars()}`
    setFormData((prev) => ({ ...prev, meetUrl: newMeetUrl }))
    toast.success("Generated Google Meet link")
  }

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    const newMeet: GoogleMeetItem = {
      id: `meet-${Date.now()}`,
      trackingId: formData.trackingId || "trk-new",
      stage: formData.stage,
      status: formData.meetUrl ? "SCHEDULED" : "PENDING_LINK",
      scheduledDate: formData.date,
      scheduledTime: `${formData.time} - ${getEndTime(formData.time, Number(formData.duration))}`,
      timeZone: "GMT+7 (Bangkok)",
      durationMinutes: Number(formData.duration),
      meetUrl: formData.meetUrl,
      hostMatchmaker: formData.host,
      matchScore: 90,
      emailInviteSent: formData.sendEmailNow && Boolean(formData.meetUrl),
      emailInviteSentAt: formData.sendEmailNow && formData.meetUrl ? "Just now" : undefined,
      male: {
        name: "Oliver Smith",
        prefix: "Mr.",
        age: 35,
        location: "Bangkok",
        nationality: "Australian",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        email: "oliver.s@example.com",
        phone: "+66 81 999 8888",
      },
      female: {
        name: "Siriporn Somchai",
        prefix: "Miss",
        age: 30,
        location: "Bangkok",
        nationality: "Thai",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        email: "siriporn.s@example.com",
        phone: "+66 89 777 6666",
      },
      notes: formData.notes,
    }

    setMeetings((prev) => [newMeet, ...prev])
    setIsScheduleOpen(false)
    toast.success(
      formData.sendEmailNow && formData.meetUrl
        ? "Google Meet scheduled & email invites dispatched!"
        : "Google Meet session scheduled successfully!"
    )
  }

  const handleSendEmailInvite = (meeting: GoogleMeetItem) => {
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === meeting.id
          ? { ...m, emailInviteSent: true, emailInviteSentAt: "Just now" }
          : m
      )
    )
    setIsEmailInviteOpen(false)
    toast.success(`Google Meet invite email sent to ${meeting.male.name} & ${meeting.female.name}!`)
  }

  const handleSaveOutcome = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMeeting) return

    setMeetings((prev) =>
      prev.map((m) =>
        m.id === selectedMeeting.id
          ? {
              ...m,
              status: "COMPLETED",
              outcome: {
                maleFeedback: outcomeData.maleFeedback,
                femaleFeedback: outcomeData.femaleFeedback,
                summary: outcomeData.summary,
              },
            }
          : m
      )
    )

    setIsOutcomeOpen(false)
    toast.success(
      `Outcome logged! Tracking status updated to ${
        outcomeData.nextStep === "SECOND_GOOGLE_MEET"
          ? "2nd Google Meet"
          : outcomeData.nextStep === "FIRST_FOLLOW_UP"
            ? "1st Follow Up"
            : "Closed"
      }`
    )
  }

  const getEndTime = (startTime: string, durationMinutes: number) => {
    const [h, m] = startTime.split(":").map(Number)
    const date = new Date()
    date.setHours(h, m + durationMinutes, 0)
    return date.toTimeString().slice(0, 5)
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
      {/* -------------------------------------------------------------
          HEADER & TOP ACTION BAR
          ------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Google Meet</h1>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-semibold text-primary">
              Virtual Dating
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Schedule, manage, track, and dispatch Google Meet video calls for matched couples.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            className="btn-gradient text-white shadow-xs font-medium gap-2"
            onClick={() => {
              setFormData({
                trackingId: "trk-ready-1",
                stage: "FIRST_GOOGLE_MEET",
                date: "2026-09-08",
                time: "19:00",
                duration: "45",
                meetUrl: "https://meet.google.com/abc-defg-hij",
                host: "Sarah Jenkins (Senior Matchmaker)",
                notes: "",
                sendEmailNow: true,
              })
              setIsScheduleOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Google Meet</span>
          </Button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          TOP KPI SCORECARD STATS
          ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Today Meetings */}
        <Card className="border border-amber-500/30 bg-amber-500/5 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Today&apos;s Sessions
            </p>
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{stats.today}</span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {stats.today === 1 ? "1 session today" : `${stats.today} sessions today`}
            </span>
          </div>
        </Card>

        {/* Total Scheduled */}
        <Card className="border bg-card p-4 shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Active Scheduled
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{stats.scheduled}</span>
            <span className="text-xs text-muted-foreground">
              {stats.firstMeets} 1st Meets • {stats.secondMeets} 2nd Meets
            </span>
          </div>
        </Card>

        {/* Pending Link / Email */}
        <Card className="border border-blue-500/30 bg-blue-500/5 p-4 shadow-2xs">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Needs Action
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{stats.pendingLink}</span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {stats.pendingLink === 0 ? "All links dispatched" : `${stats.pendingLink} pending links`}
            </span>
          </div>
        </Card>

        {/* Completed Meetings */}
        <Card className="border border-green-500/30 bg-green-500/5 p-4 shadow-2xs">
          <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
            Completed Sessions
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{stats.completed}</span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              88% moved to next step
            </span>
          </div>
        </Card>
      </div>

      {/* -------------------------------------------------------------
          READY FOR 1ST GOOGLE MEET QUEUE (PROMPT ACTION BANNER)
          ------------------------------------------------------------- */}
      {READY_PAIRS_QUEUE.length > 0 && (
        <Card className="overflow-hidden border border-primary/30 bg-gradient-to-r from-primary/5 via-background to-secondary/20 shadow-xs">
          <CardHeader className="p-4 sm:p-5 border-b border-primary/15 bg-primary/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Pairs Ready for 1st Google Meet ({READY_PAIRS_QUEUE.length} Couples)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Both members accepted each other’s profile in Step 2. Schedule their first video date now.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {READY_PAIRS_QUEUE.map((pair) => (
                <div
                  key={pair.trackingId}
                  className="flex flex-col justify-between gap-3 rounded-xl border bg-card p-3.5 shadow-2xs transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-semibold text-green-600 border-green-500/30 bg-green-500/10">
                      Both Accepted ✓ {pair.acceptedDate}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-xs font-bold text-primary">
                      {pair.matchScore}% Match
                    </Badge>
                  </div>

                  {/* Visual Pair */}
                  <div className="flex items-center justify-between gap-2 px-1">
                    {/* Male */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#D3A753]/40 shadow-2xs">
                        <Image src={pair.male.avatar} alt={pair.male.name} fill unoptimized className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{pair.male.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {pair.male.age} yrs • {pair.male.nationality}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                    </div>

                    {/* Female */}
                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-foreground">{pair.female.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {pair.female.age} yrs • {pair.female.nationality}
                        </p>
                      </div>
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-pink-400/40 shadow-2xs">
                        <Image src={pair.female.avatar} alt={pair.female.name} fill unoptimized className="object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    className="w-full btn-gradient text-white text-xs font-medium h-8 shadow-xs gap-1.5"
                    onClick={() => {
                      setFormData({
                        trackingId: pair.trackingId,
                        stage: "FIRST_GOOGLE_MEET",
                        date: "2026-09-08",
                        time: "19:00",
                        duration: "45",
                        meetUrl: "https://meet.google.com/abc-defg-hij",
                        host: "Sarah Jenkins (Senior Matchmaker)",
                        notes: "",
                        sendEmailNow: true,
                      })
                      setIsScheduleOpen(true)
                    }}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Schedule 1st Google Meet</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* -------------------------------------------------------------
          FILTER, SEARCH & VIEW TOOLBAR
          ------------------------------------------------------------- */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidate name, tracking ID, host..."
            className="pl-8 text-xs h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <div className="flex items-center rounded-lg border bg-muted/30 p-1">
            <button
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                stageFilter === "ALL" ? "btn-gradient text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setStageFilter("ALL")}
            >
              All Stages ({meetings.length})
            </button>
            <button
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                stageFilter === "FIRST_GOOGLE_MEET" ? "btn-gradient text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setStageFilter("FIRST_GOOGLE_MEET")}
            >
              1st Meet ({stats.firstMeets})
            </button>
            <button
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                stageFilter === "SECOND_GOOGLE_MEET" ? "btn-gradient text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setStageFilter("SECOND_GOOGLE_MEET")}
            >
              2nd Meet ({stats.secondMeets})
            </button>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="PENDING_LINK">Pending Link</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-xs transition-all",
                viewMode === "grid" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-xs transition-all",
                viewMode === "table" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MEETINGS DISPLAY: GRID VIEW (COUPLES CARDS)
          ------------------------------------------------------------- */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredMeetings.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Video className="h-10 w-10 text-muted-foreground/40 mb-2" />
              <p className="text-base font-semibold">No Google Meet sessions found</p>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Try adjusting your search query or filter settings, or schedule a new Google Meet session.
              </p>
            </div>
          ) : (
            filteredMeetings.map((meet) => (
              <Card
                key={meet.id}
                className={cn(
                  "flex flex-col justify-between overflow-hidden border shadow-2xs transition-all hover:shadow-xs",
                  meet.status === "TODAY" ? "ring-2 ring-amber-500/40 border-amber-500/30" : ""
                )}
              >
                {/* Card Top Bar */}
                <CardHeader className="border-b bg-muted/10 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "text-xs font-semibold shadow-2xs",
                          meet.stage === "FIRST_GOOGLE_MEET"
                            ? "bg-purple-600/10 text-purple-700 dark:text-purple-300 border-purple-500/30"
                            : "bg-pink-600/10 text-pink-700 dark:text-pink-300 border-pink-500/30"
                        )}
                        variant="outline"
                      >
                        <Video className="h-3 w-3 mr-1" />
                        {meet.stage === "FIRST_GOOGLE_MEET" ? "1st Google Meet" : "2nd Google Meet"}
                      </Badge>

                      {meet.status === "TODAY" && (
                        <Badge className="bg-amber-500 text-white font-semibold text-[10px] gap-1 shadow-2xs">
                          <Clock4 className="h-3 w-3" /> Today
                        </Badge>
                      )}

                      {meet.status === "PENDING_LINK" && (
                        <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px]">
                          Pending Link
                        </Badge>
                      )}

                      {meet.status === "COMPLETED" && (
                        <Badge variant="outline" className="border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="font-mono text-xs font-bold text-foreground">
                        {meet.matchScore}% Match
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/tracking/${meet.trackingId}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Tracking Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMeeting(meet)
                              setIsEmailInviteOpen(true)
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Preview / Send Email Invite
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMeeting(meet)
                              setIsOutcomeOpen(true)
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Record Meeting Outcome
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => toast.success("Meeting marked as cancelled")}
                          >
                            Cancel Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-4 sm:p-5">
                  {/* Couples Showcase Box */}
                  <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3.5">
                    {/* Male Candidate */}
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#D3A753]/50 shadow-xs">
                        {meet.male.avatar ? (
                          <Image src={meet.male.avatar} alt={meet.male.name} fill unoptimized className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-bold">
                            {meet.male.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#b48735] dark:text-[#E5BE6C]">{meet.male.prefix}</span>
                          <p className="text-xs font-bold text-foreground">{meet.male.name}</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {meet.male.age} yrs • {meet.male.nationality}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{meet.male.location}</p>
                      </div>
                    </div>

                    {/* Connection Icon */}
                    <div className="flex flex-col items-center justify-center px-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 shadow-2xs">
                        <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                      </div>
                    </div>

                    {/* Female Candidate */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-xs font-bold text-pink-600 dark:text-pink-400">{meet.female.prefix}</span>
                          <p className="text-xs font-bold text-foreground">{meet.female.name}</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {meet.female.age} yrs • {meet.female.nationality}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{meet.female.location}</p>
                      </div>
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-pink-400/50 shadow-xs">
                        {meet.female.avatar ? (
                          <Image src={meet.female.avatar} alt={meet.female.name} fill unoptimized className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-bold">
                            {meet.female.name[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meeting Schedule & Matchmaker Info */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-background p-2.5 border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          {new Date(meet.scheduledDate).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{meet.scheduledTime} ({meet.durationMinutes}m)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
                      <span>Matchmaker Host:</span>
                      <strong className="text-foreground">{meet.hostMatchmaker}</strong>
                    </div>
                  </div>

                  {/* Google Meet Link Box */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Google Meet URL
                    </Label>
                    {meet.meetUrl ? (
                      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-2 text-xs">
                        <LinkIcon className="h-4 w-4 shrink-0 text-primary" />
                        <span className="flex-1 font-mono text-[11px] truncate text-foreground select-all">
                          {meet.meetUrl}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopy(meet.meetUrl, "Google Meet Link")}
                          title="Copy Link"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2.5 text-[11px] gap-1 shrink-0 font-medium"
                          onClick={() => window.open(meet.meetUrl, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 p-2.5 text-xs text-amber-700 dark:text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" /> Link not assigned yet
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                          onClick={() => {
                            const newLink = "https://meet.google.com/abc-defg-hij"
                            setMeetings((prev) =>
                              prev.map((m) => (m.id === meet.id ? { ...m, meetUrl: newLink, status: "SCHEDULED" } : m))
                            )
                            toast.success("Google Meet link attached!")
                          }}
                        >
                          + Assign Link
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Email Invite Dispatch Status */}
                  <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Mail className={cn("h-3.5 w-3.5", meet.emailInviteSent ? "text-green-500" : "text-amber-500")} />
                      <span className="text-[11px]">
                        {meet.emailInviteSent ? (
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            Invite Sent ({meet.emailInviteSentAt})
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-medium">
                            Invite Email Pending
                          </span>
                        )}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[11px] text-primary hover:text-primary hover:underline"
                      onClick={() => {
                        setSelectedMeeting(meet)
                        setIsEmailInviteOpen(true)
                      }}
                    >
                      {meet.emailInviteSent ? "Resend" : "Send Invite"}
                    </Button>
                  </div>

                  {/* Outcome Note if completed */}
                  {meet.outcome && (
                    <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-2.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Meeting Outcome Logged
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground/90">{meet.outcome.summary}</p>
                    </div>
                  )}
                </CardContent>

                {/* Card Action Footer */}
                <CardFooter className="border-t bg-muted/10 p-3 flex items-center justify-between gap-2">
                  <Link href={`/dashboard/tracking/${meet.trackingId}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-medium gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Tracking #{meet.trackingId}</span>
                    </Button>
                  </Link>

                  <div className="flex items-center gap-2">
                    {meet.status !== "COMPLETED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-medium gap-1.5 text-green-600 border-green-500/40 hover:bg-green-500/10"
                        onClick={() => {
                          setSelectedMeeting(meet)
                          setIsOutcomeOpen(true)
                        }}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Log Outcome</span>
                      </Button>
                    )}

                    {meet.meetUrl && (
                      <Button
                        size="sm"
                        className="btn-gradient text-white h-8 text-xs font-medium gap-1.5 shadow-2xs"
                        onClick={() => window.open(meet.meetUrl, "_blank")}
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Join Session</span>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* -------------------------------------------------------------
            TABLE VIEW
            ------------------------------------------------------------- */
        <Card className="overflow-hidden border shadow-2xs">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground">
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Couple Pair</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Stage & Score</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Google Meet URL</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Email Invite</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMeetings.map((meet) => (
                    <tr key={meet.id} className="transition-colors hover:bg-muted/10">
                      {/* Couple Pair */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-foreground text-xs">
                              {meet.male.name} & {meet.female.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Host: {meet.hostMatchmaker}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Stage & Score */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-[10px] font-semibold">
                            {meet.stage === "FIRST_GOOGLE_MEET" ? "1st Google Meet" : "2nd Google Meet"}
                          </Badge>
                          <p className="font-mono text-[10px] font-bold text-primary">{meet.matchScore}% Match</p>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-foreground text-xs">{meet.scheduledDate}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">{meet.scheduledTime}</p>
                      </td>

                      {/* Google Meet URL */}
                      <td className="px-4 py-3.5">
                        {meet.meetUrl ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] truncate max-w-[140px] text-foreground">
                              {meet.meetUrl.replace("https://", "")}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              onClick={() => handleCopy(meet.meetUrl, "Link")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-500 font-medium">Unassigned</span>
                        )}
                      </td>

                      {/* Email Invite */}
                      <td className="px-4 py-3.5">
                        {meet.emailInviteSent ? (
                          <Badge variant="outline" className="text-[10px] border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400">
                            Sent ✓
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            Pending
                          </Badge>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] font-semibold",
                            meet.status === "TODAY" ? "bg-amber-500 text-white" : "",
                            meet.status === "COMPLETED" ? "bg-green-500/15 text-green-700 dark:text-green-400" : ""
                          )}
                        >
                          {meet.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/dashboard/tracking/${meet.trackingId}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                              View
                            </Button>
                          </Link>
                          {meet.meetUrl && (
                            <Button
                              size="sm"
                              className="btn-gradient text-white h-7 text-xs px-2 shadow-2xs"
                              onClick={() => window.open(meet.meetUrl, "_blank")}
                            >
                              Join
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* -------------------------------------------------------------
          MODAL 1: SCHEDULE GOOGLE MEET DIALOG
          ------------------------------------------------------------- */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span>Schedule Google Meet Session</span>
            </DialogTitle>
            <DialogDescription>
              Set up a virtual introduction between matched candidates and dispatch email invitations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateMeeting} className="space-y-4 py-2">
            {/* Candidate Pair Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Matched Couple Pair *</Label>
              <Select
                value={formData.trackingId}
                onValueChange={(val) => setFormData((p) => ({ ...p, trackingId: val }))}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select matched candidates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trk-ready-1">Oliver Smith & Siriporn Somchai (95% Match - Accepted)</SelectItem>
                  <SelectItem value="trk-ready-2">Sebastian Klein & Wannisa Sripai (89% Match - Accepted)</SelectItem>
                  <SelectItem value="trk-001">Alex Johnson & Supansa Thanakit (92% Match)</SelectItem>
                  <SelectItem value="trk-002">David Miller & Ploy Charoensuk (88% Match)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Stage */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Meeting Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(val) => setFormData((p) => ({ ...p, stage: val as any }))}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST_GOOGLE_MEET">1st Google Meet (Intro)</SelectItem>
                    <SelectItem value="SECOND_GOOGLE_MEET">2nd Google Meet (Deeper)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Duration (Minutes)</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(val) => setFormData((p) => ({ ...p, duration: val }))}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes (Recommended)</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date *</Label>
                <Input
                  type="date"
                  className="text-xs"
                  value={formData.date}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Time (GMT+7 Bangkok) *</Label>
                <Input
                  type="time"
                  className="text-xs"
                  value={formData.time}
                  onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Google Meet Link input + Generate button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Google Meet URL</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline font-medium"
                  onClick={handleGenerateLink}
                >
                  ⚡ Auto-Generate Link
                </button>
              </div>
              <div className="relative">
                <Input
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  className="font-mono text-xs pr-8"
                  value={formData.meetUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, meetUrl: e.target.value }))}
                />
                <LinkIcon className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Matchmaker Host */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Matchmaker Host / Moderator</Label>
              <Select
                value={formData.host}
                onValueChange={(val) => setFormData((p) => ({ ...p, host: val }))}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Jenkins (Senior Matchmaker)">Sarah Jenkins (Senior Matchmaker)</SelectItem>
                  <SelectItem value="Nathalie Wong (Matchmaker)">Nathalie Wong (Matchmaker)</SelectItem>
                  <SelectItem value="Elena Rostova (Matchmaker)">Elena Rostova (Matchmaker)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Agenda / Prep Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Staff Preparation / Icebreaker Notes</Label>
              <Textarea
                placeholder="Mention shared interest in Thai culture, outdoor travel, and language learning..."
                className="text-xs min-h-[60px]"
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>

            {/* Send Email Now Switch */}
            <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">Dispatch Email Invitations Now</Label>
                <p className="text-[11px] text-muted-foreground">
                  Sends branded email with calendar link to both candidates.
                </p>
              </div>
              <Switch
                checked={formData.sendEmailNow}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, sendEmailNow: checked }))}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsScheduleOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-gradient text-white">
                Confirm & Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------
          MODAL 2: EMAIL INVITE PREVIEW & DISPATCH
          ------------------------------------------------------------- */}
      <Dialog open={isEmailInviteOpen} onOpenChange={setIsEmailInviteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Google Meet Email Invitation Preview</span>
            </DialogTitle>
            <DialogDescription>
              This branded email will be dispatched to both candidate inboxes.
            </DialogDescription>
          </DialogHeader>

          {selectedMeeting && (
            <div className="space-y-4 py-2">
              {/* Recipients list */}
              <div className="rounded-xl border bg-muted/20 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Male Recipient:</span>
                  <strong className="text-foreground">{selectedMeeting.male.name} ({selectedMeeting.male.email})</strong>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-muted-foreground">Female Recipient:</span>
                  <strong className="text-foreground">{selectedMeeting.female.name} ({selectedMeeting.female.email})</strong>
                </div>
              </div>

              {/* Email Content Mockup */}
              <div className="rounded-xl border bg-card p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">Thai Soulmate Virtual Date</span>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedMeeting.stage === "FIRST_GOOGLE_MEET" ? "1st Virtual Introduction" : "2nd Virtual Date"}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-foreground/90">
                  <p>Dear Candidate,</p>
                  <p>
                    Congratulations! Both you and your match have accepted each other’s profile. We are pleased to confirm your scheduled Google Meet video call.
                  </p>

                  <div className="rounded-lg bg-muted/40 p-3 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      <span>{selectedMeeting.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{selectedMeeting.scheduledTime} ({selectedMeeting.timeZone})</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>{selectedMeeting.meetUrl || "https://meet.google.com/..."}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Your matchmaker, {selectedMeeting.hostMatchmaker}, will facilitate the call for the first 5 minutes to introduce you both.
                  </p>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsEmailInviteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="btn-gradient text-white gap-1.5"
                  onClick={() => handleSendEmailInvite(selectedMeeting)}
                >
                  <Send className="h-4 w-4" />
                  <span>Send Email Invite Now</span>
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------
          MODAL 3: MEETING OUTCOME & FEEDBACK LOGGER
          ------------------------------------------------------------- */}
      <Dialog open={isOutcomeOpen} onOpenChange={setIsOutcomeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Record Meeting Outcome & Advance Pipeline</span>
            </DialogTitle>
            <DialogDescription>
              Log member reactions and automatically advance the connection status in Tracking.
            </DialogDescription>
          </DialogHeader>

          {selectedMeeting && (
            <form onSubmit={handleSaveOutcome} className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/20 p-3 text-xs flex items-center justify-between">
                <span>Meeting: <strong>{selectedMeeting.male.name} & {selectedMeeting.female.name}</strong></span>
                <Badge variant="outline">{selectedMeeting.stage === "FIRST_GOOGLE_MEET" ? "1st Meet" : "2nd Meet"}</Badge>
              </div>

              {/* Male Candidate Feedback */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#b48735] dark:text-[#E5BE6C]">
                  {selectedMeeting.male.name}&apos;s Feedback
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-xs gap-1.5 h-9",
                      outcomeData.maleFeedback === "interested" ? "btn-gradient text-white border-transparent shadow-xs" : ""
                    )}
                    onClick={() => setOutcomeData((p) => ({ ...p, maleFeedback: "interested" }))}
                  >
                    <Smile className="h-3.5 w-3.5" /> Interested
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-xs gap-1.5 h-9",
                      outcomeData.maleFeedback === "neutral" ? "btn-gradient text-white border-transparent shadow-xs" : ""
                    )}
                    onClick={() => setOutcomeData((p) => ({ ...p, maleFeedback: "neutral" }))}
                  >
                    <Meh className="h-3.5 w-3.5" /> Neutral
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-xs gap-1.5 h-9",
                      outcomeData.maleFeedback === "not_interested" ? "bg-destructive text-white border-transparent shadow-xs" : ""
                    )}
                    onClick={() => setOutcomeData((p) => ({ ...p, maleFeedback: "not_interested" }))}
                  >
                    <Frown className="h-3.5 w-3.5" /> Not Interested
                  </Button>
                </div>
              </div>

              {/* Female Candidate Feedback */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                  {selectedMeeting.female.name}&apos;s Feedback
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-xs gap-1.5 h-9",
                      outcomeData.femaleFeedback === "interested" ? "btn-gradient text-white border-transparent shadow-xs" : ""
                    )}
                    onClick={() => setOutcomeData((p) => ({ ...p, femaleFeedback: "interested" }))}
                  >
                    <Smile className="h-3.5 w-3.5" /> Interested
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-xs gap-1.5 h-9",
                      outcomeData.femaleFeedback === "neutral" ? "btn-gradient text-white border-transparent shadow-xs" : ""
                    )}
                    onClick={() => setOutcomeData((p) => ({ ...p, femaleFeedback: "neutral" }))}
                  >
                    <Meh className="h-3.5 w-3.5" /> Neutral
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-xs gap-1.5 h-9",
                      outcomeData.femaleFeedback === "not_interested" ? "bg-destructive text-white border-transparent shadow-xs" : ""
                    )}
                    onClick={() => setOutcomeData((p) => ({ ...p, femaleFeedback: "not_interested" }))}
                  >
                    <Frown className="h-3.5 w-3.5" /> Not Interested
                  </Button>
                </div>
              </div>

              {/* Matchmaker Outcome Summary */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Matchmaker Call Summary & Notes</Label>
                <Textarea
                  placeholder="Both candidates engaged well and laughed throughout the call. Recommend moving forward to 2nd meeting or in-person date..."
                  className="text-xs min-h-[70px]"
                  value={outcomeData.summary}
                  onChange={(e) => setOutcomeData((p) => ({ ...p, summary: e.target.value }))}
                />
              </div>

              {/* Next Step in Pipeline */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Advance Tracking Pipeline To:</Label>
                <Select
                  value={outcomeData.nextStep}
                  onValueChange={(val) => setOutcomeData((p) => ({ ...p, nextStep: val }))}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SECOND_GOOGLE_MEET">Stage 7: Second Google Meet</SelectItem>
                    <SelectItem value="FIRST_FOLLOW_UP">Stage 8: First Follow Up (In-Person Date)</SelectItem>
                    <SelectItem value="CLOSED">Close Connection (No match)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOutcomeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-gradient text-white">
                  Save Outcome & Update Pipeline
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
