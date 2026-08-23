"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Globe, Mail, Phone, Heart } from "lucide-react"
import {
  FaFacebook,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"
import { QRCodeSVG } from "qrcode.react"

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
   BRAND NAME
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
        <linearGradient
          id="new-card-brand-gradient"
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
        fill="url(#new-card-brand-gradient)"
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
   CONTACT ROW
   ============================================================ */

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex h-[3.2mm] items-center gap-[1mm]">
      <div className="flex w-[4mm] shrink-0 items-center justify-center">
        {icon}
      </div>

      <span className="font-sans text-[1.5mm] leading-none font-medium whitespace-nowrap text-[#24141A]">
        {text}
      </span>
    </div>
  )
}

/* ============================================================
   SOCIAL
   ============================================================ */

function SocialItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-[1mm]">
      <div className="flex w-[4mm] shrink-0 items-center justify-center">
        {icon}
      </div>

      <span className="font-sans text-[1.5mm] leading-none font-medium whitespace-nowrap text-[#24141A]">
        {text}
      </span>
    </div>
  )
}

/* ============================================================
   PAGE
   ============================================================ */

export default function BusinessCardPrintPage() {
  return (
    <>
      <PrintTrigger />

      <style jsx global>{`
        @page {
          size: 90mm 55mm;
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
          background: #eee7df;
        }

        #printable-area.new-business-card-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          padding: 36px;
          background: #eee7df;
        }

        .new-business-card {
          position: relative;
          width: 90mm;
          height: 55mm;
          min-width: 90mm;
          min-height: 55mm;
          max-width: 90mm;
          max-height: 55mm;
          overflow: hidden;
        }

        @media print {
          html,
          body {
            background: white;
          }

          #printable-area.new-business-card-document {
            width: 90mm;
            padding: 0;
            gap: 0;
            background: white;
          }

          .new-business-card {
            width: 90mm;
            height: 55mm;
            min-width: 90mm;
            min-height: 55mm;
            max-width: 90mm;
            max-height: 55mm;
            box-shadow: none !important;
            border-radius: 0 !important;
            break-after: page;
            page-break-after: always;
          }

          .new-business-card:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      <main id="printable-area" className="new-business-card-document">
        {/* ======================================================
            FRONT
            ====================================================== */}

        <section
          className="new-business-card shadow-2xl"
          aria-label="Front of Thai Soulmate business card"
          style={{
            background:
              "linear-gradient(135deg, #5A0816 0%, #741128 48%, #3D0710 100%)",
          }}
        >
          {/* Decorative glow */}

          <div className="absolute top-[-25mm] right-[-20mm] h-[60mm] w-[60mm] rounded-full bg-[#D3A753]/10" />

          <div className="absolute bottom-[-28mm] left-[-22mm] h-[65mm] w-[65mm] rounded-full bg-[#CA617D]/10" />

          {/* ====================================================
              FULL GRADIENT EDGES
              ==================================================== */}

          {/* Top */}
          <div className="absolute top-0 right-0 left-0 h-[1.3mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Bottom */}
          <div className="absolute right-0 bottom-0 left-0 h-[1.3mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Left */}
          <div className="absolute top-0 bottom-0 left-0 w-[1.3mm] bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Right */}
          <div className="absolute top-0 right-0 bottom-0 w-[1.3mm] bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* ====================================================
              MAIN CONTENT
              ==================================================== */}

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <Image
              src="/logo.png"
              alt="Thai Soulmate"
              width={180}
              height={180}
              priority
              quality={100}
              unoptimized
              className="h-[18mm] w-[18mm] object-contain"
            />

            <BrandName className="mt-[1mm] w-[47mm]" />

            <p className="mt-[1mm] font-sans text-[1.75mm] font-semibold tracking-[0.24em] text-[#D3A753] uppercase">
              1-2-1 Matchmaking Service
            </p>

            {/* Divider */}

            <div className="mt-[3mm] flex items-center gap-[2mm]">
              <div className="h-px w-[14mm] bg-gradient-to-r from-transparent to-[#D3A753]" />

              <Heart
                size={8}
                fill="#D3A753"
                color="#D3A753"
                strokeWidth={1.5}
              />

              <div className="h-px w-[14mm] bg-gradient-to-l from-transparent to-[#D3A753]" />
            </div>

            <p className="mt-[2.5mm] max-w-[62mm] font-serif text-[2.6mm] leading-[1.35] text-white italic">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
        </section>

        {/* ======================================================
            BACK
            ====================================================== */}

        <section
          className="new-business-card bg-[#FBF8F3] shadow-2xl"
          aria-label="Back of Thai Soulmate business card"
        >
          {/* ====================================================
              FULL GRADIENT EDGES
              ==================================================== */}

          {/* Top */}
          <div className="absolute top-0 right-0 left-0 h-[1.3mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Bottom */}
          <div className="absolute right-0 bottom-0 left-0 h-[1.3mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Left */}
          <div className="absolute top-0 bottom-0 left-0 w-[1.3mm] bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Right */}
          <div className="absolute top-0 right-0 bottom-0 w-[1.3mm] bg-gradient-to-b from-[#D3A753] via-[#E791A7] to-[#CA617D]" />

          {/* Decorative background */}

          <div className="absolute top-[-18mm] right-[-15mm] h-[45mm] w-[45mm] rounded-full bg-[#D3A753]/7" />

          <div className="absolute bottom-[-20mm] left-[-18mm] h-[50mm] w-[50mm] rounded-full bg-[#CA617D]/5" />

          {/* ====================================================
              CONTENT
              ==================================================== */}

          <div className="relative z-10 flex h-full p-[5mm]">
            {/* ==================================================
                LEFT BRAND PANEL
                ================================================== */}

            <div className="flex w-[33mm] shrink-0 flex-col items-center justify-center border-r border-[#D3A753]/30 pr-[3.5mm]">
              <Image
                src="/logo.png"
                alt="Thai Soulmate"
                width={150}
                height={150}
                quality={100}
                unoptimized
                className="h-[13mm] w-[13mm] object-contain"
              />

              <BrandName className="mt-[1.5mm] w-[29mm]" />

              <p className="mt-[0.8mm] text-center font-sans text-[1.35mm] font-semibold tracking-[0.16em] text-[#CA617D] uppercase">
                1-2-1 Matchmaking
              </p>

              {/* Internal divider */}

              <div className="mt-[2.5mm] flex items-center gap-[1.5mm]">
                <span className="h-px w-[5mm] bg-[#D3A753]" />

                <Heart
                  size={7}
                  fill="#CA617D"
                  color="#CA617D"
                  strokeWidth={1.5}
                />

                <span className="h-px w-[5mm] bg-[#D3A753]" />
              </div>

              <p className="mt-[2.5mm] text-center font-serif text-[1.65mm] leading-[1.4] text-[#5A0816]/65 italic">
                Personal introductions.
                <br />
                Meaningful connections.
              </p>
            </div>

            {/* ==================================================
                RIGHT CONTACT PANEL
                ================================================== */}

            <div className="flex min-w-0 flex-1 flex-col pl-[3mm]">
              {/* Heading */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-[1.15mm] font-bold tracking-[0.18em] text-[#CA617D] uppercase">
                    Thai Soulmate
                  </p>

                  <h2 className="mt-[0.3mm] font-serif text-[3.5mm] leading-none text-[#5A0816]">
                    Connect with us.
                  </h2>
                </div>

                <Heart
                  size={10}
                  color="#D3A753"
                  fill="#D3A753"
                  strokeWidth={1.5}
                />
              </div>

              {/* Internal line */}

              <div className="mt-[1.2mm] h-px w-full bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-transparent" />

              {/* ==================================================
                  CONTACT INFORMATION
                  ================================================== */}

              <div className="mt-[1mm]">
                <div className="space-y-[0.3mm]">
                  <ContactRow
                    icon={<FaWhatsapp size={9} color="#25D366" />}
                    text={CONTACT.primaryPhone}
                  />

                  <ContactRow
                    icon={<Phone size={9} color="#1877F2" />}
                    text={CONTACT.primaryPhone}
                  />

                  <ContactRow
                    icon={<Phone size={9} color="#1877F2" />}
                    text={CONTACT.secondaryPhone}
                  />

                  <ContactRow
                    icon={<Mail size={9} color="#CA617D" />}
                    text={CONTACT.email}
                  />

                  <ContactRow
                    icon={<Globe size={9} color="#D3A753" />}
                    text={CONTACT.website}
                  />
                </div>
              </div>

              {/* ==================================================
                  QR CODES + SOCIAL
                  ================================================== */}

              <div className="mt-[1.5mm] border-t border-[#D3A753]/25 pt-[0.6mm]">
                {/* ==================================================
                    QR CODES — TOP
                    ================================================== */}

                <div className="flex items-start justify-center gap-[4mm] pt-[1.5mm]">
                  {/* WhatsApp QR */}

                  <div className="flex flex-col items-center">
                    <div className="rounded-[1mm] border border-[#D3A753]/35 bg-white p-[0.5mm]">
                      <div className="relative">
                        <QRCodeSVG
                          value={CONTACT.whatsapp}
                          level="H"
                          marginSize={1}
                          className="block h-[9mm] w-[9mm]"
                        />

                        <div className="absolute top-1/2 left-1/2 flex h-[3mm] w-[3mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                          <FaWhatsapp size={8} color="#25D366" />
                        </div>
                      </div>
                    </div>

                    <span className="mt-[0.3mm] font-sans text-[1.5mm] leading-none font-medium text-[#24141A]">
                      WhatsApp
                    </span>
                  </div>

                  {/* Website QR */}

                  <div className="flex flex-col items-center">
                    <div className="rounded-[1mm] border border-[#D3A753]/35 bg-white p-[0.5mm]">
                      <div className="relative">
                        <QRCodeSVG
                          value={CONTACT.website}
                          level="H"
                          marginSize={1}
                          className="block h-[9mm] w-[9mm]"
                        />

                        {/* Logo inside Website QR */}
                        <div className="absolute top-1/2 left-1/2 flex h-[3mm] w-[3mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                          <Image
                            src="/logo.png"
                            alt="Thai Soulmate"
                            width={30}
                            height={30}
                            quality={100}
                            unoptimized
                            className="h-full w-full rounded-full object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <span className="mt-[0.3mm] font-sans text-[1.5mm] leading-none font-medium text-[#24141A]">
                      Website
                    </span>
                  </div>
                </div>

                {/* ==================================================
    SOCIAL — BOTTOM CENTER
    ================================================== */}

                <div className="absolute right-[3mm] bottom-[1.8mm] left-[3mm] flex items-center justify-center gap-[2.5mm] border-t border-[#D3A753]/20 pt-[0.6mm]">
                  <SocialItem
                    icon={<FaFacebook size={9} color="#1877F2" />}
                    text="@thaisoulmates"
                  />

                  <SocialItem
                    icon={<FaInstagram size={9} color="#E4405F" />}
                    text="@thaisoulmate"
                  />

                  <SocialItem
                    icon={<FaTiktok size={9} color="#000000" />}
                    text="@thaisoulmate"
                  />

                  <SocialItem
                    icon={<FaLine size={9} color="#00C300" />}
                    text="@thaisoulmate"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
