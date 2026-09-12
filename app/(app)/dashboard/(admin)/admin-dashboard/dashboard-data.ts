import {
  ClipboardPen,
  FileText,
  CreditCard,
  HeartPulse,
  HeartHandshake,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CircleDot,
  Archive,
  MinusCircle,
  XCircle,
  Users2,
  type LucideIcon,
} from "lucide-react"

// ── Financial Data Sets ──
export interface FinancialMonth {
  month: string
  revenue: number
  profit: number
  margin: string
}

export const financial12Months: FinancialMonth[] = [
  { month: "Jan", revenue: 115000, profit: 89000, margin: "77.4%" },
  { month: "Feb", revenue: 128000, profit: 98500, margin: "77.0%" },
  { month: "Mar", revenue: 135000, profit: 104000, margin: "77.0%" },
  { month: "Apr", revenue: 142000, profit: 110500, margin: "77.8%" },
  { month: "May", revenue: 154000, profit: 121000, margin: "78.6%" },
  { month: "Jun", revenue: 148000, profit: 115000, margin: "77.7%" },
  { month: "Jul", revenue: 162000, profit: 126500, margin: "78.1%" },
  { month: "Aug", revenue: 171000, profit: 133000, margin: "77.8%" },
  { month: "Sep", revenue: 165000, profit: 128000, margin: "77.6%" },
  { month: "Oct", revenue: 178000, profit: 138500, margin: "77.8%" },
  { month: "Nov", revenue: 184000, profit: 143000, margin: "77.7%" },
  { month: "Dec", revenue: 195000, profit: 152000, margin: "77.9%" },
]

export const financial6Months = financial12Months.slice(6)
export const financial3Months = financial12Months.slice(9)

// ── Gender Demographics Data ──
export interface GenderData {
  name: string
  value: number
  color: string
}

export const genderDistributionData: GenderData[] = [
  { name: "Thai Ladies", value: 1850, color: "#E791A7" },
  { name: "Gentlemen", value: 1040, color: "#D3A753" },
]

// ── Funnel Stages Data (End-to-End Pipeline) ──
export interface FunnelStage {
  step: string
  stage: string
  subtitle: string
  count: number
  percentage: string
  stepRate: string
  color: string
  textColor: string
  borderColor: string
  bgColor: string
  icon: LucideIcon
  barWidth: string
}

export const funnelStages: FunnelStage[] = [
  {
    step: "01",
    stage: "Registered Interest",
    subtitle: "Website consultation request",
    count: 5430,
    percentage: "100%",
    stepRate: "Entry baseline",
    color: "bg-indigo-500",
    textColor: "text-indigo-500",
    borderColor: "border-indigo-500/30",
    bgColor: "bg-indigo-500/10",
    icon: ClipboardPen,
    barWidth: "100%",
  },
  {
    step: "02",
    stage: "Application Form Submitted",
    subtitle: "Comprehensive bio & partner criteria",
    count: 3120,
    percentage: "57.5%",
    stepRate: "57.5% completion",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    icon: FileText,
    barWidth: "75%",
  },
  {
    step: "03",
    stage: "Completed Profiles",
    subtitle: "Profile completed & ready to match",
    count: 2890,
    percentage: "53.2%",
    stepRate: "92.6% completed",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/10",
    icon: CheckCircle2,
    barWidth: "64%",
  },
  {
    step: "04",
    stage: "Paid Memberships",
    subtitle: "Gentlemen tiers & Female VIP plans",
    count: 850,
    percentage: "15.7%",
    stepRate: "29.4% conversion",
    color: "bg-[#D3A753]",
    textColor: "text-[#D3A753]",
    borderColor: "border-[#D3A753]/30",
    bgColor: "bg-[#D3A753]/10",
    icon: CreditCard,
    barWidth: "46%",
  },
  {
    step: "05",
    stage: "In Active Matching",
    subtitle: "1-2-1 matchmaker bespoke curation",
    count: 340,
    percentage: "6.3%",
    stepRate: "40.0% active queue",
    color: "bg-[#E791A7]",
    textColor: "text-[#E791A7]",
    borderColor: "border-[#E791A7]/30",
    bgColor: "bg-[#E791A7]/10",
    icon: HeartPulse,
    barWidth: "32%",
  },
  {
    step: "06",
    stage: "Mutually Agreed Introductions",
    subtitle: "Double consent met & date arranged",
    count: 125,
    percentage: "2.3%",
    stepRate: "36.8% mutual dates",
    color: "bg-[#CA617D]",
    textColor: "text-[#CA617D]",
    borderColor: "border-[#CA617D]/30",
    bgColor: "bg-[#CA617D]/10",
    icon: HeartHandshake,
    barWidth: "22%",
  },
]

