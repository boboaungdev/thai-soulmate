"use client"

import Image from "next/image"
import { useEffect } from "react"
import {
  Check,
  Globe,
  Heart,
  HeartHandshake,
  HandHeart,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  ChevronRight,
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
    <div className="flex items-center justify-center gap-[2.5mm]">
      <div
        className="h-px w-[22mm] shrink-0"
        style={{
          background:
            "linear-gradient(to left, #D3A753 0%, #E791A7 55%, transparent 100%)",
        }}
      />

      <h2
        className={`shrink-0 text-center font-sans text-[4mm] font-bold tracking-[0.16em] uppercase ${
          light ? "text-white" : "text-[#5A0816]"
        }`}
      >
        {children}
      </h2>

      <div
        className="h-px w-[22mm] shrink-0"
        style={{
          background:
            "linear-gradient(to right, #D3A753 0%, #E791A7 55%, transparent 100%)",
        }}
      />
    </div>
  )
}

/* ============================================================
   PAGE 1 FEATURE
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
    <div className="rounded-[2.5mm] border border-[#D3A753]/25 bg-[#FFF9F3] px-[3mm] py-[2mm]">
      <div className="flex items-center gap-[2.5mm]">
        <div
          className="flex h-[8.5mm] w-[8.5mm] shrink-0 items-center justify-center rounded-full p-[0.3mm]"
          style={{
            background:
              "linear-gradient(135deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FFF9F3]">
            {icon}
          </div>
        </div>

        <h3 className="font-sans text-[3mm] leading-[1.15] font-bold text-[#5A0816]">
          {title}
        </h3>
      </div>

      <p className="mt-[2mm] font-sans text-[3mm] leading-[1.4] text-[#241e2a]/65">
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
    <div className="flex items-center gap-[1.5mm]">
      <div className="flex h-[5.5mm] w-[5.5mm] shrink-0 items-center justify-center">
        {icon}
      </div>

      <span className="font-sans text-[3mm] leading-none font-medium text-white/90">
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

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <main id="printable-area" className="marketing-leaflet-document">
        {/* ========================================================
            PAGE 1
            ======================================================== */}

        <section className="marketing-leaflet-page bg-[#FBF8F3]">
          {/* ======================================================
              PAGE 1 — MODERN BACKGROUND
          ====================================================== */}

          <div className="absolute inset-0 bg-[#FBF8F3]" />

          {/* Top burgundy hero */}

          <div className="absolute top-0 right-0 left-0 h-[80mm] bg-gradient-to-br from-[#43050F] via-[#650D20] to-[#8A1E3A]" />

          {/* Main paper area */}

          <div className="absolute top-[75mm] right-0 bottom-0 left-0 bg-gradient-to-br from-[#FFFDF9] via-[#FBF3F0] to-[#F7E8EC]" />

          {/* Large diagonal blush stripe */}

          <div
            className="absolute top-[88mm] left-[-28mm] h-[24mm] w-[205mm] rotate-[-8deg] opacity-55"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #E791A7 18%, #E791A7 48%, transparent 78%)",
            }}
          />

          {/* Champagne stripe */}

          <div
            className="absolute top-[101mm] left-[-35mm] h-[8mm] w-[220mm] rotate-[-8deg] opacity-45"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #D3A753 22%, #D3A753 52%, transparent 82%)",
            }}
          />

          {/* Thin premium stripe */}

          <div
            className="absolute top-[113mm] left-[-30mm] h-[1mm] w-[210mm] rotate-[-8deg] opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D3A753 25%, #CA617D 65%, transparent)",
            }}
          />

          {/* Soft oversized pink circle */}

          <div
            className="absolute top-[96mm] right-[-24mm] h-[58mm] w-[58mm] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #E791A7 0%, #F4C8D3 45%, transparent 72%)",
            }}
          />

          {/* Soft champagne circle */}

          <div
            className="absolute top-[125mm] left-[-28mm] h-[55mm] w-[55mm] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, #D3A753 0%, #F2DFC0 45%, transparent 72%)",
            }}
          />

          {/* Decorative vertical stripe */}

          <div
            className="absolute top-[122mm] right-[5mm] h-[47mm] w-[1.2mm] rounded-full opacity-55"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #D3A753 25%, #E791A7 70%, transparent)",
            }}
          />

          {/* Curved transition */}

          <div
            className="absolute top-[60mm] right-[-10mm] left-[-10mm] h-[25mm] bg-[#FFFDF9]"
            style={{
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />

          {/* Secondary blush curve */}

          <div
            className="absolute top-[68mm] right-[-20mm] left-[-20mm] h-[23mm] opacity-45"
            style={{
              background: "#F7DDE4",
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />

          {/* Gold frame */}

          <div className="absolute inset-[4mm] border border-[#D3A753]/25" />

          {/* Inner premium frame */}

          <div className="absolute inset-[6mm] border border-[#CA617D]/10" />

          {/* ======================================================
              HEADER
              ====================================================== */}

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

            <BrandName className="mt-[1mm] w-[47mm]" />

            <p className="mt-[0.8mm] font-sans text-[2mm] font-semibold tracking-[0.3em] text-[#E791A7] uppercase">
              Exclusive
            </p>

            <p className="mt-[0.6mm] font-sans text-[2.3mm] font-semibold tracking-[0.24em] text-[#D3A753] uppercase">
              1-2-1 Matchmaking Service
            </p>

            <div className="mt-[3mm] flex items-center gap-[3mm]">
              <div
                className="h-[0.6px] w-[18mm]"
                style={{
                  background:
                    "linear-gradient(to left, #D3A753 0%, #E791A7 55%, transparent 100%)",
                }}
              />

              <Heart
                size={13}
                color="#D3A753"
                fill="#D3A753"
                strokeWidth={1.5}
              />

              <div
                className="h-[0.6px] w-[18mm]"
                style={{
                  background:
                    "linear-gradient(to right, #D3A753 0%, #E791A7 55%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* ======================================================
              MODERN HERO IMAGE
          ====================================================== */}

          <div className="absolute top-[46mm] right-0 left-0 h-[70mm]">
            {/* Decorative background shape */}

            <div
              className="absolute top-[5mm] left-1/2 h-[62mm] w-[110mm] -translate-x-1/2 opacity-25"
              style={{
                background:
                  "linear-gradient(135deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
                borderRadius: "28mm 8mm 28mm 8mm",
                filter: "blur(1px)",
              }}
            />

            {/* Main centered image */}

            <div
              className="absolute top-[1mm] left-1/2 h-[64mm] w-[106mm] -translate-x-1/2 p-[0.6mm]"
              style={{
                background:
                  "linear-gradient(135deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
                borderRadius: "25mm 6mm 25mm 6mm",
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden bg-[#FBF8F3]"
                style={{
                  borderRadius: "24mm 5.5mm 24mm 5.5mm",
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
                  sizes="106mm"
                />

                {/* Elegant overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-[#39040E]/85 via-[#39040E]/10 to-transparent" />

                {/* Main message */}

                <div className="absolute right-[7mm] bottom-[5mm] left-[10mm]">
                  <p className="font-serif text-[5.2mm] leading-[1.08] italic">
                    <span className="text-[#D3A753]">Real People.</span>

                    <br />

                    <span className="text-[#E791A7]">Real Relationships.</span>

                    <br />

                    <span className="bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D] bg-clip-text text-transparent">
                      Personally Matched in Thailand.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Left decoration */}

            <div className="absolute top-[15mm] left-[14mm] h-[7mm] w-[7mm] rounded-full border border-[#D3A753]/60" />

            <div className="absolute top-[28mm] left-[9mm] h-[2mm] w-[2mm] rounded-full bg-[#E791A7]" />

            <div className="absolute top-[35mm] left-[16mm] h-[1.5mm] w-[1.5mm] rounded-full bg-[#CA617D]" />

            {/* Right decoration */}

            <div className="absolute top-[12mm] right-[14mm] h-[9mm] w-[9mm] rounded-full border border-[#E791A7]/50" />

            <div className="absolute top-[27mm] right-[8mm] h-[2mm] w-[2mm] rounded-full bg-[#D3A753]" />

            <div className="absolute top-[35mm] right-[15mm] h-[1.5mm] w-[1.5mm] rounded-full bg-[#CA617D]" />
          </div>

          {/* ======================================================
              MORE THAN MATCHING
          ====================================================== */}

          <div className="absolute top-[116mm] right-[9mm] left-[9mm]">
            <div
              className="relative overflow-hidden rounded-[5mm] px-[6mm] py-[4mm]"
              style={{
                background:
                  "linear-gradient(135deg, #FFF8EF 0%, #FBE9E7 48%, #F6DCE4 100%)",
                boxShadow: "0 2mm 6mm rgba(90, 8, 22, 0.07)",
                border: "0.35mm solid rgba(211, 167, 83, 0.28)",
              }}
            >
              {/* Decorative stripe */}

              <div
                className="absolute top-[-8mm] right-[-18mm] h-[8mm] w-[65mm] rotate-[-18deg] opacity-35"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #D3A753, #E791A7, transparent)",
                }}
              />

              {/* Bottom stripe */}

              <div
                className="absolute bottom-[-7mm] left-[-18mm] h-[5mm] w-[55mm] rotate-[-18deg] opacity-25"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #CA617D, #E791A7, transparent)",
                }}
              />

              {/* Decorative gradient circle */}

              <div
                className="absolute top-[-12mm] right-[-12mm] h-[30mm] w-[30mm] rounded-full opacity-30"
                style={{
                  background:
                    "linear-gradient(135deg, #D3A753, #E791A7, #CA617D)",
                }}
              />

              <div className="relative z-10">
                {/* Heading */}

                <div className="flex items-center gap-[2.5mm]">
                  <div
                    className="h-[7mm] w-[1.2mm] rounded-full"
                    style={{
                      background:
                        "linear-gradient(to bottom, #D3A753, #E791A7, #CA617D)",
                    }}
                  />

                  <h2 className="font-serif text-[5mm] leading-none font-semibold text-[#5A0816]">
                    More Than Matching
                  </h2>
                </div>

                {/* Description */}

                <p className="mt-[2.5mm] font-sans text-[2.8mm] leading-[1.45] text-[#241e2a]/75">
                  Finding the right person is about more than a profile, a
                  photograph or a swipe. We take the time to understand you and
                  create introductions with genuine relationship potential.
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================
              OUR SERVICE
          ====================================================== */}

          <div className="absolute top-[145mm] right-[9mm] left-[9mm]">
            {/* Section title */}

            <div className="mb-[2mm] flex items-center gap-[2.5mm]">
              <div
                className="h-px flex-1"
                style={{
                  background: "linear-gradient(to right, transparent, #D3A753)",
                }}
              />

              <h2 className="font-sans text-[4mm] font-bold tracking-[0.16em] text-[#5A0816] uppercase">
                Our Service
              </h2>

              <div
                className="h-px flex-1"
                style={{
                  background: "linear-gradient(to left, transparent, #CA617D)",
                }}
              />
            </div>

            {/* Service boxes */}

            <div className="grid grid-cols-2 gap-[2.5mm]">
              {/* PERSONAL MATCHING */}

              <div
                className="relative overflow-hidden rounded-[4mm] border border-[#D3A753]/35 px-[3.5mm] py-[3mm]"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF4D9 0%, #F9E5B5 100%)",
                  boxShadow: "0 1.5mm 4mm rgba(90, 8, 22, 0.07)",
                }}
              >
                <div className="absolute top-[-5mm] right-[-5mm] h-[15mm] w-[15mm] rounded-full bg-[#D3A753]/20" />

                <div className="relative z-10 flex items-start gap-[2.5mm]">
                  <div
                    className="flex h-[10mm] w-[10mm] shrink-0 items-center justify-center rounded-[3mm]"
                    style={{
                      background: "linear-gradient(135deg, #B78D46, #D3A753)",
                      boxShadow: "0 1mm 2mm rgba(90, 8, 22, 0.12)",
                    }}
                  >
                    <HeartHandshake size={18} color="white" strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif text-[3.1mm] leading-[1.1] font-bold text-[#5A0816]">
                      Personal Matching
                    </h3>

                    <p className="mt-[1.5mm] font-sans text-[2.55mm] leading-[1.35] text-[#241e2a]/70">
                      Introductions based on personality, lifestyle and
                      relationship goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* PERSONAL SUPPORT */}

              <div
                className="relative overflow-hidden rounded-[4mm] border border-[#CA617D]/30 px-[3.5mm] py-[3mm]"
                style={{
                  background:
                    "linear-gradient(135deg, #F9E1E8 0%, #EABBC9 100%)",
                  boxShadow: "0 1.5mm 4mm rgba(90, 8, 22, 0.07)",
                }}
              >
                <div className="absolute top-[-5mm] right-[-5mm] h-[15mm] w-[15mm] rounded-full bg-[#CA617D]/20" />

                <div className="relative z-10 flex items-start gap-[2.5mm]">
                  <div
                    className="flex h-[10mm] w-[10mm] shrink-0 items-center justify-center rounded-[3mm]"
                    style={{
                      background: "linear-gradient(135deg, #B94E6A, #E791A7)",
                      boxShadow: "0 1mm 2mm rgba(90, 8, 22, 0.12)",
                    }}
                  >
                    <HandHeart size={18} color="white" strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif text-[3.1mm] leading-[1.1] font-bold text-[#5A0816]">
                      Personal Support
                    </h3>

                    <p className="mt-[1.5mm] font-sans text-[2.55mm] leading-[1.35] text-[#241e2a]/70">
                      Professional guidance throughout your matchmaking journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* PRIVATE & DISCREET */}

              <div
                className="relative overflow-hidden rounded-[4mm] border border-[#D3A753]/35 px-[3.5mm] py-[3mm]"
                style={{
                  background:
                    "linear-gradient(135deg, #F8EEDB 0%, #EED9B0 100%)",
                  boxShadow: "0 1.5mm 4mm rgba(90, 8, 22, 0.07)",
                }}
              >
                <div className="absolute top-[-5mm] right-[-5mm] h-[15mm] w-[15mm] rounded-full bg-[#D3A753]/20" />

                <div className="relative z-10 flex items-start gap-[2.5mm]">
                  <div
                    className="flex h-[10mm] w-[10mm] shrink-0 items-center justify-center rounded-[3mm]"
                    style={{
                      background: "linear-gradient(135deg, #9F7839, #D3A753)",
                      boxShadow: "0 1mm 2mm rgba(90, 8, 22, 0.12)",
                    }}
                  >
                    <ShieldCheck size={18} color="white" strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif text-[3.1mm] leading-[1.1] font-bold text-[#5A0816]">
                      Private & Discreet
                    </h3>

                    <p className="mt-[1.5mm] font-sans text-[2.55mm] leading-[1.35] text-[#241e2a]/70">
                      Personal information and matchmaking journey are treated
                      with care.
                    </p>
                  </div>
                </div>
              </div>

              {/* REAL PEOPLE */}

              <div
                className="relative overflow-hidden rounded-[4mm] border border-[#CA617D]/30 px-[3.5mm] py-[3mm]"
                style={{
                  background:
                    "linear-gradient(135deg, #FCE4EA 0%, #F3C4D0 100%)",
                  boxShadow: "0 1.5mm 4mm rgba(90, 8, 22, 0.07)",
                }}
              >
                <div className="absolute top-[-5mm] right-[-5mm] h-[15mm] w-[15mm] rounded-full bg-[#CA617D]/20" />

                <div className="relative z-10 flex items-start gap-[2.5mm]">
                  <div
                    className="flex h-[10mm] w-[10mm] shrink-0 items-center justify-center rounded-[3mm]"
                    style={{
                      background: "linear-gradient(135deg, #B94E6A, #CA617D)",
                      boxShadow: "0 1mm 2mm rgba(90, 8, 22, 0.12)",
                    }}
                  >
                    <Users size={18} color="white" strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif text-[3.1mm] leading-[1.1] font-bold text-[#5A0816]">
                      Real People
                    </h3>

                    <p className="mt-[1.5mm] font-sans text-[2.55mm] leading-[1.35] text-[#241e2a]/70">
                      Meet people who are genuinely interested in meaningful
                      relationships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
              BOTTOM CTA
          ====================================================== */}

          <div className="absolute inset-x-0 bottom-0 h-[12mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]">
            <div className="flex h-full items-center justify-between px-[10mm]">
              <div className="flex flex-col justify-center">
                <p className="font-sans text-[3.2mm] leading-none font-bold tracking-[0.12em] text-white uppercase">
                  Start Your Story
                </p>

                <p className="mt-[1.2mm] font-sans text-[3mm] leading-none font-medium text-white/80">
                  Your journey to a meaningful connection.
                </p>
              </div>

              <div className="relative flex items-center justify-center rounded-full bg-white px-[5mm] py-[2mm]">
                <span className="translate-y-[0.3mm] font-sans text-[3mm] leading-none font-bold tracking-[0.08em] text-[#5A0816] uppercase">
                  Contact Us
                </span>

                <ChevronRight
                  size={14}
                  color="#CA617D"
                  strokeWidth={2.5}
                  className="absolute right-[1.5mm] translate-x-[1mm]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            PAGE 2
            ======================================================== */}

        <section className="marketing-leaflet-page bg-[#FBF8F3]">
          {/* ======================================================
              PAGE 2 — MODERN BACKGROUND
          ====================================================== */}

          {/* Main paper */}

          <div className="absolute inset-0 bg-[#FBF8F3]" />

          {/* Burgundy hero */}

          <div className="absolute top-0 right-0 left-0 h-[80mm] bg-gradient-to-br from-[#43050F] via-[#650D20] to-[#8A1E3A]" />

          {/* Main lower background */}

          <div className="absolute top-[75mm] right-0 bottom-0 left-0 bg-gradient-to-br from-[#FFFDF9] via-[#FBF1F1] to-[#F6E5EA]" />

          {/* Large diagonal pink stripe */}

          <div
            className="absolute top-[91mm] left-[-45mm] h-[25mm] w-[235mm] rotate-[7deg] opacity-35"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #E791A7 22%, #E791A7 52%, transparent 82%)",
            }}
          />

          {/* Champagne stripe */}

          <div
            className="absolute top-[105mm] left-[-40mm] h-[7mm] w-[220mm] rotate-[7deg] opacity-35"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #D3A753 20%, #D3A753 55%, transparent 85%)",
            }}
          />

          {/* Fine gradient stripe */}

          <div
            className="absolute top-[116mm] left-[-40mm] h-[1mm] w-[220mm] rotate-[7deg] opacity-55"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D3A753 20%, #CA617D 70%, transparent)",
            }}
          />

          {/* Large soft blush circle */}

          <div
            className="absolute top-[122mm] right-[-30mm] h-[65mm] w-[65mm] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #E791A7 0%, #F3C7D2 42%, transparent 72%)",
            }}
          />

          {/* Soft gold circle */}

          <div
            className="absolute top-[143mm] left-[-35mm] h-[58mm] w-[58mm] rounded-full opacity-18"
            style={{
              background:
                "radial-gradient(circle, #D3A753 0%, #F1DFC0 45%, transparent 72%)",
            }}
          />

          {/* Thin vertical accent */}

          <div
            className="absolute top-[121mm] left-[5mm] h-[52mm] w-[1mm] rounded-full opacity-45"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #CA617D 25%, #D3A753 70%, transparent)",
            }}
          />

          {/* Hero curve */}

          <div
            className="absolute top-[60mm] right-[-10mm] left-[-10mm] h-[25mm] bg-[#FFFDF9]"
            style={{
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />

          {/* Secondary blush curve */}

          <div
            className="absolute top-[67mm] right-[-18mm] left-[-18mm] h-[23mm] opacity-40"
            style={{
              background: "#F6DDE4",
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />

          {/* Gold frame */}

          <div className="absolute inset-[4mm] border border-[#D3A753]/25" />

          {/* Inner frame */}

          <div className="absolute inset-[6mm] border border-[#CA617D]/10" />

          {/* ======================================================
              HERO TITLE
          ====================================================== */}

          <div className="absolute top-[15mm] left-[11mm] z-20 w-[66mm]">
            <h2 className="mt-[3mm] font-serif text-[8.5mm] leading-[0.95] text-white">
              More than
              <br />
              <span className="text-[#D3A753] italic">a match.</span>
            </h2>

            <p className="mt-[3mm] w-[63mm] font-sans text-[3mm] leading-[1.45] font-medium text-white/75">
              We get to know you first, understand what you are looking for, and
              introduce you to people who may genuinely complement your life.
            </p>
          </div>

          {/* ======================================================
              CIRCULAR HERO IMAGE
          ====================================================== */}

          <div
            className="absolute top-[25mm] right-[10mm] z-30 h-[43mm] w-[43mm] rounded-full p-[0.6mm]"
            style={{
              background:
                "linear-gradient(135deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-[#FBF8F3]">
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
          </div>

          {/* ======================================================
              WHO WE HELP
          ====================================================== */}

          <div className="absolute top-[68mm] right-[10mm] left-[10mm] z-20">
            <SectionTitle>Who We Help</SectionTitle>

            {/* Decorative background accent */}

            <div
              className="absolute top-[4mm] right-[-25mm] h-[30mm] w-[75mm] rotate-[-12deg] opacity-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #D3A753, #E791A7, transparent)",
              }}
            />

            {/* Compact audience card */}

            <div
              className="relative mt-[2.5mm] overflow-hidden rounded-[3mm] border border-[#D3A753]/45 px-[4mm] py-[3mm]"
              style={{
                background:
                  "linear-gradient(135deg, #FFF4E8 0%, #FBE3E8 52%, #F5D1DA 100%)",
              }}
            >
              {/* Simple icon + label */}

              <div className="flex items-start justify-center gap-[8mm]">
                {/* Foreign gentlemen */}

                <div className="flex flex-col items-center">
                  <div
                    className="flex h-[8mm] w-[8mm] items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #D3A753 0%, #C98B45 100%)",
                    }}
                  >
                    <FaMale size={18} color="white" />
                  </div>

                  <span className="mt-[1.2mm] text-center font-sans text-[2.7mm] leading-none font-bold text-[#5A0816]">
                    Foreign Gentlemen
                  </span>
                </div>

                {/* Heart with & */}

                <div className="mt-[1mm] flex h-[9mm] w-[9mm] shrink-0 items-center justify-center">
                  <div className="relative flex h-[9mm] w-[9mm] items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute h-[9mm] w-[9mm]"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient
                          id="who-help-heart-gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#D3A753" />
                          <stop offset="50%" stopColor="#E791A7" />
                          <stop offset="100%" stopColor="#CA617D" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                        fill="url(#who-help-heart-gradient)"
                      />
                    </svg>

                    <span className="relative z-10 -mt-[0.3mm] font-serif text-[2.8mm] font-bold text-white">
                      &amp;
                    </span>
                  </div>
                </div>

                {/* Thai ladies */}

                <div className="flex flex-col items-center">
                  <div
                    className="flex h-[8mm] w-[8mm] items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #E791A7 0%, #CA617D 100%)",
                    }}
                  >
                    <FaFemale size={18} color="white" />
                  </div>

                  <span className="mt-[1.2mm] text-center font-sans text-[2.7mm] leading-none font-bold text-[#5A0816]">
                    Thai Ladies
                  </span>
                </div>
              </div>

              {/* List */}

              <div className="mt-[3mm] border-t border-[#CA617D]/20 pt-[2.5mm]">
                <div className="grid gap-[1.2mm]">
                  {[
                    "Individulas looking for a serious future partner",
                    "Individulas who want carefully matched introductions",
                    "Individulas looking for a genuine and meaningful relationship",
                    "Individulas who appreciate personalized, 1-2-1 guidance and support",
                    "Individulas who prefer a private and discreet matchmaking experience",
                    "Individulas who value compatibility, shared values, and long-term potential",
                    "Individulas who value their time and prefer a professional matchmaking service",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-[1.5mm]">
                      <div
                        className="flex h-[4.5mm] w-[4.5mm] shrink-0 items-center justify-center rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, #D3A753, #E791A7, #CA617D)",
                        }}
                      >
                        <Check size={8} color="white" strokeWidth={3} />
                      </div>

                      <p className="font-sans text-[2.8mm] leading-[1.25] text-[#24141A]/75">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
              CONTACT SECTION
          ====================================================== */}

          <div className="absolute right-[10mm] bottom-[15mm] left-[10mm]">
            <div className="relative overflow-hidden rounded-[4mm] bg-gradient-to-br from-[#6B1023] to-[#3D0710] p-[4mm]">
              <div className="absolute top-[-12mm] right-[-12mm] h-[35mm] w-[35mm] rounded-full border border-[#D3A753]/20" />

              <div className="relative flex">
                {/* CONTACT */}

                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[2.5mm] font-bold tracking-[0.15em] text-[#D3A753] uppercase">
                    Start Your Journey
                  </p>

                  <p className="mt-[1mm] w-[62mm] font-serif text-[3.5mm] leading-[1.15] text-white italic">
                    Your story deserves the right introduction.
                  </p>

                  <div className="mt-[3mm] grid gap-[1.5mm]">
                    {/* WhatsApp */}

                    <ContactItem
                      icon={<FaWhatsapp size={20} color="#25D366" />}
                    >
                      {CONTACT.primaryPhone}
                    </ContactItem>

                    {/* Primary Phone */}

                    <ContactItem icon={<Phone size={20} color="#1877F2" />}>
                      {CONTACT.primaryPhone}
                    </ContactItem>

                    {/* Secondary Phone */}

                    <ContactItem icon={<Phone size={20} color="#1877F2" />}>
                      {CONTACT.secondaryPhone}
                    </ContactItem>

                    {/* Email */}

                    <ContactItem icon={<Mail size={20} color="#E791A7" />}>
                      {CONTACT.email}
                    </ContactItem>

                    {/* Website */}

                    <ContactItem icon={<Globe size={20} color="#D3A753" />}>
                      {CONTACT.website}
                    </ContactItem>
                  </div>
                </div>

                {/* ==================================================
                    QR CODES
                ================================================== */}

                <div className="mt-[15mm] mr-[4mm] flex w-[47mm] shrink-0 items-center justify-center gap-[3mm]">
                  {/* WhatsApp QR */}

                  <div className="flex flex-col items-center">
                    <div className="relative rounded-[2mm] bg-white p-[1.5mm]">
                      <QRCodeSVG
                        value={CONTACT.whatsapp}
                        level="H"
                        className="block h-[22mm] w-[22mm]"
                      />

                      <div className="absolute top-1/2 left-1/2 flex h-[8mm] w-[8mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white">
                        <FaWhatsapp size={20} color="#25D366" />
                      </div>
                    </div>

                    <span className="mt-[1.2mm] font-sans text-[2.5mm] font-bold text-white/85">
                      WhatsApp
                    </span>
                  </div>

                  {/* Website QR */}

                  <div className="flex flex-col items-center">
                    <div className="relative rounded-[2mm] bg-white p-[1.5mm]">
                      <QRCodeSVG
                        value={`https://${CONTACT.website}`}
                        level="H"
                        className="block h-[22mm] w-[22mm]"
                      />

                      <div className="absolute top-1/2 left-1/2 flex h-[8mm] w-[8mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white">
                        <Image
                          src="/logo.png"
                          alt="Thai Soulmate"
                          width={100}
                          height={100}
                          quality={100}
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <span className="mt-[1.2mm] font-sans text-[2.5mm] font-bold text-white/85">
                      Website
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
              BOTTOM SOCIAL FOOTER
          ====================================================== */}

          <div className="absolute inset-x-0 bottom-0 h-[12mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]">
            <div className="flex h-full items-center justify-center px-[8mm]">
              <div className="flex items-center justify-center gap-[5mm]">
                {/* Facebook */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaFacebook size={17} color="#1877F2" />

                  <span className="font-sans text-[3mm] font-semibold text-white">
                    @thaisoulmates
                  </span>
                </div>

                {/* Instagram */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaInstagram size={18} color="#E4405F" />

                  <span className="font-sans text-[3mm] font-semibold text-white">
                    @thaisoulmate
                  </span>
                </div>

                {/* TikTok */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaTiktok size={17} color="#000000" />

                  <span className="font-sans text-[3mm] font-semibold text-white">
                    @thaisoulmate
                  </span>
                </div>

                {/* LINE */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaLine size={17} color="#00C300" />

                  <span className="font-sans text-[3mm] font-semibold text-white">
                    @thaisoulmate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
