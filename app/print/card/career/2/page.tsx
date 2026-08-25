"use client"

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Globe2,
  Heart,
  Mail,
  Sparkles,
  Users,
} from "lucide-react"
import Image from "next/image"

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-100 py-8 print:bg-white print:p-0">
      <div className="mx-auto w-[210mm] overflow-hidden bg-white shadow-2xl print:mx-0 print:shadow-none">
        <div
          className="relative flex min-h-[297mm] w-[210mm] flex-col overflow-hidden bg-white px-[16mm] py-[13mm]"
          style={{
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {/* BACKGROUND */}

          <div
            className="pointer-events-none absolute -top-[40mm] -right-[45mm] h-[145mm] w-[145mm] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, #E791A7 0%, #CA617D 38%, transparent 70%)",
            }}
          />

          <div
            className="pointer-events-none absolute -bottom-[55mm] -left-[48mm] h-[160mm] w-[160mm] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #D3A753 0%, #E791A7 38%, transparent 72%)",
            }}
          />

          {/* Decorative curves */}

          <div className="pointer-events-none absolute top-[42mm] -right-[30mm] h-[95mm] w-[112mm] rotate-[18deg] rounded-[48%] border border-[#D3A753]/25" />

          <div className="pointer-events-none absolute top-[47mm] -right-[34mm] h-[95mm] w-[112mm] rotate-[18deg] rounded-[48%] border border-[#CA617D]/20" />

          <div className="pointer-events-none absolute top-[52mm] -right-[38mm] h-[95mm] w-[112mm] rotate-[18deg] rounded-[48%] border border-[#D3A753]/15" />

          {/* CONTENT */}

          <div className="relative z-10 flex min-h-[271mm] flex-1 flex-col">
            {/* HEADER */}

            <header className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-[15mm] w-[15mm]">
                  <Image
                    src="/logo.png"
                    alt="Thai Soulmate"
                    fill
                    priority
                    sizes="15mm"
                    className="object-contain"
                  />
                </div>

                <div>
                  <div
                    className="text-[7.5mm] leading-none font-semibold tracking-[-0.04em]"
                    style={{
                      background:
                        "linear-gradient(90deg, #D3A753, #CA617D, #E791A7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Thai Soulmate
                  </div>

                  <div className="mt-[1mm] text-[2.1mm] font-medium tracking-[0.27em] text-neutral-500 uppercase">
                    1-2-1 Matchmaking Service
                  </div>
                </div>
              </div>

              <div className="rounded-full border border-[#D3A753]/30 bg-white/80 px-[4mm] py-[2mm] text-[2.3mm] font-semibold tracking-[0.2em] text-[#B78D46] uppercase">
                Career Opportunity
              </div>
            </header>

            {/* HERO */}

            <section className="mt-[18mm] max-w-[155mm]">
              <div className="mb-[4mm] inline-flex items-center gap-2 rounded-full bg-[#CA617D]/10 px-[4mm] py-[2mm] text-[2.5mm] font-semibold tracking-[0.24em] text-[#B78D46] uppercase">
                <Sparkles size={12} />
                We&apos;re Hiring
              </div>

              <h1 className="text-[17mm] leading-[0.88] font-semibold tracking-[-0.065em] text-[#242124]">
                Sales
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #D3A753, #CA617D, #E791A7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Person
                </span>
              </h1>

              <p className="mt-[7mm] max-w-[135mm] text-[4.1mm] leading-[1.55] text-neutral-600">
                Join Thai Soulmate and help people create meaningful, genuine
                relationships through personal matchmaking.
              </p>
            </section>

            {/* FEATURES */}

            <section className="mt-[10mm] grid grid-cols-3 gap-[3mm]">
              <Feature
                icon={<Users size={16} />}
                title="People First"
                text="Build genuine connections"
              />

              <Feature
                icon={<Globe2 size={16} />}
                title="Thailand"
                text="Work with local clients"
              />

              <Feature
                icon={<BriefcaseBusiness size={16} />}
                title="Growth"
                text="Develop your career"
              />
            </section>

            {/* INFORMATION CARD */}

            <section className="relative mt-[7mm] overflow-hidden rounded-[7mm] border border-[#D3A753]/20 bg-white/95 shadow-[0_15px_45px_rgba(120,70,70,0.09)]">
              <div
                className="absolute top-0 right-0 left-0 h-[1.2mm]"
                style={{
                  background:
                    "linear-gradient(90deg, #D3A753, #CA617D, #E791A7)",
                }}
              />

              <div className="grid grid-cols-[1.15fr_0.85fr] gap-[7mm] p-[7mm]">
                {/* LEFT */}

                <div>
                  <div className="text-[2.2mm] font-semibold tracking-[0.22em] text-[#B78D46] uppercase">
                    Position
                  </div>

                  <h2 className="mt-[1mm] text-[5mm] font-semibold tracking-[-0.035em] text-neutral-800">
                    What we&apos;re looking for
                  </h2>

                  <div className="mt-[5mm] space-y-[3.5mm]">
                    <Requirement>Thai female candidate</Requirement>

                    <Requirement>
                      Fluent in spoken and written English
                    </Requirement>

                    <Requirement>
                      Friendly, confident and professional personality
                    </Requirement>

                    <Requirement>
                      Strong communication and customer service skills
                    </Requirement>

                    <Requirement>
                      Sales-minded with a positive attitude
                    </Requirement>

                    <Requirement>
                      Comfortable working with people and building relationships
                    </Requirement>
                  </div>
                </div>

                {/* RIGHT */}

                <div className="rounded-[5mm] bg-gradient-to-br from-[#D3A753]/10 via-white to-[#CA617D]/10 p-[5mm]">
                  <div className="text-[2.2mm] font-semibold tracking-[0.22em] text-[#B78D46] uppercase">
                    Role
                  </div>

                  <h2 className="mt-[1mm] text-[5mm] font-semibold tracking-[-0.035em] text-neutral-800">
                    What you&apos;ll do
                  </h2>

                  <div className="mt-[5mm] space-y-[3.5mm]">
                    <SmallItem>Communicate with prospective clients</SmallItem>

                    <SmallItem>Introduce Thai Soulmate services</SmallItem>

                    <SmallItem>Understand client needs</SmallItem>

                    <SmallItem>Follow up with potential customers</SmallItem>

                    <SmallItem>Build long-term client relationships</SmallItem>
                  </div>
                </div>
              </div>
            </section>

            {/* SPACER */}

            <div className="flex-1" />

            {/* CTA */}

            <section
              className="relative overflow-hidden rounded-[7mm] px-[8mm] py-[6mm] text-white"
              style={{
                background:
                  "linear-gradient(135deg, #D3A753 0%, #CA617D 55%, #E791A7 100%)",
              }}
            >
              <Heart
                className="pointer-events-none absolute -top-[8mm] -right-[3mm] h-[40mm] w-[40mm] rotate-12 opacity-10"
                fill="currentColor"
              />

              <div className="relative z-10 flex items-center justify-between gap-5">
                <div>
                  <div className="text-[2.2mm] font-semibold tracking-[0.25em] text-white/75 uppercase">
                    Compensation
                  </div>

                  <div className="mt-[1mm] text-[6mm] font-semibold tracking-[-0.03em]">
                    Salary based on experience
                  </div>

                  <div className="mt-[1mm] text-[2.7mm] text-white/80">
                    Join a growing team focused on meaningful relationships.
                  </div>
                </div>

                <div className="flex h-[14mm] w-[14mm] shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <ArrowRight size={22} />
                </div>
              </div>
            </section>

            {/* CONTACT */}

            <section className="mt-[5mm] flex items-center justify-between">
              <div>
                <div className="text-[2mm] font-semibold tracking-[0.25em] text-[#B78D46] uppercase">
                  Apply / Contact
                </div>

                <div className="mt-[1mm] flex items-center gap-2">
                  <Mail size={13} className="text-[#CA617D]" />

                  <span className="text-[3.2mm] font-medium text-neutral-700">
                    info@21stcenturygroup.org
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[2mm] tracking-[0.2em] text-neutral-400 uppercase">
                  Thai Soulmate Co., Ltd.
                </div>

                <div
                  className="mt-[1mm] text-[2.8mm] font-semibold"
                  style={{
                    background: "linear-gradient(90deg, #D3A753, #CA617D)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Real People. Real Relationships.
                </div>
              </div>
            </section>

            {/* FOOTER */}

            <footer className="mt-[4mm] flex items-center justify-between border-t border-neutral-200/70 pt-[2.5mm]">
              <span className="text-[1.9mm] tracking-[0.12em] text-neutral-400">
                PERSONALLY MATCHED IN THAILAND
              </span>

              <span className="text-[1.9mm] text-neutral-400">
                © 2026 Thai Soulmate
              </span>
            </footer>
          </div>
        </div>
      </div>

      {/* PRINT BUTTON */}

      <div className="mx-auto mt-5 flex w-[210mm] justify-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-neutral-700"
        >
          Print A4
        </button>
      </div>
    </main>
  )
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-[4mm] border border-neutral-200/80 bg-white/80 px-[4mm] py-[3mm]">
      <div className="flex h-[9mm] w-[9mm] shrink-0 items-center justify-center rounded-full bg-[#CA617D]/10 text-[#CA617D]">
        {icon}
      </div>

      <div>
        <div className="text-[2.6mm] font-semibold text-neutral-800">
          {title}
        </div>

        <div className="mt-[0.5mm] text-[2mm] leading-tight text-neutral-500">
          {text}
        </div>
      </div>
    </div>
  )
}

function Requirement({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-[2.5mm]">
      <div className="mt-[0.4mm] flex h-[4.5mm] w-[4.5mm] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D3A753] to-[#CA617D] text-white">
        <Check size={9} strokeWidth={3} />
      </div>

      <div className="text-[2.8mm] leading-[1.45] text-neutral-600">
        {children}
      </div>
    </div>
  )
}

function SmallItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-[2.5mm]">
      <div className="mt-[1.6mm] h-[1.3mm] w-[1.3mm] shrink-0 rounded-full bg-[#CA617D]" />

      <div className="text-[2.6mm] leading-[1.45] text-neutral-600">
        {children}
      </div>
    </div>
  )
}