// ── Gentlemen by Nationality (1,040 Total Members) ──
export interface NationalityData {
  country: string
  nationality: string
  flag: string
  count: number
  percentage: string
  abroadCount: number
  abroadPercent: string
  thailandCount: number
  thailandPercent: string
  status: string
  statusVariant:
    "gold" | "rose" | "emerald" | "blue" | "red" | "amber" | "cyan" | "purple"
  preferredPlan: string
  growth: string
  color: string
  barWidth: string
}

export const gentlemenByNationality: NationalityData[] = [
  {
    country: "United Kingdom",
    nationality: "British",
    flag: "🇬🇧",
    count: 280,
    percentage: "26.9%",
    abroadCount: 200,
    abroadPercent: "71%",
    thailandCount: 80,
    thailandPercent: "29%",
    status: "#1 Nationality",
    statusVariant: "gold",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+22% YoY",
    color: "bg-[#D3A753]",
    barWidth: "27%",
  },
  {
    country: "United States",
    nationality: "American",
    flag: "🇺🇸",
    count: 230,
    percentage: "22.1%",
    abroadCount: 165,
    abroadPercent: "72%",
    thailandCount: 65,
    thailandPercent: "28%",
    status: "Highest Spend",
    statusVariant: "rose",
    preferredPlan: "6 Months (฿49,999)",
    growth: "+28% YoY",
    color: "bg-[#CA617D]",
    barWidth: "22%",
  },
  {
    country: "Australia",
    nationality: "Australian",
    flag: "🇦🇺",
    count: 165,
    percentage: "15.9%",
    abroadCount: 119,
    abroadPercent: "72%",
    thailandCount: 46,
    thailandPercent: "28%",
    status: "Fastest Growing",
    statusVariant: "emerald",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+35% YoY",
    color: "bg-emerald-500",
    barWidth: "16%",
  },
  {
    country: "Germany",
    nationality: "German",
    flag: "🇩🇪",
    count: 115,
    percentage: "11.1%",
    abroadCount: 83,
    abroadPercent: "72%",
    thailandCount: 32,
    thailandPercent: "28%",
    status: "High Retention",
    statusVariant: "blue",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+14% YoY",
    color: "bg-blue-500",
    barWidth: "11%",
  },
  {
    country: "Switzerland",
    nationality: "Swiss",
    flag: "🇨🇭",
    count: 85,
    percentage: "8.2%",
    abroadCount: 61,
    abroadPercent: "72%",
    thailandCount: 24,
    thailandPercent: "28%",
    status: "VIP Tier",
    statusVariant: "red",
    preferredPlan: "6 Months (฿49,999)",
    growth: "+18% YoY",
    color: "bg-rose-500",
    barWidth: "8%",
  },
  {
    country: "Canada",
    nationality: "Canadian",
    flag: "🇨🇦",
    count: 65,
    percentage: "6.2%",
    abroadCount: 47,
    abroadPercent: "72%",
    thailandCount: 18,
    thailandPercent: "28%",
    status: "Long-Term Goals",
    statusVariant: "amber",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+21% YoY",
    color: "bg-amber-500",
    barWidth: "6%",
  },
  {
    country: "Sweden",
    nationality: "Swedish",
    flag: "🇸🇪",
    count: 55,
    percentage: "5.3%",
    abroadCount: 40,
    abroadPercent: "73%",
    thailandCount: 15,
    thailandPercent: "27%",
    status: "Expat Focus",
    statusVariant: "cyan",
    preferredPlan: "1 Month (฿14,999)",
    growth: "+16% YoY",
    color: "bg-cyan-500",
    barWidth: "5%",
  },
  {
    country: "New Zealand",
    nationality: "New Zealander",
    flag: "🇳🇿",
    count: 45,
    percentage: "4.3%",
    abroadCount: 34,
    abroadPercent: "76%",
    thailandCount: 11,
    thailandPercent: "24%",
    status: "High Response",
    statusVariant: "purple",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+24% YoY",
    color: "bg-purple-500",
    barWidth: "4%",
  },
]

