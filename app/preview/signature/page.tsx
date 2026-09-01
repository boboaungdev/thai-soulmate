"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import EmailSignature from "@/emails/components/email-signature"
import { APP_INFO } from "@/constants"
import { Check, Copy, Laptop, Smartphone, ExternalLink } from "lucide-react"

export default function EmailSignaturePreviewPage() {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop")
  const [bgMode, setBgMode] = useState<"warm" | "light" | "dark">("warm")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const signatureElement = document.getElementById(
      "email-signature-render-target"
    )
    if (!signatureElement) return

    const htmlContent = signatureElement.innerHTML
    navigator.clipboard.writeText(htmlContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="min-h-screen bg-[#11070A] pb-20 font-sans text-slate-100 antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-[#5A0816]/60 bg-[#1A0A0E]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D3A753] via-[#E791A7] to-[#CA617D] p-0.5 shadow-xl">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-[#1C0A0F]">
                <Image
                  src="/logo.png"
                  alt="Thai Soulmate"
                  width={26}
                  height={26}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-bold tracking-wide text-white">
                  Thai Soulmate Email Signature
                </span>
                <span className="rounded-full border border-[#D3A753]/40 bg-[#D3A753]/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#D3A753] uppercase">
                  Business Card 6 Edition
                </span>
              </div>
              <p className="text-xs text-[#E791A7]/80">
                Live email preview matching{" "}
                <Link
                  href="/print/card/business/6"
                  target="_blank"
                  className="inline-flex items-center gap-0.5 underline hover:text-[#D3A753]"
                >
                  Business Card 6 <ExternalLink className="size-2.5" />
                </Link>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Viewport Toggles (PC / Mobile) */}
            <div className="flex items-center rounded-xl border border-[#5A0816]/60 bg-[#14070A] p-1 text-xs">
              <button
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                  viewport === "desktop"
                    ? "bg-[#5A0816] text-[#D3A753] shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Desktop View (620px)"
              >
                <Laptop className="size-3.5" />
                <span>PC View</span>
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                  viewport === "mobile"
                    ? "bg-[#5A0816] text-[#D3A753] shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Mobile View (380px)"
              >
                <Smartphone className="size-3.5" />
                <span>Mobile View</span>
              </button>
            </div>

            {/* Background Selector */}
            <div className="flex items-center gap-1 rounded-xl border border-[#5A0816]/60 bg-[#14070A] p-1.5">
              <button
                onClick={() => setBgMode("warm")}
                title="Warm Grey Client View"
                className={`size-6 rounded-lg border transition-all ${
                  bgMode === "warm"
                    ? "border-[#D3A753] ring-2 ring-[#D3A753]/30"
                    : "border-slate-700"
                } bg-[#eef0f5]`}
              />
              <button
                onClick={() => setBgMode("light")}
                title="Pure White View"
                className={`size-6 rounded-lg border transition-all ${
                  bgMode === "light"
                    ? "border-[#D3A753] ring-2 ring-[#D3A753]/30"
                    : "border-slate-700"
                } bg-white`}
              />
              <button
                onClick={() => setBgMode("dark")}
                title="Dark Mode Client View"
                className={`size-6 rounded-lg border transition-all ${
                  bgMode === "dark"
                    ? "border-[#D3A753] ring-2 ring-[#D3A753]/30"
                    : "border-slate-700"
                } bg-slate-950`}
              />
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#D3A753] via-[#E791A7] to-[#CA617D] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#5A0816]/40 transition-all hover:brightness-110"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span>Copied HTML!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Email Showcase View */}
      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <div
          className={`flex justify-center rounded-3xl border border-[#5A0816]/40 p-4 transition-all duration-300 sm:p-10 ${
            bgMode === "warm"
              ? "bg-[#eef0f5]"
              : bgMode === "light"
                ? "bg-slate-100"
                : "bg-slate-950"
          }`}
        >
          {/* Email Container Card */}
          <div
            className={`w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-slate-800 shadow-2xl transition-all duration-300 ${
              viewport === "desktop" ? "max-w-[620px]" : "max-w-[390px]"
            }`}
          >
            {/* Email Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#5A0816] font-serif text-xs font-bold text-[#D3A753] shadow-xs">
                  TS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Thai Soulmate{" "}
                    <span className="text-[11px] font-normal text-slate-500">
                      &lt;contact@thaisoulmate.org&gt;
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    To: Khun Alex &lt;alex@client.com&gt;
                  </div>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                10:42 AM
              </span>
            </div>

            {/* Email Body Content */}
            <div className="space-y-4 p-6 text-sm leading-relaxed text-slate-700 sm:p-8">
              <p>Dear Khun Alex,</p>
              <p>
                Thank you for registering your interest with{" "}
                <strong>{APP_INFO.name}</strong>. Our matchmaking team has
                reviewed your consultation preferences and selected verified
                profiles for your confidential consideration.
              </p>
              <p>
                Please let me know a convenient time for our upcoming 1-on-1
                private consultation call this week.
              </p>
              <p className="pt-2 font-medium text-slate-800">Best regards,</p>

              {/* Render Signature Component */}
              <div id="email-signature-render-target" className="pt-2">
                <EmailSignature />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
