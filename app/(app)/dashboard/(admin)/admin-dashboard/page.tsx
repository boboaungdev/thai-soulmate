"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  TrendingUp,
  ClipboardPen,
  FileText,
  CreditCard,
  Users2,
  HeartHandshake,
  HeartPulse,
  ArrowUpRight,
  ShieldCheck,
  CircleDot,
  Clock,
  ThumbsUp,
  ThumbsDown,
  CircleCheck,
  Archive,
  CheckCircle2,
  MinusCircle,
  XCircle,
  Target,
  Crown,
  Flame,
  Globe,
  Plane,
  MapPin,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"
import { cn } from "@/lib/utils"

// ── Financial Data Sets ──
const financial12Months = [
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

const financial6Months = financial12Months.slice(6)
const financial3Months = financial12Months.slice(9)

// ── Demographics Data ──
const genderDistributionData = [
  { name: "Thai Ladies", value: 1850, color: "#E791A7" },
  { name: "Gentlemen", value: 1040, color: "#D3A753" },
]

// ── Funnel Stages Data (End-to-End Pipeline) ──
const funnelStages = [
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
const gentlemenByNationality = [
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
const gentlemenByLocation = [
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
    location: "Sweden & New Zealand",
    category: "International Traveler",
    flag: "🌐",
    count: 74,
    percentage: "7.1%",
    subtitle: "Living in SE (40) & NZ (34)",
    primaryNationalities: "Nordics & NZ",
    status: "Active Pipeline",
    statusVariant: "purple",
    preferredPlan: "1M / 3M Plans",
    growth: "+21% YoY",
    color: "bg-purple-500",
    barWidth: "7%",
  },
]

// ── Custom Tooltip for Financial Chart ──
interface TooltipPayloadItem {
  dataKey: string
  value: number
  color: string
}

interface FinancialChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function FinancialChartTooltip({
  active,
  payload,
  label,
}: FinancialChartTooltipProps) {
  if (active && payload && payload.length) {
    const rev = payload.find((p) => p.dataKey === "revenue")?.value || 0
    const prof = payload.find((p) => p.dataKey === "profit")?.value || 0
    const margin = rev > 0 ? ((prof / rev) * 100).toFixed(1) : "0.0"

    return (
      <div className="rounded-xl border border-[#D3A753]/30 bg-popover/95 p-3.5 shadow-2xl backdrop-blur-md">
        <p className="mb-2 text-xs font-bold text-foreground">
          {label} 2026 Financials
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-5">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-[#D3A753]" />
              Gross Revenue:
            </span>
            <span className="font-bold text-foreground">
              ฿{rev.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-5">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-[#CA617D]" />
              Net Profit:
            </span>
            <span className="font-bold text-[#CA617D]">
              ฿{prof.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-5 border-t border-border/60 pt-1.5 text-[11px]">
            <span className="text-muted-foreground">Profit Margin:</span>
            <span className="font-bold text-[#D3A753]">{margin}%</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"3M" | "6M" | "1Y">("1Y")
  const [geoView, setGeoView] = useState<"nationality" | "location">(
    "nationality"
  )

  const chartData =
    timeRange === "3M"
      ? financial3Months
      : timeRange === "6M"
        ? financial6Months
        : financial12Months

  const totalRev = chartData.reduce((acc, curr) => acc + curr.revenue, 0)
  const totalProf = chartData.reduce((acc, curr) => acc + curr.profit, 0)
  const avgMargin = ((totalProf / totalRev) * 100).toFixed(1)

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-6 lg:p-6">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-2 animate-pulse rounded-full bg-emerald-500" />
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#D3A753] uppercase">
            EXECUTIVE INTELLIGENCE
          </p>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Real-time financial performance, member pipeline, and curated match
          tracking.
        </p>
      </div>

      {/* ── Personalized Welcome Card with Live Time ── */}
      <WelcomeBanner />

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: HERO FINANCIAL OVERVIEW (1 Big Card + 2 Small Cards) ── */}
      {/* Matching Calendar column width layout: [minmax(0,1fr)_22rem]        ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main Big Financial Card with Revenue Area & Profit Line */}
        <Card className="relative min-w-0 overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 shadow-xs">
          {/* Subtle ambient lighting glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-[#D3A753]/8 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 size-64 rounded-full bg-[#CA617D]/8 blur-3xl" />

          <CardHeader className="pb-3">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#D3A753] uppercase">
                    MEMBERSHIP REVENUE
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500"
                  >
                    <ArrowUpRight className="mr-0.5 size-3" />
                    +24.8% YoY
                  </Badge>
                </div>
                <CardTitle className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Membership Revenue & Net Profit
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly gross membership income from Gentlemen & Female VIP
                  plans against net profit.
                </CardDescription>
              </div>

              {/* Time Range Selector Tabs */}
              <div className="flex items-center rounded-xl border border-border/70 bg-muted/40 p-1">
                {(["3M", "6M", "1Y"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTimeRange(tab)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                      timeRange === tab
                        ? "bg-gradient-to-r from-[#D3A753] to-[#CA617D] font-semibold text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Highlights: 3 Distinct Luxury KPI blocks + Chart Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 sm:flex-nowrap">
              <div className="flex flex-1 flex-wrap items-center gap-5 sm:gap-7">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="size-2 rounded-full bg-[#D3A753]" />
                    Gross Membership
                  </div>
                  <p className="mt-0.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    ฿{totalRev.toLocaleString()}
                  </p>
                </div>

                <div className="h-8 w-px bg-border/60" />

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#CA617D]">
                    <span className="size-2 rounded-full bg-[#CA617D]" />
                    Net Profit
                  </div>
                  <p className="mt-0.5 text-lg font-bold tracking-tight text-[#CA617D] sm:text-xl">
                    ฿{totalProf.toLocaleString()}
                  </p>
                </div>

                <div className="h-8 w-px bg-border/60" />

                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Profit Margin
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-lg font-bold tracking-tight text-[#D3A753] sm:text-xl">
                      {avgMargin}%
                    </span>
                    <Badge
                      variant="outline"
                      className="h-4.5 border-[#D3A753]/30 bg-[#D3A753]/10 px-1.5 text-[9px] font-semibold text-[#D3A753]"
                    >
                      Industry Peak
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Chart Visual Legend */}
              <div className="hidden items-center gap-3 border-l border-border/60 pl-4 text-[11px] md:flex">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full bg-[#D3A753]" />
                  Area: Gross Membership
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full bg-[#CA617D]" />
                  Line: Net Profit
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="h-[280px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#D3A753"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#D3A753"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="profitGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#CA617D"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#CA617D"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(211, 167, 83, 0.12)"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                    dy={5}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `฿${Number(val) / 1000}k`}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                    dx={-5}
                  />

                  <Tooltip content={<FinancialChartTooltip />} />

                  {/* Revenue Area */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Gross Revenue"
                    stroke="#D3A753"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                  />

                  {/* Net Profit Line - Emphasized Profit Line */}
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit"
                    stroke="#CA617D"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#CA617D",
                      stroke: "#1C0E12",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#E791A7",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Beside 2 Small Cards (22rem fixed width column on desktop) */}
        <div className="flex w-full flex-col justify-between gap-6">
          {/* Small Card 1: Membership Revenue Split (Male vs Female VIP) */}
          <Card className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-[#D3A753]/40">
            <div className="pointer-events-none absolute top-0 right-0 size-32 rounded-full bg-[#D3A753]/8 blur-2xl" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#D3A753]/12 text-[#D3A753] ring-1 ring-[#D3A753]/25">
                    <Crown className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Membership Revenue Split
                    </p>
                    <p className="text-xl font-bold tracking-tight text-foreground">
                      148 Paid Members
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[#D3A753]/30 bg-[#D3A753]/10 text-[10px] font-semibold text-[#D3A753]"
                >
                  <ArrowUpRight className="mr-0.5 size-3" />
                  +18.4% YoY
                </Badge>
              </div>

              {/* Ratio Bar: Gentlemen vs Female VIP */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <span className="size-1.5 rounded-full bg-[#D3A753]" />
                    Gentlemen (73.8%)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-[#CA617D]">
                    <span className="size-1.5 rounded-full bg-[#CA617D]" />
                    Female VIP (26.2%)
                  </span>
                </div>
                <div className="relative flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-l-full bg-gradient-to-r from-[#D3A753] to-[#CFA14F]"
                    style={{ width: "73.8%" }}
                  />
                  <div
                    className="h-full rounded-r-full bg-gradient-to-r from-[#E791A7] to-[#CA617D]"
                    style={{ width: "26.2%" }}
                  />
                </div>
              </div>
            </div>

            {/* Breakdown Cards for Male & Female VIP */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
              <div className="rounded-xl border border-[#D3A753]/20 bg-[#D3A753]/5 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Male Memberships
                  </span>
                  <span className="text-[9px] font-bold text-[#D3A753]">
                    73.8%
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  ฿1,385,000
                </p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  68 Gentlemen (1M / 3M)
                </p>
              </div>

              <div className="rounded-xl border border-[#CA617D]/20 bg-[#CA617D]/5 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Female VIP Plans
                  </span>
                  <span className="text-[9px] font-bold text-[#CA617D]">
                    26.2%
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  ฿492,000
                </p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  80 VIP Ladies (6M / 12M)
                </p>
              </div>
            </div>
          </Card>

          {/* Small Card 2: Package Popularity */}
          <Card className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-[#CA617D]/40">
            <div className="pointer-events-none absolute top-0 right-0 size-32 rounded-full bg-[#CA617D]/8 blur-2xl" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#D3A753]/15 to-[#CA617D]/15 text-[#CA617D] ring-1 ring-[#CA617D]/25">
                    <Flame className="size-4.5 text-[#CA617D]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Package Popularity
                    </p>
                    <p className="text-xl font-bold tracking-tight text-foreground">
                      3 Months is #1
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-gradient-to-r from-[#D3A753] to-[#CA617D] text-[10px] font-bold text-white shadow-xs"
                >
                  Most Popular
                </Badge>
              </div>

              {/* Tier Distribution Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">
                    Plan Sales Share
                  </span>
                  <span className="font-bold text-foreground">
                    48% choose 3-Months
                  </span>
                </div>
                <div className="relative flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-l-full bg-gradient-to-r from-[#D3A753] to-[#E791A7]"
                    style={{ width: "48%" }}
                  />
                  <div
                    className="h-full bg-[#CA617D]"
                    style={{ width: "32%" }}
                  />
                  <div
                    className="h-full rounded-r-full bg-muted-foreground/50"
                    style={{ width: "20%" }}
                  />
                </div>
              </div>
            </div>

            {/* 3 Real Website Pricing Packages */}
            <div className="mt-4 grid grid-cols-3 gap-1.5 border-t border-border/60 pt-3 text-xs">
              <div className="rounded-xl border border-[#D3A753]/25 bg-muted/20 p-2">
                <p className="text-[10px] font-semibold text-[#D3A753]">
                  3 Months
                </p>
                <p className="mt-0.5 text-xs font-bold text-foreground">48%</p>
                <p className="text-[9px] text-muted-foreground">71 sales</p>
              </div>

              <div className="rounded-xl border border-[#CA617D]/25 bg-muted/20 p-2">
                <p className="text-[10px] font-semibold text-[#CA617D]">
                  1 Month
                </p>
                <p className="mt-0.5 text-xs font-bold text-foreground">32%</p>
                <p className="text-[9px] text-muted-foreground">47 sales</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
                <p className="text-[10px] font-semibold text-muted-foreground">
                  6M / 12M
                </p>
                <p className="mt-0.5 text-xs font-bold text-foreground">20%</p>
                <p className="text-[9px] text-muted-foreground">30 sales</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: OPERATIONAL METRICS (4 Executive Metric Cards) ─────── */}
      {/* ── Matching Calendar line 915: grid-cols-2 gap-4 lg:grid-cols-4   ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Registered Interest */}
        <Card className="flex flex-col justify-between rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-indigo-500/40">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Registered Interest
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <ClipboardPen className="size-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                5,430
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-emerald-500">
                  +250 this month
                </span>
                <span>88.4% accepted</span>
              </div>
            </div>

            {/* Visual Status Ratio Bar */}
            <div className="mt-3 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-l-full bg-emerald-500"
                style={{ width: "88.4%" }}
              />
              <div className="h-full bg-amber-500" style={{ width: "3.9%" }} />
              <div className="h-full bg-slate-400" style={{ width: "6.2%" }} />
              <div
                className="h-full rounded-r-full bg-rose-500"
                style={{ width: "1.5%" }}
              />
            </div>
          </div>

          {/* Status Breakdown from Register Interest Data Table */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
            <Badge
              variant="outline"
              className="h-5 gap-1 border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <ThumbsUp className="size-2.5" />
              <span>Accepted:</span>
              <span className="font-bold">4,800</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
            >
              <Clock className="size-2.5" />
              <span>Pending:</span>
              <span className="font-bold">210</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-border bg-muted/40 px-1.5 text-[10px] font-medium text-muted-foreground"
            >
              <CircleDot className="size-2.5" />
              <span>Received:</span>
              <span className="font-bold">340</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-rose-500/30 bg-rose-500/10 px-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-400"
            >
              <ThumbsDown className="size-2.5" />
              <span>Declined:</span>
              <span className="font-bold">80</span>
            </Badge>
          </div>
        </Card>

        {/* Card 2: Application Forms */}
        <Card className="flex flex-col justify-between rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-blue-500/40">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Application Forms
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="size-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                3,120
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-emerald-500">
                  +150 this month
                </span>
                <span>95.2% completion</span>
              </div>
            </div>

            {/* Visual Status Ratio Bar */}
            <div className="mt-3 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-l-full bg-emerald-500"
                style={{ width: "87.8%" }}
              />
              <div className="h-full bg-amber-500" style={{ width: "5.8%" }} />
              <div className="h-full bg-slate-400" style={{ width: "4.8%" }} />
              <div
                className="h-full rounded-r-full bg-rose-500"
                style={{ width: "1.6%" }}
              />
            </div>
          </div>

          {/* Status Breakdown from Application Form Data Table */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
            <Badge
              variant="outline"
              className="h-5 gap-1 border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CircleCheck className="size-2.5" />
              <span>Completed:</span>
              <span className="font-bold">2,740</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
            >
              <Clock className="size-2.5" />
              <span>Pending:</span>
              <span className="font-bold">180</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-border bg-muted/40 px-1.5 text-[10px] font-medium text-muted-foreground"
            >
              <CircleDot className="size-2.5" />
              <span>Received:</span>
              <span className="font-bold">150</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-rose-500/30 bg-rose-500/10 px-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-400"
            >
              <Archive className="size-2.5" />
              <span>Closed:</span>
              <span className="font-bold">50</span>
            </Badge>
          </div>
        </Card>

        {/* Card 3: Completed Payments */}
        <Card className="flex flex-col justify-between rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-emerald-500/40">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Completed Payments
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CreditCard className="size-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                850
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-emerald-500">
                  +50 this month
                </span>
                <span>15 pending review</span>
              </div>
            </div>

            {/* Visual Status Ratio Bar */}
            <div className="mt-3 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-l-full bg-emerald-500"
                style={{ width: "92.9%" }}
              />
              <div className="h-full bg-amber-500" style={{ width: "4.1%" }} />
              <div className="h-full bg-blue-500" style={{ width: "1.8%" }} />
              <div
                className="h-full rounded-r-full bg-rose-500"
                style={{ width: "1.2%" }}
              />
            </div>
          </div>

          {/* Status Breakdown from Payment Data Table */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
            <Badge
              variant="outline"
              className="h-5 gap-1 border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="size-2.5" />
              <span>Completed:</span>
              <span className="font-bold">790</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
            >
              <Clock className="size-2.5" />
              <span>Pending:</span>
              <span className="font-bold">35</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-blue-500/30 bg-blue-500/10 px-1.5 text-[10px] font-medium text-blue-600 dark:text-blue-400"
            >
              <MinusCircle className="size-2.5" />
              <span>Refunded:</span>
              <span className="font-bold">15</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-rose-500/30 bg-rose-500/10 px-1.5 text-[10px] font-medium text-rose-600 dark:text-rose-400"
            >
              <XCircle className="size-2.5" />
              <span>Cancelled:</span>
              <span className="font-bold">10</span>
            </Badge>
          </div>
        </Card>

        {/* Card 4: Completed Profiles Pool */}
        <Card className="flex flex-col justify-between rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-[#D3A753]/40">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Completed Profiles Pool
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#D3A753]/10 text-[#D3A753]">
                <Users2 className="size-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                2,890
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-[#D3A753]">
                  Ready to Match
                </span>
                <span>Profile completed</span>
              </div>
            </div>

            {/* Visual Status Ratio Bar */}
            <div className="mt-3 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-l-full bg-emerald-500"
                style={{ width: "92.7%" }}
              />
              <div
                className="h-full rounded-r-full bg-amber-500"
                style={{ width: "7.3%" }}
              />
            </div>
          </div>

          {/* Status Breakdown from Profiles Data Table */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
            <Badge
              variant="outline"
              className="h-5 gap-1 border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="size-2.5" />
              <span>Completed:</span>
              <span className="font-bold">2,680</span>
            </Badge>
            <Badge
              variant="outline"
              className="h-5 gap-1 border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
            >
              <Clock className="size-2.5" />
              <span>Pending:</span>
              <span className="font-bold">210</span>
            </Badge>
          </div>
        </Card>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 3: FUNNEL PROGRESSION & DEMOGRAPHIC BALANCE ───────────── */}
      {/* ── Matching Calendar layout: [minmax(0,1fr)_22rem]                 ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Matchmaking Conversion Funnel (Main Column) */}
        <Card className="min-w-0 rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-6 shadow-xs">
          <CardHeader className="p-0 pb-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#D3A753] uppercase">
                    PIPELINE EFFICIENCY
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500"
                  >
                    Completed Profiles
                  </Badge>
                </div>
                <CardTitle className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  Member Journey & Conversion Funnel
                </CardTitle>
                <CardDescription className="text-xs">
                  Step-by-step pipeline from website consultation to mutually
                  agreed introductions.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-1 text-xs">
                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-muted-foreground">
                  6 Active Stages
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-0 pt-2">
            {funnelStages.map((stage) => {
              const Icon = stage.icon
              return (
                <div
                  key={stage.stage}
                  className="group relative rounded-xl border border-border/50 bg-muted/20 p-3 transition-all hover:border-border/80 hover:bg-muted/35"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      {/* Step Number */}
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted/60 font-mono text-[10px] font-bold text-muted-foreground">
                        {stage.step}
                      </span>

                      {/* Icon */}
                      <div
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-lg border",
                          stage.borderColor,
                          stage.bgColor,
                          stage.textColor
                        )}
                      >
                        <Icon className="size-3.5" />
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {stage.stage}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "h-4 border px-1.5 text-[9px] font-semibold",
                              stage.borderColor,
                              stage.bgColor,
                              stage.textColor
                            )}
                          >
                            {stage.stepRate}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Counts & Percentage */}
                    <div className="flex items-center justify-between gap-3 pl-9 font-mono text-xs sm:justify-end sm:pl-0">
                      <span className="font-bold text-foreground">
                        {stage.count.toLocaleString()}
                      </span>
                      <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {stage.percentage} of pool
                      </span>
                    </div>
                  </div>

                  {/* Progress track */}
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        stage.color
                      )}
                      style={{ width: stage.barWidth }}
                    />
                  </div>
                </div>
              )
            })}

            {/* Bottom 3-Metric Funnel Takeaways */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-center">
              <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
                <p className="text-[10px] text-muted-foreground">
                  Intake Completion
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  57.5%
                </p>
                <p className="text-[9px] font-medium text-emerald-500">
                  Interest → Form
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
                <p className="text-[10px] text-muted-foreground">
                  Profile Completion
                </p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  92.6%
                </p>
                <p className="text-[9px] font-medium text-emerald-500">
                  Profile Completed
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
                <p className="text-[10px] text-muted-foreground">
                  Date Success
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#D3A753]">36.8%</p>
                <p className="text-[9px] font-medium text-[#CA617D]">
                  Mutual Consent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Demographic Balance (22rem Sidebar Column) */}
        <Card className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-6 shadow-xs">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">
                  Completed Profiles Pool
                </CardTitle>
                <CardDescription className="text-xs">
                  Gender split across all 2,890 completed profiles.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500"
              >
                Healthy Balance
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col items-center justify-between p-0 pt-2">
            <div className="relative my-auto size-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genderDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Text */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Total
                </span>
                <span className="text-xl font-black text-foreground">
                  2,890
                </span>
                <span className="text-[10px] text-[#D3A753]">Completed</span>
              </div>
            </div>

            {/* 2 Clear Visual Breakdown Cards */}
            <div className="mt-4 grid w-full grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
              <div className="rounded-xl border border-[#E791A7]/30 bg-[#E791A7]/10 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#CA617D]">
                    Thai Ladies
                  </span>
                  <span className="rounded-md bg-[#E791A7]/25 px-1.5 py-0.5 text-[9px] font-bold text-[#CA617D]">
                    64%
                  </span>
                </div>
                <p className="mt-1 text-base font-bold text-foreground">
                  1,850
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Living in Thailand
                </p>
              </div>

              <div className="rounded-xl border border-[#D3A753]/30 bg-[#D3A753]/10 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#D3A753]">
                    Gentlemen
                  </span>
                  <span className="rounded-md bg-[#D3A753]/25 px-1.5 py-0.5 text-[9px] font-bold text-[#D3A753]">
                    36%
                  </span>
                </div>
                <p className="mt-1 text-base font-bold text-foreground">
                  1,040
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Expats & International
                </p>
              </div>
            </div>

            {/* Simple Business Takeaway */}
            <div className="mt-3 flex w-full items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs">
              <span className="text-[10px] text-muted-foreground">
                Candidates per Gentleman:
              </span>
              <span className="text-[11px] font-semibold text-foreground">
                ~1.8 Ladies available
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 4: GENTLEMEN NATIONALITY & CURRENT LOCATION ────────────── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <Card className="overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-6 shadow-xs">
        <CardHeader className="p-0 pb-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#D3A753] uppercase">
                  MEMBER DEMOGRAPHICS
                </span>
                <Badge
                  variant="outline"
                  className="border-[#D3A753]/30 bg-[#D3A753]/10 text-[10px] font-semibold text-[#D3A753]"
                >
                  1,040 Verified Gentlemen
                </Badge>
              </div>
              <CardTitle className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Gentlemen Nationality & Current Location
              </CardTitle>
              <CardDescription className="text-xs">
                Tracking passport nationality alongside real-time physical
                residence across 1,040 gentlemen.
              </CardDescription>
            </div>

            {/* View Switcher: By Nationality vs By Current Location */}
            <div className="flex items-center rounded-xl border border-border/70 bg-muted/40 p-1">
              <button
                onClick={() => setGeoView("nationality")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                  geoView === "nationality"
                    ? "bg-gradient-to-r from-[#D3A753] to-[#CA617D] font-semibold text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                By Nationality
              </button>
              <button
                onClick={() => setGeoView("location")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                  geoView === "location"
                    ? "bg-gradient-to-r from-[#D3A753] to-[#CA617D] font-semibold text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                By Current Location
              </button>
            </div>
          </div>

          {/* Dual Global Physical Location Ratio Bar */}
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-3">
            <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-[#CA617D]" />
                <span className="font-semibold text-foreground">
                  ✈️ Residing Abroad:
                </span>
                <span className="font-bold text-foreground">
                  749 Gentlemen (72.0%)
                </span>
                <span className="hidden text-[10px] text-muted-foreground md:inline">
                  — Fly to Thailand for scheduled dates
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-[#D3A753]" />
                <span className="font-semibold text-foreground">
                  🇹🇭 Residing in Thailand:
                </span>
                <span className="font-bold text-[#D3A753]">
                  291 Gentlemen (28.0%)
                </span>
                <span className="hidden text-[10px] text-muted-foreground md:inline">
                  — Local Expats ready for in-person dates
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-l-full bg-gradient-to-r from-[#E791A7] to-[#CA617D]"
                style={{ width: "72%" }}
                title="Residing Abroad: 72%"
              />
              <div
                className="h-full rounded-r-full bg-gradient-to-r from-[#D3A753] to-[#CFA14F]"
                style={{ width: "28%" }}
                title="Residing in Thailand: 28%"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {geoView === "nationality" ? (
            /* VIEW A: BY NATIONALITY (WITH LOCATION BREAKDOWN CHIPS) */
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {gentlemenByNationality.map((item) => (
                <div
                  key={item.country}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:border-[#D3A753]/40 hover:bg-muted/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xl"
                          role="img"
                          aria-label={item.country}
                        >
                          {item.flag}
                        </span>
                        <div>
                          <p className="max-w-[105px] truncate text-xs font-bold text-foreground">
                            {item.country}
                          </p>
                          <p className="text-[10px] font-medium text-[#D3A753]">
                            {item.nationality}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 shrink-0 px-1.5 text-[9px] font-semibold",
                          item.statusVariant === "gold" &&
                            "border-[#D3A753]/30 bg-[#D3A753]/10 text-[#D3A753]",
                          item.statusVariant === "rose" &&
                            "border-[#CA617D]/30 bg-[#CA617D]/10 text-[#CA617D]",
                          item.statusVariant === "emerald" &&
                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                          item.statusVariant === "blue" &&
                            "border-blue-500/30 bg-blue-500/10 text-blue-500",
                          item.statusVariant === "red" &&
                            "border-rose-500/30 bg-rose-500/10 text-rose-500",
                          item.statusVariant === "amber" &&
                            "border-amber-500/30 bg-amber-500/10 text-amber-500",
                          item.statusVariant === "cyan" &&
                            "border-cyan-500/30 bg-cyan-500/10 text-cyan-500",
                          item.statusVariant === "purple" &&
                            "border-purple-500/30 bg-purple-500/10 text-purple-500"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                          {item.count}
                        </span>
                        <span className="ml-1 text-[11px] text-muted-foreground">
                          Members
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {item.percentage}
                      </span>
                    </div>

                    {/* Both Nationality & Current Location in the card */}
                    <div className="mt-2.5 space-y-1 rounded-lg border border-border/40 bg-background/50 p-2 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Plane className="size-2.5 text-[#CA617D]" />
                          <span>In Home Country:</span>
                        </span>
                        <span className="font-semibold text-foreground">
                          {item.abroadCount} ({item.abroadPercent})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="size-2.5 text-[#D3A753]" />
                          <span>Expat in Thailand:</span>
                        </span>
                        <span className="font-semibold text-[#D3A753]">
                          {item.thailandCount} ({item.thailandPercent})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[10px]">
                    <span className="max-w-[95px] truncate text-muted-foreground">
                      {item.preferredPlan}
                    </span>
                    <span className="font-semibold text-emerald-500">
                      {item.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VIEW B: BY CURRENT PHYSICAL LOCATION */
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {gentlemenByLocation.map((item) => (
                <div
                  key={item.location}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:border-[#D3A753]/40 hover:bg-muted/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xl"
                          role="img"
                          aria-label={item.location}
                        >
                          {item.flag}
                        </span>
                        <div>
                          <p className="max-w-[105px] truncate text-xs font-bold text-foreground">
                            {item.location}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 shrink-0 px-1.5 text-[9px] font-semibold",
                          item.statusVariant === "gold" &&
                            "border-[#D3A753]/30 bg-[#D3A753]/10 text-[#D3A753]",
                          item.statusVariant === "rose" &&
                            "border-[#CA617D]/30 bg-[#CA617D]/10 text-[#CA617D]",
                          item.statusVariant === "emerald" &&
                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                          item.statusVariant === "blue" &&
                            "border-blue-500/30 bg-blue-500/10 text-blue-500",
                          item.statusVariant === "red" &&
                            "border-rose-500/30 bg-rose-500/10 text-rose-500",
                          item.statusVariant === "amber" &&
                            "border-amber-500/30 bg-amber-500/10 text-amber-500",
                          item.statusVariant === "cyan" &&
                            "border-cyan-500/30 bg-cyan-500/10 text-cyan-500",
                          item.statusVariant === "purple" &&
                            "border-purple-500/30 bg-purple-500/10 text-purple-500"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                          {item.count}
                        </span>
                        <span className="ml-1 text-[11px] text-muted-foreground">
                          Gentlemen
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {item.percentage}
                      </span>
                    </div>

                    <div className="mt-2.5 rounded-lg border border-border/40 bg-background/50 p-2 text-[10px]">
                      <p className="text-muted-foreground">
                        Primary Passports:
                      </p>
                      <p className="mt-0.5 font-semibold text-foreground">
                        {item.primaryNationalities}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[10px]">
                    <span className="max-w-[95px] truncate text-muted-foreground">
                      {item.preferredPlan}
                    </span>
                    <span className="font-semibold text-emerald-500">
                      {item.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Strategic Takeaways Strip */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-border/60 pt-4 text-xs sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#D3A753]/10 text-[#D3A753]">
                <Globe className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Nationality Concentration
                </p>
                <p className="font-bold text-foreground">
                  UK, US & Australia (65% Passports)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#CA617D]/10 text-[#CA617D]">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Immediate Date Readiness
                </p>
                <p className="font-bold text-foreground">
                  291 Expats Living in Thailand
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Plane className="size-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Overseas Dating Pipeline
                </p>
                <p className="font-bold text-foreground">
                  749 Travel to Thailand for Dates
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
