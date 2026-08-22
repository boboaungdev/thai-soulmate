"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Globe, Mail, Phone } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"

import { APP_INFO, CONTACT } from "@/constants"

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

function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 40V1H40" stroke="#cfa14f" strokeWidth="1.6" />
      <path d="M5 40V5H40" stroke="#cb5d7a" strokeWidth="0.9" />
    </svg>
  )
}

function BrandWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "flex items-center gap-[1.4mm]"
          : "flex flex-col items-center text-center"
      }
    >
      <Image
        src="/logo.png"
        alt=""
        width={64}
        height={64}
        priority
        quality={100}
        unoptimized
        sizes={compact ? "11mm" : "16mm"}
        className={
          compact
            ? "h-[11mm] w-[11mm] object-contain"
            : "h-[16mm] w-[16mm] object-contain"
        }
      />
      <div
        className={
          compact
            ? "flex flex-col items-start leading-none"
            : "mt-[1.5mm] flex flex-col items-center leading-none"
        }
      >
        <svg
          aria-label={APP_INFO.name}
          className={
            compact ? "block h-[5mm] w-[34mm]" : "block h-[7mm] w-[48mm]"
          }
          role="img"
          viewBox="0 0 180 28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={
                compact
                  ? "business-card-v2-brand-compact"
                  : "business-card-v2-brand"
              }
              x1="0"
              x2="1"
              y1="0"
              y2="0"
            >
              <stop offset="0" stopColor="#cfa14f" />
              <stop offset="1" stopColor="#cb5d7a" />
            </linearGradient>
          </defs>
          <text
            x="90"
            y="22"
            fill={
              compact
                ? "url(#business-card-v2-brand-compact)"
                : "url(#business-card-v2-brand)"
            }
            fontFamily="sans-serif"
            fontSize="18"
            fontWeight="700"
            textAnchor="middle"
          >
            {APP_INFO.name}
          </text>
        </svg>
        <p
          className={
            compact
              ? "mt-[0.6mm] font-sans text-[1.8mm] font-bold tracking-[0.14em] text-[#5a4d55]"
              : "mt-[1mm] font-sans text-[2mm] font-bold tracking-[0.22em] text-[#5a4d55] uppercase"
          }
        >
          {APP_INFO.tagline}
        </p>
      </div>
    </div>
  )
}

