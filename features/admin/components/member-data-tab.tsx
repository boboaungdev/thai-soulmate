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
import { Globe, Plane, MapPin, CheckCircle2 } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"
import {
  operationalPipelineMetrics,
  genderDistributionData,
  gentlemenByNationality,
  gentlemenByLocation,
} from "../data/dashboard-data"

export function MemberDataTab() {
  const [geoView, setGeoView] = useState<"nationality" | "location">(
    "nationality"
  )

  return (
    <div className="space-y-6">
      {/* ── SECTION 1: 4 OPERATIONAL PIPELINE STATUS CARDS ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {operationalPipelineMetrics.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl border-border/70 p-5 shadow-xs transition-all",
                item.hoverBorder
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.title}
                  </span>
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      item.iconBg
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {item.count}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-emerald-500">
                      {item.delta}
                    </span>
                    <span>{item.rate}</span>
                  </div>
                </div>

                {/* Segment Ratio Bar */}
                <div className="mt-3 flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted/40">
                  {item.segments.map((seg, idx) => (
                    <div
                      key={idx}
                      className={cn("h-full", seg.color, {
                        "rounded-l-full": idx === 0,
                        "rounded-r-full": idx === item.segments.length - 1,
                      })}
                      style={{ width: seg.width }}
                    />
                  ))}
                </div>
              </div>

              {/* Status Badges */}
              <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
                {item.badges.map((b, idx) => {
                  const BIcon = b.icon
                  return (
                    <Badge
                      key={idx}
                      variant="outline"
                      className={cn(
                        "h-5 gap-1 px-1.5 text-[10px] font-medium",
                        b.cls
                      )}
                    >
                      <BIcon className="size-2.5" />
                      <span>{b.label}:</span>
                      <span className="font-bold">{b.val}</span>
                    </Badge>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>

      {/* ── SECTION 2: GENDER BALANCE POOL (COMPLETED PROFILES) ── */}
      <Card className="overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-card via-card to-card/60 p-6 shadow-xs">
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-center">
          {/* Donut Chart */}
          <div className="flex flex-col items-center">
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
                  Total Pool
                </span>
                <span className="text-xl font-black text-foreground">
                  2,890
                </span>
                <span className="text-[10px] text-[#D3A753]">Completed</span>
              </div>
            </div>
            <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
              Healthy ~1.8 Ladies per Gentleman Ratio
            </p>
          </div>

          {/* Balance Metrics & Insights */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-500 uppercase">
                  ACTIVE POOL
                </span>
                <Badge
                  variant="outline"
                  className="border-[#D3A753]/30 bg-[#D3A753]/10 text-[10px] font-semibold text-[#D3A753]"
                >
                  92.6% Pass Rate
                </Badge>
              </div>
              <h3 className="mt-1 text-xl font-bold text-foreground">
                Completed Profiles Demographic Balance
              </h3>
              <p className="text-xs text-muted-foreground">
                All candidates have submitted complete bio profiles, identity
                details, and relationship criteria verified by human
                matchmakers.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E791A7]/30 bg-[#E791A7]/10 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#CA617D]">
                    Thai Ladies Pool
                  </span>
                  <span className="rounded-md bg-[#E791A7]/25 px-1.5 py-0.5 text-[10px] font-bold text-[#CA617D]">
                    64% of Pool
                  </span>
                </div>
                <p className="mt-1.5 text-2xl font-bold text-foreground">
                  1,850 Ladies
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Living in Thailand • Ready for curated introduction
                </p>
              </div>

              <div className="rounded-xl border border-[#D3A753]/30 bg-[#D3A753]/10 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#D3A753]">
                    Gentlemen Pool
                  </span>
                  <span className="rounded-md bg-[#D3A753]/25 px-1.5 py-0.5 text-[10px] font-bold text-[#D3A753]">
                    36% of Pool
                  </span>
                </div>
                <p className="mt-1.5 text-2xl font-bold text-foreground">
                  1,040 Gentlemen
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  291 Living in Thailand • 749 Travelling from Abroad
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── SECTION 3: GENTLEMEN NATIONALITY & CURRENT LOCATION ── */}
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
            /* VIEW A: BY NATIONALITY */
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
            /* VIEW B: BY CURRENT PHYSICAL LOCATION (ALL COUNTRIES SEPARATED) */
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
    </div>
  )
}
