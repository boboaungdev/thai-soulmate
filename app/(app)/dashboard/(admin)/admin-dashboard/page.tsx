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
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  ClipboardPen,
  FileText,
  CreditCard,
  Users2,
  HeartHandshake,
  HeartPulse,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Layers,
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
  { name: "Ladies (In Thailand)", value: 1850, color: "#E791A7" },
  { name: "Gentlemen (International & Expats)", value: 1040, color: "#D3A753" },
]

// ── Funnel Stages Data ──
const funnelStages = [
  {
    stage: "Registered Interest",
    count: 5430,
    percentage: "100%",
    rate: "Initial Entry",
    color: "bg-indigo-500",
    textColor: "text-indigo-500",
    icon: ClipboardPen,
  },
  {
    stage: "Application Form Submitted",
    count: 3120,
    percentage: "57.5%",
    rate: "57.5% conversion",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    icon: FileText,
  },
  {
    stage: "Verified Profile Pool",
    count: 2890,
    percentage: "53.2%",
    rate: "92.6% qualification",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    icon: ShieldCheck,
  },
  {
    stage: "In Matching & Consultation",
    count: 340,
    percentage: "6.3%",
    rate: "Hand-curated matching",
    color: "bg-[#D3A753]",
    textColor: "text-[#D3A753]",
    icon: HeartPulse,
  },
  {
    stage: "Mutually Agreed Introductions",
    count: 125,
    percentage: "2.3%",
    rate: "Mutual consent met",
    color: "bg-[#CA617D]",
    textColor: "text-[#CA617D]",
    icon: HeartHandshake,
  },
]

