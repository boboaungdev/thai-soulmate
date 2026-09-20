"use client"

import Image from "next/image"
import { Globe, Heart, MapPin, ShieldCheck } from "lucide-react"
import { useEffect } from "react"

import { APP_INFO } from "@/constants"

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
  size = "front",
  className = "",
}: {
  size?: "front" | "back"
  className?: string
}) {
  return (
    <span
      className={`block leading-none font-black tracking-tight uppercase no-underline ${
        size === "back" ? "text-[11mm]" : "text-[8mm]"
      } ${className}`}
      style={{
        background: "linear-gradient(to right, #D3A753, #E791A7, #CA617D)",
        backgroundSize: "100% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        textDecoration: "none",
      }}
    >
      {APP_INFO.name}
    </span>
  )
}

function PrimaryTagline({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-[4.5mm] font-semibold tracking-[0.18em] text-[#D3A753] uppercase ${className}`}
    >
      {APP_INFO.tagline}
    </p>
  )
}

function ExclusiveLabel({
  withLines = false,
  className = "",
}: {
  withLines?: boolean
  className?: string
}) {
  return (
    <p
      className={
        withLines
          ? `inline-flex items-center gap-[2mm] text-[4mm] font-semibold tracking-[0.35em] text-[#CA617D] uppercase ${className}`
          : `text-[4mm] font-semibold tracking-[0.35em] text-[#CA617D] uppercase ${className}`
      }
    >
      {withLines && <span className="h-px w-[7mm] bg-[#CA617D]/70" />}
      Exclusive
      {withLines && <span className="h-px w-[7mm] bg-[#CA617D]/70" />}
    </p>
  )
}

function PrintPage({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="shirt-print-sheet relative flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-white shadow-2xl print:shadow-none"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <div className="relative z-10 flex h-full flex-col px-[18mm] py-[18mm]">
        {children}
      </div>
    </section>
  )
}

export default function ShirtPrintPage() {
  const secondaryTagline = APP_INFO.secondaryTagline
    .replaceAll("\n", " ")
    .split(". ")
    .map((line) => line.replace(/\.$/, ""))

  return (
    <main className="min-h-screen bg-background py-8 print:bg-white print:p-0">
      <PrintTrigger />

      <div className="mx-auto w-[210mm] print:mx-0">
        <PrintPage>
          <header className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative h-[40mm] w-[40mm] shrink-0">
              <Image
                src="/logo.png"
                alt={`${APP_INFO.name} logo`}
                fill
                priority
                sizes="40mm"
                className="object-contain"
              />
            </div>

            <div className="mt-[6mm] flex flex-col items-center justify-center text-center">
              <BrandName size="front" />
              <div className="mt-[2.5mm]">
                <ExclusiveLabel withLines className="text-[3mm]" />
              </div>
              <div className="mt-[1.5mm]">
                <PrimaryTagline className="text-[4mm]" />
              </div>
            </div>
          </header>
        </PrintPage>

        <div aria-hidden="true" className="h-8 print:h-0" />

        <PrintPage>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative h-[78mm] w-[78mm]">
              <Image
                src="/logo.png"
                alt={`${APP_INFO.name} logo`}
                fill
                priority
                sizes="78mm"
                className="object-contain drop-shadow-[0_5mm_7mm_rgba(90,8,22,0.18)]"
              />
            </div>

            <div className="mt-[12mm] flex flex-col items-center">
              <BrandName size="back" />
              <div className="mt-[3mm]">
                <ExclusiveLabel withLines className="text-[5.5mm]" />
              </div>
              <div className="mt-[2mm]">
                <PrimaryTagline className="text-[5.6mm]" />
              </div>
              <div className="mt-[6mm] flex w-max max-w-none flex-nowrap items-center justify-center gap-[2.5mm]">
                {secondaryTagline.map((line, lineIndex) => {
                  const Icon = [ShieldCheck, Heart, MapPin][lineIndex]

                  return (
                    <p
                      key={line}
                      className="inline-flex items-center gap-[1.5mm] rounded-full border border-[#C08F32] bg-[#D3A753] px-[4mm] py-[2mm] text-[3.5mm] leading-none font-bold tracking-[0.06em] whitespace-nowrap text-white"
                    >
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          className="h-[3.8mm] w-[3.8mm] shrink-0 text-white"
                        />
                      )}
                      {line}
                    </p>
                  )
                })}
              </div>

              <div className="mt-[8mm] flex items-center gap-[2.5mm] text-[#D3A753]">
                <Globe
                  aria-hidden="true"
                  className="h-[7.2mm] w-[7.2mm]"
                  strokeWidth={2}
                />
                <p className="text-[7.2mm] font-semibold tracking-[0.12em]">
                  thaisoulmate.org
                </p>
              </div>
            </div>
          </div>
        </PrintPage>
      </div>

      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 210mm;
            margin: 0;
            padding: 0;
            background: white;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .shirt-print-sheet {
            display: flex;
            visibility: visible;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .shirt-print-sheet * {
            visibility: visible;
          }

          .h-8 {
            break-before: page;
            page-break-before: always;
          }
        }
      `}</style>
    </main>
  )
}
