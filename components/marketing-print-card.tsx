"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Globe, Mail, Phone } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import type { IconType } from "react-icons"
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"

import { APP_INFO, CONTACT } from "@/constants"

type MarketingVariant = "editorial" | "classic" | "sunset" | "sage"

type MarketingCopy = {
  eyebrow: string
  headline: React.ReactNode
  backHeadline: React.ReactNode
  showFrontFooter?: boolean
}

const socialLinks = [
  { label: "Facebook", value: "@thaisoulmates", icon: FaFacebookF },
  { label: "Instagram", value: "@thaisoulmate", icon: FaInstagram },
  { label: "TikTok", value: "@thaisoulmate", icon: FaTiktok },
  { label: "Line", value: "@thaisoulmate", icon: FaLine },
]

const colors = {
  editorial: {
    ink: "#542538",
    accent: "#cb5d7a",
    background: "#fff7f8",
    front: "#18212f",
    muted: "#a45d72",
  },
  classic: {
    ink: "#241e2a",
    accent: "#cb5d7a",
    background: "#fffaf7",
    front: "#1c1420",
    muted: "#987d86",
  },
  sunset: {
    ink: "#43222a",
    accent: "#d46a4c",
    background: "#fff4ed",
    front: "#7c3345",
    muted: "#a96861",
  },
  sage: {
    ink: "#203b36",
    accent: "#5c8f7d",
    background: "#f3f8f2",
    front: "#183b3c",
    muted: "#6b8b7c",
  },
} as const

function PrintTrigger() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") !== "true")
      return

    const print = async () => {
      await document.fonts.ready
      await Promise.all(
        Array.from(document.images).map((image) => image.decode())
      )
      window.print()
    }

    void print()
  }, [])

  return null
}

function BrandMark({ inverse, color }: { inverse?: boolean; color: string }) {
  const gradientId = inverse
    ? "marketing-gradient-back"
    : "marketing-gradient-front"

  return (
    <div className="flex items-center gap-[5mm]">
      <Image
        src="/logo.png"
        alt=""
        width={76}
        height={76}
        className="h-[23mm] w-[23mm] object-contain"
      />
      <div className="flex flex-col items-center justify-center text-center leading-none">
        <svg
          aria-label={APP_INFO.name}
          className="block h-[9mm] w-[58mm]"
          role="img"
          viewBox="0 0 180 28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#f2b854" />
              <stop offset="1" stopColor="#f07797" />
            </linearGradient>
          </defs>
          <text
            x="90"
            y="22"
            fill={`url(#${gradientId})`}
            fontFamily="sans-serif"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
          >
            {APP_INFO.name}
          </text>
        </svg>
        <p
          className="mt-0 text-center font-sans text-[3.7mm] font-bold tracking-[0.08em]"
          style={{ color: inverse ? "#867079" : color }}
        >
          {APP_INFO.tagline}
        </p>
      </div>
    </div>
  )
}

function ContactRow({
  icon: Icon,
  label,
  children,
  color,
  muted,
}: {
  icon: IconType | typeof Phone
  label: string
  children: React.ReactNode
  color: string
  muted: string
}) {
  return (
    <div
      className="grid min-h-[8mm] grid-cols-[9mm_25mm_1fr] items-center gap-[2mm] border-b pb-[2mm]"
      style={{ borderColor: `${color}3d` }}
    >
      <span className="grid h-[7mm] w-[7mm] place-items-center rounded-[1mm]">
        <Icon size={16} strokeWidth={2.2} color={color} />
      </span>
      <span
        className="font-sans text-[2.4mm] font-extrabold tracking-[0.08em] uppercase"
        style={{ color: muted }}
      >
        {label}
      </span>
      <span
        className="text-right font-sans text-[2.9mm] font-bold"
        style={{ color: "#542538" }}
      >
        {children}
      </span>
    </div>
  )
}

