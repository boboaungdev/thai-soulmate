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

function BrandName({
  gradientId,
  className,
}: {
  gradientId: string
  className: string
}) {
  return (
    <svg
      aria-label={APP_INFO.name}
      className={className}
      role="img"
      viewBox="0 0 180 28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#cfa14f" />
          <stop offset="1" stopColor="#cb5d7a" />
        </linearGradient>
      </defs>
      <text
        x="90"
        y="22"
        fill={`url(#${gradientId})`}
        fontFamily="sans-serif"
        fontSize="18"
        fontWeight="700"
        textAnchor="middle"
      >
        {APP_INFO.name}
      </text>
    </svg>
  )
}

export default function BusinessCardPrintPageV3() {
  return (
    <>
      <PrintTrigger />
      <style jsx global>{`
        @page {
          size: 90mm 55mm;
          margin: 0;
        }
        #printable-area.business-card-v3-document {
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
          #printable-area.business-card-v3-document {
            width: 90mm;
            margin: 0;
            padding: 0;
          }
          #printable-area.business-card-v3-document .business-card-side {
            box-shadow: none;
            break-after: page;
          }
          #printable-area.business-card-v3-document
            .business-card-side:last-child {
            break-after: auto;
          }
        }
      `}</style>
      <main id="printable-area" className="business-card-v3-document">
        <section
          className="business-card-side relative flex h-[55mm] w-[90mm] overflow-hidden"
          style={{ boxShadow: "0 14px 35px rgb(36 30 42 / 18%)" }}
          aria-label="Front of Thai Soulmate business card, gold rail design"
        >
          <div
            className="flex w-[36mm] shrink-0 flex-col items-center justify-center px-[2mm] text-center"
            style={{
              background:
                "linear-gradient(180deg, #fffdf8 0%, #fff8f4 55%, #f6ebe0 100%)",
              borderRight: "0.6mm solid #cfa14f",
            }}
          >
            <Image
              src="/logo.png"
              alt=""
              width={64}
              height={64}
              priority
              quality={100}
              unoptimized
              sizes="13mm"
              className="h-[13mm] w-[13mm] object-contain"
            />
            <BrandName
              gradientId="business-card-v3-front-name"
              className="mt-[1.6mm] block h-[5mm] w-[32mm]"
            />
            <p className="mt-[0.8mm] max-w-[32mm] text-center font-sans text-[1.7mm] leading-[1.25] font-bold tracking-[0.06em] text-[#241e2a]">
              {APP_INFO.tagline}
            </p>
          </div>
          <div
            className="relative flex min-w-0 flex-1 flex-col justify-center px-[6mm] py-[6mm]"
            style={{
              background:
                "linear-gradient(165deg, #3a2430 0%, #241e2a 55%, #1a151c 100%)",
            }}
          >
            <span className="mb-[2mm] block h-[0.4mm] w-[14mm] bg-[#cfa14f]" />
            <p className="font-sans text-[2.1mm] font-bold tracking-[0.04em] text-[#cfa14f]">
              Personal matchmaking in Thailand
            </p>
            <p className="mt-[1.6mm] max-w-[46mm] font-sans text-[1.9mm] leading-[1.35] text-white/65">
              Real people. Real relationships.
              <br />
              Personally matched.
            </p>
          </div>
        </section>

        <section
          className="business-card-side relative flex h-[55mm] w-[90mm] flex-col overflow-hidden"
          style={{
            background: "#fff8f4",
            boxShadow: "0 14px 35px rgb(36 30 42 / 18%)",
          }}
          aria-label="Back of Thai Soulmate business card, band design"
        >
          <div className="flex flex-1 flex-col px-[6mm] pt-[3.5mm] pb-[2mm]">
            <div className="mb-[2mm] flex flex-col items-center text-center">
              <Image
                src="/logo.png"
                alt=""
                width={48}
                height={48}
                quality={100}
                unoptimized
                sizes="8mm"
                className="h-[8mm] w-[8mm] object-contain"
              />
              <BrandName
                gradientId="business-card-v3-back-name"
                className="mt-[0.8mm] block h-[4.4mm] w-[36mm]"
              />
              <p className="mt-[0.5mm] max-w-[40mm] text-center font-sans text-[1.6mm] leading-[1.2] font-bold tracking-[0.08em] text-[#5a4d55]">
                {APP_INFO.tagline}
              </p>
            </div>
            <div className="flex items-center justify-between gap-[3mm]">
              <div className="grid min-w-0 gap-[1.2mm] font-sans text-[1.8mm] font-semibold text-[#241e2a]">
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
              <div className="grid shrink-0 justify-items-center text-center">
                <div className="relative border border-[#cfa14f]/60 bg-white p-[0.9mm]">
                  <QRCodeSVG
                    value={CONTACT.whatsapp}
                    level="H"
                    includeMargin={false}
                    className="block h-[14mm] w-[14mm]"
                  />
                  <span className="absolute top-1/2 left-1/2 grid h-[4mm] w-[4mm] -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-white text-[#25d366]">
                    <FaWhatsapp className="h-[2.8mm] w-[2.8mm]" />
                  </span>
                </div>
                <span className="mt-[0.6mm] font-sans text-[1.4mm] font-bold text-[#241e2a]">
                  Scan to WhatsApp
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-[2mm] px-[6mm] py-[2.4mm]"
            style={{
              background:
                "linear-gradient(90deg, #cfa14f 0%, #cb5d7a 55%, #8a3d55 100%)",
            }}
          >
            <span className="flex items-center gap-[1mm] font-sans text-[1.7mm] font-bold text-white">
              <FaFacebookF size={8} />
              @thaisoulmates
            </span>
            <span className="flex items-center gap-[1mm] font-sans text-[1.7mm] font-bold text-white">
              <FaInstagram size={8} />
              @thaisoulmate
            </span>
            <span className="flex items-center gap-[1mm] font-sans text-[1.7mm] font-bold text-white">
              <FaLine size={8} />
              @thaisoulmate
            </span>
            <span className="flex items-center gap-[1mm] font-sans text-[1.7mm] font-bold text-white">
              <FaTiktok size={8} />
              @thaisoulmate
            </span>
          </div>
        </section>
      </main>
    </>
  )
}
