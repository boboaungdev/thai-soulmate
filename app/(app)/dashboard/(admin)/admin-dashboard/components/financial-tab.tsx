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
  ArrowUpRight,
  Crown,
  Flame,
  CreditCard,
  ShieldCheck,
  Percent,
  Wallet,
  Coins,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"
import {
  financial12Months,
  financial6Months,
  financial3Months,
} from "../dashboard-data"

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

export function FinancialTab() {
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
    <div className="space-y-6">
      {/* ── Financial Headline Stats Strip ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Coins className="size-4 text-[#D3A753]" />
            <span>Gross Revenue ({timeRange})</span>
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            ฿{totalRev.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-emerald-500">
            +24.8% YoY Pace
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs text-[#CA617D]">
            <Wallet className="size-4 text-[#CA617D]" />
            <span>Net Profit ({timeRange})</span>
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-[#CA617D] sm:text-2xl">
            ฿{totalProf.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            After curation costs
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Percent className="size-4 text-[#D3A753]" />
            <span>Profit Margin</span>
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-[#D3A753] sm:text-2xl">
            {avgMargin}%
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-emerald-500">
            Top tier performance
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="size-4 text-emerald-500" />
            <span>ARPU (Paid Users)</span>
          </div>
          <p className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            ฿13,378
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Avg revenue per user
          </p>
        </div>
      </div>

      {/* ── Main Chart + 2 Companion Cards ── */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main Big Financial Card with Revenue Area & Profit Line */}
        <Card className="relative min-w-0 overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 shadow-xs">
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

            {/* Financial Highlights */}
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
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="finRevenueGradient"
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
                      id="finProfitGradient"
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
                    fill="url(#finRevenueGradient)"
                  />

                  {/* Net Profit Line */}
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

        {/* Companion Cards Column */}
        <div className="flex w-full flex-col justify-between gap-6">
          {/* Card 1: Membership Revenue Split (Male vs Female VIP) */}
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

          {/* Card 2: Package Popularity */}
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

      {/* ── Financial Health Trust & Gateway Strip ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="size-4.5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">
              Payment Gateway Health
            </p>
            <p className="font-bold text-foreground">99.4% Success Rate</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#D3A753]/10 text-[#D3A753]">
            <Crown className="size-4.5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">
              VIP Renewal Rate
            </p>
            <p className="font-bold text-foreground">62% Repeat Extensions</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#CA617D]/10 text-[#CA617D]">
            <Coins className="size-4.5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">
              Refund & Dispute Rate
            </p>
            <p className="font-bold text-foreground">1.7% Discretionary</p>
          </div>
        </div>
      </div>
    </div>
  )
}