// ── Recent Matchmaking Activity Feed ──
const recentIntroductions = [
  {
    id: "M-8041",
    gentleman: "Jonathan R.",
    gentlemanCountry: "United Kingdom",
    lady: "Supaporn S.",
    ladyCountry: "Thailand",
    matchStage: "First Introduction",
    status: "MUTUAL CONSENT",
    statusVariant: "success",
    matchmaker: "Sarah M.",
    date: "Today, 14:30",
  },
  {
    id: "M-8038",
    gentleman: "Michael B.",
    gentlemanCountry: "United States",
    lady: "Kanya P.",
    ladyCountry: "Thailand",
    matchStage: "Video Consultation",
    status: "SCHEDULED",
    statusVariant: "warning",
    matchmaker: "David K.",
    date: "Today, 11:15",
  },
  {
    id: "M-8035",
    gentleman: "Alexander T.",
    gentlemanCountry: "Australia",
    lady: "Nattaya W.",
    ladyCountry: "Thailand",
    matchStage: "In-Person Meeting",
    status: "CONFIRMED",
    statusVariant: "success",
    matchmaker: "Elena V.",
    date: "Yesterday",
  },
  {
    id: "M-8031",
    gentleman: "Thomas H.",
    gentlemanCountry: "Germany",
    lady: "Pimchanok C.",
    ladyCountry: "Thailand",
    matchStage: "Profile Review",
    status: "UNDER REVIEW",
    statusVariant: "secondary",
    matchmaker: "Sarah M.",
    date: "10 Sep",
  },
  {
    id: "M-8027",
    gentleman: "Christian D.",
    gentlemanCountry: "Switzerland",
    lady: "Anong L.",
    ladyCountry: "Thailand",
    matchStage: "Match Proposal",
    status: "AWAITING CONSENT",
    statusVariant: "warning",
    matchmaker: "David K.",
    date: "09 Sep",
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-2 animate-pulse rounded-full bg-emerald-500" />
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#D3A753] uppercase">
              EXECUTIVE INTELLIGENCE
            </p>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Matchmaking Operations Dashboard
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Real-time financial performance, member pipeline, and curated match
            tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border/80 text-xs shadow-xs hover:border-[#D3A753]/40 hover:text-[#D3A753]"
            onClick={() => window.print()}
          >
            <Layers className="mr-1.5 size-3.5 text-[#D3A753]" />
            Print Report
          </Button>
          <Button
            size="sm"
            className="rounded-lg bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D] text-xs font-semibold text-white shadow-xs hover:opacity-95"
          >
            <Sparkles className="mr-1.5 size-3.5" />
            New Match Request
          </Button>
        </div>
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
                    FINANCIAL HEALTH
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
                  Revenue & Net Profit
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly gross matchmaking revenue against realized net profit.
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

            {/* Financial Highlights Strip */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border/60 py-3 sm:grid-cols-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Total Gross Revenue
                </p>
                <p className="text-lg font-bold text-foreground sm:text-xl">
                  ฿{totalRev.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#CA617D]">
                  Total Net Profit
                </p>
                <p className="text-lg font-bold text-[#CA617D] sm:text-xl">
                  ฿{totalProf.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Profit Margin
                </p>
                <p className="text-lg font-bold text-[#D3A753] sm:text-xl">
                  {avgMargin}%
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#D3A753]" />
                    <span className="text-muted-foreground">Gross Revenue</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#CA617D]" />
                    <span className="font-semibold text-[#CA617D]">
                      Net Profit Line
                    </span>
                  </span>
                </div>
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
        <div className="flex w-full flex-col gap-6">
          {/* Small Card 1: Net Profit & Target Realization */}
          <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-[#CA617D]/40">
            <div className="pointer-events-none absolute top-0 right-0 size-32 rounded-full bg-[#CA617D]/8 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#CA617D]/12 text-[#CA617D] ring-1 ring-[#CA617D]/25">
                  <TrendingUp className="size-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Net Profit Realized
                  </p>
                  <p className="text-xl font-bold tracking-tight text-[#CA617D]">
                    ฿1,428,500
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500"
              >
                +18.4%
              </Badge>
            </div>

            {/* Target Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">
                  Annual Target Progress
                </span>
                <span className="font-bold text-foreground">
                  95.2% (฿1.5M Goal)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                <div className="h-full w-[95.2%] rounded-full bg-gradient-to-r from-[#D3A753] to-[#CA617D]" />
              </div>
            </div>

            {/* Revenue Stream Breakdown */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground">
                  VIP Match Retainers
                </p>
                <p className="font-semibold text-foreground">฿1,016,050</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Consultations
                </p>
                <p className="font-semibold text-foreground">฿412,450</p>
              </div>
            </div>
          </Card>

          {/* Small Card 2: Average Member Lifetime Value */}
          <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-[#D3A753]/40">
            <div className="pointer-events-none absolute top-0 right-0 size-32 rounded-full bg-[#D3A753]/8 blur-2xl" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#D3A753]/12 text-[#D3A753] ring-1 ring-[#D3A753]/25">
                  <DollarSign className="size-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Average Client Value
                  </p>
                  <p className="text-xl font-bold tracking-tight text-foreground">
                    ฿38,450
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-[#D3A753]/30 bg-[#D3A753]/10 text-[10px] font-semibold text-[#D3A753]"
              >
                +12.6%
              </Badge>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-xs text-muted-foreground">
                Average realization per successful introduction & membership
                contract.
              </p>
            </div>

            {/* Key Efficiency Ratios */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Active VIP Clients
                </p>
                <p className="font-semibold text-[#D3A753]">148 Members</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Renewal / Retention
                </p>
                <p className="font-semibold text-emerald-500">86.4% Rate</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: OPERATIONAL METRICS (4 Executive Metric Cards) ─────── */}
      {/* ── Matching Calendar line 915: grid-cols-2 gap-4 lg:grid-cols-4   ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Registered Interest */}
        <Card className="rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-indigo-500/40">
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
        </Card>

        {/* Card 2: Application Forms */}
        <Card className="rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-blue-500/40">
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
        </Card>

        {/* Card 3: Completed Payments */}
        <Card className="rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-emerald-500/40">
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
        </Card>

        {/* Card 4: Verified Profiles Pool */}
        <Card className="rounded-2xl border-border/70 p-5 shadow-xs transition-all hover:border-[#D3A753]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Verified Profiles Pool
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
              <span className="font-medium text-[#D3A753]">Ready to Match</span>
              <span>100% ID verified</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 3: FUNNEL PROGRESSION & DEMOGRAPHIC BALANCE ───────────── */}
      {/* ── Matching Calendar layout: [minmax(0,1fr)_22rem]                 ── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Matchmaking Conversion Funnel (Main Column) */}
        <Card className="min-w-0 rounded-2xl border-border/70 p-6 shadow-xs">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">
                  Member Journey & Conversion Funnel
                </CardTitle>
                <CardDescription className="text-xs">
                  End-to-end progression from initial registration to mutual
                  introduction.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-[#D3A753]/30 bg-[#D3A753]/10 text-[10px] text-[#D3A753]"
              >
                High Intent Pool
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-0 pt-2">
            {funnelStages.map((stage) => {
              const Icon = stage.icon
              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("size-3.5", stage.textColor)} />
                      <span className="font-semibold text-foreground">
                        {stage.stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-bold text-foreground">
                        {stage.count.toLocaleString()}
                      </span>
                      <span className="w-12 text-right text-[11px] font-semibold text-muted-foreground">
                        {stage.percentage}
                      </span>
                    </div>
                  </div>
                  {/* Progress track */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        stage.color
                      )}
                      style={{ width: stage.percentage }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Member Demographic Balance (22rem Sidebar Column) */}
        <Card className="flex w-full flex-col justify-between rounded-2xl border-border/70 p-6 shadow-xs">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-lg font-bold tracking-tight">
              Member Balance
            </CardTitle>
            <CardDescription className="text-xs">
              Gender distribution across verified active members.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center p-0">
            <div className="relative size-44">
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
                <span className="text-[10px] text-[#D3A753]">Members</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="mt-4 w-full space-y-2 border-t border-border/60 pt-3 text-xs">
              {genderDistributionData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-foreground">
                    {item.value.toLocaleString()}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      ({((item.value / 2890) * 100).toFixed(0)}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 4: LIVE MATCHMAKING FEED & RECENT INTRODUCTIONS ───────── */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 p-5">
          <div>
            <CardTitle className="text-lg font-bold tracking-tight">
              Recent Matchmaking Introductions
            </CardTitle>
            <CardDescription className="text-xs">
              Active introductions being coordinated by 1-2-1 matchmakers.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-500"
          >
            Live Activity
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase">
                <tr>
                  <th className="px-5 py-3">Match ID</th>
                  <th className="px-5 py-3">Gentleman</th>
                  <th className="px-5 py-3">Thai Lady</th>
                  <th className="px-5 py-3">Stage</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Matchmaker</th>
                  <th className="px-5 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentIntroductions.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-5 py-3.5 font-mono font-medium text-[#D3A753]">
                      {row.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-foreground">
                        {row.gentleman}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {row.gentlemanCountry}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-foreground">
                        {row.lady}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {row.ladyCountry}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-1 text-[11px] font-medium text-foreground">
                        {row.matchStage}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                          row.statusVariant === "success" &&
                            "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                          row.statusVariant === "warning" &&
                            "border border-amber-500/30 bg-amber-500/10 text-amber-500",
                          row.statusVariant === "secondary" &&
                            "border border-border bg-muted/60 text-muted-foreground"
                        )}
                      >
                        <span className="size-1 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {row.matchmaker}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-muted-foreground">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
