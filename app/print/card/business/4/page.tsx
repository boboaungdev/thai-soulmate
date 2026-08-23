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
          id="business-card-brand-gradient"
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
        fill="url(#business-card-brand-gradient)"
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

function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-[1.2mm] py-[0.35mm]">
      <div className="flex w-[4mm] shrink-0 justify-center">{icon}</div>

      <span className="font-sans text-[1.9mm] font-medium whitespace-nowrap text-[#241e2a]">
        {text}
      </span>
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

        html,
        body {
          margin: 0;
          padding: 0;
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
          background: #f3eee7;
          box-sizing: border-box;
        }

        @media print {
          #printable-area.business-card-document {
            display: flex;
            width: 90mm;
            margin: 0;
            padding: 0;
            gap: 0;
            background: white;
          }

          #printable-area.business-card-document .business-card-side {
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

          #printable-area.business-card-document
            .business-card-side:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      <main id="printable-area" className="business-card-document">
        {/* ====================================================== */}
        {/* FRONT CARD */}
        {/* ====================================================== */}

        <section
          className="business-card-side relative flex h-[55mm] w-[90mm] flex-col items-center justify-center overflow-hidden rounded-[28px] shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #5A0816 0%, #741128 50%, #3F0510 100%)",
          }}
          aria-label="Front of Thai Soulmate business card"
        >
          {/* Texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Gold Border */}
          <div className="absolute inset-[2mm] rounded-[5mm] border border-[#D3A753]/30" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo */}
            <Image
              src="/logo.png"
              alt="Thai Soulmate"
              width={170}
              height={170}
              priority
              quality={100}
              unoptimized
              className="mb-[1.5mm] h-[22mm] w-[22mm] object-contain"
            />

            {/* Brand */}
            <BrandName className="w-[48mm]" />

            {/* Tagline */}
            <p className="mt-[0.7mm] font-sans text-[2.2mm] font-semibold tracking-[0.25em] text-[#D3A753] uppercase">
              {APP_INFO.tagline}
            </p>

            {/* Heart Divider */}
            <div className="my-[2mm] flex w-[55mm] items-center gap-[2mm]">
              <div className="h-px flex-1 bg-[#D3A753]/40" />

              <Heart
                size={11}
                fill="#D3A753"
                color="#D3A753"
                strokeWidth={1.5}
              />

              <div className="h-px flex-1 bg-[#D3A753]/40" />
            </div>

            {/* Secondary Tagline */}
            <p className="max-w-[58mm] font-sans text-[2.1mm] leading-[1.4] whitespace-pre-line text-white italic">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
        </section>

        {/* ====================================================== */}
        {/* BACK CARD */}
        {/* ====================================================== */}

        <section
          className="business-card-side relative h-[55mm] w-[90mm] overflow-hidden rounded-[28px] bg-[#FBF8F3] shadow-2xl"
          aria-label="Back of Thai Soulmate business card"
        >
          {/* Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 flex h-[8mm] items-center justify-center bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]">
            <div className="flex items-center gap-[4mm] font-sans text-[1.7mm] font-semibold tracking-[0.2em] text-white uppercase">
              <span>Exclusive</span>
              <span className="text-white/80">•</span>
              <span>Personal</span>
              <span className="text-white/80">•</span>
              <span>Professional</span>
            </div>
          </div>

          {/* Main Grid */}
          <div className="relative grid h-full grid-cols-[42%_58%] p-[5mm]">
            {/* ================================================== */}
            {/* LEFT SIDE */}
            {/* ================================================== */}

            <div className="relative flex flex-col items-center justify-center pr-[4mm]">
              {/* Vertical Divider */}
              <div className="absolute top-1/2 right-0 h-[38mm] w-px -translate-y-1/2 bg-[#D3A753]/40" />

              {/* Logo */}
              <Image
                src="/logo.png"
                alt="Thai Soulmate"
                width={135}
                height={135}
                quality={100}
                unoptimized
                className="h-[16mm] w-[16mm] object-contain"
              />

              {/* Brand */}
              <BrandName className="mt-[2mm] w-[30mm]" />

              {/* Service */}
              <p className="mt-[1mm] text-center font-sans text-[1.6mm] font-semibold tracking-[0.18em] text-[#CA617D] uppercase">
                1-2-1 Matchmaking Service
              </p>

              {/* Heart Decoration */}
              <div className="mt-[2.5mm] flex items-center gap-[2mm] text-[#CA617D]">
                <div className="h-px w-[8mm] bg-[#D3A753]" />

                <Heart
                  size={9}
                  fill="#CA617D"
                  color="#CA617D"
                  strokeWidth={1.5}
                />

                <div className="h-px w-[8mm] bg-[#D3A753]" />
              </div>
            </div>

            {/* ================================================== */}
            {/* RIGHT SIDE */}
            {/* ================================================== */}

            <div className="flex h-full flex-col pl-[4mm]">
              {/* Contact Title */}
              <div className="mb-[1.5mm]">
                <svg
                  aria-label="Connect with us"
                  className="block h-auto w-[30mm]"
                  role="img"
                  viewBox="0 0 220 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="connect-title-gradient"
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
                    x="110"
                    y="21"
                    fill="url(#connect-title-gradient)"
                    fontFamily="sans-serif"
                    fontSize="16"
                    fontWeight="700"
                    letterSpacing="2"
                    textAnchor="middle"
                  >
                    CONNECT WITH US
                  </text>
                </svg>

                <div className="mt-[0.5mm] h-px w-[30mm] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />
              </div>

              {/* Contact + QR */}
              <div className="flex min-h-0 flex-1">
                {/* CONTACT + SOCIAL */}
                <div className="flex min-w-0 flex-1 flex-col">
                  {/* WhatsApp */}
                  <Info
                    icon={<FaWhatsapp size={10} color="#25D366" />}
                    text={CONTACT.primaryPhone}
                  />

                  {/* Phone */}
                  <Info
                    icon={<Phone size={10} color="#1877F2" />}
                    text={`${CONTACT.primaryPhone} / ${CONTACT.secondaryPhone}`}
                  />

                  {/* Email */}
                  <Info
                    icon={<Mail size={10} color="#EA4335" />}
                    text={CONTACT.email}
                  />

                  {/* Website */}
                  <Info
                    icon={<Globe size={10} color="#D3A753" />}
                    text={CONTACT.website}
                  />

                  {/* Divider */}
                  <div className="my-[1mm] h-px w-full bg-[#D3A753]/30" />

                  {/* Facebook */}
                  <Info
                    icon={<FaFacebook size={10} color="#1877F2" />}
                    text="@thaisoulmates"
                  />

                  {/* Instagram */}
                  <Info
                    icon={<FaInstagram size={10} color="#E4405F" />}
                    text="@thaisoulmate"
                  />

                  {/* TikTok */}
                  <Info
                    icon={<FaTiktok size={10} color="#000000" />}
                    text="@thaisoulmate"
                  />

                  {/* LINE */}
                  <Info
                    icon={<FaLine size={10} color="#00C300" />}
                    text="@thaisoulmate"
                  />
                </div>

                {/* ================================================== */}
                {/* QR CODES BESIDE SOCIAL */}
                {/* ================================================== */}

                {/* ================================================== */}
                {/* WHATSAPP QR BESIDE SOCIAL */}
                {/* ================================================== */}

                <div className="ml-[3mm] flex shrink-0 items-center pt-[13mm]">
                  {/* WhatsApp QR */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-2 rounded-[2mm] border border-[#D3A753]/40 bg-white p-[1mm] shadow-sm">
                      <QRCodeSVG
                        value={CONTACT.whatsapp}
                        level="H"
                        marginSize={4}
                        className="block h-[15mm] w-[15mm]"
                      />

                      {/* WhatsApp Logo */}
                      <div className="absolute top-1/2 left-1/2 flex h-[4.5mm] w-[4.5mm] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white shadow-sm">
                        <FaWhatsapp size={11} color="#25D366" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
