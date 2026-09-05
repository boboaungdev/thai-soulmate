"use client"

import React, { useState } from "react"
import Link from "next/link"
import { AppName } from "@/components/app-name"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShieldCheck,
  Compass,
  Sparkles,
  Handshake,
  Video,
  Heart,
  UserCheck,
  Lock,
  CheckCircle2,
  XCircle,
  MapPin,
  Languages,
  CalendarCheck,
} from "lucide-react"

export function HowItWorksContent() {
  const [activeTab, setActiveTab] = useState<string>("men")

  return (
    <div className="space-y-20 py-8 sm:py-14">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden px-4 text-center sm:px-6 lg:px-8">
        {/* Background Subtle Radial Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-40 -z-10 size-[500px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl space-y-6"
        >
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
            <ShieldCheck className="size-3.5" />
            <span>Private 1-to-1 Matchmaking Process</span>
          </div>

          {/* Main Title */}
          <h1 className="text-gradient text-4xl font-bold tracking-tighter md:text-5xl">
            How Private Matchmaking Works
          </h1>

          {/* Subtitle / Positioning pitch */}
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            &ldquo;Stop searching. Let your personal matchmaker in Thailand do
            the work.&rdquo;
          </p>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            <AppName className="font-bold" /> was created to replace the
            superficial swiping, fake profiles, and frustration of dating apps
            with the discretion, human empathy, and precision of a private
            matchmaking agency based in Thailand.
          </p>

          {/* 4 Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-medium text-foreground sm:gap-6 sm:text-sm">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <UserCheck className="size-4 text-[#D3A753]" />
              <span>Real Matchmakers (No Algorithms)</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <Lock className="size-4 text-[#D3A753]" />
              <span>100% Confidential & Discreet</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <Handshake className="size-4 text-[#D3A753]" />
              <span>Mutual Consent Introductions</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
              <MapPin className="size-4 text-[#D3A753]" />
              <span>Based in Thailand</span>
            </div>
          </div>
        </MotionDiv>
      </section>

      {/* 2. DUAL AUDIENCE JOURNEYS (FOR GENTLEMEN & FOR THAI LADIES) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-[#D3A753] uppercase">
            Tailored Experiences
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Matchmaking Journey
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Explore how our bespoke service works for international gentlemen
            and relationship-minded Thai ladies.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-8 space-y-8"
        >
          {/* Tabs Switcher */}
          <div className="flex w-full justify-center">
            <div className="w-full overflow-x-auto sm:w-auto">
              <TabsList className="mx-auto flex w-max min-w-max rounded-xl border border-border/70 bg-card/80 p-1 backdrop-blur-sm group-data-horizontal/tabs:h-10">
                <TabsTrigger
                  value="men"
                  variant="gradient"
                  className="h-full gap-2 rounded-lg px-4 text-xs font-semibold sm:px-6 sm:text-sm"
                >
                  <Compass className="size-4 shrink-0" />
                  <span className="hidden sm:inline">
                    For Gentlemen (International Men)
                  </span>
                  <span className="sm:hidden">For Gentlemen</span>
                </TabsTrigger>

                <TabsTrigger
                  value="women"
                  variant="gradient"
                  className="h-full gap-2 rounded-lg px-4 text-xs font-semibold sm:px-6 sm:text-sm"
                >
                  <Heart className="size-4 shrink-0" />
                  <span className="hidden sm:inline">
                    For Thai Ladies (Women in Thailand)
                  </span>
                  <span className="sm:hidden">For Thai Ladies</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* TAB 1: FOR GENTLEMEN */}
          <TabsContent value="men" className="space-y-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                As a serious gentleman, your time is valuable. You don&apos;t
                have months to spend swiping through anonymous profiles or
                wondering if someone is genuine. Here is how your personal
                matchmaker handles everything for you:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Step 1 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#D3A753]/15 px-3 py-1 font-mono text-xs font-bold text-[#D3A753]">
                  STAGE 01
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#D3A753]/15 text-[#D3A753]">
                    <Compass className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Confidential Consultation & Values Intake
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    We start with an in-depth private conversation to understand
                    your personality, lifestyle, relationship goals, and partner
                    preferences.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Zero public visibility of your profile</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Learn what has & hasn&apos;t worked for you</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Agree on your specific match criteria</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#D3A753]/15 px-3 py-1 font-mono text-xs font-bold text-[#D3A753]">
                  STAGE 02
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E791A7]/20 text-[#CA617D]">
                    <Sparkles className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Curated Search Across Verified Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    Your matchmaker acts as your personal scout in Thailand,
                    personally reviewing candidates against your values rather
                    than relying on computer algorithms.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>100% ID, age, and intention verified</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Personal video or in-person interviews</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>3 to 5 curated introductions per month</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#D3A753]/15 px-3 py-1 font-mono text-xs font-bold text-[#D3A753]">
                  STAGE 03
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#D3A753]/15 text-[#D3A753]">
                    <Handshake className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Mutual Profile Review & Double Consent
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    You receive an executive profile dossier of the lady. If you
                    are interested, we present your profile to her privately.
                    Both sides must say &ldquo;Yes&rdquo; before an introduction
                    happens.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Complete transparency on background</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>No awkwardness or unreciprocated effort</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Introductions built on genuine interest</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#D3A753]/15 px-3 py-1 font-mono text-xs font-bold text-[#D3A753]">
                  STAGE 04
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#CA617D]/20 text-[#CA617D]">
                    <Video className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Facilitated Video Date with Interpreter
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    We coordinate a secure Google Meet video date across your
                    respective time zones. Your matchmaker is on hand to
                    facilitate, break the ice, and provide bilingual
                    translation.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Comfortable, relaxed virtual environment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Bilingual English & Thai translation support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Private post-date feedback with matchmaker</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 5 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/50 hover:shadow-lg md:col-span-2 lg:col-span-2">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#D3A753]/15 px-3 py-1 font-mono text-xs font-bold text-[#D3A753]">
                  STAGE 05
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753]">
                    <Heart className="size-6 text-[#CA617D]" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    In-Person Meeting in Thailand & Ongoing Concierge
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    When you are ready to visit Thailand, our local team in
                    Thailand is right here on the ground to assist you. We
                    coordinate safe, romantic meeting locations, offer cultural
                    advice, and continue supporting you until your connection
                    flourishes into marriage or long-term partnership.
                  </p>
                  <div className="mt-auto grid grid-cols-1 gap-2 border-t border-border/40 pt-3 text-xs sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Thailand meeting coordination</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Continuous matchmaker coaching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#D3A753]" />
                      <span>Alternative match if connection falters</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: FOR THAI LADIES */}
          <TabsContent value="women" className="space-y-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Are you looking for a sincere, loving relationship with a kind
                and committed international gentleman? Thai Soulmate is 100%
                free for relationship-minded Thai ladies. You remain in total
                control at every step.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Step 1 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E791A7]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#E791A7]/15 px-3 py-1 font-mono text-xs font-bold text-[#CA617D]">
                  STAGE 01
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E791A7]/15 text-[#CA617D]">
                    <ShieldCheck className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Free & Private Member Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    Apply online or speak directly with our friendly female
                    matchmakers. We verify your identity, understand your
                    lifestyle, and discuss what kind of gentleman would make you
                    happy.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>100% Free for Thai female applicants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Your photos are NEVER published publicly</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Private, supportive female staff in Thailand</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E791A7]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#E791A7]/15 px-3 py-1 font-mono text-xs font-bold text-[#CA617D]">
                  STAGE 02
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#D3A753]/15 text-[#D3A753]">
                    <UserCheck className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Vetted, Sincere International Gentlemen
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    We strictly vet every gentleman. They are financially
                    established, emotionally mature, and committed to finding a
                    life partner for marriage—not casual dating or games.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Background & identity verified gentlemen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Genuine intentions for long-term marriage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Respectful and family-oriented values</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E791A7]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#E791A7]/15 px-3 py-1 font-mono text-xs font-bold text-[#CA617D]">
                  STAGE 03
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#CA617D]/15 text-[#CA617D]">
                    <Lock className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    You Remain in Complete Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    When a suitable gentleman expresses interest in meeting you,
                    you receive his full profile and background. You decide
                    whether you want to proceed.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Zero obligation to accept any introduction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>We NEVER sell or give out your phone number</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Your decision is always fully respected</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E791A7]/50 hover:shadow-lg">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#E791A7]/15 px-3 py-1 font-mono text-xs font-bold text-[#CA617D]">
                  STAGE 04
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#D3A753]/15 text-[#D3A753]">
                    <Languages className="size-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Safe Video Meeting with Thai Translation
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    Meet in a relaxed, friendly video call. Don&apos;t worry
                    about speaking perfect English—our caring Thai matchmaker
                    will attend to assist, translate, and keep the conversation
                    flowing smoothly.
                  </p>
                  <ul className="mt-auto space-y-1.5 border-t border-border/40 pt-3 text-xs">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Supportive Thai-speaking staff present</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>No pressure, just a comfortable chat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Tell us honestly how you felt afterwards</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step 5 */}
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E791A7]/50 hover:shadow-lg md:col-span-2 lg:col-span-2">
                <div className="absolute top-0 right-0 rounded-bl-xl bg-[#E791A7]/15 px-3 py-1 font-mono text-xs font-bold text-[#CA617D]">
                  STAGE 05
                </div>
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#CA617D]">
                    <Heart className="size-6 text-[#CA617D]" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    Safe In-Person Dates in Thailand & Continuous Care
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between space-y-3 text-sm text-muted-foreground">
                  <p>
                    When the gentleman arrives in Thailand to meet you, we help
                    coordinate safe, public, and comfortable dinner dates in
                    Thailand. We support you before, during, and after each
                    meeting so you always feel protected, valued, and respected.
                  </p>
                  <div className="mt-auto grid grid-cols-1 gap-2 border-t border-border/40 pt-3 text-xs sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Safe, vetted public date venues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Local Thailand support anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#E791A7]" />
                      <span>Ongoing advice for your relationship</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* 3. DATING APPS VS THAI SOULMATE COMPARISON */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.25em] text-[#D3A753] uppercase">
              The Fundamental Difference
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Thai Soulmate is Not Another Dating App
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Online dating apps are designed to keep you swiping. Our private
              matchmaking service is designed to find you a life partner.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Conventional Dating Apps */}
            <Card className="rounded-2xl border border-destructive/30 bg-destructive/5 backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-destructive/10">
              <CardHeader className="space-y-2">
                <div className="inline-flex w-fit items-center gap-2 rounded-md bg-destructive/15 px-3 py-1 text-xs font-bold text-destructive uppercase">
                  <XCircle className="size-4" />
                  <span>Conventional Dating Apps</span>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  The Frustration of Doing It Yourself
                </CardTitle>
                <CardDescription>
                  Tinder, Bumble, Thai dating websites, and swipe apps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <span>
                      <strong>Endless swiping:</strong> Months spent browsing
                      thousands of anonymous profiles with zero guidance.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <span>
                      <strong>Unverified identities:</strong> High risk of
                      scammers, financial romance baiting, fake pictures, and
                      bots.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <span>
                      <strong>Casual hookups & ghosting:</strong> Most users are
                      looking for casual fun, validation, or disappear without
                      warning.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <span>
                      <strong>No local presence:</strong> Nobody to advise you
                      on Thai cultural nuances, safety, or assist with date
                      logistics.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Thai Soulmate Private Matchmaking */}
            <Card className="rounded-2xl border border-[#D3A753]/40 bg-[#D3A753]/5 backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:bg-[#D3A753]/10">
              <CardHeader className="space-y-2">
                <div className="inline-flex w-fit items-center gap-2 rounded-md bg-[#D3A753]/20 px-3 py-1 text-xs font-bold text-[#D3A753] uppercase">
                  <CheckCircle2 className="size-4" />
                  <span>Thai Soulmate Executive Matchmaking</span>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Your Personal Assistant in Thailand
                </CardTitle>
                <CardDescription>
                  Bespoke, human-guided 1-to-1 introduction concierge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3.5 text-sm text-foreground/90">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#D3A753]" />
                    <span>
                      <strong>We do the work:</strong> Your dedicated matchmaker
                      searches, screens, and filters candidates directly for
                      you.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#D3A753]" />
                    <span>
                      <strong>100% Verified members:</strong> Every woman and
                      man is identity checked, age verified, and personally
                      interviewed.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#D3A753]" />
                    <span>
                      <strong>Serious relationship intentions:</strong> Only
                      relationship-minded singles committed to lifelong marriage
                      are accepted.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#D3A753]" />
                    <span>
                      <strong>Local Thailand team:</strong> Video translation,
                      date coordination, and real support on the ground in
                      Thailand.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </MotionDiv>
      </section>

      {/* 4. WHAT EVERY MEMBERSHIP INCLUDES */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card/60 p-8 backdrop-blur-sm sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold tracking-[0.25em] text-[#D3A753] uppercase">
              Comprehensive Service
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What Is Included In Every Matchmaking Package
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              <AppName className="font-bold" /> offers simple, transparent
              packages. Whichever duration you select, you receive exceptional
              care every step of the way.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/40 hover:shadow-md">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#D3A753]/15 text-[#D3A753]">
                <UserCheck className="size-6" />
              </div>
              <h3 className="font-bold text-foreground">
                Dedicated Matchmaker
              </h3>
              <p className="text-xs text-muted-foreground">
                A single personal point of contact who understands your values
                and works tirelessly on your behalf.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/40 hover:shadow-md">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#E791A7]/20 text-[#CA617D]">
                <Sparkles className="size-6" />
              </div>
              <h3 className="font-bold text-foreground">3–5 Matches / Month</h3>
              <p className="text-xs text-muted-foreground">
                Carefully filtered, high-compatibility introductions matched to
                your specific lifestyle criteria.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/40 hover:shadow-md">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#D3A753]/15 text-[#D3A753]">
                <Languages className="size-6" />
              </div>
              <h3 className="font-bold text-foreground">Video Interpreter</h3>
              <p className="text-xs text-muted-foreground">
                Complimentary English-Thai translation assistance during virtual
                meetings so communication flows effortlessly.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-border/60 bg-background/50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D3A753]/40 hover:shadow-md">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#CA617D]/20 text-[#CA617D]">
                <CalendarCheck className="size-6" />
              </div>
              <h3 className="font-bold text-foreground">
                Local Thailand Support
              </h3>
              <p className="text-xs text-muted-foreground">
                Logistics, safety guidance, romantic venue planning, and
                in-person debriefs when you meet in Thailand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM SINGLE CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card/90 via-card/70 to-[#D3A753]/10 p-8 text-center backdrop-blur-sm sm:p-12">
            {/* Ambient subtle glow inside CTA */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/20 to-transparent blur-3xl" />
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
                <Compass className="size-3.5" />
                <span>Start Your Matchmaking Journey</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Ready to Find Your Life Partner in Thailand?
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Whether you are an international gentleman seeking a meaningful
                relationship or a Thai lady looking for a sincere, loving
                partner, our private matchmaking team is here to guide you
                discreetly every step of the way.
              </p>

              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="btn-gradient font-semibold shadow-lg"
                >
                  <Link href="/#register-interest">
                    Arrange a Confidential Consultation
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                100% confidential • No obligation • Direct human matchmaking
              </p>
            </div>
          </div>
        </MotionDiv>
      </section>
    </div>
  )
}
