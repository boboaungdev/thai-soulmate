"use client"

import Link from "next/link"
import Image from "next/image"
import { APP_INFO } from "@/constants"
import { AppName } from "@/components/app-name"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Target,
  ShieldCheck,
  UserCheck,
  Lock,
  SearchX,
  Users,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
  Smile,
  Compass,
  Heart,
  History,
  Check,
  X,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterInterestForm } from "@/components/register-interest-form"
import { HeroSoulWaves } from "@/components/hero-soul-waves"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export default function HomePage() {
  const router = useRouter()
  const registerInterestRef = useRef<HTMLDivElement>(null)

  // Scroll Progress tracking for top luxury gradient bar
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Hero Parallax & scroll fade
  const heroBgY = useTransform(scrollYProgress, [0, 0.25], ["0%", "18%"])
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.35])

  useEffect(() => {
    if (window.location.hash === "#register-interest") {
      registerInterestRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [router])

  return (
    <main className="relative">
      {/* ========================================================= */}
      {/* TOP SCROLL PROGRESS BAR */}
      {/* ========================================================= */}
      <motion.div
        style={{ scaleX }}
        className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[3px] origin-left bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D] shadow-[0_0_12px_rgba(211,167,83,0.8)]"
      />

      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative flex h-[85vh] min-h-[580px] flex-col justify-center overflow-hidden text-white">
        <motion.div
          style={{ y: heroBgY }}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/home-landing-mobile-2.png"
            alt="Background"
            fill
            className="object-cover md:hidden"
            priority
          />
          <Image
            src="/home-landing-2.png"
            alt="Background"
            fill
            className="hidden object-cover md:block"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />

        <motion.div
          style={{ opacity: heroContentOpacity }}
          className="relative mx-auto w-full max-w-7xl px-4 pt-60 sm:px-6 sm:pt-0 lg:px-8"
        >
          {/* Subtle golden ambient glow behind hero */}
          <div className="pointer-events-none absolute top-1/2 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/20 via-[#E791A7]/10 to-transparent blur-3xl" />

          <div className="flex max-w-2xl flex-col items-center space-y-5 text-center">
            {/* Signature Two Souls Converging Wave & Logo Animation */}
            <HeroSoulWaves />

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.75,
                  delay: 2.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <AppName className="text-4xl font-black tracking-tight uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl" />
              </motion.div>

              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 2.5, ease: "easeOut" }}
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-[0.35em] text-[#E791A7] uppercase sm:text-base"
                >
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.6, delay: 2.55 }}
                    className="h-px bg-[#CA617D]/70"
                  />
                  EXCLUSIVE
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.6, delay: 2.55 }}
                    className="h-px bg-[#CA617D]/70"
                  />
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.65 }}
                  className="text-sm font-semibold tracking-[0.2em] text-[#D3A753] uppercase sm:text-base md:text-lg"
                >
                  {APP_INFO.tagline}
                </motion.p>
              </div>

              {/* Slogan Trust Ribbon */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.8 }}
                className="mx-auto flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-white/90 sm:gap-3 sm:text-sm"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1 backdrop-blur-md transition-colors hover:border-[#D3A753]/50"
                >
                  <ShieldCheck className="size-3.5 text-[#D3A753]" />
                  <span>Real People</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1 backdrop-blur-md transition-colors hover:border-[#E791A7]/50"
                >
                  <Heart className="size-3.5 text-[#E791A7]" />
                  <span>Real Relationships</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1 backdrop-blur-md transition-colors hover:border-[#D3A753]/50"
                >
                  <MapPin className="size-3.5 text-[#D3A753]" />
                  <span>Personally Matched in Thailand</span>
                </motion.div>
              </motion.div>

              {/* Two Hero CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.95 }}
                className="mx-auto flex w-full flex-col items-stretch justify-center gap-3 pt-2 sm:w-fit"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    asChild
                    size="lg"
                    className="btn-gradient w-full font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#D3A753]/30"
                  >
                    <Link href="/#register-interest">
                      Arrange a Confidential Consultation
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full border-white/30 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/15 hover:text-white"
                  >
                    <Link href="/service">See How It Works</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================= */}
      {/* ABOUT THAI SOULMATE */}
      {/* ========================================================= */}
      <section
        id="about"
        className="relative overflow-hidden border-b border-border/40 py-16 sm:py-24"
      >
        {/* Unified Atmospheric Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(207,161,79,0.08),transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -bottom-40 -z-10 size-[500px] rounded-full bg-gradient-to-br from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

        <div className="mx-auto w-full max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Header & Main Story Narrative */}
          <div className="space-y-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-gradient-to-r from-[#D3A753]/15 via-[#E791A7]/15 to-[#CA617D]/15 px-4 py-1.5 text-xs font-semibold text-[#D3A753] sm:text-sm"
            >
              <Sparkles className="size-4 text-[#CA617D]" />
              <span>About Us</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-gradient mx-auto max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Where Genuine International Connections Begin
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto max-w-3xl space-y-6 leading-relaxed text-muted-foreground md:text-lg"
            >
              <p>
                You are at a stage in life where everything is in place—except
                the right partner. You have built your career, achieved
                stability, and know what truly matters. What you don&apos;t have
                is time for dating apps that offer endless noise, unverified
                profiles, and superficial swiping with people who aren&apos;t
                aligned with your future.
              </p>
              <div className="relative overflow-hidden rounded-2xl border border-[#D3A753]/25 bg-gradient-to-r from-[#D3A753]/10 via-[#E791A7]/5 to-[#CA617D]/10 p-5 text-foreground shadow-sm sm:p-6">
                <p className="text-base leading-relaxed font-medium sm:text-lg">
                  <span className="text-gradient font-bold tracking-tight">
                    THAI SOULMATE
                  </span>{" "}
                  was created to replace the frustration of modern dating with
                  the discretion, warmth, and precision of a private matchmaking
                  agency based locally in Thailand.
                </p>
              </div>
            </motion.div>
          </div>

          {/* The Boutique Matchmaking Difference (3 Pillars) */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-[#D3A753] uppercase sm:text-sm">
                The Boutique Matchmaking Difference
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: HeartHandshake,
                  title: "A Human Bridge Between Two Worlds",
                  desc: "We connect serious international gentlemen with genuine, relationship-minded Thai women seeking a loving marriage and shared future.",
                },
                {
                  icon: ShieldCheck,
                  title: "Integrity Above Database Numbers",
                  desc: "We take the time to understand each person's core values, lifestyle, and family vision before suggesting an introduction.",
                },
                {
                  icon: Lock,
                  title: "Complete Discretion & Respect",
                  desc: "Every interaction is handled with utmost privacy. Introductions only take place when both individuals have reviewed each other and agreed.",
                },
              ].map((pillar, idx) => {
                const Icon = pillar.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      duration: 0.55,
                      delay: idx * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#D3A753]/40 hover:bg-card/90 hover:shadow-xl hover:shadow-[#D3A753]/5 sm:p-8"
                  >
                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-[#D3A753]/30 bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/15 to-[#CA617D]/10 text-[#D3A753] shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6 text-[#CA617D]" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-foreground sm:text-xl">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {pillar.desc}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Philosophy Quote Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#D3A753]/30 bg-gradient-to-r from-[#D3A753]/10 via-[#E791A7]/10 to-[#CA617D]/10 p-6 text-center shadow-md backdrop-blur-sm sm:p-10">
              <Quote className="mx-auto mb-4 size-8 rotate-180 text-[#D3A753]/60 sm:size-10" />
              <blockquote className="font-serif text-lg leading-relaxed text-foreground italic sm:text-xl md:text-2xl">
                &ldquo;Real relationships are built on mutual respect, verified
                sincerity, and shared values—never on random algorithms.&rdquo;
              </blockquote>
            </div>
          </motion.div>

          {/* 4 Proof / Metrics Badges */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          >
            {[
              {
                icon: UserCheck,
                value: "1-2-1 Personal",
                label: "Matchmaking Service",
              },
              {
                icon: ShieldCheck,
                value: "100% Verified",
                label: "Profile Standard",
              },
              {
                icon: MapPin,
                value: "Thailand",
                label: "Local Presence",
              },
              {
                icon: HeartHandshake,
                value: "Mutual Consent",
                label: "Introductions",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card/40 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/40 hover:bg-card/70 sm:p-6"
                >
                  <Icon className="mb-2 size-5 text-[#CA617D] sm:size-6" />
                  <div className="text-base font-bold text-foreground sm:text-lg md:text-xl">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* WHY MEN CHOOSE THAI SOULMATE — MASSIVE TRUST SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden border-b border-border/40 bg-muted/20 py-16 sm:py-24">
        {/* Atmospheric Ambient Glow */}
        <div className="pointer-events-none absolute top-10 -left-40 -z-10 size-[550px] rounded-full bg-gradient-to-tr from-[#D3A753]/10 via-[#E791A7]/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-40 -bottom-20 -z-10 size-[600px] rounded-full bg-gradient-to-bl from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

        <div className="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-bold tracking-[0.25em] text-[#D3A753] uppercase sm:text-sm">
                Trust Is The Product
              </p>
              <h2 className="text-gradient mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Why Men Choose Thai Soulmate
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground md:text-lg">
                Not another dating app. We take the time to understand you
                personally and find real compatibility—saving you the months of
                uncertainty, ghosting, and endless swiping.
              </p>
            </motion.div>
          </div>

          {/* 6 Trust Pillars Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: UserCheck,
                title: "Genuine People",
                desc: "We focus on genuine introductions rather than anonymous profiles, bots, or endless time-wasting conversations.",
              },
              {
                icon: HeartHandshake,
                title: "Personal 1-2-1 Matching",
                desc: "We take the time to deeply understand your personality, lifestyle, and values before recommending any match.",
              },
              {
                icon: Lock,
                title: "100% Confidential & Discreet",
                desc: "Your personal information, background, and conversations are handled with absolute discretion and strict privacy.",
              },
              {
                icon: SearchX,
                title: "No Endless Searching",
                desc: "You don't have to spend months browsing dating apps. Your dedicated matchmaker handles the entire search and vetting for you.",
              },
              {
                icon: Users,
                title: "Both Sides Choose",
                desc: "An introduction only happens when there is genuine interest and consent from both people. Never one-sided.",
              },
              {
                icon: MapPin,
                title: "Based in Thailand",
                desc: "Our matchmaking team is based locally in Thailand—giving us real presence and personal contact with every member.",
              },
            ].map((pillar, index) => {
              const Icon = pillar.icon
              const col = index % 3
              const initialX = col === 0 ? -40 : col === 2 ? 40 : 0
              const initialY = col === 1 ? 35 : 20

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: initialX,
                    y: initialY,
                    scale: col === 1 ? 0.95 : 1,
                    filter: "blur(6px)",
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 3) * 0.1 + Math.floor(index / 3) * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -7,
                    scale: 1.02,
                    transition: { duration: 0.25 },
                  }}
                  className="h-full"
                >
                  <Card className="group h-full rounded-2xl border border-[#D3A753]/20 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/10">
                    <CardHeader className="space-y-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#D3A753] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="size-6 text-[#CA617D]" />
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {pillar.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {pillar.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Verification Box / Process Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 35, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card/90 via-card/70 to-[#D3A753]/10 p-6 shadow-xl backdrop-blur-sm sm:p-10"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/20 to-transparent blur-3xl" />
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-3.5 py-1 text-xs font-semibold text-[#D3A753]"
                >
                  <ShieldCheck className="size-4 text-[#D3A753]" />
                  <span>Strict Member Verification Standards</span>
                </motion.div>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  You Deserve to Know Who You&apos;re Talking To
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Before introducing any member, our team verifies critical
                  details so you can proceed with confidence, security, and
                  peace of mind.
                </p>

                <div className="grid grid-cols-2 gap-2.5 pt-2 sm:grid-cols-3">
                  {[
                    "Government ID & Age",
                    "Current Location",
                    "Relationship Status",
                    "Background & Career",
                    "Relationship Intentions",
                    "In-Person / Video Interview",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.88, x: -8 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15 + i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ scale: 1.04, x: 2 }}
                      className="flex items-center gap-2 rounded-lg border border-border/40 bg-card/50 px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-[#CA617D]/40 sm:text-sm"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-[#CA617D]" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex shrink-0 flex-col items-start justify-center gap-3 lg:items-center lg:border-l lg:border-border/60 lg:pl-8"
              >
                <p className="text-center text-sm font-semibold lg:text-left">
                  Have questions before registering?
                </p>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    asChild
                    size="lg"
                    className="btn-gradient w-full font-semibold shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-[#D3A753]/20 sm:w-auto"
                  >
                    <Link href="/#register-interest">
                      Arrange a Confidential Consultation
                    </Link>
                  </Button>
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  Free · 100% Confidential · No Obligation
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* WHAT DOES 1-2-1 MATCHMAKING MEAN? */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden border-b border-border/40 py-16 sm:py-24">
        {/* Atmospheric Ambient Glow */}
        <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 size-[600px] rounded-full bg-gradient-to-b from-[#D3A753]/10 via-[#E791A7]/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 size-[600px] rounded-full bg-gradient-to-tr from-[#CA617D]/10 via-[#D3A753]/5 to-transparent blur-3xl" />

        <div className="mx-auto w-full max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase">
                <Sparkles className="size-3.5" />
                <span>Real Human Service · Not An Algorithm</span>
              </div>
              <h2 className="text-gradient mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                What Does 1-2-1 Matchmaking Mean?
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
                It means you&apos;re dealing with a real person—not an
                algorithm. Think of us as your{" "}
                <span className="font-semibold text-foreground">
                  personal assistant in your search for a life partner in
                  Thailand
                </span>
                . You&apos;re not buying access to another crowded database;
                you&apos;re having an expert do the searching, vetting, and
                matching for you.
              </p>
            </motion.div>
          </div>

          {/* Comparison Cards: Dating Apps vs Personal Matchmaker */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Card 1: Dating Apps (Enters from Left) */}
            <motion.div
              initial={{ opacity: 0, x: -55, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="h-full"
            >
              <Card className="h-full rounded-2xl border border-destructive/25 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-destructive/40">
                <CardHeader className="space-y-2 border-b border-border/40 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      The Standard Dating Experience
                    </span>
                    <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                      Frustrating & Impersonal
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Not Another Dating App
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Endless profiles, hours lost scrolling, and zero certainty.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6 text-sm text-muted-foreground">
                  <div className="space-y-4">
                    {[
                      {
                        title: "Endless profiles to swipe through",
                        desc: "Dating apps dump thousands of unverified profiles on you with zero guidance.",
                      },
                      {
                        title: "You message, wait, and get ghosted",
                        desc: "You invest precious hours messaging people who never reply or disappear midway.",
                      },
                      {
                        title: "Wondering who is genuine",
                        desc: "You constantly second-guess if photos are real, filtered, or outright scammers.",
                      },
                      {
                        title: "Starting all over again from scratch",
                        desc: "Months pass feeling exhausted and discouraged, without meeting anyone real.",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                          <X className="size-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground/90">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2: Thai Soulmate Personal Matchmaker (Enters from Right) */}
            <motion.div
              initial={{ opacity: 0, x: 55, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -6,
                scale: 1.015,
                transition: { duration: 0.25 },
              }}
              className="h-full"
            >
              <Card className="relative h-full overflow-hidden rounded-2xl border border-[#D3A753]/60 bg-gradient-to-br from-card via-card to-background shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/90 hover:shadow-2xl hover:shadow-[#D3A753]/15">
                <motion.div
                  animate={{
                    scale: [0.95, 1.15, 0.95],
                    opacity: [0.15, 0.3, 0.15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-[#D3A753] blur-2xl"
                />
                <CardHeader className="space-y-2 border-b border-[#D3A753]/20 pb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-[#D3A753] uppercase">
                      The Thai Soulmate Difference
                    </span>
                    <span className="rounded-full bg-gradient-to-r from-[#D3A753]/20 to-[#CA617D]/20 px-2.5 py-0.5 text-xs font-semibold text-[#D3A753]">
                      Personal & Curated
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Your Personal Matchmaker in Thailand
                  </CardTitle>
                  <CardDescription className="text-sm text-foreground/80">
                    Stop searching. Let us do the matching for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6 text-sm">
                  <div className="space-y-4">
                    {[
                      {
                        title: "Dealing with a real human",
                        desc: "No cold algorithms. A dedicated matchmaker based in Thailand handles your introductions.",
                      },
                      {
                        title: "Personally vetted women",
                        desc: "Every candidate is interviewed face-to-face or on video, with identity & background verified.",
                      },
                      {
                        title: "Mutual agreement before introduction",
                        desc: "Introductions happen only when both sides have reviewed profiles and expressed genuine interest.",
                      },
                      {
                        title: "Quality over database quantity",
                        desc: "Our success metric is meaningful, lasting relationships—not how many profiles are in our database.",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#D3A753]/20 text-[#D3A753]">
                          <Check className="size-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 8 Things We Take Time to Understand */}
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <motion.div
                initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.55 }}
              >
                <h3 className="text-2xl font-bold sm:text-3xl">
                  8 Things We Take Time to Understand About You
                </h3>
                <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Before recommending any match, we build a thorough
                  understanding of who you are and what you genuinely seek:
                </p>
              </motion.div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Smile,
                  number: "01",
                  title: "Your Personality",
                  desc: "Your temperament, values, sense of humor, and emotional outlook.",
                },
                {
                  icon: Compass,
                  number: "02",
                  title: "Your Lifestyle",
                  desc: "Daily routines, career demands, hobbies, travel habits, and living pace.",
                },
                {
                  icon: Target,
                  number: "03",
                  title: "Your Relationship Goals",
                  desc: "Whether you're seeking marriage, lifelong companionship, or family-building.",
                },
                {
                  icon: Heart,
                  number: "04",
                  title: "Your Preferences",
                  desc: "Age preferences, cultural compatibility, language comfort, and shared interests.",
                },
                {
                  icon: UserCheck,
                  number: "05",
                  title: "Your Expectations",
                  desc: "What mutual respect, emotional commitment, and daily life look like to you.",
                },
                {
                  icon: History,
                  number: "06",
                  title: "What Has & Hasn't Worked",
                  desc: "Understanding past relationship experiences so we don't repeat mistakes.",
                },
                {
                  icon: HeartHandshake,
                  number: "07",
                  title: "Your Ideal Life Partner",
                  desc: "The kind of partner you believe would truly suit you and bring you lasting joy.",
                },
                {
                  icon: MapPin,
                  number: "08",
                  title: "Your Future & Living Plans",
                  desc: "Where you plan to live, retirement dreams, and long-term horizon in Thailand or abroad.",
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{
                      opacity: 0,
                      y: 35,
                      scale: 0.94,
                      filter: "blur(4px)",
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    viewport={{ once: false, amount: 0.12 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      y: -6,
                      scale: 1.025,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#D3A753]/60 hover:shadow-xl hover:shadow-[#D3A753]/10">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D3A753]/20 via-[#E791A7]/20 to-[#CA617D]/20 text-[#CA617D] transition-transform duration-300 group-hover:scale-110">
                            <Icon className="size-5" />
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#D3A753]">
                            {item.number}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Bottom Pitch Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 35, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card/90 via-card/70 to-[#D3A753]/10 p-8 text-center shadow-xl backdrop-blur-sm sm:p-12"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/20 to-transparent blur-3xl" />
            <div className="mx-auto max-w-3xl space-y-4">
              <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">
                Then we use that information when considering potential
                introductions.
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base">
                This makes your service feel personal and premium. We save you
                the time, uncertainty, and frustration of doing it all yourself.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="btn-gradient font-semibold shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-[#D3A753]/20"
                  >
                    <Link href="/#register-interest">
                      Arrange a Confidential Consultation
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-[#D3A753]/40 hover:bg-[#D3A753]/10"
                  >
                    <Link href="/service">See How It Works</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* REGISTER INTEREST FORM */}
      {/* ========================================================= */}
      <section
        id="register-interest"
        ref={registerInterestRef}
        className="relative overflow-hidden py-16 sm:py-24"
      >
        {/* Atmospheric Ambient Glow behind form */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(207,161,79,0.08),transparent_70%)]" />
        <motion.div
          animate={{
            scale: [0.94, 1.06, 0.94],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/15 via-[#E791A7]/10 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <RegisterInterestForm />
        </motion.div>
      </section>
    </main>
  )
}
