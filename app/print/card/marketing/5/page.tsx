"use client"

import Image from "next/image"
import { useEffect } from "react"
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
  MessageCircle,
  Globe,
  Mail,
  Phone,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import {
  FaFacebook,
  FaInstagram,
  FaLine,
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
            } catch {
              // Ignore images that cannot be decoded
            }
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
   BRAND NAME
   ============================================================ */

function BrandName({
  className = "",
  dark = false,
}: {
  className?: string
  dark?: boolean
}) {
  return (
    <svg
      aria-label={APP_INFO.name}
      className={`block h-auto ${className}`}
      role="img"
      viewBox="0 0 180 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={dark ? "leaflet-brand-dark" : "leaflet-brand-light"}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stopColor="#D3A753" />
          <stop offset="50%" stopColor="#E791A7" />
          <stop offset="100%" stopColor="#CA617D" />
        </linearGradient>
      </defs>

      <text
        x="90"
        y="22"
        fill={`url(#${dark ? "leaflet-brand-dark" : "leaflet-brand-light"})`}
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
    <div className="flex items-center gap-[3mm]">
      <div
        className={`h-px w-[12mm] ${
          light ? "bg-[#D3A753]/70" : "bg-[#D3A753]"
        }`}
      />

      <h2
        className={`font-sans text-[4mm] font-bold tracking-[0.12em] uppercase ${
          light ? "text-white" : "text-[#241e2a]"
        }`}
      >
        {children}
      </h2>

      <div
        className={`h-px flex-1 ${
          light ? "bg-[#D3A753]/30" : "bg-[#D3A753]/40"
        }`}
      />
    </div>
  )
}

/* ============================================================
   SERVICE ITEM
   ============================================================ */

function ServiceItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex gap-[3mm]">
      <div className="flex h-[10mm] w-[10mm] shrink-0 items-center justify-center rounded-full border border-[#D3A753]/50 bg-white">
        {icon}
      </div>

      <div>
        <h3 className="font-sans text-[3mm] font-bold text-[#241e2a]">
          {title}
        </h3>

        <p className="mt-[0.8mm] font-sans text-[2.2mm] leading-[1.35] text-[#241e2a]/65">
          {text}
        </p>
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
    <div className="flex items-center gap-[2.5mm]">
      <div className="flex w-[5mm] shrink-0 justify-center">{icon}</div>

      <span className="font-sans text-[2.3mm] font-semibold text-[#241e2a]">
        {children}
      </span>
    </div>
  )
}

/* ============================================================
   SOCIAL ITEM
   ============================================================ */

function SocialItem({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-[1.5mm]">
      {icon}

      <span className="font-sans text-[2mm] font-semibold text-[#241e2a]">
        {children}
      </span>
    </div>
  )
}

