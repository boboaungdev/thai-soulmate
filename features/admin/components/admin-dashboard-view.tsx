"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LayoutDashboard, Coins, Users2, HeartHandshake } from "lucide-react"
import { WelcomeBanner } from "@/components/layout"
import { OverviewTab } from "./overview-tab"
import { FinancialTab } from "./financial-tab"
import { MemberDataTab } from "./member-data-tab"
import { MatchmakingTab } from "./matchmaking-tab"

export function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState<string>("overview")

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

      {/* ── Dedicated 4-Tab Navigation & Content ── */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        {/* Responsive Tab Bar */}
        <div className="flex scrollbar-none items-center justify-start overflow-x-auto pb-1">
          <TabsList
            variant="default"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border/70 bg-muted/40 p-1 shadow-xs"
          >
            <TabsTrigger
              value="overview"
              variant="gradient"
              className="h-7 shrink-0 gap-1.5 rounded-md px-2.5 text-xs font-medium sm:px-3"
            >
              <LayoutDashboard className="size-3.5 shrink-0" />
              <span>
                <span className="hidden sm:inline">Executive </span>Overview
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="financial"
              variant="gradient"
              className="h-7 shrink-0 gap-1.5 rounded-md px-2.5 text-xs font-medium sm:px-3"
            >
              <Coins className="size-3.5 shrink-0" />
              <span>Financial Health</span>
            </TabsTrigger>

            <TabsTrigger
              value="member-data"
              variant="gradient"
              className="h-7 shrink-0 gap-1.5 rounded-md px-2.5 text-xs font-medium sm:px-3"
            >
              <Users2 className="size-3.5 shrink-0" />
              <span>Member Data</span>
            </TabsTrigger>

            <TabsTrigger
              value="matchmaking"
              variant="gradient"
              className="h-7 shrink-0 gap-1.5 rounded-md px-2.5 text-xs font-medium sm:px-3"
            >
              <HeartHandshake className="size-3.5 shrink-0" />
              <span>
                Matchmaking<span className="hidden sm:inline"> Pipeline</span>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Executive Overview */}
        <TabsContent
          value="overview"
          className="mt-0 focus-visible:outline-none"
        >
          <OverviewTab onNavigateTab={setActiveTab} />
        </TabsContent>

        {/* Tab 2: Financial Health */}
        <TabsContent
          value="financial"
          className="mt-0 focus-visible:outline-none"
        >
          <FinancialTab />
        </TabsContent>

        {/* Tab 3: Member Data & Demographics */}
        <TabsContent
          value="member-data"
          className="mt-0 focus-visible:outline-none"
        >
          <MemberDataTab />
        </TabsContent>

        {/* Tab 4: Matchmaking Pipeline */}
        <TabsContent
          value="matchmaking"
          className="mt-0 focus-visible:outline-none"
        >
          <MatchmakingTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}
