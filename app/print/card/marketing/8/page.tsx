"use client"

import Image from "next/image"
import { useEffect } from "react"
import {
  ArrowRight,
  Check,
  Globe,
  Heart,
  HeartHandshake,
  HandHeart,
  Mail,
  Phone,
  ShieldCheck,
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
    <div className="rounded-[2.5mm] border border-[#D3A753]/25 bg-[#FFF9F3] px-[3.2mm] py-[3.2mm]">
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

        <h3 className="font-sans text-[2.9mm] leading-[1.15] font-bold text-[#5A0816]">
          {title}
        </h3>
      </div>

      <p className="mt-[2mm] font-sans text-[2.15mm] leading-[1.4] text-[#241e2a]/65">
        {text}
      </p>
    </div>
  )
}

/* ============================================================
   PAGE 2 AUDIENCE
   ============================================================ */

function Audience({
  icon,
  title,
  description,
  items,
}: {
  icon: React.ReactNode
  title: string
  description: string
  items: string[]
}) {
  return (
    <div className="relative min-h-[46mm] overflow-hidden rounded-[4mm] border border-[#D3A753]/25 bg-[#FBF8F3] px-[4mm] py-[4mm]">
      <div className="relative flex h-full flex-col items-center text-center">
        {/* Gender Icon */}

        <div
          className="flex h-[11mm] w-[11mm] items-center justify-center rounded-full p-[0.45mm]"
          style={{
            background:
              "linear-gradient(135deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#FBF8F3]">
            {icon}
          </div>
        </div>

        {/* Title */}

        <h3 className="mt-[2.5mm] font-sans text-[3.2mm] font-bold text-[#5A0816]">
          {title}
        </h3>

        {/* Description */}

        <p className="mt-[0.8mm] font-sans text-[1.9mm] font-semibold text-[#CA617D]">
          {description}
        </p>

        {/* Gradient Line */}

        <div
          className="mt-[2.5mm] h-px w-[18mm]"
          style={{
            background:
              "linear-gradient(to right, transparent, #D3A753, #E791A7, #CA617D, transparent)",
          }}
        />

        {/* Features */}

        <div className="mt-[2.5mm] flex w-full flex-col items-center gap-[1.5mm]">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center gap-[1.5mm]"
            >
              <Check
                size={9}
                color="#CA617D"
                strokeWidth={3}
                className="shrink-0"
              />

              <p className="font-sans text-[1.8mm] leading-[1.3] text-[#24141A]/65">
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
      <div className="flex h-[5.5mm] w-[5.5mm] shrink-0 items-center justify-center rounded-full bg-white/10">
        {icon}
      </div>

      <span className="font-sans text-[2.2mm] leading-none font-medium text-white/90">
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
            PAGE 1
            ======================================================== */}

        <section className="marketing-leaflet-page relative bg-[#FBF8F3] shadow-2xl">
          {/* Background */}

          <div className="absolute inset-0 bg-[#FBF8F3]" />

          <div className="absolute inset-x-0 top-0 h-[91mm] bg-gradient-to-br from-[#43050F] via-[#650D20] to-[#8A1E3A]" />

          <div className="absolute top-[35mm] left-[-20mm] h-[80mm] w-[80mm] rounded-full bg-[#E791A7]/10 blur-2xl" />

          <div className="absolute top-[-25mm] right-[-25mm] h-[75mm] w-[75mm] rounded-full bg-[#D3A753]/10 blur-2xl" />

          {/* Gold frame */}

          <div className="absolute inset-[4mm] border border-[#D3A753]/25" />

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
              HERO IMAGE
              ====================================================== */}

          <div
            className="absolute top-[51mm] right-[10mm] left-[10mm] h-[61mm] rounded-[2mm] p-[0.3mm] shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[2mm]">
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
                <p className="font-sans text-[5.8mm] leading-[1.08] font-bold text-white">
                  Real People.
                  <br />
                  Real Relationships.
                </p>

                <p className="mt-[1.8mm] font-sans text-[2.6mm] font-medium text-[#F9DDA7]">
                  Personally matched in Thailand.
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================
              MAIN STATEMENT
              ====================================================== */}

          <div className="absolute top-[117mm] right-[10mm] left-[10mm]">
            <SectionTitle>More Than Matching</SectionTitle>

            <p className="mt-[3mm] font-sans text-[2.9mm] leading-[1.5] text-[#241e2a]/72">
              Finding the right person is about more than a profile or
              photograph. We take the time to understand you and create
              introductions with genuine relationship potential.
            </p>
          </div>

          {/* ======================================================
              OUR SERVICE
              ====================================================== */}

          <div className="absolute top-[137mm] right-[10mm] left-[10mm]">
            <SectionTitle>Our Service</SectionTitle>

            <div className="mt-[3mm] grid grid-cols-2 gap-[3mm]">
              <Feature
                icon={<HeartHandshake size={15} color="#D3A753" />}
                title="Personal Matching"
                text="Introductions based on personality, lifestyle and relationship goals."
              />

              <Feature
                icon={<Users size={15} color="#CA617D" />}
                title="Real People"
                text="Meet people who are genuinely interested in meaningful relationships."
              />

              <Feature
                icon={<ShieldCheck size={15} color="#D3A753" />}
                title="Private & Discreet"
                text="Your personal information and matchmaking journey are treated with care."
              />

              <Feature
                icon={<HandHeart size={15} color="#CA617D" />}
                title="Personal Support"
                text="Professional guidance throughout your matchmaking journey."
              />
            </div>
          </div>

          {/* ======================================================
              BOTTOM CTA
              ====================================================== */}

          <div className="absolute inset-x-0 bottom-0 h-[13mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]">
            <div className="flex h-full items-center justify-between px-[10mm]">
              <div className="flex flex-col justify-center">
                <p className="font-sans text-[2.9mm] leading-none font-bold tracking-[0.12em] text-white uppercase">
                  Start Your Story
                </p>

                <p className="mt-[1.2mm] font-sans text-[2mm] leading-none font-medium text-white/80">
                  Your journey to a meaningful connection.
                </p>
              </div>

              <div className="flex items-center rounded-full bg-white px-[4mm] py-[2mm]">
                <span className="font-sans text-[2.3mm] font-bold tracking-[0.08em] text-[#5A0816] uppercase">
                  Contact Us
                </span>

                <ArrowRight
                  size={14}
                  color="#CA617D"
                  strokeWidth={2.5}
                  className="ml-[1.5mm]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            PAGE 2
            ======================================================== */}

        <section className="marketing-leaflet-page bg-[#FBF8F3] ">
          {/* Top burgundy section */}

          <div className="absolute top-0 right-0 left-0 h-[77mm] bg-[#5A0816]" />

          {/* ======================================================
              HEADER
              ====================================================== */}

          <div className="absolute top-[12mm] left-[8mm] z-20 flex w-[64mm] items-center">
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

            <div className="w-[48mm] text-center">
              <BrandName className="mx-auto w-[48mm]" />

              <p className="mt-[0.8mm] text-center font-sans text-[1.6mm] font-bold tracking-[0.28em] text-[#E791A7] uppercase">
                Exclusive
              </p>

              <p className="mt-[0.5mm] text-center font-sans text-[2mm] font-semibold tracking-[0.22em] text-[#D3A753] uppercase">
                1-2-1 Matchmaking Service
              </p>
            </div>
          </div>

          {/* ======================================================
              HERO TITLE
              ====================================================== */}

          <div className="absolute top-[29mm] left-[11mm] z-20 w-[66mm]">
            <h2 className="mt-[3mm] font-serif text-[8.5mm] leading-[0.95] text-white">
              More than
              <br />
              <span className="text-[#D3A753] italic">a match.</span>
            </h2>

            <p className="mt-[3mm] w-[63mm] font-sans text-[2.2mm] leading-[1.45] text-white/60">
              We get to know you first, understand what you are looking for, and
              introduce you to people who may genuinely complement your life.
            </p>
          </div>

          {/* ======================================================
              CIRCULAR HERO IMAGE
              ====================================================== */}

          <div
            className="absolute top-[30mm] right-[10mm] z-30 h-[43mm] w-[43mm] rounded-full p-[0.6mm]"
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
              WAVE
              ====================================================== */}

          <div
            className="absolute top-[67mm] right-[-10mm] left-[-10mm] h-[24mm] bg-[#FBF8F3]"
            style={{
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />

          {/* ======================================================
              WHO WE HELP
              ====================================================== */}

          <div className="absolute top-[75mm] right-[10mm] left-[10mm] z-20">
            <div className="flex items-center justify-center gap-[2.5mm]">
              <div
                className="h-px w-[22mm] shrink-0"
                style={{
                  background:
                    "linear-gradient(to left, #D3A753 0%, #E791A7 55%, transparent 100%)",
                }}
              />

              <h2 className="shrink-0 text-center font-sans text-[4mm] font-bold tracking-[0.16em] text-[#5A0816] uppercase">
                Who We Help
              </h2>

              <div
                className="h-px w-[22mm] shrink-0"
                style={{
                  background:
                    "linear-gradient(to right, #D3A753 0%, #E791A7 55%, transparent 100%)",
                }}
              />
            </div>

            {/* Audience Cards */}

            <div className="mt-[4mm] grid grid-cols-2 gap-[4mm]">
              <Audience
                icon={<FaFemale size={22} color="#CA617D" />}
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
                icon={<FaMale size={22} color="#D3A753" />}
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

          {/* ======================================================
              CONTACT SECTION
              ====================================================== */}

          <div className="absolute right-[10mm] bottom-[8mm] left-[10mm]">
            <div className="relative overflow-hidden rounded-[4mm] bg-gradient-to-br from-[#6B1023] to-[#3D0710] p-[4mm] ">
              <div className="absolute top-[-12mm] right-[-12mm] h-[35mm] w-[35mm] rounded-full border border-[#D3A753]/20" />

              <div className="relative flex">
                {/* CONTACT */}

                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[2.1mm] font-bold tracking-[0.15em] text-[#D3A753] uppercase">
                    Start Your Journey
                  </p>

                  <p className="mt-[1mm] w-[62mm] font-serif text-[3.4mm] text-white italic">
                    Your story deserves the right introduction.
                  </p>

                  <div className="mt-[3mm] grid gap-[1.4mm]">
                    <ContactItem
                      icon={<FaWhatsapp size={12} color="#25D366" />}
                    >
                      {CONTACT.primaryPhone}
                    </ContactItem>

                    <ContactItem icon={<Phone size={12} color="#1877F2" />}>
                      {CONTACT.primaryPhone}
                    </ContactItem>

                    <ContactItem icon={<Phone size={12} color="#1877F2" />}>
                      {CONTACT.secondaryPhone}
                    </ContactItem>

                    <ContactItem icon={<Mail size={12} color="#E791A7" />}>
                      {CONTACT.email}
                    </ContactItem>

                    <ContactItem icon={<Globe size={12} color="#D3A753" />}>
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
                        marginSize={2}
                        className="block h-[22mm] w-[22mm]"
                      />

                      <div className="absolute top-1/2 left-1/2 flex h-[6mm] w-[6mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white">
                        <FaWhatsapp size={16} color="#25D366" />
                      </div>
                    </div>

                    <div className="mt-[1.2mm] flex items-center gap-[1mm]">
                      <span className="font-sans text-[1.7mm] font-bold text-white/75">
                        WhatsApp
                      </span>
                    </div>
                  </div>

                  {/* Website QR */}

                  <div className="flex flex-col items-center">
                    <div className="relative rounded-[2mm] bg-white p-[1.5mm] ">
                      <QRCodeSVG
                        value={`https://${CONTACT.website}`}
                        level="H"
                        marginSize={2}
                        className="block h-[22mm] w-[22mm]"
                      />

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
                      <span className="font-sans text-[1.7mm] font-bold text-white/75">
                        Website
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ====================================================
    SOCIAL
    ==================================================== */}

            <div className="mt-[2.5mm] flex items-center justify-center">
              <div className="flex items-center justify-center gap-[5mm]">
                {/* Facebook */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaFacebook size={18} color="#1877F2" />

                  <span className="font-sans text-[2.2mm] font-semibold text-[#24141A]/65">
                    @thaisoulmates
                  </span>
                </div>

                {/* Instagram */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaInstagram size={18} color="#E4405F" />

                  <span className="font-sans text-[2.2mm] font-semibold text-[#24141A]/65">
                    @thaisoulmate
                  </span>
                </div>

                {/* TikTok */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaTiktok size={18} color="#000000" />

                  <span className="font-sans text-[2.2mm] font-semibold text-[#24141A]/65">
                    @thaisoulmate
                  </span>
                </div>

                {/* LINE */}

                <div className="flex items-center gap-[1.5mm]">
                  <FaLine size={18} color="#00C300" />

                  <span className="font-sans text-[2.2mm] font-semibold text-[#24141A]/65">
                    @thaisoulmate
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================
              BOTTOM GOLD ACCENT
              ====================================================== */}

          <div className="absolute right-0 bottom-0 left-0 h-[1.5mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />
        </section>
      </main>
    </>
  )
}
