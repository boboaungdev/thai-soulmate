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
          <stop offset="1" stopColor="#e8c27a" />
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
            className="flex w-[24mm] shrink-0 flex-col items-center justify-center"
            style={{
              background:
                "linear-gradient(180deg, #e8c27a 0%, #cfa14f 48%, #b8863e 100%)",
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
              sizes="16mm"
              className="h-[16mm] w-[16mm] object-contain"
            />
          </div>
          <div
            className="relative flex min-w-0 flex-1 flex-col justify-between px-[6mm] py-[6mm]"
            style={{
              background:
                "linear-gradient(165deg, #3a2430 0%, #241e2a 55%, #1a151c 100%)",
            }}
          >
            <div>
              <BrandName
                gradientId="business-card-v3-front-name"
                className="block h-[7mm] w-[48mm]"
              />
              <p className="mt-[1.2mm] font-sans text-[2mm] font-bold tracking-[0.16em] text-white/85">
                {APP_INFO.tagline}
              </p>
            </div>
            <div>
              <span className="mb-[2mm] block h-[0.4mm] w-[14mm] bg-[#cfa14f]" />
              <p className="font-sans text-[2.1mm] font-bold tracking-[0.04em] text-[#cfa14f]">
                Personal matchmaking in Thailand
              </p>
              <p className="mt-[1.6mm] max-w-[52mm] font-sans text-[1.9mm] leading-[1.35] text-white/65">
                Real people. Real relationships.
                <br />
                Personally matched.
              </p>
            </div>
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
          <div className="flex flex-1 items-start justify-between gap-[4mm] px-[6mm] pt-[5mm] pb-[3mm]">
            <div className="min-w-0">
              <div className="mb-[3mm] flex items-center gap-[1.4mm]">
                <Image
                  src="/logo.png"
                  alt=""
                  width={48}
                  height={48}
                  quality={100}
                  unoptimized
                  sizes="9mm"
                  className="h-[9mm] w-[9mm] object-contain"
                />
                <div className="flex flex-col leading-none">
                  <BrandName
                    gradientId="business-card-v3-back-name"
                    className="block h-[4.6mm] w-[32mm]"
                  />
                  <p className="mt-[0.6mm] font-sans text-[1.7mm] font-bold tracking-[0.08em] text-[#5a4d55]">
                    {APP_INFO.tagline}
                  </p>
                </div>
              </div>
              <div className="grid gap-[1.4mm] font-sans text-[1.9mm] font-semibold text-[#241e2a]">
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
            </div>
            <div className="grid shrink-0 justify-items-center pt-[1mm] text-center">
              <div className="relative border border-[#cfa14f]/60 bg-white p-[1.1mm]">
                <QRCodeSVG
                  value={CONTACT.whatsapp}
                  level="H"
                  includeMargin={false}
                  className="block h-[16mm] w-[16mm]"
                />
                <span className="absolute top-1/2 left-1/2 grid h-[4.2mm] w-[4.2mm] -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-white text-[#25d366]">
                  <FaWhatsapp className="h-[3mm] w-[3mm]" />
                </span>
              </div>
              <span className="mt-[1mm] font-sans text-[1.5mm] font-bold text-[#241e2a]">
                Scan to WhatsApp
              </span>
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-[2mm] px-[6mm] py-[2.4mm]"
            style={{
              background:
                "linear-gradient(90deg, #8a3d55 0%, #cb5d7a 55%, #cfa14f 100%)",
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
