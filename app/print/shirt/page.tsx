"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Heart, MapPin, ShieldCheck } from "lucide-react"

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
  size = "nav",
  className = "",
}: {
  size?: "nav" | "hero"
  className?: string
}) {
  return (
    <span
      className={`block leading-none font-black tracking-tight uppercase no-underline ${
        size === "hero" ? "text-[13mm]" : "text-[8mm]"
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

function PrimaryTagline() {
  return (
    <p className="text-[4.5mm] font-semibold tracking-[0.18em] text-[#D3A753] uppercase">
      {APP_INFO.tagline}
    </p>
  )
}

function ExclusiveLabel({ withLines = false }: { withLines?: boolean }) {
  return (
    <p
      className={
        withLines
          ? "inline-flex items-center gap-[2mm] text-[4mm] font-semibold tracking-[0.35em] text-[#CA617D] uppercase"
          : "text-[4mm] font-semibold tracking-[0.35em] text-[#CA617D] uppercase"
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
            <div className="relative h-[34mm] w-[34mm] shrink-0">
              <Image
                src="/logo.png"
                alt={`${APP_INFO.name} logo`}
                fill
                priority
                sizes="34mm"
                className="object-contain"
              />
            </div>

            <div className="mt-[6mm] flex flex-col items-center justify-center text-center">
              <BrandName size="nav" />
              <div className="mt-[2.5mm]">
                <ExclusiveLabel withLines />
              </div>
              <div className="mt-[1.5mm]">
                <PrimaryTagline />
              </div>
            </div>
          </header>
        </PrintPage>

        <div aria-hidden="true" className="h-8 print:h-0" />

        <PrintPage>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative h-[63mm] w-[63mm]">
              <Image
                src="/logo.png"
                alt={`${APP_INFO.name} logo`}
                fill
                priority
                sizes="63mm"
                className="object-contain drop-shadow-[0_5mm_7mm_rgba(90,8,22,0.18)]"
              />
            </div>

            <div className="mt-[13mm] flex flex-col items-center">
              <BrandName size="nav" />
              <div className="mt-[3mm]">
                <ExclusiveLabel withLines />
              </div>
              <div className="mt-[2mm]">
                <PrimaryTagline />
              </div>
              <div className="mt-[8mm] flex w-max max-w-none flex-nowrap items-center justify-center gap-[2mm]">
                {secondaryTagline.map((line, lineIndex) => {
                  const Icon = [ShieldCheck, Heart, MapPin][lineIndex]

                  return (
                    <p
                      key={line}
                      className="inline-flex items-center gap-[1.5mm] rounded-full border border-[#C08F32] bg-[#D3A753] px-[4mm] py-[2mm] text-[3.3mm] leading-none font-bold tracking-[0.06em] whitespace-nowrap text-white"
                    >
                      <Icon className="size-[3.5mm] text-white" />
                      {line}
                    </p>
                  )
                })}
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