// ── Gentlemen by Current Location (1,040 Total Members) ──
export interface LocationData {
  location: string
  category: string
  flag: string
  count: number
  percentage: string
  subtitle: string
  primaryNationalities: string
  status: string
  statusVariant:
    "gold" | "rose" | "emerald" | "blue" | "red" | "amber" | "cyan" | "purple"
  preferredPlan: string
  growth: string
  color: string
  barWidth: string
}

export const gentlemenByLocation: LocationData[] = [
  {
    location: "Thailand",
    category: "Local Expat Residents",
    flag: "🇹🇭",
    count: 291,
    percentage: "28.0%",
    subtitle: "Living in Thailand (Expats)",
    primaryNationalities: "UK, US, AU, DE, Swiss",
    status: "Immediate In-Person",
    statusVariant: "gold",
    preferredPlan: "Direct Matchmaking",
    growth: "+19% YoY",
    color: "bg-[#D3A753]",
    barWidth: "28%",
  },
  {
    location: "United Kingdom",
    category: "International Traveler",
    flag: "🇬🇧",
    count: 200,
    percentage: "19.2%",
    subtitle: "Living in UK (Travels to Thailand)",
    primaryNationalities: "British Citizens",
    status: "#1 Abroad Hub",
    statusVariant: "rose",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+22% YoY",
    color: "bg-[#CA617D]",
    barWidth: "19%",
  },
  {
    location: "United States",
    category: "International Traveler",
    flag: "🇺🇸",
    count: 165,
    percentage: "15.9%",
    subtitle: "Living in US (Travels to Thailand)",
    primaryNationalities: "US Citizens",
    status: "Highest VIP Spend",
    statusVariant: "emerald",
    preferredPlan: "6 Months (฿49,999)",
    growth: "+26% YoY",
    color: "bg-emerald-500",
    barWidth: "16%",
  },
  {
    location: "Australia",
    category: "International Traveler",
    flag: "🇦🇺",
    count: 119,
    percentage: "11.4%",
    subtitle: "Living in AU (Travels to Thailand)",
    primaryNationalities: "Australian Citizens",
    status: "Direct Flight Hub",
    statusVariant: "blue",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+33% YoY",
    color: "bg-blue-500",
    barWidth: "11%",
  },
  {
    location: "Germany",
    category: "International Traveler",
    flag: "🇩🇪",
    count: 83,
    percentage: "8.0%",
    subtitle: "Living in Germany",
    primaryNationalities: "German Citizens",
    status: "High Retention",
    statusVariant: "amber",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+15% YoY",
    color: "bg-amber-500",
    barWidth: "8%",
  },
  {
    location: "Switzerland",
    category: "International Traveler",
    flag: "🇨🇭",
    count: 61,
    percentage: "5.9%",
    subtitle: "Living in Switzerland",
    primaryNationalities: "Swiss Citizens",
    status: "VIP Tier",
    statusVariant: "red",
    preferredPlan: "6 Months (฿49,999)",
    growth: "+19% YoY",
    color: "bg-rose-500",
    barWidth: "6%",
  },
  {
    location: "Canada",
    category: "International Traveler",
    flag: "🇨🇦",
    count: 47,
    percentage: "4.5%",
    subtitle: "Living in Canada",
    primaryNationalities: "Canadian Citizens",
    status: "Long-Term Goals",
    statusVariant: "cyan",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+20% YoY",
    color: "bg-cyan-500",
    barWidth: "5%",
  },
  {
    location: "Sweden",
    category: "International Traveler",
    flag: "🇸🇪",
    count: 40,
    percentage: "3.8%",
    subtitle: "Living in Sweden",
    primaryNationalities: "Swedish Citizens",
    status: "Expat Focus",
    statusVariant: "cyan",
    preferredPlan: "1 Month (฿14,999)",
    growth: "+16% YoY",
    color: "bg-cyan-500",
    barWidth: "4%",
  },
  {
    location: "New Zealand",
    category: "International Traveler",
    flag: "🇳🇿",
    count: 34,
    percentage: "3.3%",
    subtitle: "Living in New Zealand",
    primaryNationalities: "New Zealand Citizens",
    status: "High Response",
    statusVariant: "purple",
    preferredPlan: "3 Months (฿19,999)",
    growth: "+24% YoY",
    color: "bg-purple-500",
    barWidth: "3%",
  },
]