/* ============================================================
   MAIN PAGE
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
          min-height: 0;
          margin: 0;
          padding: 36px;
          background: #f3eee7;
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
            FRONT PAGE
            ======================================================== */}

        <section
          className="marketing-leaflet-page relative h-[210mm] w-[148mm] overflow-hidden bg-[#FBF8F3] shadow-2xl"
          aria-label="Front of Thai Soulmate A5 marketing leaflet"
        >
          {/* Top burgundy area */}

          <div className="absolute inset-x-0 top-0 h-[83mm] bg-gradient-to-br from-[#5A0816] via-[#741128] to-[#3F0510]" />

          {/* Texture */}

          <div
            className="absolute inset-x-0 top-0 h-[83mm] opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Gold border */}

          <div className="absolute inset-[4mm] border border-[#D3A753]/30" />

          {/* Header */}

          <div className="relative z-10 flex flex-col items-center pt-[10mm] text-center">
            <Image
              src="/logo.png"
              alt="Thai Soulmate"
              width={180}
              height={180}
              priority
              quality={100}
              unoptimized
              className="h-[25mm] w-[25mm] object-contain"
            />

            <BrandName className="mt-[2mm] w-[62mm]" />

            <p className="mt-[1.5mm] font-sans text-[2.8mm] font-semibold tracking-[0.28em] text-[#D3A753] uppercase">
              {APP_INFO.tagline}
            </p>

            <div className="mt-[4mm] flex items-center gap-[3mm]">
              <div className="h-px w-[18mm] bg-[#D3A753]/50" />

              <Heart size={13} fill="#D3A753" color="#D3A753" />

              <div className="h-px w-[18mm] bg-[#D3A753]/50" />
            </div>
          </div>

          {/* Main photo */}

          <div className="absolute top-[70mm] right-[10mm] left-[10mm] h-[68mm] overflow-hidden border-[2mm] border-white shadow-xl">
            <Image
              src="/card/marketing/2.png"
              alt="Thai Soulmate matchmaking"
              fill
              priority
              quality={100}
              className="object-cover"
              sizes="128mm"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#3F0510]/75 via-transparent to-transparent" />

            <div className="absolute right-[6mm] bottom-[6mm] left-[6mm]">
              <p className="font-sans text-[4.6mm] leading-[1.15] font-bold text-white">
                Real People.
                <br />
                Real Relationships.
                <br />
                Personally matched in Thailand.
              </p>
            </div>
          </div>

          {/* Services section */}

          <div className="absolute inset-x-[10mm] top-[145mm]">
            <SectionTitle>Our Service</SectionTitle>

            <div className="mt-[5mm] grid grid-cols-2 gap-x-[8mm] gap-y-[5mm]">
              <ServiceItem
                icon={<Heart size={17} color="#CA617D" fill="#CA617D" />}
                title="Personal Matching"
                text="Thoughtful introductions based on your preferences and relationship goals."
              />

              <ServiceItem
                icon={<Users size={17} color="#D3A753" />}
                title="Real People"
                text="Connect with genuine people looking for meaningful relationships."
              />

              <ServiceItem
                icon={<ShieldCheck size={17} color="#CA617D" />}
                title="Private & Discreet"
                text="Your personal information and matchmaking journey are handled with care."
              />

              <ServiceItem
                icon={<MessageCircle size={17} color="#D3A753" />}
                title="Personal Support"
                text="We are here to help guide you through every step of the process."
              />
            </div>
          </div>

          {/* Bottom statement */}

          <div className="absolute inset-x-0 bottom-0 flex h-[18mm] items-center justify-center bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]">
            <div className="flex items-center gap-[4mm] font-sans text-[2.4mm] font-bold tracking-[0.2em] text-white uppercase">
              <span>Exclusive</span>
              <span className="text-white/70">•</span>
              <span>Personal</span>
              <span className="text-white/70">•</span>
              <span>Professional</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            BACK PAGE
            ======================================================== */}

        <section
          className="marketing-leaflet-page relative h-[210mm] w-[148mm] overflow-hidden bg-[#FBF8F3] shadow-2xl"
          aria-label="Back of Thai Soulmate A5 marketing leaflet"
        >
          {/* Top gradient */}

          <div className="absolute inset-x-0 top-0 h-[6mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Main content */}

          <div className="relative flex h-full flex-col px-[12mm] pt-[13mm] pb-[12mm]">
            {/* Header */}

            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center text-center">
                <BrandName className="w-[50mm]" />

                <p className="mt-[1mm] font-sans text-[2.1mm] font-semibold tracking-[0.18em] text-[#CA617D] uppercase">
                  1-2-1 Matchmaking Service
                </p>
              </div>
            </div>

            {/* Connect title */}

            <div className="mt-[9mm]">
              <SectionTitle>Connect With Us</SectionTitle>

              <p className="mt-[3mm] max-w-[115mm] font-sans text-[2.5mm] leading-[1.45] text-[#241e2a]/70">
                Ready to meet someone special? Contact Thai Soulmate and
                discover a more personal approach to matchmaking in Thailand.
              </p>
            </div>

            {/* Contact + QR */}

            <div className="mt-[7mm] grid grid-cols-[1fr_auto] gap-[8mm]">
              {/* Contact details */}

              <div className="grid content-start gap-[3mm]">
                <ContactItem icon={<FaWhatsapp size={16} color="#25D366" />}>
                  {CONTACT.primaryPhone}
                </ContactItem>

                <ContactItem icon={<Phone size={17} color="#1877F2" />}>
                  {CONTACT.primaryPhone}
                </ContactItem>

                <ContactItem icon={<Phone size={17} color="#1877F2" />}>
                  {CONTACT.secondaryPhone}
                </ContactItem>

                <ContactItem icon={<Mail size={17} color="#EA4335" />}>
                  {CONTACT.email}
                </ContactItem>

                <ContactItem icon={<Globe size={17} color="#D3A753" />}>
                  {CONTACT.website}
                </ContactItem>
              </div>

              {/* QR codes */}

              <div className="flex gap-[5mm]">
                {/* WhatsApp */}

                <div className="flex flex-col items-center">
                  <div className="relative border border-[#D3A753]/50 bg-white p-[2mm] shadow-sm">
                    <QRCodeSVG
                      value={CONTACT.whatsapp}
                      level="H"
                      marginSize={4}
                      className="block h-[27mm] w-[27mm]"
                    />

                    <div className="absolute top-1/2 left-1/2 flex h-[8mm] w-[8mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
                      <FaWhatsapp size={24} color="#25D366" />
                    </div>
                  </div>

                  <p className="mt-[1.5mm] font-sans text-[2mm] font-bold text-[#CA617D]">
                    WhatsApp
                  </p>

                  <p className="mt-[0.5mm] font-sans text-[1.6mm] text-[#241e2a]/60">
                    Scan to chat
                  </p>
                </div>

                {/* Website */}

                <div className="flex flex-col items-center">
                  <div className="relative border border-[#D3A753]/50 bg-white p-[2mm] shadow-sm">
                    <QRCodeSVG
                      value={CONTACT.website}
                      level="H"
                      marginSize={4}
                      className="block h-[27mm] w-[27mm]"
                    />

                    <div className="absolute top-1/2 left-1/2 flex h-[8mm] w-[8mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
                      <Image
                        src="/logo.png"
                        alt="Thai Soulmate"
                        width={40}
                        height={40}
                        quality={100}
                        unoptimized
                        className="h-[6mm] w-[6mm] object-contain"
                      />
                    </div>
                  </div>

                  <p className="mt-[1.5mm] font-sans text-[2mm] font-bold text-[#CA617D]">
                    Website
                  </p>

                  <p className="mt-[0.5mm] font-sans text-[1.6mm] text-[#241e2a]/60">
                    thaisoulmate.org
                  </p>
                </div>
              </div>
            </div>

            {/* Why Thai Soulmate */}

            <div className="mt-[9mm]">
              <SectionTitle>Why Thai Soulmate?</SectionTitle>

              <div className="mt-[5mm] grid grid-cols-3 gap-[5mm]">
                <div className="border border-[#D3A753]/30 bg-white p-[4mm]">
                  <Heart size={19} color="#CA617D" fill="#CA617D" />

                  <h3 className="mt-[2.5mm] font-sans text-[2.7mm] font-bold text-[#241e2a]">
                    Personal
                  </h3>

                  <p className="mt-[1mm] font-sans text-[1.9mm] leading-[1.35] text-[#241e2a]/60">
                    Every introduction is carefully considered.
                  </p>
                </div>

                <div className="border border-[#D3A753]/30 bg-white p-[4mm]">
                  <ShieldCheck size={19} color="#D3A753" />

                  <h3 className="mt-[2.5mm] font-sans text-[2.7mm] font-bold text-[#241e2a]">
                    Discreet
                  </h3>

                  <p className="mt-[1mm] font-sans text-[1.9mm] leading-[1.35] text-[#241e2a]/60">
                    Your privacy is treated with respect.
                  </p>
                </div>

                <div className="border border-[#D3A753]/30 bg-white p-[4mm]">
                  <Sparkles size={19} color="#CA617D" />

                  <h3 className="mt-[2.5mm] font-sans text-[2.7mm] font-bold text-[#241e2a]">
                    Professional
                  </h3>

                  <p className="mt-[1mm] font-sans text-[1.9mm] leading-[1.35] text-[#241e2a]/60">
                    Personal support throughout your journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo strip */}

            <div className="mt-[8mm] grid h-[38mm] grid-cols-3 gap-[2mm] overflow-hidden">
              <div className="relative">
                <Image
                  src="/card/marketing/2.png"
                  alt="Thai Soulmate"
                  fill
                  quality={100}
                  unoptimized
                  className="object-cover"
                  sizes="40mm"
                />
              </div>

              <div className="relative">
                <Image
                  src="/card/marketing/3.png"
                  alt="Thai Soulmate"
                  fill
                  quality={100}
                  unoptimized
                  className="object-cover"
                  sizes="40mm"
                />
              </div>

              <div className="relative">
                <Image
                  src="/card/marketing/1-5.png"
                  alt="Thai Soulmate"
                  fill
                  quality={100}
                  unoptimized
                  className="object-cover"
                  sizes="40mm"
                />
              </div>
            </div>

            {/* Social */}

            <div className="mt-auto border-t border-[#CA617D]/25 pt-[4mm]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[5mm]">
                  <SocialItem icon={<FaFacebook size={12} color="#1877F2" />}>
                    @thaisoulmates
                  </SocialItem>

                  <SocialItem icon={<FaInstagram size={12} color="#E4405F" />}>
                    @thaisoulmate
                  </SocialItem>

                  <SocialItem icon={<FaTiktok size={12} color="#000000" />}>
                    @thaisoulmate
                  </SocialItem>

                  <SocialItem icon={<FaLine size={12} color="#00C300" />}>
                    @thaisoulmate
                  </SocialItem>
                </div>

                <p className="font-sans text-[2mm] font-bold tracking-[0.12em] text-[#CA617D]">
                  thaisoulmate.org
                </p>
              </div>
            </div>
          </div>

          {/* Bottom gradient */}

          <div className="absolute inset-x-0 bottom-0 h-[4mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />
        </section>
      </main>
    </>
  )
}
