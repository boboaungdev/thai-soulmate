"use client"

import { useEffect } from "react"
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Check,
  Clock3,
  Globe2,
  Heart,
  Mail,
  MonitorCog,
  Sparkles,
  Users,
} from "lucide-react"

/* ============================================================
   PRINT TRIGGER
   ============================================================ */

function PrintTrigger() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") !== "true") {
      return
    }

    const print = async () => {
      await document.fonts.ready

      await new Promise((resolve) => setTimeout(resolve, 500))

      window.print()
    }

    void print()
  }, [])

  return null
}

/* ============================================================
   PAGE
   ============================================================ */

export default function Page() {
  return (
    <>
      <PrintTrigger />

      <style jsx global>{`
        @page {
          size: A4 portrait;
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

        /* ======================================================
           SCREEN
        ====================================================== */

        .hiring-print-document {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 32px;
          background: #eee7df;
        }

        .hiring-a4-page {
          position: relative;
          width: 210mm;
          height: 297mm;
          min-width: 210mm;
          min-height: 297mm;
          max-width: 210mm;
          max-height: 297mm;
          overflow: hidden;
          background: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        /* ======================================================
           PRINT
        ====================================================== */

        @media print {
          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body {
            overflow: hidden !important;
          }

          .hiring-print-document {
            display: block !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .hiring-a4-page {
            position: relative !important;
            display: block !important;
            width: 210mm !important;
            height: 297mm !important;
            min-width: 210mm !important;
            min-height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            box-shadow: none !important;
            break-after: auto !important;
            page-break-after: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          svg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <main className="hiring-print-document">
        <div className="hiring-a4-page">
          {/* =====================================================
              BACKGROUND
          ====================================================== */}

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

          <div className="pointer-events-none absolute top-[40mm] -right-[30mm] h-[95mm] w-[112mm] rotate-[18deg] rounded-[48%] border border-[#D3A753]/25" />

          <div className="pointer-events-none absolute top-[45mm] -right-[34mm] h-[95mm] w-[112mm] rotate-[18deg] rounded-[48%] border border-[#CA617D]/20" />

          <div className="pointer-events-none absolute top-[50mm] -right-[38mm] h-[95mm] w-[112mm] rotate-[18deg] rounded-[48%] border border-[#D3A753]/15" />

          {/* =====================================================
              CONTENT
          ====================================================== */}

          <div className="relative z-10 flex h-full flex-col px-[15mm] py-[8mm]">
            {/* =================================================
                HEADER
            ================================================== */}

            <header className="flex shrink-0 items-center justify-between">
              <div>
                <div className="text-[2.3mm] font-semibold tracking-[0.28em] text-[#B78D46] uppercase">
                  New Business Opportunity
                </div>

                <div className="mt-[1mm] text-[2.7mm] text-neutral-500">
                  Thailand-Based Service Business
                </div>
              </div>

              {/* NOW HIRING */}

              <div className="flex items-center gap-[2mm] rounded-full border border-[#D3A753]/30 bg-white/90 px-[4mm] py-[2mm] text-[2.3mm] font-semibold tracking-[0.18em] text-[#B78D46] uppercase">
                <span className="relative flex h-[3.5mm] w-[3.5mm] items-center justify-center">
                  <span className="absolute h-[3.5mm] w-[3.5mm] rounded-full bg-emerald-400/20" />

                  <span className="absolute h-[2.8mm] w-[2.8mm] rounded-full border border-emerald-400/40" />

                  <span className="relative h-[2mm] w-[2mm] rounded-full bg-emerald-500 shadow-[0_0_3px_rgba(16,185,129,0.55)]" />
                </span>

                Now Hiring
              </div>
            </header>

            {/* =================================================
                HERO
            ================================================== */}

            <section className="mt-[9mm] shrink-0">
              <div className="mb-[3mm] inline-flex items-center gap-2 rounded-full bg-[#CA617D]/10 px-[4mm] py-[1.8mm] text-[2.6mm] font-semibold tracking-[0.24em] text-[#B78D46] uppercase">
                <Sparkles size={13} />

                We&apos;re Hiring
              </div>

              <h1 className="max-w-[160mm] text-[19mm] leading-[0.84] font-semibold tracking-[-0.065em] text-[#242124]">
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

              <p className="mt-[4mm] max-w-[153mm] text-[3.6mm] leading-[1.45] text-neutral-600">
                Join a growing service business and become part of a new team
                where you will learn our application, systems, customer service
                process, sales workflow, and daily operations.
              </p>
            </section>

            {/* =================================================
                BIG MESSAGE
            ================================================== */}

            <section
              className="relative mt-[3.5mm] shrink-0 overflow-hidden rounded-[6mm] border border-[#D3A753]/20 px-[6mm] py-[3.2mm]"
              style={{
                background:
                  "linear-gradient(105deg, rgba(211,167,83,0.10), rgba(202,97,125,0.10), rgba(231,145,167,0.12))",
              }}
            >
              <div
                className="absolute top-0 bottom-0 left-0 w-[1.3mm]"
                style={{
                  background:
                    "linear-gradient(to bottom, #D3A753 0%, #E791A7 50%, #CA617D 100%)",
                }}
              />

              <div className="pl-[3mm]">
                <div className="text-[4mm] leading-[1.1] font-semibold tracking-[-0.03em] text-[#5A0816]">
                  No need to know everything from day one.
                </div>

                <p className="mt-[1.2mm] text-[2.6mm] leading-[1.4] text-neutral-600">
                  Full guidance and training will be provided. You will learn
                  our application, internal systems, customer service, sales
                  process, and daily workflow as you grow with the team.
                </p>
              </div>
            </section>

         {/* =================================================
    QUICK BENEFITS
================================================== */}

<section className="mt-[3.5mm] grid shrink-0 grid-cols-4 gap-[2.5mm]">
  <Feature
    icon={<MonitorCog size={16} />}
    title="Full Training"
    text="Application & systems"
  />

  <Feature
    icon={<Users size={16} />}
    title="Customer Service"
    text="Learn client communication"
  />

  <Feature
    icon={<BriefcaseBusiness size={16} />}
    title="Career Growth"
    text="Grow with a new business"
  />

  <Feature
    icon={<Award size={16} />}
    title="Salary"
    text="Basic salary + up to ฿40,000 commission"
  />
</section>
{/* =================================================
    MAIN INFORMATION — TWO MATCHING CARDS
================================================== */}

<section className="mt-[3.5mm] shrink-0 grid grid-cols-2 gap-[5mm]">
  {/* =================================================
      CANDIDATE CARD
  ================================================== */}

  <div className="overflow-hidden rounded-[6mm] border border-[#D3A753]/25 bg-gradient-to-br from-[#D3A753]/10 via-white to-[#CA617D]/10">
    {/* Card top gradient */}
    <div
      className="h-[1.1mm] w-full"
      style={{
        background:
          "linear-gradient(90deg, #D3A753, #CA617D, #E791A7)",
      }}
    />

    <div className="p-[4.5mm]">
      <div className="text-[2.2mm] font-semibold tracking-[0.22em] text-[#B78D46] uppercase">
        Candidate
      </div>

      <h2 className="mt-[1mm] text-[5mm] font-semibold tracking-[-0.035em] text-neutral-800">
        Who we&apos;re looking for
      </h2>

      <div className="mt-[3.2mm] space-y-[2.15mm]">
        <Requirement highlight>
          Thai female only
        </Requirement>

        <Requirement highlight>
          Fluent in English
        </Requirement>

        <Requirement>
          Friendly, confident and professional
        </Requirement>

        <Requirement>
          Strong customer service skills
        </Requirement>

        <Requirement>
          Good communication skills
        </Requirement>

        <Requirement>
          Willing to learn new systems and technology
        </Requirement>

        <Requirement>
          Responsible, hardworking and positive
        </Requirement>

        <Requirement>
          Comfortable communicating with customers
        </Requirement>
      </div>
    </div>
  </div>

  {/* =================================================
      TRAINING CARD
  ================================================== */}

  <div className="overflow-hidden rounded-[6mm] border border-[#D3A753]/25 bg-gradient-to-br from-[#D3A753]/10 via-white to-[#CA617D]/10">
    {/* Card top gradient */}
    <div
      className="h-[1.1mm] w-full"
      style={{
        background:
          "linear-gradient(90deg, #D3A753, #CA617D, #E791A7)",
      }}
    />

    <div className="p-[4.5mm]">
      <div className="text-[2.2mm] font-semibold tracking-[0.22em] text-[#B78D46] uppercase">
        Training & Development
      </div>

      <h2 className="mt-[1mm] text-[5mm] font-semibold tracking-[-0.035em] text-neutral-800">
        What you&apos;ll learn
      </h2>

      <div className="mt-[3.2mm] space-y-[2.15mm]">
        <SmallItem>
          How our application works
        </SmallItem>

        <SmallItem>
          Our internal systems and tools
        </SmallItem>

        <SmallItem>
          Customer service and communication
        </SmallItem>

        <SmallItem>
          Sales and client follow-up
        </SmallItem>

        <SmallItem>
          Daily business operations
        </SmallItem>

        <SmallItem>
          How to support customers
        </SmallItem>

        <SmallItem>
          Professional service workflow
        </SmallItem>

        <SmallItem>
          Building customer relationships
        </SmallItem>

        <SmallItem>
          Team communication and coordination
        </SmallItem>
      </div>
    </div>
  </div>
</section>

            {/* =================================================
                POSITION DETAILS
            ================================================== */}

            <section className="mt-[3.5mm] shrink-0">
              <div className="mb-[2mm] text-[2.2mm] font-semibold tracking-[0.22em] text-[#B78D46] uppercase">
                Position Details
              </div>

              <div className="grid grid-cols-4 gap-[2.5mm]">
                <JobDetail
                  icon={<Clock3 size={16} />}
                  label="Working Days"
                  value="5 Days / Week"
                />

                <JobDetail
                  icon={<BriefcaseBusiness size={16} />}
                  label="Working Hours"
                  value="10 Hours / Day"
                />

                <JobDetail
                  icon={<Award size={16} />}
                  label="Salary"
                  value="Based on Experience"
                />

                <JobDetail
                  icon={<Globe2 size={16} />}
                  label="Work Environment"
                  value="Office / Online"
                />
              </div>
            </section>

            {/* =================================================
                ATTITUDE
            ================================================== */}

            <section className="mt-[3.5mm] flex shrink-0 items-center gap-[4mm] rounded-[5mm] border border-neutral-200/70 bg-white/75 px-[5mm] py-[3mm]">
              <div className="flex h-[8.5mm] w-[8.5mm] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D3A753]/15 to-[#CA617D]/15 text-[#CA617D]">
                <Heart size={16} />
              </div>

              <div>
                <div className="text-[3.1mm] font-semibold text-neutral-800">
                  We&apos;re looking for the right attitude.
                </div>

                <div className="mt-[0.7mm] text-[2.5mm] leading-[1.4] text-neutral-500">
                  If you are willing to learn, work hard, communicate well, and
                  grow with a new business, we want to hear from you.
                </div>
              </div>
            </section>

            {/* =================================================
                CONTACT GRADIENT
            ================================================== */}

            <section
              className="relative mt-[3.5mm] shrink-0 overflow-hidden rounded-[7mm] px-[7mm] py-[4mm] text-white"
              style={{
                background:
                  "linear-gradient(135deg, #D3A753 0%, #CA617D 55%, #E791A7 100%)",
              }}
            >
              <Heart
                className="pointer-events-none absolute -top-[8mm] -right-[3mm] h-[38mm] w-[38mm] rotate-12 opacity-10"
                fill="currentColor"
              />

              <div className="relative z-10 flex items-center justify-between gap-5">
                <div>
                  <div className="text-[2.1mm] font-semibold tracking-[0.25em] text-white/75 uppercase">
                    Apply / Contact
                  </div>

                  <div className="mt-[1.2mm] flex items-center gap-[2mm]">
                    <Mail size={15} />

                    <span className="text-[4.2mm] font-semibold tracking-[-0.02em]">
                      info@21stcenturygroup.org
                    </span>
                  </div>

                  <div className="mt-[1mm] text-[2.6mm] text-white/80">
                    Send your Resume and a short introduction to apply.
                  </div>
                </div>

                <div className="flex h-[12mm] w-[12mm] shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <ArrowRight size={21} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}

/* ===============================================================
   FEATURE
================================================================ */

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
    <div className="flex items-center gap-3 rounded-[4mm] border border-neutral-200/80 bg-white/80 px-[3.5mm] py-[2.5mm]">
      <div className="flex h-[8mm] w-[8mm] shrink-0 items-center justify-center rounded-full bg-[#CA617D]/10 text-[#CA617D]">
        {icon}
      </div>

      <div>
        <div className="text-[2.7mm] font-semibold text-neutral-800">
          {title}
        </div>

        <div className="mt-[0.4mm] text-[2.1mm] leading-tight text-neutral-500">
          {text}
        </div>
      </div>
    </div>
  )
}

/* ===============================================================
   JOB DETAIL
================================================================ */

function JobDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[4mm] border border-neutral-200/80 bg-white/80 px-[2.8mm] py-[2.6mm]">
      <div className="flex items-center gap-2 text-[#CA617D]">
        {icon}

        <span className="text-[1.9mm] font-semibold tracking-[0.1em] text-[#B78D46] uppercase">
          {label}
        </span>
      </div>

      <div className="mt-[1.2mm] text-[2.7mm] leading-[1.2] font-semibold text-neutral-800">
        {value}
      </div>
    </div>
  )
}

/* ===============================================================
   REQUIREMENT
================================================================ */

function Requirement({
  children,
  highlight = false,
}: {
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className="flex items-start gap-[2.3mm]">
      <div
        className={`mt-[0.4mm] flex h-[4mm] w-[4mm] shrink-0 items-center justify-center rounded-full text-white ${
          highlight
            ? "bg-gradient-to-br from-[#D3A753] to-[#CA617D]"
            : "bg-[#CA617D]/80"
        }`}
      >
        <Check size={8} strokeWidth={3} />
      </div>

      <div
        className={`text-[2.8mm] leading-[1.3] ${
          highlight
            ? "font-medium text-neutral-700"
            : "text-neutral-600"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

/* ===============================================================
   SMALL ITEM
================================================================ */

function SmallItem({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-[2.3mm]">
      <div className="mt-[1.6mm] h-[1.5mm] w-[1.5mm] shrink-0 rounded-full bg-[#CA617D]" />

      <div className="text-[2.7mm] leading-[1.3] text-neutral-600">
        {children}
      </div>
    </div>
  )
}