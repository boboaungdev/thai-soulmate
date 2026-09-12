"use client"

import React, { useState } from "react"
import Link from "next/link"
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
  HeartHandshake,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Video,
  ArrowRight,
  ExternalLink,
  Users2,
  Send,
  Clock,
  Flame,
  Activity,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import { cn } from "@/lib/utils"
import {
  funnelStages,
  trackingStatusDistribution,
  monthlyMatchingTrends,
} from "../data/dashboard-data"

export function MatchmakingTab() {
  const [trendMetric, setTrendMetric] = useState<"both" | "matched">("both")

  const totalActivePipeline = trackingStatusDistribution.reduce(
    (acc, curr) => acc + curr.count,
    0
  )

  return (
    <div className="space-y-6">
      {/* ── Executive Subheader & Direct Hub Shortcuts ── */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#D3A753] uppercase">
              1-2-1 MATCHMAKING INTELLIGENCE
            </span>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500"
            >
              Live Pipeline Active
            </Badge>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Matchmaking Health & Tracking Status
          </h2>
          <p className="text-xs text-muted-foreground">
            High-level metrics, status milestone distribution, and introduction
            velocity.
          </p>
        </div>

        {/* Quick Jump Shortcuts to Full Tools */}
        <div className="flex shrink-0 items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-[#D3A753]/30 bg-[#D3A753]/5 text-xs font-semibold text-[#D3A753] hover:bg-[#D3A753]/15 hover:text-[#D3A753]"
          >
            <Link href="/dashboard/matching">
              <Flame className="size-3.5" />
              <span>Matching Engine</span>
              <ExternalLink className="size-3" />
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="btn-gradient h-9 gap-1.5 text-xs font-semibold text-white shadow-xs"
          >
            <Link href="/dashboard/tracking">
              <span>Full Tracking Board</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ── SECTION 1: 4 CLEAN COUNT CARDS ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Card 1: Active In-Progress Pairs */}
        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-4 shadow-xs sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Active In-Progress
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Users2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {totalActivePipeline} Pairs
            </p>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-blue-500">
                100% Curated 1-2-1
              </span>
              <span>In active flow</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Both Profiles Accepted */}
        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-4 shadow-xs sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Both Accepted
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#D3A753]/10 text-[#D3A753]">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              14 Pairs
            </p>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-[#D3A753]">
                Double Consent
              </span>
              <span>Ready for dates</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Video & Meets Active */}
        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-4 shadow-xs sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Video & Meets
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#CA617D]/10 text-[#CA617D]">
              <Video className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              13 Sessions
            </p>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-[#CA617D]">Google Meet</span>
              <span>& Thailand Lounge</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Matched Couples */}
        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-4 shadow-xs sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Couples Matched
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-emerald-500 sm:text-3xl">
              12 Matched 🎉
            </p>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-500">
                36.8% Success
              </span>
              <span>Life partners</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── SECTION 2: CHART LOGIC (TRENDS & STATUS BREAKDOWN) ── */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main Chart: Monthly Introductions & Matching Velocity */}
        <Card className="relative min-w-0 overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs sm:p-6">
          <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-[#D3A753]/8 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 size-64 rounded-full bg-[#CA617D]/8 blur-3xl" />

          <CardHeader className="p-0 pb-3">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#D3A753] uppercase">
                    VELOCITY & SUCCESS
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500"
                  >
                    +34% YoY Introductions
                  </Badge>
                </div>
                <CardTitle className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  Monthly Introductions & Matched Trends
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly volume of curated 1-2-1 introductions alongside
                  confirmed matched couples.
                </CardDescription>
              </div>

              {/* Metric Switcher */}
              <div className="flex items-center rounded-xl border border-border/70 bg-muted/40 p-1">
                <button
                  onClick={() => setTrendMetric("both")}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                    trendMetric === "both"
                      ? "bg-gradient-to-r from-[#D3A753] to-[#CA617D] font-semibold text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Trends
                </button>
                <button
                  onClick={() => setTrendMetric("matched")}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                    trendMetric === "matched"
                      ? "bg-gradient-to-r from-[#D3A753] to-[#CA617D] font-semibold text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Matched Only
                </button>
              </div>
            </div>

            {/* Visual Indicators */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5 sm:flex-nowrap">
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-[#D3A753]" />
                    Total 2026 Introductions:
                  </span>
                  <span className="font-bold text-foreground">
                    397 Coordinated
                  </span>
                </div>
                <div className="h-6 w-px bg-border/60" />
                <div>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-2 rounded-full bg-[#CA617D]" />
                    Successful Matches:
                  </span>
                  <span className="font-bold text-[#CA617D]">138 Couples</span>
                </div>
              </div>

              <div className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground md:flex">
                <Activity className="size-3.5 text-emerald-500" />
                <span>Peak Avg: 36.8% conversion</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-2">
            <div className="h-[270px] w-full sm:h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyMatchingTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="matchIntroGrad"
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
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                    dx={-5}
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const intro =
                          payload.find((p) => p.dataKey === "introductions")
                            ?.value || 0
                        const match =
                          payload.find((p) => p.dataKey === "matched")?.value ||
                          0
                        const rate =
                          payload.find((p) => p.dataKey === "rate")?.value || 0

                        return (
                          <div className="rounded-xl border border-[#D3A753]/30 bg-popover/95 p-3 text-xs shadow-2xl backdrop-blur-md">
                            <p className="font-bold text-foreground">
                              {label} 2026 Matchmaking
                            </p>
                            <div className="mt-1.5 space-y-1">
                              <p className="flex items-center justify-between gap-4 text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-[#D3A753]" />
                                  Introductions:
                                </span>
                                <span className="font-bold text-foreground">
                                  {intro}
                                </span>
                              </p>
                              <p className="flex items-center justify-between gap-4 text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-[#CA617D]" />
                                  Couples Matched:
                                </span>
                                <span className="font-bold text-[#CA617D]">
                                  {match}
                                </span>
                              </p>
                              <p className="flex items-center justify-between gap-4 border-t border-border/60 pt-1 text-[11px]">
                                <span className="text-muted-foreground">
                                  Success Rate:
                                </span>
                                <span className="font-bold text-emerald-500">
                                  {rate}%
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />

                  {trendMetric === "both" && (
                    <Area
                      type="monotone"
                      dataKey="introductions"
                      name="Introductions"
                      stroke="#D3A753"
                      strokeWidth={2}
                      fill="url(#matchIntroGrad)"
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="matched"
                    name="Couples Matched"
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

        {/* Companion Card: Live Tracking Status Distribution */}
        <Card className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs sm:p-6">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold tracking-tight sm:text-lg">
                  Status Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Active connections across 6 core milestone stages.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-border bg-muted/40 text-[10px] font-semibold text-muted-foreground"
              >
                {totalActivePipeline} Active Pairs
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-between p-0 pt-3">
            {/* Status Breakdown List */}
            <div className="space-y-2.5">
              {trackingStatusDistribution.map((item) => (
                <div
                  key={item.stage}
                  className="rounded-xl border border-border/40 bg-muted/20 p-2.5 transition-all hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-foreground">
                        {item.stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-foreground">
                        {item.count}
                      </span>
                      <span className="text-muted-foreground">
                        ({item.percentage})
                      </span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: item.percentage,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Hub Jump */}
            <div className="mt-4 border-t border-border/60 pt-3 text-center">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full justify-between text-xs font-semibold text-[#D3A753] hover:text-[#D3A753]"
              >
                <Link href="/dashboard/tracking">
                  <span>Open Full Tracking Board</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── SECTION 3: 6-STAGE MACRO INTAKE CONVERSION FUNNEL ── */}
      <Card className="min-w-0 rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs sm:p-6">
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
                6 Active Macro Stages
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
                className="group relative rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:border-border/80 hover:bg-muted/35"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted/60 font-mono text-[10px] font-bold text-muted-foreground">
                      {stage.step}
                    </span>

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

                  <div className="flex items-center justify-between gap-3 pl-9 font-mono text-xs sm:justify-end sm:pl-0">
                    <span className="font-bold text-foreground">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {stage.percentage} of pool
                    </span>
                  </div>
                </div>

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
              <p className="mt-0.5 text-sm font-bold text-foreground">57.5%</p>
              <p className="text-[9px] font-medium text-emerald-500">
                Interest → Form
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
              <p className="text-[10px] text-muted-foreground">
                Profile Completion
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">92.6%</p>
              <p className="text-[9px] font-medium text-emerald-500">
                Profile Completed
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
              <p className="text-[10px] text-muted-foreground">Date Success</p>
              <p className="mt-0.5 text-sm font-bold text-[#D3A753]">36.8%</p>
              <p className="text-[9px] font-medium text-[#CA617D]">
                Mutual Consent
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
