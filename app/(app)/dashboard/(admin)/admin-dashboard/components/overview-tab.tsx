"use client"

import React from "react"
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
  ArrowUpRight,
  ArrowRight,
  Users2,
  HeartHandshake,
  Crown,
  Flame,
  Globe,
  MapPin,
  Plane,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import {
  financial12Months,
  genderDistributionData,
  gentlemenByNationality,
  funnelStages,
} from "../dashboard-data"

interface OverviewTabProps {
  onNavigateTab: (tab: string) => void
}

export function OverviewTab({ onNavigateTab }: OverviewTabProps) {
  const sparklineData = financial12Months.slice(6) // Last 6 months for sparkline

  return (
    <div className="space-y-6">
      {/* ── Top 4 Executive KPI Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Gross Revenue */}
        <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-[#D3A753]/40">
          <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-[#D3A753]/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Gross Revenue
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#D3A753]/12 text-[#D3A753] ring-1 ring-[#D3A753]/25">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              ฿1,980,000
            </p>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-500">
                <ArrowUpRight className="size-3.5" />
                +24.8% YoY
              </span>
              <span className="text-muted-foreground">77.6% Net Margin</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Completed Profiles Pool */}
        <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-emerald-500/40">
          <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Completed Profiles Pool
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-500 ring-1 ring-emerald-500/25">
              <Users2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              2,890
            </p>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-500">
                <CheckCircle2 className="size-3.5" />
                92.6% pass rate
              </span>
              <span className="text-muted-foreground">64% F / 36% M</span>
            </div>
          </div>
        </Card>

        {/* KPI 3: Paid Memberships */}
        <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-[#CA617D]/40">
          <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-[#CA617D]/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Active Paid Members
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#CA617D]/12 text-[#CA617D] ring-1 ring-[#CA617D]/25">
              <Crown className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              148 Members
            </p>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#D3A753]">
                <ArrowUpRight className="size-3.5" />
                +18.4% YoY
              </span>
              <span className="text-muted-foreground">
                ฿1.39M Male / ฿492k VIP
              </span>
            </div>
          </div>
        </Card>

        {/* KPI 4: Mutually Agreed Introductions */}
        <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-5 shadow-xs transition-all hover:border-[#CA617D]/40">
          <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-[#CA617D]/10 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Mutually Agreed Dates
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#CA617D]/12 text-[#CA617D] ring-1 ring-[#CA617D]/25">
              <HeartHandshake className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              125 Couples
            </p>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-500">
                <Sparkles className="size-3.5" />
                36.8% Success Rate
              </span>
              <span className="text-muted-foreground">Double-Consent</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Departmental Snapshots with 1-Click Jump Buttons ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Snapshot 1: Financial Health */}
        <Card className="flex flex-col justify-between rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-6 shadow-xs transition-all hover:border-[#D3A753]/40">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#D3A753] uppercase">
                  FINANCIAL HEALTH
                </span>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-[9px] font-semibold text-emerald-500"
                >
                  Peak Margin
                </Badge>
              </div>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#D3A753]/10 text-[#D3A753]">
                <TrendingUp className="size-4" />
              </div>
            </div>

            <h3 className="mt-3 text-lg font-bold text-foreground">
              Revenue & Margin Health
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Gross membership revenue from Gentlemen & Female VIP tiers against
              net operational profit.
            </p>

            {/* Mini Sparkline Chart */}
            <div className="mt-4 h-24 w-full overflow-hidden rounded-xl border border-border/40 bg-muted/20 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sparklineData}
                  margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="overviewRevGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#D3A753" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#D3A753"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-[#D3A753]/30 bg-popover/95 p-1.5 text-[10px] shadow-lg backdrop-blur-md">
                            <span className="font-bold text-foreground">
                              ฿{Number(payload[0].value).toLocaleString()}
                            </span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D3A753"
                    strokeWidth={2}
                    fill="url(#overviewRevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Financial Highlights */}
            <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Annual Gross:</span>
                <span className="font-bold text-foreground">฿1,980,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Net Profit:</span>
                <span className="font-bold text-[#CA617D]">฿1,540,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Top Plan:</span>
                <span className="font-bold text-[#D3A753]">
                  3-Months (48% Share)
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onNavigateTab("financial")}
            variant="outline"
            className="mt-5 w-full justify-between border-[#D3A753]/30 bg-[#D3A753]/5 text-xs font-semibold text-[#D3A753] transition-all hover:bg-[#D3A753]/15 hover:text-[#D3A753]"
          >
            <span>View Full Financial Analytics</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Card>

        {/* Snapshot 2: Member Demographics */}
        <Card className="flex flex-col justify-between rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-6 shadow-xs transition-all hover:border-[#E791A7]/40">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#E791A7]/30 bg-[#E791A7]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#CA617D] uppercase">
                  DEMOGRAPHICS
                </span>
                <Badge
                  variant="outline"
                  className="border-[#D3A753]/30 bg-[#D3A753]/10 text-[9px] font-semibold text-[#D3A753]"
                >
                  1,040 Gentlemen
                </Badge>
              </div>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#E791A7]/10 text-[#CA617D]">
                <Globe className="size-4" />
              </div>
            </div>

            <h3 className="mt-3 text-lg font-bold text-foreground">
              Member Pool & Origins
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Dual passport and physical residence split across international
              gentlemen & Thai ladies.
            </p>

            {/* Gender Balance Progress Bar */}
            <div className="mt-4 rounded-xl border border-border/40 bg-muted/20 p-3">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#CA617D]">
                  1,850 Ladies (64%)
                </span>
                <span className="font-semibold text-[#D3A753]">
                  1,040 Men (36%)
                </span>
              </div>
              <div className="mt-2 flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-l-full bg-gradient-to-r from-[#E791A7] to-[#CA617D]"
                  style={{ width: "64%" }}
                />
                <div
                  className="h-full rounded-r-full bg-gradient-to-r from-[#D3A753] to-[#CFA14F]"
                  style={{ width: "36%" }}
                />
              </div>
            </div>

            {/* Residence Split Details */}
            <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Plane className="size-3 text-[#CA617D]" />
                  Residing Abroad:
                </span>
                <span className="font-bold text-foreground">
                  749 Gentlemen (72%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-3 text-[#D3A753]" />
                  Living in Thailand:
                </span>
                <span className="font-bold text-[#D3A753]">
                  291 Expats (28%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Top Passport:</span>
                <span className="font-bold text-foreground">
                  🇬🇧 British (26.9%)
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onNavigateTab("member-data")}
            variant="outline"
            className="mt-5 w-full justify-between border-[#E791A7]/30 bg-[#E791A7]/5 text-xs font-semibold text-[#CA617D] transition-all hover:bg-[#E791A7]/15 hover:text-[#CA617D]"
          >
            <span>View Member Demographics</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Card>

        {/* Snapshot 3: Matchmaking Pipeline */}
        <Card className="flex flex-col justify-between rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-6 shadow-xs transition-all hover:border-[#CA617D]/40">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#CA617D]/30 bg-[#CA617D]/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#CA617D] uppercase">
                  MATCHMAKING FUNNEL
                </span>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-[9px] font-semibold text-emerald-500"
                >
                  6 Stages Active
                </Badge>
              </div>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#CA617D]/10 text-[#CA617D]">
                <HeartHandshake className="size-4" />
              </div>
            </div>

            <h3 className="mt-3 text-lg font-bold text-foreground">
              Conversion & Date Velocity
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              End-to-end journey from initial consultation to in-person and
              video introductions.
            </p>

            {/* Mini Funnel Summary Bar */}
            <div className="mt-4 space-y-2 rounded-xl border border-border/40 bg-muted/20 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Interest → Form:</span>
                <span className="font-bold text-foreground">57.5% (3,120)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Profile Completion:
                </span>
                <span className="font-bold text-emerald-500">
                  92.6% (2,890)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Active Matching Queue:
                </span>
                <span className="font-bold text-[#D3A753]">340 Members</span>
              </div>
            </div>

            {/* Funnel Highlights */}
            <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Mutually Agreed Dates:
                </span>
                <span className="font-bold text-[#CA617D]">
                  125 Introductions
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Date Conversion Rate:
                </span>
                <span className="font-bold text-emerald-500">
                  36.8% from active queue
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Match Verification:
                </span>
                <span className="font-bold text-foreground">
                  100% Curated 1-2-1
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onNavigateTab("matchmaking")}
            variant="outline"
            className="mt-5 w-full justify-between border-[#CA617D]/30 bg-[#CA617D]/5 text-xs font-semibold text-[#CA617D] transition-all hover:bg-[#CA617D]/15 hover:text-[#CA617D]"
          >
            <span>View Matchmaking Funnel</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Card>
      </div>

      {/* ── Operational Status Banner ── */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#D3A753]/25 bg-gradient-to-r from-[#D3A753]/10 via-[#E791A7]/5 to-[#CA617D]/10 p-4 text-xs sm:flex-row sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753] to-[#CA617D] text-white shadow-xs">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              Elite Matchmaking Operations Active
            </p>
            <p className="text-[11px] text-muted-foreground">
              Curated matchmaker operating hours: 10:00 – 20:00 ICT daily.
              In-person & video consultations active across Thailand.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/80 px-3 py-1.5 text-[11px] font-semibold text-foreground backdrop-blur-xs">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Live System Online
          </div>
        </div>
      </div>
    </div>
  )
}
