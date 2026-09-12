"use client"

import React, { useState, useEffect, useRef } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { APP_INFO } from "@/constants"
import { Mail, Laptop, Smartphone } from "lucide-react"

import { RegisterInterestMemberConfirmationEmail } from "@/features/interest"
import { SendProfileEmail } from "@/features/matching"

function EmailFrame({ children }: { children: React.ReactElement }) {
  const [html, setHtml] = useState<string>("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    try {
      const markup = renderToStaticMarkup(children)
      setHtml(markup)
    } catch (err) {
      console.error("Failed to render email markup:", err)
    }
  }, [children])

  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current && iframeRef.current.contentDocument?.body) {
        const body = iframeRef.current.contentDocument.body
        const docEl = iframeRef.current.contentDocument.documentElement
        const height = Math.max(body.scrollHeight, docEl.scrollHeight, 600)
        iframeRef.current.style.height = `${height + 20}px`
      }
    }

    const timer1 = setTimeout(handleResize, 50)
    const timer2 = setTimeout(handleResize, 300)
    const timer3 = setTimeout(handleResize, 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [html])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      className="w-full border-0 transition-all duration-300"
      style={{ minHeight: "850px", display: "block" }}
      title="Member Email Preview"
    />
  )
}

const memberTemplates = [
  {
    id: "register-interest",
    tab: "Registration Confirmation",
    subject: `[Register Interest] Thank you for your interest in ${APP_INFO.name}!`,
    recipient: "supansa.t@example.com (Miss Supansa Thanakit)",
    description: "Sent automatically to new clients upon registering interest.",
    component: (
      <RegisterInterestMemberConfirmationEmail
        prefix="Miss"
        name="Supansa Thanakit"
        email="supansa.t@example.com"
        preferredContactDate="Thursday, 18 Sep 2026"
        preferredContactTime="14:00 - 15:00"
      />
    ),
  },
  {
    id: "send-profile-female",
    tab: "Send Profile (To Female Member)",
    subject: `[${APP_INFO.name}] A hand-selected match is waiting for your review.`,
    recipient: "supansa.t@example.com (Miss Supansa Thanakit)",
    description:
      "Sent to female member with male match's profile PDF & Accept/Decline action buttons.",
    component: (
      <SendProfileEmail
        to={{
          prefix: "Miss",
          name: "Supansa Thanakit",
          gender: "Female",
        }}
        trackingId="match-trk-009182"
      />
    ),
  },
  {
    id: "send-profile-male",
    tab: "Send Profile (To Male Member)",
    subject: `[${APP_INFO.name}] A hand-selected match is waiting for your review.`,
    recipient: "alex.j@example.com (Mr. Alex Johnson)",
    description:
      "Sent to male member with female match's profile PDF & Accept/Decline action buttons.",
    component: (
      <SendProfileEmail
        to={{
          prefix: "Mr.",
          name: "Alex Johnson",
          gender: "Male",
        }}
        trackingId="match-trk-009183"
      />
    ),
  },
]

export default function MemberEmailsPreviewPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop")

  const current = memberTemplates[activeTab]

  return (
    <div className="min-h-screen bg-[#11070A] pb-20 font-sans text-slate-100 antialiased">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-50 border-b border-[#5A0816]/60 bg-[#1A0A0E]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D3A753] via-[#E791A7] to-[#CA617D] p-0.5 shadow-xl">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-[#1C0A0F]">
                <Mail className="size-4 text-[#D3A753]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-wide text-white">
                  Member Email Templates
                </span>
                <span className="rounded-full border border-[#D3A753]/40 bg-[#D3A753]/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#D3A753] uppercase">
                  {memberTemplates.length} Templates
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#E791A7]/70">
                Luxury branded member communications with full email signature
              </p>
            </div>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center rounded-xl border border-[#5A0816]/60 bg-[#14070A] p-1 text-xs">
            <button
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewport === "desktop"
                  ? "bg-[#5A0816] text-[#D3A753] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Laptop className="size-3.5" />
              PC View
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                viewport === "mobile"
                  ? "bg-[#5A0816] text-[#D3A753] shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="size-3.5" />
              Mobile View
            </button>
          </div>
        </div>
      </header>

      {/* ── Template Switcher Tabs ── */}
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {memberTemplates.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === idx
                  ? "border-[#5A0816] bg-gradient-to-r from-[#5A0816] to-[#8B1428] text-white shadow-md shadow-[#5A0816]/30"
                  : "border-[#5A0816]/40 bg-[#1A0A0E] text-slate-400 hover:border-[#5A0816]/80 hover:text-white"
              }`}
            >
              {item.tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Email Preview Canvas ── */}
      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="flex justify-center rounded-3xl border border-[#5A0816]/40 bg-[#F5F0EC] p-4 transition-all duration-300 sm:p-10">
          <div
            className={`w-full transition-all duration-300 ${
              viewport === "desktop" ? "max-w-[620px]" : "max-w-[390px]"
            }`}
          >
            {/* Simulated Email Client Envelope */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              {/* Top Client Header */}
              <div className="flex flex-col gap-1.5 border-b border-slate-200 bg-slate-50 px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2.5 rounded-full bg-rose-400/80" />
                    <span className="inline-block size-2.5 rounded-full bg-amber-400/80" />
                    <span className="inline-block size-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-1 text-[11px] font-semibold text-slate-600">
                      {APP_INFO.name} Member Communications
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 border-t border-slate-100 pt-1 text-[11px] text-slate-500">
                  <div>
                    <span className="font-semibold text-slate-700">
                      Subject:
                    </span>{" "}
                    <span className="text-slate-900">{current.subject}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">To:</span>{" "}
                    <span className="text-slate-600">{current.recipient}</span>
                  </div>
                </div>
              </div>

              {/* Rendered Email Template Inside Isolated IFrame (Zero Hydration Mismatch) */}
              <div className="bg-[#F5F0EC]">
                <EmailFrame key={`${current.id}-${viewport}`}>
                  {current.component}
                </EmailFrame>
              </div>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="mt-4 flex flex-col justify-between gap-2 px-2 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            Active:{" "}
            <span className="font-semibold text-[#D3A753]">{current.tab}</span>{" "}
            — {current.description}
          </p>
          <p className="text-xs text-slate-600">
            Powered by{" "}
            <code className="text-[11px] text-[#E791A7]">
              MemberEmailLayout
            </code>{" "}
            + <code className="text-[11px] text-[#E791A7]">EmailSignature</code>
          </p>
        </div>
      </main>
    </div>
  )
}
