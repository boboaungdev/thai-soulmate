"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Globe, Mail, Phone } from "lucide-react"
import { FaFacebookF, FaInstagram, FaLine, FaWhatsapp } from "react-icons/fa"

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
    <div className="flex items-center gap-[3mm]">
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
      <div className="leading-none">
        <p
          className="font-sans text-[6mm] font-bold"
          style={{ color: light ? "#ffffff" : "#241e2a" }}
        >
          {APP_INFO.name}
        </p>
        <p
          className="mt-[1.5mm] font-sans text-[2.2mm] font-bold tracking-[0.08em]"
          style={{ color: light ? "#cfa14f" : "#cb5d7a" }}
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
          <div className="absolute top-0 right-0 h-[55mm] w-[30mm] border-l-[1.5mm] border-[#cb5d7a]" />
          <div className="absolute right-[8mm] bottom-[-16mm] h-[34mm] w-[34mm] rounded-full border-[1mm] border-[#cfa14f]" />
          <div className="relative z-10">
            <BrandMark light />
          </div>
          <div className="relative z-10 max-w-[62mm]">
            <p className="font-serif text-[5mm] leading-[1.05] text-white">
              Meaningful introductions.
            </p>
            <p className="mt-[2mm] font-sans text-[2.2mm] font-bold tracking-[0.12em] text-[#cfa14f] uppercase">
              Personal matchmaking in Thailand
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
          <div className="grid grid-cols-2 gap-x-[5mm] gap-y-[1.5mm] font-sans text-[2.1mm] font-semibold text-[#241e2a]">
            <p className="flex items-center gap-[1.5mm]">
              <FaWhatsapp className="text-[#cb5d7a]" />
              +66 6369 15263
            </p>
            <p className="flex items-center gap-[1.5mm]">
              <Phone size={9} color="#cb5d7a" />
              +66 6369 15264
            </p>
            <p className="flex items-center gap-[1.5mm]">
              <Mail size={9} color="#cb5d7a" />
              {CONTACT.email}
            </p>
            <p className="flex items-center gap-[1.5mm]">
              <Globe size={9} color="#cb5d7a" />
              thaisoulmate.org
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-[#cb5d7a]/25 pt-[2.5mm]">
            <div className="flex items-center gap-[2mm] text-[#cb5d7a]">
              <FaFacebookF size={11} />
              <FaInstagram size={11} />
              <FaLine size={11} />
              <span className="font-sans text-[2mm] font-bold text-[#241e2a]">
                @thaisoulmate
              </span>
            </div>
            <p className="font-sans text-[2mm] font-bold tracking-[0.08em] text-[#cfa14f] uppercase">
              thaisoulmate.org
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