export function MarketingPrintCard({
  variant,
  copy,
}: {
  variant: MarketingVariant
  copy: MarketingCopy
}) {
  const palette = colors[variant]

  return (
    <>
      <PrintTrigger />
      <style jsx global>{`
        @page {
          size: A5 portrait;
          margin: 0;
        }
        #printable-area.marketing-document {
          width: 100%;
          min-height: 0;
          margin: 0 auto;
          padding: 36px;
          background: #ded5d2;
          box-shadow: none;
        }
        @media print {
          body {
            background: white;
          }
          #printable-area.marketing-document {
            width: 148mm;
            margin: 0;
            padding: 0;
            background: white;
          }
          #printable-area .marketing-sheet {
            box-shadow: none;
            break-after: page;
          }
          #printable-area .marketing-sheet:last-child {
            break-after: auto;
          }
        }
      `}</style>
      <main
        id="printable-area"
        className="mx-auto flex flex-col items-center gap-7 p-9 font-sans"
        style={{ background: "#ded5d2" }}
      >
        <section
          className="marketing-sheet relative flex h-[210mm] w-[148mm] flex-col justify-between overflow-hidden p-[15mm_14mm_13mm] text-white"
          style={{
            background: `linear-gradient(145deg, ${palette.front}, ${palette.ink})`,
            boxShadow: "0 18px 45px rgb(36 30 42 / 22%)",
          }}
          aria-label="Front of Thai Soulmate marketing card"
        >
          <BrandMark color="#ffffff" />
          <div className="relative my-auto max-w-[111mm]">
            <p
              className="mb-[8mm] inline-block border-b pb-[2mm] font-sans text-[2.7mm] font-extrabold tracking-[0.2em] uppercase"
              style={{ borderColor: palette.accent, color: palette.accent }}
            >
              {copy.eyebrow}
            </p>
            <h1 className="max-w-[105mm] font-serif text-[18mm] leading-[0.93] font-normal tracking-[-0.035em]">
              {copy.headline}
            </h1>
            <p className="mt-[9mm] max-w-[90mm] font-sans text-[3.6mm] leading-[1.5] font-semibold whitespace-pre-line text-white/75">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
          {copy.showFrontFooter && (
            <footer className="flex items-end justify-between gap-[8mm] border-t border-white/35 pt-[5mm]">
              <p className="font-sans text-[3mm] font-extrabold tracking-[0.14em]">
                thaisoulmate.org
              </p>
              <div
                className="min-w-[32mm] border p-[3mm_4mm] text-center font-serif text-[2.8mm] leading-[1.25]"
                style={{ borderColor: "#cfa14f", color: "#cfa14f" }}
              >
                Made for
                <br />
                real love
                <br />
                in Thailand
              </div>
            </footer>
          )}
        </section>

        <section
          className="marketing-sheet flex h-[210mm] w-[148mm] flex-col overflow-hidden p-[15mm_14mm_13mm]"
          style={{
            background: palette.background,
            boxShadow: "0 18px 45px rgb(36 30 42 / 18%)",
          }}
          aria-label="Back of Thai Soulmate marketing card"
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <BrandMark inverse color={palette.ink} />
              <h2
                className="mt-[10mm] font-serif text-[11mm] leading-[0.98] font-normal tracking-[-0.03em]"
                style={{ color: palette.ink }}
              >
                {copy.backHeadline}
              </h2>
              <p
                className="mt-[4mm] font-sans text-[2.8mm] font-extrabold tracking-[0.17em] uppercase"
                style={{ color: palette.accent }}
              >
                Personal matchmaking in Thailand
              </p>
            </div>
            <div className="my-[9mm] grid gap-[3mm]">
              <ContactRow
                icon={FaWhatsapp}
                label="WhatsApp"
                color={palette.accent}
                muted={palette.muted}
              >
                +66 6369 15263
              </ContactRow>
              <ContactRow
                icon={Phone}
                label="Phone"
                color={palette.accent}
                muted={palette.muted}
              >
                +66 6369 15263 · +66 6369 15264
              </ContactRow>
              <ContactRow
                icon={Mail}
                label="Email"
                color={palette.accent}
                muted={palette.muted}
              >
                {CONTACT.email}
              </ContactRow>
              <ContactRow
                icon={Globe}
                label="Website"
                color={palette.accent}
                muted={palette.muted}
              >
                thaisoulmate.org
              </ContactRow>
            </div>
            <div
              className="flex items-end justify-between gap-[8mm] pt-[6mm]"
              style={{ borderColor: `${palette.accent}3d` }}
            >
              <div
                className="grid gap-[2.5mm] font-sans text-[2.7mm] font-bold"
                style={{ color: palette.ink }}
              >
                {socialLinks.map(({ label, value, icon: Icon }) => (
                  <div className="flex items-center gap-[2mm]" key={label}>
                    <Icon size={14} color={palette.accent} aria-hidden="true" />
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <div
                className="grid flex-[0_0_39mm] justify-items-center gap-[2mm] text-center font-sans text-[2.25mm] font-extrabold uppercase"
                style={{ color: palette.ink }}
              >
                <div
                  className="relative border bg-white p-[2mm]"
                  style={{ borderColor: `${palette.accent}47` }}
                >
                  <QRCodeSVG
                    value={CONTACT.whatsapp}
                    level="H"
                    includeMargin={false}
                    className="block h-[34mm] w-[34mm]"
                  />
                  <span className="absolute top-1/2 left-1/2 grid h-[9mm] w-[9mm] -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-white text-[#25d366]">
                    <FaWhatsapp className="h-[6mm] w-[6mm]" />
                  </span>
                </div>
                <span>Scan to WhatsApp us</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
