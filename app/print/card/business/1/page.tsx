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

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex -translate-y-[2mm] items-center gap-[1.5mm]">
      <Image
        src="/logo.png"
        alt=""
        width={64}
        height={64}
        priority
        quality={100}
        unoptimized
        sizes="15mm"
        className="h-[15mm] w-[15mm] object-contain"
      />
      <div className="flex flex-col items-center justify-center text-center leading-none">
        <svg
          aria-label={APP_INFO.name}
          className="block h-[6mm] w-[39mm]"
          role="img"
          viewBox="0 0 180 28"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="business-card-brand-gradient"
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
            fill="url(#business-card-brand-gradient)"
            fontFamily="sans-serif"
            fontSize="18"
            fontWeight="700"
            textAnchor="middle"
          >
            {APP_INFO.name}
          </text>
        </svg>
        <p
          className="mt-[0.5mm] text-center font-sans text-[2.2mm] font-bold tracking-[0.08em]"
          style={{ color: light ? "#ffffff" : "#241e2a" }}
        >
          {APP_INFO.tagline}
        </p>
      </div>
    </div>
  )
}

export default function BusinessCardPrintPage() {
  return (
    <>
      <PrintTrigger />
      <style jsx global>{`
        @page {
          size: 90mm 55mm;
          margin: 0;
        }
        #printable-area.business-card-document {
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
          #printable-area.business-card-document {
            width: 90mm;
            margin: 0;
            padding: 0;
          }
          #printable-area.business-card-document .business-card-side {
            box-shadow: none;
            break-after: page;
          }
          #printable-area.business-card-document
            .business-card-side:last-child {
            break-after: auto;
          }
        }
      `}</style>
      <main id="printable-area" className="business-card-document">
        <section
          className="business-card-side relative flex h-[55mm] w-[90mm] flex-col justify-between overflow-hidden p-[8mm]"
          style={{
            background: "#241e2a",
            boxShadow: "0 14px 35px rgb(36 30 42 / 18%)",
          }}
          aria-label="Front of Thai Soulmate business card"
        >
          <div className="relative z-10">
            <BrandMark light />
          </div>
          <div className="relative z-10 max-w-[62mm]">
            <p className="mt-[2mm] font-sans text-[2.2mm] font-bold tracking-[0.12em] text-[#cfa14f] uppercase">
              Personal matchmaking in Thailand
            </p>
            <p className="mt-[2mm] max-w-[58mm] font-sans text-[2mm] leading-[1.3] text-white/70">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
        </section>

        <section
          className="business-card-side flex h-[55mm] w-[90mm] flex-col justify-between p-[7mm]"
          style={{
            background: "#ffffff",
            boxShadow: "0 14px 35px rgb(36 30 42 / 18%)",
            borderTop: "1.5mm solid #cfa14f",
          }}
          aria-label="Back of Thai Soulmate business card"
        >
          <div className="flex items-start justify-between gap-4">
            <BrandMark />
            <p className="pt-[1mm] text-right font-sans text-[2mm] font-extrabold tracking-[0.12em] text-[#cb5d7a] uppercase">
              Connect with us
            </p>
          </div>
          <div className="flex items-start justify-between gap-[4mm] font-sans font-semibold text-[#241e2a]">
            <div className="grid min-w-0 gap-[1.5mm] text-[1.9mm]">
              <p className="flex items-center gap-[1.5mm] whitespace-nowrap">
                <FaWhatsapp size={9} className="shrink-0 text-[#cb5d7a]" />
                <span>{CONTACT.primaryPhone}</span>
              </p>
              <p className="flex items-center gap-[1.5mm] whitespace-nowrap">
                <Phone size={9} color="#cb5d7a" className="shrink-0" />
                <span>
                  {CONTACT.primaryPhone} / {CONTACT.secondaryPhone}
                </span>
              </p>
              <p className="flex items-center gap-[1.5mm] whitespace-nowrap">
                <Mail size={9} color="#cb5d7a" className="shrink-0" />
                {CONTACT.email}
              </p>
              <p className="flex items-center gap-[1.5mm] whitespace-nowrap">
                <Globe size={9} color="#cb5d7a" className="shrink-0" />
                thaisoulmate.org
              </p>
            </div>
            <div className="grid shrink-0 justify-items-center text-center text-[1.6mm] font-bold">
              <div className="relative border border-[#cb5d7a]/45 bg-white p-[1mm]">
                <QRCodeSVG
                  value={CONTACT.whatsapp}
                  level="H"
                  includeMargin={false}
                  className="block h-[14mm] w-[14mm]"
                />
                <span className="absolute top-1/2 left-1/2 grid h-[4mm] w-[4mm] -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-white text-[#25d366]">
                  <FaWhatsapp className="h-[3mm] w-[3mm]" />
                </span>
              </div>
              <span className="mt-[0.5mm] text-[#241e2a]">
                Scan to WhatsApp
              </span>
            </div>
          </div>
          <div className="flex items-center justify-start gap-[3mm] border-t border-[#cb5d7a]/25 pt-[2.5mm]">
            <div className="grid grid-cols-2 gap-x-[3mm] gap-y-[1mm] font-sans text-[1.8mm] font-bold text-[#241e2a]">
              <span className="flex items-center gap-[1mm]">
                <FaFacebookF size={9} color="#cb5d7a" />
                @thaisoulmates
              </span>
              <span className="flex items-center gap-[1mm]">
                <FaInstagram size={9} color="#cb5d7a" />
                @thaisoulmate
              </span>
              <span className="flex items-center gap-[1mm]">
                <FaLine size={9} color="#cb5d7a" />
                @thaisoulmate
              </span>
              <span className="flex items-center gap-[1mm]">
                <FaTiktok size={9} color="#cb5d7a" />
                @thaisoulmate
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
