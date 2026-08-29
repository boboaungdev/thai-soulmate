"use client"

import Image from "next/image"
import { useEffect } from "react"
import {
  ArrowRight,
  Check,
  Globe,
  Heart,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import {
  FaFacebook,
  FaFemale,
  FaInstagram,
  FaLine,
  FaMale,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"

import { APP_INFO, CONTACT } from "@/constants"

/* ============================================================
   PRINT TRIGGER
   ============================================================ */

function PrintTrigger() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") !== "true")
      return

    const print = async () => {
      await document.fonts.ready

      await Promise.all(
        Array.from(document.images).map(async (image) => {
          if (image.complete) {
            try {
              await image.decode()
            } catch {}
          }
        })
      )

      window.print()
    }

    void print()
  }, [])

  return null
}

/* ============================================================
   BRAND
   ============================================================ */

function BrandName({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-label={APP_INFO.name}
      className={`block h-auto ${className}`}
      role="img"
      viewBox="0 0 180 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brand-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D3A753" />
          <stop offset="100%" stopColor="#CA617D" />
        </linearGradient>
      </defs>

      <text
        x="90"
        y="22"
        fill="url(#brand-gradient)"
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="1"
        textAnchor="middle"
      >
        {APP_INFO.name}
      </text>
    </svg>
  )
}

/* ============================================================
   SMALL LABEL
   ============================================================ */

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <div className="flex items-center gap-[2mm]">
      <div
        className={`h-px w-[8mm] ${light ? "bg-[#D3A753]" : "bg-[#D3A753]"}`}
      />

      <span
        className={`font-sans text-[1.8mm] font-bold tracking-[0.22em] uppercase ${
          light ? "text-[#D3A753]" : "text-[#CA617D]"
        }`}
      >
        {children}
      </span>
    </div>
  )
}

/* ============================================================
   FEATURE
   ============================================================ */

function MiniFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[3mm] border border-[#D3A753]/20 bg-white px-[3mm] py-[3mm] shadow-[0_2mm_8mm_rgba(36,20,26,0.08)]">
      {/* Decorative circle */}
      <div className="absolute top-[-6mm] right-[-6mm] h-[17mm] w-[17mm] rounded-full bg-[#D3A753]/8" />

      <div className="relative">
        {/* Icon */}
        <div className="flex h-[8mm] w-[8mm] items-center justify-center rounded-full bg-[#FBF1E5]">
          {icon}
        </div>

        {/* Title */}
        <h3 className="mt-[2mm] font-sans text-[2.2mm] font-bold text-[#5A0816]">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-[1mm] font-sans text-[1.55mm] leading-[1.4] text-[#24141A]/55">
          {text}
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   AUDIENCE
   ============================================================ */

function Audience({
  icon,
  number,
  title,
  description,
  items,
}: {
  icon: React.ReactNode
  number: string
  title: string
  description: string
  items: string[]
}) {
  return (
    <div className="relative min-h-[46mm] overflow-hidden rounded-[4mm] border border-[#D3A753]/25 bg-[#FBF8F3] px-[3.5mm] py-[3.5mm]">
      {/* Decorative circle */}
      <div className="absolute top-[-8mm] right-[-8mm] h-[27mm] w-[27mm] rounded-full bg-[#D3A753]/10" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex h-[9mm] w-[9mm] items-center justify-center rounded-full bg-white shadow-sm">
            {icon}
          </div>

          <span className="font-serif text-[6mm] leading-none text-[#D3A753]/35">
            {number}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-[2.5mm] font-sans text-[2.8mm] font-bold text-[#5A0816]">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-[0.8mm] font-sans text-[1.55mm] leading-[1.3] font-medium text-[#CA617D]">
          {description}
        </p>

        {/* Features */}
        <div className="mt-[2.5mm] space-y-[1.4mm]">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-[1.3mm]">
              <Check
                size={8}
                color="#CA617D"
                strokeWidth={3}
                className="mt-[0.15mm] shrink-0"
              />

              <p className="font-sans text-[1.5mm] leading-[1.3] text-[#24141A]/65">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   STEP
   ============================================================ */

function MatchStep({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <div className="relative">
      <div className="flex h-[9mm] w-[9mm] items-center justify-center rounded-full bg-gradient-to-br from-[#D3A753] to-[#CA617D] font-sans text-[2mm] font-bold text-white shadow-md">
        {number}
      </div>

      <h3 className="mt-[2mm] font-sans text-[2mm] font-bold text-white">
        {title}
      </h3>

      <p className="mt-[0.8mm] font-sans text-[1.55mm] leading-[1.35] text-white/55">
        {text}
      </p>
    </div>
  )
}

/* ============================================================
   CONTACT ITEM
   ============================================================ */

function ContactItem({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-[2mm]">
      <div className="flex h-[6mm] w-[6mm] shrink-0 items-center justify-center rounded-full bg-white/10">
        {icon}
      </div>

      <span className="font-sans text-[1.7mm] font-medium text-white/85">
        {children}
      </span>
    </div>
  )
}

/* ============================================================
   PAGE
   ============================================================ */

export default function MarketingLeafletPrintPage() {
  return (
    <>
      <PrintTrigger />

      <style jsx global>{`
        @page {
          size: A5 portrait;
          margin: 0;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        * {
          box-sizing: border-box;
        }

        body {
          background: #e9e1da;
        }

        #printable-area.marketing-leaflet-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          padding: 36px;
          background: #e9e1da;
        }

        .marketing-leaflet-page {
          position: relative;
          width: 148mm;
          height: 210mm;
          min-width: 148mm;
          min-height: 210mm;
          max-width: 148mm;
          max-height: 210mm;
          overflow: hidden;
        }

        @media print {
          html,
          body {
            background: white;
          }

          #printable-area.marketing-leaflet-document {
            width: 148mm;
            padding: 0;
            gap: 0;
            background: white;
          }

          #printable-area.marketing-leaflet-document .marketing-leaflet-page {
            width: 148mm;
            height: 210mm;
            min-width: 148mm;
            min-height: 210mm;
            max-width: 148mm;
            max-height: 210mm;
            box-shadow: none !important;
            border-radius: 0 !important;
            break-after: page;
            page-break-after: always;
          }

          #printable-area.marketing-leaflet-document
            .marketing-leaflet-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      <main id="printable-area" className="marketing-leaflet-document">
        {/* ========================================================
    PAGE 1 — MODERN PREMIUM HERO
    ======================================================== */}

        <section className="marketing-leaflet-page bg-[#FBF8F3] shadow-2xl">
          {/* Background */}

          <div className="absolute top-[-35mm] right-[-35mm] h-[105mm] w-[105mm] rounded-full bg-[#D3A753]/10" />

          <div className="absolute bottom-[-35mm] left-[-35mm] h-[90mm] w-[90mm] rounded-full bg-[#CA617D]/8" />

          <div className="absolute top-0 right-0 h-[78mm] w-[55mm] bg-[#5A0816] [clip-path:polygon(25%_0,100%_0,100%_100%,0_70%)]" />

          {/* Gold side accent */}

          <div className="absolute top-0 bottom-0 left-0 w-[1.5mm] bg-gradient-to-b from-[#D3A753] via-[#CA617D] to-[#D3A753]" />

          {/* Decorative circles */}

          <div className="absolute top-[17mm] right-[12mm] h-[45mm] w-[45mm] rounded-full border border-[#D3A753]/20" />

          <div className="absolute top-[21mm] right-[16mm] h-[37mm] w-[37mm] rounded-full border border-[#CA617D]/15" />

          {/* ======================================================
      HEADER
      ====================================================== */}

          <div className="absolute top-[9mm] right-[11mm] left-[11mm] z-30 flex items-center justify-between">
            {/* BRAND HEADER — SAME STYLE AS PAGE 2 */}

            <div className="left-4mm] absolute top-[4mm] z-20 flex w-[64mm] items-center">
              {/* Logo */}
              <Image
                src="/logo.png"
                alt="Thai Soulmate"
                width={180}
                height={180}
                priority
                quality={100}
                unoptimized
                className="h-[14mm] w-[14mm] shrink-0 object-contain"
              />

              {/* Brand + tagline */}
              <div className="w-[48mm] text-center">
                <BrandName className="mx-auto w-[48mm]" />

                <p className="mt-[0.5mm] text-center font-sans text-[1.8mm] font-semibold tracking-[0.22em] text-[#D3A753] uppercase">
                  1-2-1 Matchmaking Service
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================
      HERO IMAGE
      ====================================================== */}

          <div
            className="absolute top-[31mm] right-[8mm] z-10 h-[79mm] w-[76mm] overflow-hidden border-[2mm] border-[#FBF8F3] shadow-[0_7mm_20mm_rgba(36,20,26,0.18)]"
            style={{
              borderRadius: "42% 42% 42% 12% / 38% 38% 38% 18%",
            }}
          >
            <Image
              src="/card/marketing/1.png"
              alt="Thai Soulmate"
              fill
              priority
              quality={100}
              unoptimized
              className="object-cover"
              sizes="80mm"
            />

            {/* Image overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#5A0816]/35 via-transparent to-transparent" />
          </div>

          {/* Floating image badge */}

          <div className="absolute top-[91mm] right-[55mm] z-30 rounded-[3mm] bg-white px-[3mm] py-[2.5mm] shadow-[0_3mm_12mm_rgba(36,20,26,0.15)]">
            <div className="flex items-center gap-[2mm]">
              <div className="flex h-[7mm] w-[7mm] items-center justify-center rounded-full bg-[#FBF1E5]">
                <Heart size={13} color="#CA617D" fill="#CA617D" />
              </div>

              <div>
                <p className="font-sans text-[1.35mm] font-bold tracking-[0.12em] text-[#CA617D] uppercase">
                  Personal Matching
                </p>

                <p className="mt-[0.5mm] font-sans text-[1.45mm] font-medium text-[#5A0816]">
                  Made around you
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================
      MAIN COPY
      ====================================================== */}

          <div className="absolute top-[34mm] left-[11mm] z-20 w-[57mm]">
            <Eyebrow>REAL CONNECTIONS</Eyebrow>

            <h1 className="mt-[4mm] font-serif text-[11mm] leading-[0.9] tracking-[-0.035em] text-[#5A0816]">
              Meet someone
              <br />
              <span className="text-[#CA617D] italic">worth knowing.</span>
            </h1>

            <p className="mt-[5mm] w-[51mm] font-sans text-[2mm] leading-[1.55] text-[#24141A]/65">
              A personal matchmaking service connecting genuine Thai ladies and
              foreign gentlemen through thoughtful, private introductions in
              Thailand.
            </p>

            {/* CTA */}

            <div className="mt-[5mm] flex items-center gap-[2mm]">
              <div className="flex items-center gap-[2mm] rounded-full bg-[#5A0816] px-[4mm] py-[2.5mm] shadow-md">
                <span className="font-sans text-[1.65mm] font-bold tracking-[0.1em] text-white uppercase">
                  Start Your Journey
                </span>

                <ArrowRight size={11} color="#D3A753" />
              </div>
            </div>
          </div>

          {/* ======================================================
      TRUST LABELS
      ====================================================== */}

          <div className="absolute top-[119mm] right-[11mm] left-[11mm] z-20">
            <div className="grid grid-cols-3 gap-[2.5mm]">
              {/* Personal */}

              <div className="rounded-[3mm] border border-[#D3A753]/25 bg-white px-[3mm] py-[3mm] shadow-[0_2mm_8mm_rgba(36,20,26,0.06)]">
                <div className="flex items-center gap-[2mm]">
                  <div className="flex h-[7mm] w-[7mm] items-center justify-center rounded-full bg-[#FBF1E5]">
                    <Heart size={13} color="#CA617D" fill="#CA617D" />
                  </div>

                  <div>
                    <p className="font-sans text-[1.6mm] font-bold text-[#5A0816]">
                      Personal
                    </p>

                    <p className="mt-[0.5mm] font-sans text-[1.25mm] text-[#24141A]/50">
                      Matching around you
                    </p>
                  </div>
                </div>
              </div>

              {/* Genuine */}

              <div className="rounded-[3mm] border border-[#D3A753]/25 bg-white px-[3mm] py-[3mm] shadow-[0_2mm_8mm_rgba(36,20,26,0.06)]">
                <div className="flex items-center gap-[2mm]">
                  <div className="flex h-[7mm] w-[7mm] items-center justify-center rounded-full bg-[#FBF1E5]">
                    <Users size={13} color="#D3A753" />
                  </div>

                  <div>
                    <p className="font-sans text-[1.6mm] font-bold text-[#5A0816]">
                      Genuine
                    </p>

                    <p className="mt-[0.5mm] font-sans text-[1.25mm] text-[#24141A]/50">
                      Real people & intentions
                    </p>
                  </div>
                </div>
              </div>

              {/* Discreet */}

              <div className="rounded-[3mm] border border-[#D3A753]/25 bg-white px-[3mm] py-[3mm] shadow-[0_2mm_8mm_rgba(36,20,26,0.06)]">
                <div className="flex items-center gap-[2mm]">
                  <div className="flex h-[7mm] w-[7mm] items-center justify-center rounded-full bg-[#FBF1E5]">
                    <ShieldCheck size={13} color="#CA617D" />
                  </div>

                  <div>
                    <p className="font-sans text-[1.6mm] font-bold text-[#5A0816]">
                      Discreet
                    </p>

                    <p className="mt-[0.5mm] font-sans text-[1.25mm] text-[#24141A]/50">
                      Private & respectful
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
      WHY THAI SOULMATE
      ====================================================== */}

          <div className="absolute top-[142mm] right-[11mm] left-[11mm] z-20">
            <div className="flex items-end justify-between">
              <div>
                <Eyebrow>WHY THAI SOULMATE</Eyebrow>

                <h2 className="mt-[2mm] font-serif text-[5.5mm] leading-[1] text-[#5A0816]">
                  A more personal way
                  <br />
                  <span className="text-[#CA617D] italic">to meet.</span>
                </h2>
              </div>

              <Sparkles size={18} color="#D3A753" />
            </div>

            <p className="mt-[2.5mm] w-[110mm] font-sans text-[1.65mm] leading-[1.45] text-[#24141A]/60">
              We don't simply introduce profiles. We take time to understand who
              you are, what you want, and the kind of relationship you're hoping
              to build.
            </p>

            <div className="mt-[3mm] grid grid-cols-3 gap-[3mm]">
              <div>
                <div className="flex items-center gap-[1.5mm]">
                  <span className="font-serif text-[3.5mm] text-[#D3A753]">
                    01
                  </span>

                  <span className="font-sans text-[1.7mm] font-bold text-[#5A0816]">
                    Real People
                  </span>
                </div>

                <p className="mt-[1mm] font-sans text-[1.35mm] leading-[1.35] text-[#24141A]/50">
                  Genuine introductions instead of endless swiping.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-[1.5mm]">
                  <span className="font-serif text-[3.5mm] text-[#D3A753]">
                    02
                  </span>

                  <span className="font-sans text-[1.7mm] font-bold text-[#5A0816]">
                    Personal Approach
                  </span>
                </div>

                <p className="mt-[1mm] font-sans text-[1.35mm] leading-[1.35] text-[#24141A]/50">
                  We learn about you before recommending a match.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-[1.5mm]">
                  <span className="font-serif text-[3.5mm] text-[#D3A753]">
                    03
                  </span>

                  <span className="font-sans text-[1.7mm] font-bold text-[#5A0816]">
                    Thailand Focused
                  </span>
                </div>

                <p className="mt-[1mm] font-sans text-[1.35mm] leading-[1.35] text-[#24141A]/50">
                  Personal matchmaking support based in Thailand.
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================
      BOTTOM CTA
      ====================================================== */}

          <div className="absolute right-0 bottom-0 left-0 h-[22mm] bg-[#5A0816]">
            {/* Decorative gold curve */}

            <div className="absolute top-[-12mm] right-[-12mm] h-[35mm] w-[35mm] rounded-full border border-[#D3A753]/20" />

            <div className="absolute top-[-18mm] right-[20mm] h-[42mm] w-[42mm] rounded-full border border-[#CA617D]/10" />

            <div className="absolute top-[4mm] right-[11mm] left-[11mm] z-10 flex items-center justify-between">
              <div>
                <p className="font-sans text-[1.45mm] font-bold tracking-[0.2em] text-[#D3A753] uppercase">
                  Ready to meet differently?
                </p>

                <p className="mt-[1mm] font-serif text-[3.5mm] text-white italic">
                  Your story deserves the right introduction.
                </p>
              </div>

              <div className="flex h-[10mm] items-center gap-[2mm] rounded-full bg-[#D3A753] px-[4mm] shadow-lg">
                <span className="font-sans text-[1.65mm] font-bold tracking-[0.1em] text-[#5A0816] uppercase">
                  Contact Us
                </span>

                <ArrowRight size={12} color="#5A0816" />
              </div>
            </div>

            <p className="absolute right-[11mm] bottom-[2.5mm] font-sans text-[1.2mm] tracking-[0.12em] text-white/35 uppercase">
              Real People · Real Connections · Real Futures
            </p>
          </div>
        </section>
        {/* ========================================================
            PAGE 2 — SERVICE / CONTACT
            ======================================================== */}

        <section className="marketing-leaflet-page bg-[#FBF8F3] shadow-2xl">
          {/* Top burgundy section */}

          <div className="absolute top-0 right-0 left-0 h-[77mm] bg-[#5A0816]" />

          {/* Decorative curves */}

          <div className="absolute top-[-28mm] right-[-25mm] h-[75mm] w-[75mm] rounded-full border border-[#D3A753]/30" />

          <div className="absolute top-[-22mm] right-[-19mm] h-[63mm] w-[63mm] rounded-full border border-[#CA617D]/20" />

          {/* Header */}

          <div className="absolute top-[12mm] left-[8mm] z-20 flex w-[64mm] items-center">
            {/* Logo */}
            <Image
              src="/logo.png"
              alt="Thai Soulmate"
              width={180}
              height={180}
              priority
              quality={100}
              unoptimized
              className="h-[14mm] w-[14mm] shrink-0 object-contain"
            />

            {/* Brand + tagline */}
            <div className="w-[48mm] text-center">
              <BrandName className="mx-auto w-[48mm]" />

              <p className="mt-[0.5mm] text-center font-sans text-[1.8mm] font-semibold tracking-[0.22em] text-[#D3A753] uppercase">
                1-2-1 Matchmaking Service
              </p>
            </div>
          </div>

          {/* Hero title */}

          <div className="absolute top-[29mm] left-[11mm] z-20 w-[66mm]">
            <h2 className="mt-[3mm] font-serif text-[8mm] leading-[0.95] text-white">
              More than
              <br />
              <span className="text-[#D3A753] italic">a match.</span>
            </h2>

            <p className="mt-[3mm] w-[63mm] font-sans text-[1.9mm] leading-[1.45] text-white/60">
              We get to know you first, understand what you are looking for, and
              introduce you to people who may genuinely complement your life.
            </p>
          </div>

          {/* Circular hero image */}

          <div className="absolute top-[30mm] right-[10mm] z-30 h-[43mm] w-[43mm] overflow-hidden rounded-full border-[1.5mm] border-[#FBF8F3] shadow-xl">
            <Image
              src="/card/marketing/3.png"
              alt="Thai Soulmate couple"
              fill
              quality={100}
              unoptimized
              className="object-cover"
              sizes="43mm"
            />
          </div>

          {/* Gold wave transition */}

          <div
            className="absolute top-[67mm] right-[-10mm] left-[-10mm] h-[24mm] bg-[#FBF8F3]"
            style={{
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />

          {/* Who we help */}

          <div className="absolute top-[81mm] right-[10mm] left-[10mm] z-20">
            <Eyebrow>WHO WE HELP</Eyebrow>

            <h2 className="mt-[2mm] font-serif text-[5.2mm] leading-none text-[#5A0816]">
              Two people.
              <span className="text-[#CA617D] italic">
                {" "}
                One meaningful journey.
              </span>
            </h2>

            <div className="mt-[3mm] grid grid-cols-2 gap-[3mm]">
              <Audience
                number="01"
                icon={<FaFemale size={20} color="#CA617D" />}
                title="For Thai Ladies"
                description="Meet genuine foreign gentlemen"
                items={[
                  "Personal consultation",
                  "Carefully selected introductions",
                  "Compatibility-focused matching",
                  "Private and respectful support",
                ]}
              />

              <Audience
                number="02"
                icon={<FaMale size={20} color="#D3A753" />}
                title="For Foreign Gentlemen"
                description="Meet genuine Thai ladies"
                items={[
                  "Personal matchmaking consultation",
                  "Genuine Thai introductions",
                  "Matches based on preferences",
                  "Professional support in Thailand",
                ]}
              />
            </div>
          </div>

          {/* How it works */}

          {/* <div className="absolute top-[130mm] right-0 left-0 bg-[#24141A] px-[10mm] pt-[6mm] pb-[7mm]">
            <div className="flex items-center justify-between">
              <div>
                <Eyebrow light>HOW IT WORKS</Eyebrow>

                <h2 className="mt-[2mm] font-serif text-[5mm] text-white">
                  A more personal way to meet.
                </h2>
              </div>
            </div>

            <div className="relative mt-[5mm] grid grid-cols-4 gap-[3mm]">
              <div className="absolute top-[4.5mm] right-[4mm] left-[4mm] h-px bg-gradient-to-r from-[#D3A753]/60 via-[#CA617D]/50 to-[#D3A753]/60" />

              <MatchStep
                number="01"
                title="Get to know you"
                text="We learn about your personality and life."
              />

              <MatchStep
                number="02"
                title="Understand your goals"
                text="We discuss your relationship expectations."
              />

              <MatchStep
                number="03"
                title="Find compatibility"
                text="We select people who fit your preferences."
              />

              <MatchStep
                number="04"
                title="Make an introduction"
                text="We help create the first connection."
              />
            </div>
          </div> */}

          {/* Contact section */}

          <div className="absolute right-[10mm] bottom-[8mm] left-[10mm]">
            <div className="relative overflow-hidden rounded-[4mm] bg-gradient-to-br from-[#6B1023] to-[#3D0710] p-[4mm] shadow-lg">
              <div className="absolute top-[-12mm] right-[-12mm] h-[35mm] w-[35mm] rounded-full border border-[#D3A753]/20" />

              <div className="relative flex">
                {/* Contact */}

                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[2mm] font-bold tracking-[0.15em] text-[#D3A753] uppercase">
                    Start Your Journey
                  </p>

                  <p className="mt-[1mm] w-[62mm] font-serif text-[3.2mm] text-white italic">
                    Your story deserves the right introduction.
                  </p>

                  <div className="mt-[3mm] grid gap-[1.4mm]">
                    {/* WhatsApp */}
                    <ContactItem
                      icon={<FaWhatsapp size={11} color="#25D366" />}
                    >
                      {CONTACT.primaryPhone}
                    </ContactItem>

                    {/* Phone 1 */}
                    <ContactItem icon={<Phone size={11} color="#1877F2" />}>
                      {CONTACT.primaryPhone}
                    </ContactItem>

                    {/* Phone 2 */}
                    <ContactItem icon={<Phone size={11} color="#1877F2" />}>
                      {CONTACT.secondaryPhone}
                    </ContactItem>

                    <ContactItem icon={<Mail size={11} color="#E791A7" />}>
                      {CONTACT.email}
                    </ContactItem>

                    <ContactItem icon={<Globe size={11} color="#D3A753" />}>
                      {CONTACT.website}
                    </ContactItem>
                  </div>
                </div>

                {/* QR */}

                <div className="mt-[15mm] mr-[4mm] flex w-[47mm] shrink-0 items-center justify-center gap-[3mm]">
                  {" "}
                  {/* WhatsApp QR */}
                  <div className="flex flex-col items-center">
                    <div className="relative rounded-[2mm] bg-white p-[1.5mm] shadow-md">
                      <QRCodeSVG
                        value={CONTACT.whatsapp}
                        level="H"
                        marginSize={2}
                        className="block h-[22mm] w-[22mm]"
                      />

                      {/* WhatsApp icon */}
                      <div className="absolute top-1/2 left-1/2 flex h-[6mm] w-[6mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white">
                        <FaWhatsapp size={16} color="#25D366" />
                      </div>
                    </div>

                    <div className="mt-[1.2mm] flex items-center gap-[1mm]">
                      <span className="font-sans text-[1.5mm] font-bold text-white/75">
                        WhatsApp
                      </span>
                    </div>
                  </div>
                  {/* Website QR */}
                  <div className="flex flex-col items-center">
                    <div className="relative rounded-[2mm] bg-white p-[1.5mm] shadow-md">
                      <QRCodeSVG
                        value={`https://${CONTACT.website}`}
                        level="H"
                        marginSize={2}
                        className="block h-[22mm] w-[22mm]"
                      />

                      {/* Website logo */}
                      <div className="absolute top-1/2 left-1/2 flex h-[6mm] w-[6mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white">
                        <Image
                          src="/logo.png"
                          alt="Thai Soulmate"
                          width={40}
                          height={40}
                          quality={100}
                          unoptimized
                          className="h-[4.5mm] w-[4.5mm] object-contain"
                        />
                      </div>
                    </div>

                    <div className="mt-[1.2mm] flex items-center gap-[1mm]">
                      <span className="font-sans text-[1.5mm] font-bold text-white/75">
                        Website
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}

            <div className="mt-[2.5mm] flex items-center justify-between">
              <div className="flex items-center gap-[3.5mm]">
                {/* Facebook */}
                <div className="flex items-center gap-[1mm]">
                  <FaFacebook size={9} color="#1877F2" />
                  <span className="font-sans text-[1.35mm] font-medium text-[#24141A]/55">
                    @thaisoulmates
                  </span>
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-[1mm]">
                  <FaInstagram size={9} color="#E4405F" />
                  <span className="font-sans text-[1.35mm] font-medium text-[#24141A]/55">
                    @thaisoulmate
                  </span>
                </div>

                {/* TikTok */}
                <div className="flex items-center gap-[1mm]">
                  <FaTiktok size={9} color="#000000" />
                  <span className="font-sans text-[1.35mm] font-medium text-[#24141A]/55">
                    @thaisoulmate
                  </span>
                </div>

                {/* LINE */}
                <div className="flex items-center gap-[1mm]">
                  <FaLine size={9} color="#00C300" />
                  <span className="font-sans text-[1.35mm] font-medium text-[#24141A]/55">
                    @thaisoulmate
                  </span>
                </div>
              </div>

              <p className="font-sans text-[1.45mm] font-medium text-[#24141A]/45">
                Real People. Real Connections. Real Futures.
              </p>
            </div>
          </div>

          {/* Bottom gold accent */}

          <div className="absolute right-0 bottom-0 left-0 h-[1.5mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />
        </section>
      </main>
    </>
  )
}