export default function BusinessCardPrintPageV2() {
  return (
    <>
      <PrintTrigger />
      <style jsx global>{`
        @page {
          size: 90mm 55mm;
          margin: 0;
        }
        #printable-area.business-card-v2-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          width: 100%;
          min-height: 0;
          margin: 0;
          padding: 36px;
          background: white;
          box-shadow: none;
        }
        @media print {
          #printable-area.business-card-v2-document {
            width: 90mm;
            margin: 0;
            padding: 0;
          }
          #printable-area.business-card-v2-document .business-card-side {
            box-shadow: none;
            break-after: page;
          }
          #printable-area.business-card-v2-document
            .business-card-side:last-child {
            break-after: auto;
          }
        }
      `}</style>
      <main id="printable-area" className="business-card-v2-document">
        <section
          className="business-card-side relative flex h-[55mm] w-[90mm] flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #fffdf8 0%, #f3e6d4 58%, #ead7c0 100%)",
            boxShadow: "0 14px 35px rgb(36 30 42 / 18%)",
          }}
          aria-label="Front of Thai Soulmate business card, framed design"
        >
          <CornerOrnament className="absolute top-[2.4mm] left-[2.4mm] h-[9mm] w-[9mm]" />
          <CornerOrnament className="absolute top-[2.4mm] right-[2.4mm] h-[9mm] w-[9mm] rotate-90" />
          <CornerOrnament className="absolute bottom-[2.4mm] left-[2.4mm] h-[9mm] w-[9mm] -rotate-90" />
          <CornerOrnament className="absolute right-[2.4mm] bottom-[2.4mm] h-[9mm] w-[9mm] rotate-180" />

          <div className="relative z-10 flex flex-col items-center px-[8mm]">
            <BrandWordmark />
            <div className="mt-[3mm] flex items-center gap-[2mm]">
              <span className="h-px w-[8mm] bg-[#cfa14f]" />
              <span className="h-[1.4mm] w-[1.4mm] rotate-45 bg-[#cb5d7a]" />
              <span className="h-px w-[8mm] bg-[#cfa14f]" />
            </div>
            <p className="mt-[2.2mm] max-w-[62mm] text-center font-sans text-[2mm] leading-[1.35] font-semibold tracking-[0.02em] text-[#3b3238]">
              Personal matchmaking for real relationships
            </p>
          </div>
        </section>

        <section
          className="business-card-side relative flex h-[55mm] w-[90mm] overflow-hidden"
          style={{
            background: "#241e2a",
            boxShadow: "0 14px 35px rgb(36 30 42 / 18%)",
          }}
          aria-label="Back of Thai Soulmate business card, split design"
        >
          <div
            className="flex w-[34mm] shrink-0 flex-col items-center justify-center gap-[3mm] px-[4mm] py-[5mm]"
            style={{
              background:
                "linear-gradient(180deg, #2d2433 0%, #1c171f 100%)",
            }}
          >
            <div className="relative border border-[#cfa14f]/55 bg-white p-[1.2mm]">
              <QRCodeSVG
                value={CONTACT.whatsapp}
                level="H"
                includeMargin={false}
                className="block h-[18mm] w-[18mm]"
              />
              <span className="absolute top-1/2 left-1/2 grid h-[4.4mm] w-[4.4mm] -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-white text-[#25d366]">
                <FaWhatsapp className="h-[3.2mm] w-[3.2mm]" />
              </span>
            </div>
            <p className="text-center font-sans text-[1.6mm] leading-[1.3] font-bold text-white/75">
              Scan to start
              <br />a conversation
            </p>
          </div>

          <div
            className="flex min-w-0 flex-1 flex-col justify-between px-[4.5mm] py-[4.5mm]"
            style={{ background: "#fffaf4" }}
          >
            <BrandWordmark compact />

            <div className="grid gap-[1.3mm] font-sans text-[1.85mm] font-semibold text-[#241e2a]">
              <p className="flex items-center gap-[1.4mm] whitespace-nowrap">
                <FaWhatsapp size={9} className="shrink-0 text-[#cb5d7a]" />
                <span>{CONTACT.primaryPhone}</span>
              </p>
              <p className="flex items-center gap-[1.4mm] whitespace-nowrap">
                <Phone size={9} color="#cb5d7a" className="shrink-0" />
                <span>
                  {CONTACT.primaryPhone} / {CONTACT.secondaryPhone}
                </span>
              </p>
              <p className="flex items-center gap-[1.4mm] whitespace-nowrap">
                <Mail size={9} color="#cb5d7a" className="shrink-0" />
                {CONTACT.email}
              </p>
              <p className="flex items-center gap-[1.4mm] whitespace-nowrap">
                <Globe size={9} color="#cb5d7a" className="shrink-0" />
                thaisoulmate.org
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-[2.5mm] gap-y-[1mm] border-t border-[#cfa14f]/35 pt-[2mm] font-sans text-[1.65mm] font-bold text-[#241e2a]">
              <span className="flex items-center gap-[1mm]">
                <FaFacebookF size={8} color="#cb5d7a" />
                @thaisoulmates
              </span>
              <span className="flex items-center gap-[1mm]">
                <FaInstagram size={8} color="#cb5d7a" />
                @thaisoulmate
              </span>
              <span className="flex items-center gap-[1mm]">
                <FaLine size={8} color="#cb5d7a" />
                @thaisoulmate
              </span>
              <span className="flex items-center gap-[1mm]">
                <FaTiktok size={8} color="#cb5d7a" />
                @thaisoulmate
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
