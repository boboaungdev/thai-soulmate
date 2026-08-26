"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Heart, Globe } from "lucide-react"
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

      await new Promise((resolve) => setTimeout(resolve, 300))

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
          id="website-landscape-brand-gradient"
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
        fill="url(#website-landscape-brand-gradient)"
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
   PAGE
   ============================================================ */

export default function WebsiteQrPrintPage() {
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

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          background: #eee7df;
        }

        #printable-area.website-qr-document {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          width: 100%;
          padding: 36px;
          background: #eee7df;
        }

        .website-qr-card {
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
            width: 90mm;
            height: 55mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #printable-area.website-qr-document {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 90mm !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            background: white !important;
          }

          .website-qr-card {
            position: relative !important;
            display: block !important;
            width: 90mm !important;
            height: 55mm !important;
            min-width: 90mm !important;
            min-height: 55mm !important;
            max-width: 90mm !important;
            max-height: 55mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            break-after: auto !important;
            page-break-after: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          img,
          svg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <main id="printable-area" className="website-qr-document">
        <section
          className="website-qr-card shadow-2xl"
          aria-label="Website QR code card"
          style={{
            background:
              "linear-gradient(135deg, #5A0816 0%, #741128 48%, #3D0710 100%)",
          }}
        >
          {/* ====================================================
              DECORATIVE GLOW
              ==================================================== */}

          <div className="absolute top-[-25mm] right-[-20mm] h-[60mm] w-[60mm] rounded-full bg-[#D3A753]/10" />

          <div className="absolute bottom-[-28mm] left-[-22mm] h-[65mm] w-[65mm] rounded-full bg-[#CA617D]/10" />

          {/* ====================================================
              BORDER
              ==================================================== */}

          {/* TOP */}

          <div
            className="pointer-events-none absolute top-0 right-0 left-0 z-30 h-[1.3mm]"
            style={{
              background:
                "linear-gradient(to right, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
            }}
          />

          {/* RIGHT */}

          <div
            className="pointer-events-none absolute top-0 right-0 bottom-0 z-30 w-[1.3mm]"
            style={{
              background: "#CA617D",
            }}
          />

          {/* BOTTOM */}

          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 z-30 h-[1.3mm]"
            style={{
              background:
                "linear-gradient(to right, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
            }}
          />

          {/* LEFT */}

          <div
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-30 w-[1.3mm]"
            style={{
              background: "#D3A753",
            }}
          />

          {/* ====================================================
              MAIN CONTENT
              ==================================================== */}

          <div className="relative z-10 flex h-full items-center px-[6mm] py-[4mm]">
            {/* ==================================================
                LEFT BRAND SECTION
                ================================================== */}

            <div className="flex w-[42mm] flex-col items-center text-center">
              {/* LOGO */}

              <Image
                src="/logo.png"
                alt={APP_INFO.name}
                width={180}
                height={180}
                priority
                quality={100}
                unoptimized
                className="h-[13mm] w-[13mm] object-contain"
              />

              {/* APP NAME */}

              <BrandName className="mt-[0.5mm] w-[34mm]" />

              {/* EXCLUSIVE */}

              <p className="mt-[0.4mm] font-sans text-[1.45mm] font-semibold tracking-[0.3em] text-[#E791A7] uppercase">
                Exclusive
              </p>

              {/* SERVICE TAGLINE */}

              <p className="mt-[0.4mm] font-sans text-[1.55mm] font-semibold tracking-[0.15em] text-[#D3A753] uppercase">
                1-2-1 Matchmaking Service
              </p>

              {/* HEART DIVIDER */}

              <div className="mt-[1.3mm] flex items-center gap-[1.2mm]">
                <div
                  className="h-px w-[7mm]"
                  style={{
                    background:
                      "linear-gradient(to left, #D3A753, #E791A7, transparent)",
                  }}
                />

                <Heart
                  size={7}
                  fill="#D3A753"
                  color="#D3A753"
                  strokeWidth={1.5}
                />

                <div
                  className="h-px w-[7mm]"
                  style={{
                    background:
                      "linear-gradient(to right, #D3A753, #E791A7, transparent)",
                  }}
                />
              </div>

              {/* SECONDARY TAGLINE */}

              <p className="mt-[1.1mm] max-w-[36mm] font-serif text-[2.15mm] leading-[1.2] text-white italic">
                {APP_INFO.secondaryTagline}
              </p>
            </div>

            {/* ==================================================
                VERTICAL DIVIDER
                ================================================== */}

            <div
              className="mx-[3mm] h-[37mm] w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #D3A753 20%, #E791A7 50%, #CA617D 80%, transparent)",
              }}
            />

            {/* ==================================================
                RIGHT WEBSITE SECTION
                ================================================== */}

            <div className="flex flex-1 flex-col items-center">
              {/* TITLE */}

              <div className="flex items-center gap-[1.5mm]">
                <Globe
                  size={16}
                  color="#D3A753"
                  strokeWidth={2}
                />

                <span className="font-sans text-[3.5mm] font-bold text-white">
                  Website
                </span>
              </div>

              {/* DESCRIPTION */}

              <p className="mt-[0.4mm] font-sans text-[1.65mm] font-medium text-white/80">
                Scan to visit our website
              </p>

              {/* QR FRAME */}

              <div
                className="mt-[1.4mm] rounded-[1mm] p-[0.45mm]"
                style={{
                  background:
                    "linear-gradient(to right, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
                }}
              >
                <div className="relative rounded-[0.7mm] bg-white p-[0.8mm]">
                  <QRCodeSVG
                    value={CONTACT.website}
                    level="H"
                    marginSize={1}
                    className="block h-[24mm] w-[24mm]"
                  />

                  {/* CENTER LOGO */}

                  <div className="absolute top-1/2 left-1/2 flex h-[5.5mm] w-[5.5mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm border-[0.5mm] border-white bg-white">
                    <Image
                      src="/logo.png"
                      alt={APP_INFO.name}
                      width={40}
                      height={40}
                      quality={100}
                      unoptimized
                      className="h-full w-full rounded-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* WEBSITE */}

              <p className="mt-[1.8mm] max-w-[40mm] text-center font-sans text-[1.75mm] font-semibold leading-none text-white/90">
                {CONTACT.website}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}