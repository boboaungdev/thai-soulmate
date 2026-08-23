import Image from "next/image"
import { Phone, Mail, Globe, Heart } from "lucide-react"

import {
  FaFacebook,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"
import { QRCodeSVG } from "qrcode.react"

const APP_INFO = {
  name: "Thai Soulmate",
  tagline: "1-2-1 Matchmaking Service",
  secondaryTagline:
    "Real People. Real Relationships.\nPersonally Matched in Thailand.",
} as const

const CONTACT = {
  email: "contact@thaisoulmate.org",
  primaryPhone: "+66 6369 15263",
  secondaryPhone: "+66 6369 15264",
  website: "thaisoulmate.org",
  whatsapp: "https://wa.me/66636915263",
  websiteUrl: "https://thaisoulmate.org",
} as const

export default function CardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3EEE7] p-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* ====================================================== */}
        {/* FRONT CARD */}
        {/* ====================================================== */}

        <section className="relative aspect-[1.75/1] overflow-hidden rounded-[28px] shadow-2xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5A0816] via-[#741128] to-[#3F0510]" />

          {/* Texture */}
          <div className="absolute inset-0 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

          {/* Gold border */}
          <div className="absolute inset-3 rounded-[22px] border border-[#D3A753]/30" />

          <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
            {/* Logo */}
            <Image
              src="/logo.png"
              alt="Thai Soulmate"
              width={170}
              height={170}
              quality={100}
              priority
              className="mb-6"
            />

            {/* Brand Name */}
            <svg
              aria-label={APP_INFO.name}
              className="block h-auto w-[420px] max-w-full"
              role="img"
              viewBox="0 0 180 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="thai-soulmate-brand-gradient"
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
                fill="url(#thai-soulmate-brand-gradient)"
                fontFamily="sans-serif"
                fontSize="18"
                fontWeight="700"
                letterSpacing="1"
                textAnchor="middle"
              >
                {APP_INFO.name}
              </text>
            </svg>

            {/* Tagline */}
            <p className="mt-3 text-sm tracking-[0.35em] text-[#D3A753] uppercase md:text-base">
              {APP_INFO.tagline}
            </p>

            {/* Heart Divider */}
            <div className="my-6 flex w-full max-w-md items-center gap-3">
              <div className="h-px flex-1 bg-[#D3A753]/40" />

              <Heart
                size={16}
                fill="#D3A753"
                color="#D3A753"
                strokeWidth={1.5}
              />

              <div className="h-px flex-1 bg-[#D3A753]/40" />
            </div>

            {/* Secondary Tagline */}
            <p className="text-lg leading-8 whitespace-pre-line text-white italic">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
        </section>

        {/* ====================================================== */}
        {/* BACK CARD */}
        {/* ====================================================== */}

        <section className="relative aspect-[1.75/1] overflow-hidden rounded-[28px] bg-[#FBF8F3] shadow-2xl">
          {/* Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 flex h-28 items-center justify-center bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]">
            <div className="flex items-center gap-15 text-sm font-semibold tracking-[0.3em] text-white uppercase md:text-base">
              <span>Exclusive</span>

              <span className="text-white/80">•</span>

              <span>Personal</span>

              <span className="text-white/80">•</span>

              <span>Professional</span>
            </div>
          </div>

          <div className="relative grid h-full grid-cols-[42%_58%] p-8">
            {/* ================================================== */}
            {/* LEFT SIDE */}
            {/* ================================================== */}

            <div className="relative flex flex-col items-center justify-center pr-6">
              {/* Vertical Divider */}
              <div className="absolute top-1/2 right-0 h-80 w-px -translate-y-1/2 bg-[#D3A753]/40" />

              {/* Logo */}
              <Image
                src="/logo.png"
                alt="Thai Soulmate"
                width={135}
                height={135}
                quality={100}
              />

              {/* Brand Name */}
              <svg
                aria-label={APP_INFO.name}
                className="mt-4 block h-auto w-[240px] max-w-full"
                role="img"
                viewBox="0 0 180 28"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="thai-soulmate-back-gradient"
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
                  fill="url(#thai-soulmate-back-gradient)"
                  fontFamily="sans-serif"
                  fontSize="18"
                  fontWeight="700"
                  letterSpacing="1"
                  textAnchor="middle"
                >
                  {APP_INFO.name}
                </text>
              </svg>

              {/* Service */}
              <p className="mt-2 text-center text-xs font-semibold tracking-[0.28em] text-[#CA617D] uppercase">
                1-2-1 Matchmaking Service
              </p>

              {/* Heart Decoration */}
              <div className="mt-5 flex items-center gap-3 text-[#CA617D]">
                <div className="h-px w-10 bg-[#D3A753]" />
                ♥
                <div className="h-px w-10 bg-[#D3A753]" />
              </div>
            </div>

            {/* ================================================== */}
            {/* RIGHT SIDE */}
            {/* ================================================== */}

            {/* ================================================== */}
            {/* RIGHT SIDE */}
            {/* ================================================== */}

            <div className="flex h-full flex-col pt-5 pl-8">
              {/* Contact Title */}
              <div className="mb-2">
                <svg
                  aria-label="Connect with us"
                  className="block h-auto w-[190px]"
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

                <div className="mt-1 h-px w-[190px] bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D]" />
              </div>

              {/* Contact + Social + QR */}
              <div className="flex min-h-0 flex-1 pt-1">
                {/* CONTACT + SOCIAL */}
                <div className="flex min-w-0 flex-1 flex-col text-[16px]">
                  {/* Contact */}
                  <Info
                    icon={<FaWhatsapp size={21} color="#25D366" />}
                    text={CONTACT.primaryPhone}
                  />

                  <Info
                    icon={<Phone size={21} color="#1877F2" />}
                    text={CONTACT.primaryPhone}
                  />

                  <Info
                    icon={<Phone size={21} color="#1877F2" />}
                    text={CONTACT.secondaryPhone}
                  />

                  <Info
                    icon={<Mail size={21} color="#EA4335" />}
                    text={CONTACT.email}
                  />

                  <Info
                    icon={<Globe size={21} color="#D3A753" />}
                    text={CONTACT.website}
                  />

                  {/* Divider */}
                  <div className="my-3 h-px w-full bg-[#D3A753]/30" />

                  {/* Social */}
                  <Info
                    icon={<FaFacebook size={21} color="#1877F2" />}
                    text="@thaisoulmates"
                  />

                  <Info
                    icon={<FaInstagram size={21} color="#E4405F" />}
                    text="@thaisoulmate"
                  />

                  <Info
                    icon={<FaTiktok size={21} color="#000000" />}
                    text="@thaisoulmate"
                  />

                  <Info
                    icon={<FaLine size={21} color="#00C300" />}
                    text="@thaisoulmate"
                  />
                </div>

                {/* QR CODES BESIDE SOCIAL */}
                <div className="ml-5 flex shrink-0 items-center pt-25">
                  <div className="flex items-center gap-6">
                    {/* WhatsApp QR */}
                    <div className="flex flex-col items-center">
                      <div className="relative rounded-xl border border-[#D3A753]/40 bg-white p-2 shadow-sm">
                        <QRCodeSVG
                          value={CONTACT.whatsapp}
                          level="H"
                          marginSize={4}
                          className="h-[82px] w-[82px]"
                        />

                        <div className="absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
                          <FaWhatsapp size={18} color="#25D366" />
                        </div>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#CA617D]">
                        <FaWhatsapp size={13} color="#25D366" />
                        <span>WhatsApp</span>
                      </div>
                    </div>

                    {/* Website QR */}
                    <div className="flex flex-col items-center">
                      <div className="relative rounded-xl border border-[#D3A753]/40 bg-white p-2 shadow-sm">
                        <QRCodeSVG
                          value={CONTACT.websiteUrl}
                          level="H"
                          marginSize={4}
                          className="h-[82px] w-[82px]"
                        />

                        {/* Logo in center */}
                        <div className="absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
                          <Image
                            src="/logo.png"
                            alt="Thai Soulmate"
                            width={28}
                            height={28}
                            quality={100}
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#CA617D]">
                        <Globe size={13} color="#D3A753" />
                        <span>Website</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Info({
  icon,
  text,
  label,
}: {
  icon: React.ReactNode
  text: string
  label?: string
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      {/* Icon */}
      <div className="flex w-7 shrink-0 justify-center">{icon}</div>

      {/* Text */}
      <div className="flex items-center gap-2">
        {label && (
          <span className="text-sm font-semibold tracking-wide text-[#CA617D] uppercase">
            {label}
          </span>
        )}

        <span className="font-medium text-gray-800">{text}</span>
      </div>
    </div>
  )
}
