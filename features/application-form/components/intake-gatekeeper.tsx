"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Heart,
  ArrowRight,
  Search,
  Sparkles,
  Lock,
  UserCheck,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { RegisterInterestLead } from "./types"

interface IntakeGatekeeperProps {
  lead: RegisterInterestLead | null
  loading: boolean
  searchedEmail: string | null
  notFound: boolean
  onStartForm: () => void
  onSearchEmail: (email: string) => void
}

export function IntakeGatekeeper({
  lead,
  loading,
  searchedEmail,
  notFound,
  onStartForm,
  onSearchEmail,
}: IntakeGatekeeperProps) {
  const [manualEmail, setManualEmail] = useState("")

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualEmail.trim()) {
      onSearchEmail(manualEmail.trim().toLowerCase())
    }
  }

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-[#D3A753]/40 bg-[#D3A753]/10">
          <Spinner className="size-6 text-[#D3A753]" />
        </div>
        <p className="text-sm font-medium tracking-wide text-foreground">
          Checking your registration details...
        </p>
        <p className="text-xs text-muted-foreground">
          Verifying details for {searchedEmail || "your profile"}
        </p>
      </div>
    )
  }

  // 2. VIP Verified Lead Card
  if (lead) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card via-card to-background p-6 shadow-2xl backdrop-blur-md sm:p-10"
      >
        <div className="space-y-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/40 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold text-[#D3A753]">
            <Sparkles className="size-3.5 text-[#D3A753]" />
            <span>Application Form</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Welcome,{" "}
              <span className="text-gradient">
                {lead.prefix} {lead.name}
              </span>
            </h1>
            <p className="mx-auto max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
              We have your registration on file. Complete your confidential
              matchmaking profile below so our team can carefully review your
              preferences and curate compatible introductions.
            </p>
          </div>

          {/* Lead Details Snapshot Grid */}
          <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-[#D3A753]/20 bg-background/50 p-4 text-left sm:grid-cols-3 sm:gap-3 sm:p-5">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Current Location
              </span>
              <p className="flex items-center gap-1.5 text-xs font-medium text-foreground sm:text-sm">
                <MapPin className="size-3.5 text-[#D3A753]" />
                <span className="truncate">{lead.currentLocation}</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Relationship Goal
              </span>
              <p className="flex items-center gap-1.5 text-xs font-medium text-foreground sm:text-sm">
                <Heart className="size-3.5 text-[#CA617D]" />
                <span className="truncate">
                  {lead.relationshipGoal || "Not specified"}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Contact Number
              </span>
              <p className="flex items-center gap-1.5 text-xs font-medium text-foreground sm:text-sm">
                <Phone className="size-3.5 text-[#D3A753]" />
                <span className="truncate">
                  {lead.phoneCountry} {lead.phone}
                </span>
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              onClick={onStartForm}
              className="btn-gradient h-11 w-full gap-2 text-sm font-semibold shadow-lg transition-all hover:scale-[1.01]"
            >
              <span>Start Application Form</span>
              <ChevronRight className="size-4" />
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3 text-[#D3A753]" />
              <span>
                100% Confidential · Your private details are never made public
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // 3. Email Not Found Card
  if (notFound && searchedEmail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-xl rounded-3xl border border-destructive/30 bg-card p-6 text-center shadow-xl sm:p-8"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <UserCheck className="size-6" />
        </div>
        <h2 className="text-xl font-bold sm:text-2xl">
          No Registration Record Found
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          We couldn&apos;t find an existing registration for{" "}
          <span className="font-semibold text-foreground">
            &quot;{searchedEmail}&quot;
          </span>
          . Please register your interest first, or check if you entered a
          different email address.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="btn-gradient text-xs sm:text-sm">
            <Link href="/#register-interest">Register Your Interest</Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => onSearchEmail("")}
            className="text-xs sm:text-sm"
          >
            Try Another Email
          </Button>
        </div>
      </motion.div>
    )
  }

  // 4. Default Gatekeeper Card (No email query provided)
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D3A753]/30 bg-gradient-to-br from-card via-card to-background p-6 shadow-2xl sm:p-10"
    >
      <div className="space-y-6 text-center">
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold text-[#D3A753]">
          <ShieldCheck className="size-4 text-[#CA617D]" />
          <span>Exclusive Matchmaking Intake</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Begin Your Private Search for a{" "}
            <span className="text-gradient">Life Partner</span>
          </h1>
          <p className="mx-auto max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
            To ensure mutual suitability and verified authenticity, all
            prospective members begin by registering their interest. Once
            registered, you can complete your full matchmaking profile.
          </p>
        </div>

        {/* 3 Step Process Highlights */}
        <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Register Interest",
              desc: "Share your initial preferences with our advisory team.",
            },
            {
              step: "02",
              title: "Complete Profile",
              desc: "Share your lifestyle, background, and ideal partner.",
            },
            {
              step: "03",
              title: "Curated Matches",
              desc: "Personal introductions with verified Thai women.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="space-y-1 rounded-2xl border border-border/50 bg-background/50 p-3.5"
            >
              <span className="font-mono text-xs font-bold text-[#D3A753]">
                {item.step}
              </span>
              <p className="text-xs font-bold text-foreground sm:text-sm">
                {item.title}
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Primary CTA: Register Interest */}
        <div className="space-y-3 pt-2">
          <Button
            asChild
            size="lg"
            className="btn-gradient h-11 w-full gap-2 text-sm font-semibold shadow-xl transition-all hover:scale-[1.01]"
          >
            <Link href="/#register-interest">
              <span>Register Your Interest</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            Complimentary · 100% Confidential · No Obligation
          </p>
        </div>

        {/* Divider & Returning Applicant Search */}
        <div className="relative my-6 border-t border-border/60">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase">
            Already Registered Interest?
          </span>
        </div>

        <form onSubmit={handleManualSearch} className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="email"
              required
              placeholder="Enter your registered email..."
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="h-9 text-xs sm:text-sm"
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="h-9 shrink-0 gap-1.5 text-xs font-semibold"
            >
              <Search className="size-3.5 text-[#D3A753]" />
              <span>Find Profile</span>
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Enter the email address you used when registering your interest.
          </p>
        </form>
      </div>
    </motion.div>
  )
}