// ── Operational Pipeline Cards Data ──
export const operationalPipelineMetrics = [
  {
    id: "interest",
    title: "Registered Interest",
    count: "5,430",
    delta: "+250 this month",
    rate: "88.4% accepted",
    icon: ClipboardPen,
    iconBg: "bg-indigo-500/10 text-indigo-500",
    hoverBorder: "hover:border-indigo-500/40",
    segments: [
      { width: "88.4%", color: "bg-emerald-500" },
      { width: "3.9%", color: "bg-amber-500" },
      { width: "6.2%", color: "bg-slate-400" },
      { width: "1.5%", color: "bg-rose-500" },
    ],
    badges: [
      {
        icon: ThumbsUp,
        label: "Accepted",
        val: "4,800",
        cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        icon: Clock,
        label: "Pending",
        val: "210",
        cls: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        icon: CircleDot,
        label: "Received",
        val: "340",
        cls: "border-border bg-muted/40 text-muted-foreground",
      },
      {
        icon: ThumbsDown,
        label: "Declined",
        val: "80",
        cls: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
    ],
  },
  {
    id: "applications",
    title: "Application Forms",
    count: "3,120",
    delta: "+150 this month",
    rate: "95.2% completion",
    icon: FileText,
    iconBg: "bg-blue-500/10 text-blue-500",
    hoverBorder: "hover:border-blue-500/40",
    segments: [
      { width: "87.8%", color: "bg-emerald-500" },
      { width: "5.8%", color: "bg-amber-500" },
      { width: "4.8%", color: "bg-slate-400" },
      { width: "1.6%", color: "bg-rose-500" },
    ],
    badges: [
      {
        icon: CheckCircle2,
        label: "Completed",
        val: "2,740",
        cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        icon: Clock,
        label: "Pending",
        val: "180",
        cls: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        icon: CircleDot,
        label: "Received",
        val: "150",
        cls: "border-border bg-muted/40 text-muted-foreground",
      },
      {
        icon: Archive,
        label: "Closed",
        val: "50",
        cls: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
    ],
  },
  {
    id: "payments",
    title: "Completed Payments",
    count: "850",
    delta: "+50 this month",
    rate: "15 pending review",
    icon: CreditCard,
    iconBg: "bg-emerald-500/10 text-emerald-500",
    hoverBorder: "hover:border-emerald-500/40",
    segments: [
      { width: "92.9%", color: "bg-emerald-500" },
      { width: "4.1%", color: "bg-amber-500" },
      { width: "1.8%", color: "bg-blue-500" },
      { width: "1.2%", color: "bg-rose-500" },
    ],
    badges: [
      {
        icon: CheckCircle2,
        label: "Completed",
        val: "790",
        cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        icon: Clock,
        label: "Pending",
        val: "35",
        cls: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        icon: MinusCircle,
        label: "Refunded",
        val: "15",
        cls: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        icon: XCircle,
        label: "Cancelled",
        val: "10",
        cls: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      },
    ],
  },
  {
    id: "profiles",
    title: "Completed Profiles Pool",
    count: "2,890",
    delta: "Ready to Match",
    rate: "Profile completed",
    icon: Users2,
    iconBg: "bg-[#D3A753]/10 text-[#D3A753]",
    hoverBorder: "hover:border-[#D3A753]/40",
    segments: [
      { width: "92.7%", color: "bg-emerald-500" },
      { width: "7.3%", color: "bg-amber-500" },
    ],
    badges: [
      {
        icon: CheckCircle2,
        label: "Completed",
        val: "2,680",
        cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        icon: Clock,
        label: "Pending",
        val: "210",
        cls: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
    ],
  },
]

// ── Matchmaking & Tracking Live Data Sets ──
export interface TrackingPerson {
  id?: string
  customId: number | string
  name: string
  prefix?: string
  nationality: string
  currentLocation: string
  flag?: string
  headshot?: string
}

export interface TrackingConnection {
  id: string
  customTrackingId: string
  male: TrackingPerson
  female: TrackingPerson
  matchPercentage: number
  status: string
  statusLabel: string
  step: number
  matchmaker: string
  lastActivity: string
  notes?: string
}

// ── Matchmaking Status Distribution (for charts) ──
export interface StatusDistributionItem {
  stage: string
  count: number
  percentage: string
  color: string
  description: string
}

export const trackingStatusDistribution: StatusDistributionItem[] = [
  {
    stage: "Profiles Sent",
    count: 14,
    percentage: "17.3%",
    color: "#3b82f6",
    description: "Initial connect & dossiers delivered",
  },
  {
    stage: "Under Review",
    count: 21,
    percentage: "25.9%",
    color: "#f59e0b",
    description: "Lady or gentleman evaluating bio",
  },
  {
    stage: "Both Accepted",
    count: 14,
    percentage: "17.3%",
    color: "#D3A753",
    description: "Mutual double-consent confirmed",
  },
  {
    stage: "Video & Meets",
    count: 13,
    percentage: "16.0%",
    color: "#CA617D",
    description: "1st & 2nd Google Meet sessions",
  },
  {
    stage: "Follow-ups",
    count: 7,
    percentage: "8.6%",
    color: "#8b5cf6",
    description: "Post-date debrief & feedback",
  },
  {
    stage: "Matched 🎉",
    count: 12,
    percentage: "14.8%",
    color: "#10b981",
    description: "Exclusive life partnership agreed",
  },
]

// ── Monthly Introductions & Matching Trends (12 Months) ──
export interface MonthlyMatchingTrend {
  month: string
  introductions: number
  matched: number
  rate: number
}

export const monthlyMatchingTrends: MonthlyMatchingTrend[] = [
  { month: "Jan", introductions: 18, matched: 5, rate: 27.8 },
  { month: "Feb", introductions: 22, matched: 7, rate: 31.8 },
  { month: "Mar", introductions: 25, matched: 8, rate: 32.0 },
  { month: "Apr", introductions: 28, matched: 9, rate: 32.1 },
  { month: "May", introductions: 32, matched: 11, rate: 34.4 },
  { month: "Jun", introductions: 30, matched: 10, rate: 33.3 },
  { month: "Jul", introductions: 35, matched: 12, rate: 34.3 },
  { month: "Aug", introductions: 38, matched: 14, rate: 36.8 },
  { month: "Sep", introductions: 36, matched: 13, rate: 36.1 },
  { month: "Oct", introductions: 40, matched: 15, rate: 37.5 },
  { month: "Nov", introductions: 42, matched: 16, rate: 38.1 },
  { month: "Dec", introductions: 46, matched: 18, rate: 39.1 },
]

export const trackingMilestones = [
  { step: 1, name: "Initial Connect", status: "INITIAL_CONNECT", count: 8 },
  { step: 2, name: "Profiles Sent", status: "BOTH_PROFILES_SENT", count: 6 },
  { step: 3, name: "Female Review", status: "FEMALE_REVIEW", count: 12 },
  { step: 4, name: "Male Review", status: "MALE_REVIEW", count: 9 },
  {
    step: 5,
    name: "Both Accepted",
    status: "BOTH_PROFILES_ACCEPTED",
    count: 14,
  },
  { step: 6, name: "1st Google Meet", status: "FIRST_GOOGLE_MEET", count: 8 },
  { step: 7, name: "2nd Google Meet", status: "SECOND_GOOGLE_MEET", count: 5 },
  { step: 8, name: "Follow-ups", status: "FIRST_FOLLOW_UP", count: 7 },
  { step: 11, name: "Matched 🎉", status: "MATCHED", count: 12 },
]

export const initialTrackingConnections: TrackingConnection[] = [
  {
    id: "track-8041",
    customTrackingId: "M-8041",
    male: {
      customId: "0051",
      name: "Jonathan R.",
      prefix: "Mr.",
      nationality: "British",
      currentLocation: "United Kingdom",
      flag: "🇬🇧",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/1.jpg",
    },
    female: {
      customId: "0058",
      name: "Supaporn S.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/8.jpg",
    },
    matchPercentage: 92,
    status: "BOTH_PROFILES_ACCEPTED",
    statusLabel: "Both Accepted",
    step: 5,
    matchmaker: "Sarah M.",
    lastActivity: "Today, 14:30",
    notes: "Mutual consent confirmed. Preparing 1st introduction video call.",
  },
  {
    id: "track-8038",
    customTrackingId: "M-8038",
    male: {
      customId: "0062",
      name: "Michael B.",
      prefix: "Mr.",
      nationality: "American",
      currentLocation: "Thailand",
      flag: "🇺🇸",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/2.jpg",
    },
    female: {
      customId: "0044",
      name: "Kanya P.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/2.jpg",
    },
    matchPercentage: 88,
    status: "FIRST_GOOGLE_MEET",
    statusLabel: "1st Google Meet",
    step: 6,
    matchmaker: "David K.",
    lastActivity: "Today, 11:15",
    notes: "Google Meet consultation session scheduled with coordinator.",
  },
  {
    id: "track-8035",
    customTrackingId: "M-8035",
    male: {
      customId: "0077",
      name: "Alexander T.",
      prefix: "Mr.",
      nationality: "Australian",
      currentLocation: "Australia",
      flag: "🇦🇺",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/3.jpg",
    },
    female: {
      customId: "0039",
      name: "Nattaya W.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/3.jpg",
    },
    matchPercentage: 94,
    status: "SECOND_GOOGLE_MEET",
    statusLabel: "2nd Google Meet",
    step: 7,
    matchmaker: "Elena V.",
    lastActivity: "Yesterday, 18:00",
    notes:
      "2nd virtual meet positive. Gentleman scheduling Thailand flight for in-person date.",
  },
  {
    id: "track-8031",
    customTrackingId: "M-8031",
    male: {
      customId: "0048",
      name: "Thomas H.",
      prefix: "Mr.",
      nationality: "German",
      currentLocation: "Germany",
      flag: "🇩🇪",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/4.jpg",
    },
    female: {
      customId: "0052",
      name: "Pimchanok C.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/4.jpg",
    },
    matchPercentage: 85,
    status: "FEMALE_REVIEW",
    statusLabel: "Female Review",
    step: 3,
    matchmaker: "Sarah M.",
    lastActivity: "10 Sep, 16:45",
    notes: "Bio dossier delivered to lady. Awaiting confidential feedback.",
  },
  {
    id: "track-8027",
    customTrackingId: "M-8027",
    male: {
      customId: "0083",
      name: "Christian D.",
      prefix: "Mr.",
      nationality: "Swiss",
      currentLocation: "Thailand",
      flag: "🇨🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/5.jpg",
    },
    female: {
      customId: "0067",
      name: "Anong L.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/5.jpg",
    },
    matchPercentage: 81,
    status: "MALE_REVIEW",
    statusLabel: "Male Review",
    step: 4,
    matchmaker: "David K.",
    lastActivity: "09 Sep, 14:10",
    notes:
      "Lady approved proposal. Gentleman reviewing full profile and values.",
  },
  {
    id: "track-8022",
    customTrackingId: "M-8022",
    male: {
      customId: "0035",
      name: "William C.",
      prefix: "Mr.",
      nationality: "Canadian",
      currentLocation: "Canada",
      flag: "🇨🇦",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/6.jpg",
    },
    female: {
      customId: "0071",
      name: "Rattana M.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/6.jpg",
    },
    matchPercentage: 79,
    status: "BOTH_PROFILES_SENT",
    statusLabel: "Profiles Sent",
    step: 2,
    matchmaker: "Elena V.",
    lastActivity: "08 Sep, 10:20",
    notes: "Confidential match proposals sent via member portal.",
  },
  {
    id: "track-8018",
    customTrackingId: "M-8018",
    male: {
      customId: "0091",
      name: "James L.",
      prefix: "Mr.",
      nationality: "British",
      currentLocation: "Thailand",
      flag: "🇬🇧",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/7.jpg",
    },
    female: {
      customId: "0088",
      name: "Chutima K.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/7.jpg",
    },
    matchPercentage: 96,
    status: "MATCHED",
    statusLabel: "Matched 🎉",
    step: 11,
    matchmaker: "Sarah M.",
    lastActivity: "07 Sep, 19:30",
    notes:
      "Exclusive long-term partnership agreed after in-person Thailand dates.",
  },
  {
    id: "track-8012",
    customTrackingId: "M-8012",
    male: {
      customId: "0042",
      name: "Henrik S.",
      prefix: "Mr.",
      nationality: "Swedish",
      currentLocation: "Sweden",
      flag: "🇸🇪",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/8.jpg",
    },
    female: {
      customId: "0063",
      name: "Siriporn B.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/1.jpg",
    },
    matchPercentage: 87,
    status: "FIRST_FOLLOW_UP",
    statusLabel: "1st Follow-up",
    step: 8,
    matchmaker: "Elena V.",
    lastActivity: "05 Sep, 15:40",
    notes:
      "Debrief call completed. Next in-person lounge session being scheduled.",
  },
  {
    id: "track-8009",
    customTrackingId: "M-8009",
    male: {
      customId: "0055",
      name: "Oliver D.",
      prefix: "Mr.",
      nationality: "New Zealander",
      currentLocation: "New Zealand",
      flag: "🇳🇿",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/1.jpg",
    },
    female: {
      customId: "0047",
      name: "Panida T.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/2.jpg",
    },
    matchPercentage: 83,
    status: "INITIAL_CONNECT",
    statusLabel: "Initial Connect",
    step: 1,
    matchmaker: "Elena V.",
    lastActivity: "04 Sep, 11:20",
    notes: "Matchmaker initiating initial confidential connection.",
  },
  {
    id: "track-8004",
    customTrackingId: "M-8004",
    male: {
      customId: "0068",
      name: "David W.",
      prefix: "Mr.",
      nationality: "American",
      currentLocation: "Thailand",
      flag: "🇺🇸",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/male/3.jpg",
    },
    female: {
      customId: "0074",
      name: "Malai S.",
      prefix: "Ms.",
      nationality: "Thai",
      currentLocation: "Thailand",
      flag: "🇹🇭",
      headshot:
        "https://pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev/mock/women/4.jpg",
    },
    matchPercentage: 91,
    status: "THIRD_FOLLOW_UP",
    statusLabel: "3rd Follow-up",
    step: 10,
    matchmaker: "Sarah M.",
    lastActivity: "02 Sep, 17:15",
    notes: "3rd follow-up meeting completed. High mutual interest observed.",
  },
]
