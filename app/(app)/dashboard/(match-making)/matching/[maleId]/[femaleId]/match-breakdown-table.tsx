"use client"

import React, { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cake,
  MapPin,
  Ruler,
  Scale,
  GraduationCap,
  Home,
  Languages,
  Smile,
  Target,
  GlassWater,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react"
import { FaSmoking } from "react-icons/fa"
import { cn } from "@/lib/utils"

export type MatchBreakdownItem = {
  key: string
  category: string
  label: string
  malePreference: string
  femaleValue: string
  malePrefMatch: boolean
  femalePreference: string
  maleValue: string
  femalePrefMatch: boolean
  weight: number
  malePoints: number
  femalePoints: number
  malePossiblePoints: number
  femalePossiblePoints: number
}

export type DealBreakerPenalty = {
  key: string
  label: string
  penalty: number
}

const idealPartnerNationalityOptions = [
  { display: "Asian", value: "Asia" },
  { display: "European", value: "Europe" },
  { display: "African", value: "Africa" },
  { display: "Oceanian", value: "Oceania" },
  { display: "American", value: "Americas" },
  { display: "Polar", value: "Polar" },
  { display: "Antarctic", value: "Antarctic" },
  { display: "Antarctic Ocean", value: "Antarctic Ocean" },
  { display: "Any", value: "Any" },
]

const getNationalityDisplay = (value: string | undefined | null) => {
  if (!value) return null
  const option = idealPartnerNationalityOptions.find((opt) => opt.value === value)
  return option ? option.display : value
}

const formatVal = (key: string, val: string) => {
  if (!val || val === "-" || val === "N/A") return "Not specified"
  if (key === "nationality") return getNationalityDisplay(val) || val
  return val
}

const getCriteriaIcon = (key: string) => {
  switch (key) {
    case "ageRange":
      return <Cake className="h-4 w-4 text-amber-500" />
    case "location":
      return <MapPin className="h-4 w-4 text-emerald-500" />
    case "nationality":
      return <Home className="h-4 w-4 text-blue-500" />
    case "education":
      return <GraduationCap className="h-4 w-4 text-purple-500" />
    case "height":
      return <Ruler className="h-4 w-4 text-cyan-500" />
    case "weight":
      return <Scale className="h-4 w-4 text-indigo-500" />
    case "languageEnglish":
    case "languageThai":
      return <Languages className="h-4 w-4 text-teal-500" />
    case "smoking":
      return <FaSmoking className="h-4 w-4 text-orange-500" />
    case "drinking":
      return <GlassWater className="h-4 w-4 text-sky-500" />
    case "children":
      return <Home className="h-4 w-4 text-rose-500" />
    case "hobbies":
      return <Target className="h-4 w-4 text-pink-500" />
    case "personality":
      return <Smile className="h-4 w-4 text-yellow-500" />
    default:
      return <Sparkles className="h-4 w-4 text-primary" />
  }
}

export function MatchBreakdownTable({
  items,
  penalties,
  matchPercentage,
}: {
  items: MatchBreakdownItem[]
  penalties: DealBreakerPenalty[]
  matchPercentage?: number
}) {
  const [filter, setFilter] = useState<"all" | "full-match" | "mismatch" | "penalties">("all")

  // Counts for filter pills
  const stats = useMemo(() => {
    let fullMatches = 0
    let partialOrMismatch = 0
    let maleMatchCount = 0
    let femaleMatchCount = 0

    items.forEach((item) => {
      if (item.malePrefMatch && item.femalePrefMatch) {
        fullMatches++
      } else {
        partialOrMismatch++
      }
      if (item.malePrefMatch) maleMatchCount++
      if (item.femalePrefMatch) femaleMatchCount++
    })

    return {
      total: items.length,
      fullMatches,
      partialOrMismatch,
      maleMatchCount,
      femaleMatchCount,
      penaltiesCount: penalties.length,
    }
  }, [items, penalties])

  // Filtered items
  const filteredItems = useMemo(() => {
    if (filter === "full-match") {
      return items.filter((item) => item.malePrefMatch && item.femalePrefMatch)
    }
    if (filter === "mismatch") {
      return items.filter((item) => !item.malePrefMatch || !item.femalePrefMatch)
    }
    return items
  }, [items, filter])

  if (!items.length) return null

  return (
    <div className="space-y-6">
      {/* Top Overview KPI Scorecards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border bg-card p-4 shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Overall Match
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {matchPercentage ?? Math.round(((stats.maleMatchCount + stats.femaleMatchCount) / (stats.total * 2)) * 100)}%
            </span>
            <span className="text-xs text-muted-foreground">weighted score</span>
          </div>
        </Card>

        <Card className="border border-[#D3A753]/30 bg-[#D3A753]/5 p-4 shadow-2xs">
          <p className="text-xs font-semibold text-[#b48735] dark:text-[#E5BE6C] uppercase tracking-wider">
            Male Preference Met
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {stats.maleMatchCount}/{stats.total}
            </span>
            <span className="text-xs font-medium text-[#b48735] dark:text-[#E5BE6C]">
              {Math.round((stats.maleMatchCount / stats.total) * 100)}%
            </span>
          </div>
        </Card>

        <Card className="border border-pink-400/30 bg-pink-500/5 p-4 shadow-2xs">
          <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
            Female Preference Met
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {stats.femaleMatchCount}/{stats.total}
            </span>
            <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
              {Math.round((stats.femaleMatchCount / stats.total) * 100)}%
            </span>
          </div>
        </Card>

        <Card
          className={cn(
            "border p-4 shadow-2xs",
            stats.penaltiesCount > 0
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-border bg-card text-foreground"
          )}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Deal Breakers
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {stats.penaltiesCount === 0
                ? "0"
                : `-${penalties.reduce((acc, p) => acc + p.penalty, 0)} pts`}
            </span>
            <span className="text-xs opacity-80">
              {stats.penaltiesCount === 0 ? "No penalties" : `${stats.penaltiesCount} active`}
            </span>
          </div>
        </Card>
      </div>

      {/* Filter Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Filter:
          </span>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 text-xs font-medium transition-all",
              filter === "all"
                ? "btn-gradient border-transparent text-white shadow-xs"
                : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30"
            )}
            onClick={() => setFilter("all")}
          >
            All Criteria ({stats.total})
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1.5 text-xs font-medium transition-all",
              filter === "full-match"
                ? "btn-gradient border-transparent text-white shadow-xs"
                : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30"
            )}
            onClick={() => setFilter("full-match")}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            Both Matched ({stats.fullMatches})
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1.5 text-xs font-medium transition-all",
              filter === "mismatch"
                ? "btn-gradient border-transparent text-white shadow-xs"
                : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30"
            )}
            onClick={() => setFilter("mismatch")}
          >
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            Has Mismatch ({stats.partialOrMismatch})
          </Button>

          {penalties.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1.5 text-xs font-medium transition-all",
                filter === "penalties"
                  ? "btn-gradient border-transparent text-white shadow-xs"
                  : "border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30"
              )}
              onClick={() => setFilter("penalties")}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              Penalties ({penalties.length})
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Showing <strong>{filter === "penalties" ? penalties.length : filteredItems.length}</strong> items
        </p>
      </div>

      {/* Deal Breaker Penalties (When filter is penalties or has penalties) */}
      {(filter === "penalties" || (filter === "all" && penalties.length > 0)) && penalties.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 shadow-2xs">
          <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Deal Breaker Penalties Applied</span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {penalties.map((penalty) => (
              <div
                key={penalty.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-background p-3 text-xs shadow-2xs"
              >
                <span className="font-medium text-foreground">{penalty.label}</span>
                <Badge variant="destructive" className="font-bold">
                  -{penalty.penalty} pts
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Way Comparison Table Matrix */}
      {filter !== "penalties" && (
        <Card className="overflow-hidden border shadow-2xs">
          <CardHeader className="border-b bg-muted/10 pb-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-bold">2-Way Match Breakdown Matrix</CardTitle>
                <CardDescription className="text-xs">
                  Direct evaluation of each candidate’s stated preferences against the other party’s verified profile attributes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground">
                    <th className="w-1/4 px-4 py-3 font-semibold uppercase tracking-wider">Criteria & Category</th>
                    <th className="w-[37.5%] border-l px-4 py-3 font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 text-[#b48735] dark:text-[#E5BE6C]">
                        <span className="inline-block h-2 w-2 rounded-full bg-[#D3A753]" />
                        <span>Male Perspective (What He Wants)</span>
                      </div>
                    </th>
                    <th className="w-[37.5%] border-l px-4 py-3 font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
                        <span className="inline-block h-2 w-2 rounded-full bg-pink-500" />
                        <span>Female Perspective (What She Wants)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map((item) => {
                    const isLanguage = item.key === "languageEnglish" || item.key === "languageThai"

                    return (
                      <tr key={item.key} className="transition-colors hover:bg-muted/10">
                        {/* Criteria Column */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-card shadow-2xs">
                              {getCriteriaIcon(item.key)}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-semibold text-foreground text-xs">{item.label}</p>
                              <span className="inline-block text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Male Perspective Column */}
                        <td className="border-l px-4 py-3.5 align-top">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-muted-foreground font-medium">
                                  {isLanguage ? "His Level:" : "He Wants:"}
                                </span>
                                <strong className="text-foreground">
                                  {formatVal(item.key, item.malePreference)}
                                </strong>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 gap-1 text-[11px] font-semibold border shadow-2xs",
                                  item.malePrefMatch
                                    ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400"
                                    : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                                )}
                              >
                                {item.malePrefMatch ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3" /> Match
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3" /> No Match
                                  </>
                                )}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-[11px]">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                                <span>She Has:</span>
                                <strong className="text-foreground">
                                  {formatVal(item.key, item.femaleValue)}
                                </strong>
                              </div>
                              <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                                +{item.malePoints}/{item.malePossiblePoints} pts
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Female Perspective Column */}
                        <td className="border-l px-4 py-3.5 align-top">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-muted-foreground font-medium">
                                  {isLanguage ? "Her Level:" : "She Wants:"}
                                </span>
                                <strong className="text-foreground">
                                  {formatVal(item.key, item.femalePreference)}
                                </strong>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "shrink-0 gap-1 text-[11px] font-semibold border shadow-2xs",
                                  item.femalePrefMatch
                                    ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400"
                                    : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                                )}
                              >
                                {item.femalePrefMatch ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3" /> Match
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3" /> No Match
                                  </>
                                )}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5 text-[11px]">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                                <span>He Has:</span>
                                <strong className="text-foreground">
                                  {formatVal(item.key, item.maleValue)}
                                </strong>
                              </div>
                              <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                                +{item.femalePoints}/{item.femalePossiblePoints} pts
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
