import Image from "next/image"
import { Phone, Mail, Globe } from "lucide-react"

import {
  FaFacebook,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa"

const APP_INFO = {
  name: "Thai Soulmate",
  tagline: "1-2-1 Matchmaking Service",
  secondaryTagline:
    "Real People. Real Relationships.\nPersonally Matched in Thailand.",
  companyName: "thaisoulmate.org",
} as const

const CONTACT = {
  email: "contact@thaisoulmate.org",
  primaryPhone: "+66 6369 15263",
  secondaryPhone: "+66 6369 15264",
  website: "thaisoulmate.org",
} as const

export default function CardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3EEE7] p-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* FRONT CARD */}
        <section className="relative aspect-[1.75/1] overflow-hidden rounded-[28px] shadow-2xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5A0816] via-[#741128] to-[#3F0510]" />

          {/* Texture */}
          <div className="absolute inset-0 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

          {/* Gold border */}
          <div className="absolute inset-3 rounded-[22px] border border-[#D3A753]/30" />

          <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
            <Image
              src="/logo.png"
              alt="Thai Soulmate"
              width={170}
              height={170}
              priority
              className="mb-6"
            />

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

            <p className="mt-3 text-sm tracking-[0.35em] text-[#D3A753] uppercase md:text-base">
              {APP_INFO.tagline}
            </p>

            <div className="my-6 flex w-full max-w-md items-center gap-3">
              <div className="h-px flex-1 bg-[#D3A753]/40" />
              <div className="h-3 w-3 rotate-45 bg-[#D3A753]" />
              <div className="h-px flex-1 bg-[#D3A753]/40" />
            </div>

            <p className="text-lg leading-8 whitespace-pre-line text-white italic">
              {APP_INFO.secondaryTagline}
            </p>
          </div>
        </section>

        {/* BACK CARD */}
        <section className="relative aspect-[1.75/1] overflow-hidden rounded-[28px] bg-[#FBF8F3] shadow-2xl">
          {/* Decorative waves */}
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
            {/* Left */}
            <div className="relative flex flex-col items-center justify-center pr-6">
              <div className="absolute top-1/2 right-0 h-80 w-px -translate-y-1/2 bg-[#D3A753]/40" />{" "}
              <Image src="/logo.png" alt="Logo" width={135} height={135} />
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
              <p className="mt-2 text-center text-xs font-semibold tracking-[0.28em] text-[#CA617D] uppercase">
                1-2-1 Matchmaking Service
              </p>
              <div className="mt-5 flex items-center gap-3 text-[#CA617D]">
                <div className="h-px w-10 bg-[#D3A753]" />
                ♥
                <div className="h-px w-10 bg-[#D3A753]" />
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col justify-center pl-8 text-[15px]">
              <Info
                icon={<FaWhatsapp size={18} color="#25D366" />}
                text={CONTACT.primaryPhone}
              />

              <Info
                icon={<Phone size={18} color="#1877F2" />}
                text={CONTACT.primaryPhone}
              />

              <Info
                icon={<Phone size={18} color="#1877F2" />}
                text={CONTACT.secondaryPhone}
              />

              <Info
                icon={<Mail size={18} color="#EA4335" />}
                text={CONTACT.email}
              />

              <Info
                icon={<Globe size={18} color="#D3A753" />}
                text={CONTACT.website}
              />

              <div className="my-4 h-px bg-[#D3A753]/30" />

              <Info
                icon={<FaFacebook size={18} color="#1877F2" />}
                text="@thaisoulmates"
              />

              <Info
                icon={<FaInstagram size={18} color="#E4405F" />}
                text="@thaisoulmate"
              />
              <Info
                icon={<FaTiktok size={18} color="#000000" />}
                text="@thaisoulmate"
              />

              <Info
                icon={<FaLine size={18} color="#00C300" />}
                text="@thaisoulmate"
              />
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
      <div className="flex w-6 justify-center text-[#B78D46]">{icon}</div>
      <div className="flex items-center gap-2">
        {label && (
          <span className="text-xs font-semibold tracking-wide text-[#CA617D] uppercase">
            {label}
          </span>
        )}
        <span className="font-medium text-gray-800">{text}</span>
      </div>
    </div>
  )
}
