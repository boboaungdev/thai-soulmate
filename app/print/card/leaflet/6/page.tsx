"use client"

import Image from "next/image"
import { useEffect } from "react"
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
  Globe,
  Mail,
  Phone,
  Check,
  ArrowRight,
  HandHeart,
  Star,
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
   PRINT
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
        <linearGradient id="leaflet-brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D3A753" />
          <stop offset="50%" stopColor="#E791A7" />
          <stop offset="100%" stopColor="#CA617D" />
        </linearGradient>
      </defs>

      <text
        x="90"
        y="22"
        fill="url(#leaflet-brand)"
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
   SECTION TITLE
   ============================================================ */

function SectionTitle({
  children,
  light = false,
}: {
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <div className="flex items-center gap-[2mm]">
      <div
        className={`h-px w-[9mm] ${light ? "bg-[#D3A753]/70" : "bg-[#D3A753]"}`}
      />

      <h2
        className={`font-sans text-[3.4mm] font-bold tracking-[0.13em] uppercase ${
          light ? "text-white" : "text-[#241e2a]"
        }`}
      >
        {children}
      </h2>

      <div
        className={`h-px flex-1 ${light ? "bg-white/20" : "bg-[#D3A753]/35"}`}
      />
    </div>
  )
}

/* ============================================================
   FEATURE
   ============================================================ */

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-[2.5mm] border border-[#D3A753]/25 bg-white p-[3mm] shadow-sm">
      <div className="flex items-center gap-[2mm]">
        <div className="flex h-[8mm] w-[8mm] shrink-0 items-center justify-center rounded-full bg-[#FBF1E5]">
          {icon}
        </div>

        <h3 className="font-sans text-[2.5mm] font-bold text-[#241e2a]">
          {title}
        </h3>
      </div>

      <p className="mt-[1.5mm] font-sans text-[1.8mm] leading-[1.4] text-[#241e2a]/60">
        {text}
      </p>
    </div>
  )
}

/* ============================================================
   AUDIENCE CARD
   ============================================================ */

function AudienceCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  items: string[]
}) {
  return (
    <div className="rounded-[2.5mm] border border-[#D3A753]/30 bg-white p-[3.5mm] shadow-sm">
      <div className="flex items-center gap-[2.5mm]">
        <div className="flex h-[9mm] w-[9mm] shrink-0 items-center justify-center rounded-full bg-[#FBF2E7]">
          {icon}
        </div>

        <div>
          <h3 className="font-sans text-[2.9mm] font-bold text-[#5A0816]">
            {title}
          </h3>

          <p className="mt-[0.4mm] font-sans text-[1.65mm] font-semibold text-[#CA617D]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-[2.5mm] space-y-[1.3mm]">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-[1.5mm]">
            <Check
              size={9}
              color="#CA617D"
              strokeWidth={3}
              className="mt-[0.2mm] shrink-0"
            />

            <p className="font-sans text-[1.7mm] leading-[1.3] text-[#241e2a]/65">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   STEP
   ============================================================ */

function Step({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-[7mm] w-[7mm] items-center justify-center rounded-full bg-gradient-to-br from-[#D3A753] to-[#CA617D] font-sans text-[1.9mm] font-bold text-white">
        {number}
      </div>

      <p className="mt-[1.2mm] font-sans text-[1.7mm] leading-[1.2] font-bold text-[#241e2a]">
        {title}
      </p>
    </div>
  )
}

/* ============================================================
   CONTACT LINE
   ============================================================ */

function ContactLine({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-[1.8mm]">
      <div className="flex h-[5.5mm] w-[5.5mm] shrink-0 items-center justify-center rounded-full bg-white/10">
        {icon}
      </div>

      <span className="font-sans text-[1.8mm] font-medium text-white/90">
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

        #printable-area.marketing-leaflet-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          width: 100%;
          padding: 36px;
          background: #eee7df;
        }

        @media print {
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
            overflow: hidden;
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
            PAGE 1
            ======================================================== */}

        <section className="marketing-leaflet-page relative h-[210mm] w-[148mm] overflow-hidden bg-[#FBF8F3] shadow-2xl">
          {/* Premium background */}

          <div className="absolute inset-0 bg-[#FBF8F3]" />

          <div className="absolute inset-x-0 top-0 h-[91mm] bg-gradient-to-br from-[#43050F] via-[#650D20] to-[#8A1E3A]" />

          {/* Pink glow */}

          <div className="absolute top-[35mm] left-[-20mm] h-[80mm] w-[80mm] rounded-full bg-[#E791A7]/10 blur-2xl" />

          {/* Gold glow */}

          <div className="absolute top-[-25mm] right-[-25mm] h-[75mm] w-[75mm] rounded-full bg-[#D3A753]/10 blur-2xl" />

          {/* Gold frame */}

          <div className="absolute inset-[4mm] border border-[#D3A753]/25" />

          {/* Header */}

          <div className="relative z-10 flex flex-col items-center pt-[8mm] text-center">
            <Image
              src="/logo.png"
              alt="Thai Soulmate"
              width={180}
              height={180}
              priority
              quality={100}
              unoptimized
              className="h-[20mm] w-[20mm] object-contain"
            />

            <BrandName className="mt-[1mm] w-[59mm]" />

            <p className="mt-[1mm] font-sans text-[2.2mm] font-semibold tracking-[0.28em] text-[#D3A753] uppercase">
              {APP_INFO.tagline}
            </p>

            <div className="mt-[2.5mm] flex items-center gap-[2.5mm]">
              <div className="h-px w-[15mm] bg-[#D3A753]/45" />

              <Heart size={11} color="#D3A753" fill="#D3A753" />

              <div className="h-px w-[15mm] bg-[#D3A753]/45" />
            </div>
          </div>

          {/* Hero image */}

          <div className="absolute top-[51mm] right-[10mm] left-[10mm] h-[61mm] overflow-hidden rounded-[3mm] border-[1.5mm] border-white shadow-2xl">
            <Image
              src="/card/marketing/1.png"
              alt="Thai Soulmate"
              fill
              priority
              quality={100}
              unoptimized
              className="object-cover"
              sizes="128mm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#39040E] via-transparent to-transparent" />
            <div className="absolute right-[5mm] bottom-[5mm] left-[5mm]">
              <p className="font-sans text-[5.2mm] leading-[1.08] font-bold text-white">
                Real People.
                <br />
                Real Relationships.
              </p>

              <p className="mt-[1.8mm] font-sans text-[2.2mm] font-medium text-[#F9DDA7]">
                Personally matched in Thailand.
              </p>
            </div>
          </div>

          {/* Main statement */}

          <div className="absolute top-[117mm] right-[10mm] left-[10mm]">
            <SectionTitle>A Different Kind Of Matchmaking</SectionTitle>
            <p className="mt-[3mm] font-sans text-[2.25mm] leading-[1.45] text-[#241e2a]/72">
              Finding the right person is about more than a profile, a
              photograph or a swipe. We take the time to understand the person
              behind the profile and create introductions with genuine
              relationship potential.
            </p>
          </div>

          {/* Feature cards */}

          <div className="absolute top-[137mm] right-[10mm] left-[10mm] grid grid-cols-3 gap-[3mm]">
            <Feature
              icon={<Heart size={15} color="#CA617D" fill="#CA617D" />}
              title="Personal Matching"
              text="Introductions based on personality, lifestyle and relationship goals."
            />
            <Feature
              icon={<Users size={15} color="#D3A753" />}
              title="Genuine People"
              text="Meet people who are interested in meaningful relationships."
            />
            <Feature
              icon={<ShieldCheck size={15} color="#CA617D" />}
              title="Private & Discreet"
              text="Your personal information and journey are treated with care."
            />
          </div>

          {/* Premium quote panel */}

          <div className="absolute right-[10mm] bottom-[22mm] left-[10mm] overflow-hidden rounded-[3mm] bg-gradient-to-r from-[#5A0816] to-[#7B1730] px-[6mm] py-[4mm]">
            <div className="absolute top-[-10mm] right-[-5mm] h-[30mm] w-[30mm] rounded-full border border-[#D3A753]/15" />

            <div className="relative flex items-center gap-[4mm]">
              <div className="flex h-[10mm] w-[10mm] shrink-0 items-center justify-center rounded-full bg-[#D3A753]/15">
                <Sparkles size={17} color="#D3A753" />
              </div>

              <div>
                <p className="font-sans text-[2.5mm] font-bold text-white">
                  Made for meaningful connections.
                </p>

                <p className="mt-[0.8mm] font-sans text-[1.8mm] leading-[1.3] text-white/65">
                  Personal attention. Genuine introductions. Professional
                  support.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}

          <div className="absolute inset-x-0 bottom-0 h-[15mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]">
            <div className="flex h-full items-center justify-center gap-[3mm]">
              <p className="font-sans text-[2.5mm] font-bold tracking-[0.12em] text-white uppercase">
                Start Your Story
              </p>

              <ArrowRight size={14} color="white" />
            </div>
          </div>
        </section>

        {/* ========================================================
            PAGE 2
            ======================================================== */}

        <section className="marketing-leaflet-page relative h-[210mm] w-[148mm] overflow-hidden bg-[#FBF8F3] shadow-2xl">
          {/* Accent */}

          <div className="absolute inset-x-0 top-0 h-[4mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          <div className="relative h-full px-[9mm] pt-[8mm]">
            {/* Header */}

            <div className="text-center">
              <BrandName className="mx-auto w-[45mm]" />

              <p className="mt-[0.8mm] font-sans text-[1.7mm] font-semibold tracking-[0.2em] text-[#CA617D] uppercase">
                1-2-1 MATCHMAKING SERVICE
              </p>
            </div>

            {/* Services */}

            <div className="mt-[4mm]">
              <SectionTitle>Who We Help</SectionTitle>

              <div className="mt-[3mm] grid grid-cols-2 gap-[3mm]">
                <AudienceCard
                  icon={<FaFemale size={20} color="#CA617D" />}
                  title="Thai Ladies"
                  subtitle="Meet genuine foreign gentlemen"
                  items={[
                    "Personal consultation",
                    "Carefully selected introductions",
                    "Compatibility-focused matching",
                    "Communication guidance",
                    "Private & respectful service",
                  ]}
                />

                <AudienceCard
                  icon={<FaMale size={20} color="#D3A753" />}
                  title="Foreign Gentlemen"
                  subtitle="Meet genuine Thai ladies"
                  items={[
                    "Personal matchmaking consultation",
                    "Genuine Thai ladies",
                    "Matches based on preferences",
                    "Local relationship guidance",
                    "Professional personal support",
                  ]}
                />
              </div>
            </div>

            {/* How it works */}

            <div className="mt-[4mm]">
              <SectionTitle>How It Works</SectionTitle>

              <div className="relative mt-[3mm] grid grid-cols-4">
                <div className="absolute top-[3.5mm] right-[8mm] left-[8mm] h-px bg-gradient-to-r from-[#D3A753]/30 via-[#CA617D]/40 to-[#D3A753]/30" />

                <Step number="01" title="Get To Know You" />

                <Step number="02" title="Understand Your Goals" />

                <Step number="03" title="Select Compatible Matches" />

                <Step number="04" title="Personal Introduction" />
              </div>
            </div>

            {/* Support banner */}

            <div className="mt-[4mm] rounded-[2.5mm] bg-gradient-to-r from-[#5A0816] via-[#681126] to-[#801B38] px-[4mm] py-[3mm]">
              <div className="flex items-center gap-[3mm]">
                <HandHeart size={18} color="#D3A753" />

                <div>
                  <p className="font-sans text-[2.3mm] font-bold text-white">
                    More than an introduction.
                  </p>

                  <p className="mt-[0.5mm] font-sans text-[1.7mm] leading-[1.3] text-white/65">
                    We provide personal guidance and support throughout your
                    matchmaking journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Why us */}

            <div className="mt-[4mm]">
              <SectionTitle>Why Thai Soulmate</SectionTitle>

              <div className="mt-[2.5mm] grid grid-cols-3 gap-[2.5mm]">
                <div className="rounded-[2mm] border border-[#D3A753]/25 bg-white px-[3mm] py-[2.5mm]">
                  <Heart size={14} color="#CA617D" fill="#CA617D" />

                  <p className="mt-[1.5mm] font-sans text-[2mm] font-bold text-[#241e2a]">
                    Personal
                  </p>

                  <p className="mt-[0.6mm] font-sans text-[1.55mm] leading-[1.3] text-[#241e2a]/55">
                    We take time to understand the individual.
                  </p>
                </div>

                <div className="rounded-[2mm] border border-[#D3A753]/25 bg-white px-[3mm] py-[2.5mm]">
                  <ShieldCheck size={14} color="#D3A753" />

                  <p className="mt-[1.5mm] font-sans text-[2mm] font-bold text-[#241e2a]">
                    Discreet
                  </p>

                  <p className="mt-[0.6mm] font-sans text-[1.55mm] leading-[1.3] text-[#241e2a]/55">
                    Privacy and respect throughout your journey.
                  </p>
                </div>

                <div className="rounded-[2mm] border border-[#D3A753]/25 bg-white px-[3mm] py-[2.5mm]">
                  <Star size={14} color="#CA617D" fill="#CA617D" />

                  <p className="mt-[1.5mm] font-sans text-[2mm] font-bold text-[#241e2a]">
                    Professional
                  </p>

                  <p className="mt-[0.6mm] font-sans text-[1.55mm] leading-[1.3] text-[#241e2a]/55">
                    Personal support from beginning to introduction.
                  </p>
                </div>
              </div>
            </div>

            {/* CONTACT AREA — FIXED HEIGHT */}

            {/* CONTACT AREA */}

            <div className="absolute right-[9mm] bottom-[9mm] left-[9mm] h-[47mm] overflow-hidden rounded-[3mm] bg-[#24141A]">
              <div className="flex h-full min-w-0">
                {/* Contact details */}

                <div className="min-w-0 flex-1 px-[4mm] py-[3.5mm]">
                  <p className="font-sans text-[2.5mm] font-bold tracking-[0.08em] text-[#D3A753] uppercase">
                    Start Your Journey
                  </p>

                  <p className="mt-[1mm] max-w-[58mm] font-sans text-[1.65mm] leading-[1.3] text-white/60">
                    Ready to meet someone special? Contact us for a private
                    consultation.
                  </p>

                  <div className="mt-[2.5mm] mb-5 grid gap-[1.5mm]">
                    <ContactLine
                      icon={<FaWhatsapp size={12} color="#25D366" />}
                    >
                      {CONTACT.primaryPhone}
                    </ContactLine>

                    <ContactLine icon={<Phone size={12} color="#D3A753" />}>
                      {CONTACT.primaryPhone}
                    </ContactLine>

                    <ContactLine icon={<Phone size={12} color="#D3A753" />}>
                      {CONTACT.secondaryPhone}
                    </ContactLine>

                    <ContactLine icon={<Mail size={12} color="#E791A7" />}>
                      {CONTACT.email}
                    </ContactLine>

                    <ContactLine icon={<Globe size={12} color="#D3A753" />}>
                      {CONTACT.website}
                    </ContactLine>
                  </div>
                </div>

                {/* QR AREA */}

                <div className="flex w-[50mm] shrink-0 items-center justify-center gap-[3mm] bg-white/5 px-[2mm]">
                  {/* WhatsApp QR */}

                  <div className="flex w-[21mm] shrink-0 flex-col items-center">
                    <div className="relative rounded-[1.5mm] bg-white p-[1mm]">
                      <QRCodeSVG
                        value={CONTACT.whatsapp}
                        level="H"
                        marginSize={2}
                        className="block h-[19mm] w-[19mm]"
                      />

                      <div className="absolute top-1/2 left-1/2 flex h-[5.5mm] w-[5.5mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white">
                        <FaWhatsapp size={15} color="#25D366" />
                      </div>
                    </div>

                    <p className="mt-[1mm] font-sans text-[1.5mm] font-bold whitespace-nowrap text-[#E791A7]">
                      WhatsApp
                    </p>
                  </div>

                  {/* Website QR */}

                  <div className="flex w-[21mm] shrink-0 flex-col items-center">
                    <div className="relative rounded-[1.5mm] bg-white p-[1mm]">
                      <QRCodeSVG
                        value={`https://${CONTACT.website}`}
                        level="H"
                        marginSize={2}
                        className="block h-[19mm] w-[19mm]"
                      />

                      <div className="absolute top-1/2 left-1/2 flex h-[5.5mm] w-[5.5mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white">
                        <Image
                          src="/logo.png"
                          alt="Thai Soulmate"
                          width={40}
                          height={40}
                          quality={100}
                          unoptimized
                          className="h-[4mm] w-[4mm] object-contain"
                        />
                      </div>
                    </div>

                    <p className="mt-[1mm] font-sans text-[1.5mm] font-bold whitespace-nowrap text-[#E791A7]">
                      Website
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social footer */}

            <div className="absolute right-[9mm] bottom-[3.5mm] left-[9mm] flex items-center justify-between">
              <div className="flex items-center gap-[3.5mm]">
                <div className="flex items-center gap-[1mm]">
                  <FaFacebook size={10} color="#1877F2" />
                  <span className="font-sans text-[1.45mm] font-semibold text-[#241e2a]/60">
                    @thaisoulmates
                  </span>
                </div>

                <div className="flex items-center gap-[1mm]">
                  <FaInstagram size={10} color="#E4405F" />
                  <span className="font-sans text-[1.45mm] font-semibold text-[#241e2a]/60">
                    @thaisoulmate
                  </span>
                </div>

                <div className="flex items-center gap-[1mm]">
                  <FaTiktok size={10} color="#000000" />
                  <span className="font-sans text-[1.45mm] font-semibold text-[#241e2a]/60">
                    @thaisoulmate
                  </span>
                </div>

                <div className="flex items-center gap-[1mm]">
                  <FaLine size={10} color="#00C300" />
                  <span className="font-sans text-[1.45mm] font-semibold text-[#241e2a]/60">
                    @thaisoulmate
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom line */}

          <div className="absolute inset-x-0 bottom-0 h-[2mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />
        </section>
      </main>
    </>
  )
}
