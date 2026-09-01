"use client"

import React, { useState, useEffect, useRef } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { AdminNotification } from "@/emails/components/admin-notification-card"
import { APP_INFO } from "@/constants"
import { Mail, Laptop, Smartphone } from "lucide-react"

function EmailFrame({ children }: { children: React.ReactElement }) {
  const [html, setHtml] = useState<string>("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    try {
      const markup = renderToStaticMarkup(children)
      setHtml(markup)
    } catch (err) {
      console.error("Failed to render admin email markup:", err)
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
      style={{ minHeight: "750px", display: "block" }}
      title="Admin Notification Email Preview"
    />
  )
}

const notifications = [
  {
    id: "register-interest",
    tab: "Register Interest",
    props: {
      previewText: "[Register Interest] New registration from Khun Supansa",
      category: "Register Interest",
      title: "New Interest Registration",
      description:
        "A new visitor has registered their interest on the website.",
      fields: [
        { label: "Name", value: "Miss Supansa Thanakit" },
        { label: "Email", value: "supansa@example.com" },
      ],
      buttonText: "View in Dashboard",
      buttonUrl: "https://thaisoulmate.org/dashboard/register-interest",
    },
  },
  {
    id: "application-form",
    tab: "Application Form",
    props: {
      previewText: "[Application Form] New application from Khun Alex",
      category: "Application Form",
      title: "New Application Submitted",
      description:
        "A candidate has submitted a new application on the website.",
      fields: [
        { label: "Name", value: "Mr. Alex Johnson" },
        { label: "Email", value: "alex.johnson@example.com" },
      ],
      buttonText: "View in Dashboard",
      buttonUrl: "https://thaisoulmate.org/dashboard/application-form",
    },
  },
  {
    id: "contact-form",
    tab: "Contact Form",
    props: {
      previewText: "[Contact Form] Enquiry about membership tiers",
      category: "Contact Form",
      title: "New Contact Message",
      description: "A new message was submitted via the website contact form.",
      fields: [
        { label: "Name", value: "Ms. Priya Sharma" },
        { label: "Email", value: "priya.sharma@example.com" },
        { label: "Subject", value: "Enquiry about membership tiers" },
      ],
      messagePreview:
        "Hello, I came across your website and I am very interested in your exclusive matchmaking service. Could you please provide more information about your membership packages and how the process works? I am looking for a serious, long-term relationship.",
      buttonText: "View in Email Inbox",
      buttonUrl: "https://thaisoulmate.org/dashboard/email/contact/inbox",
    },
  },
  {
    id: "website-review",
    tab: "Website Review",
    props: {
      previewText: "[Website Review] Khun Natthaporn",
      category: "Website Review",
      title: "New Review Received",
      description: "A visitor has submitted a new review on the website.",
      fields: [
        { label: "Name", value: "Khun Natthaporn" },
        { label: "Email", value: "natthaporn@example.com" },
      ],
      buttonText: "View in Dashboard",
      buttonUrl: "https://thaisoulmate.org/dashboard/website-review",
    },
  },
  {
    id: "mailbox",
    tab: "Mailbox Activity",
    props: {
      previewText: "[Mailbox Alert] RE: Your Thai Soulmate consultation",
      category: "Mailbox Activity",
      title: "RE: Your Thai Soulmate consultation",
      description: "New email received for contact@thaisoulmate.org.",
      fields: [
        { label: "From", value: "James Wilson <james.wilson@example.com>" },
        { label: "To", value: "contact@thaisoulmate.org" },
      ],
      messagePreview:
        "Thank you for your prompt response. I would love to schedule a consultation call at your earliest convenience. Please let me know what times are available this week.",
      buttonText: "View in Email Inbox",
      buttonUrl: "https://thaisoulmate.org/dashboard/email/contact/inbox",
    },
  },
]

export default function AdminNotificationPreviewPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop")

  const current = notifications[activeTab]

  return (
    <div className="min-h-screen bg-[#11070A] pb-20 font-sans text-slate-100 antialiased">
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
                  Admin Notification Emails
                </span>
                <span className="rounded-full border border-[#D3A753]/40 bg-[#D3A753]/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#D3A753] uppercase">
                  {notifications.length} Types
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#E791A7]/70">
                Branded admin notification templates for {APP_INFO.name}
              </p>
            </div>
          </div>

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

      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {notifications.map((n, i) => (
            <button
              key={n.id}
              onClick={() => setActiveTab(i)}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === i
                  ? "border-[#5A0816] bg-gradient-to-r from-[#5A0816] to-[#8B1428] text-white shadow-md shadow-[#5A0816]/30"
                  : "border-[#5A0816]/40 bg-[#1A0A0E] text-slate-400 hover:border-[#5A0816]/80 hover:text-white"
              }`}
            >
              {n.tab}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="flex justify-center rounded-3xl border border-[#5A0816]/40 bg-[#F5F0EC] p-4 transition-all duration-300 sm:p-10">
          <div
            className={`w-full transition-all duration-300 ${
              viewport === "desktop" ? "max-w-[600px]" : "max-w-[390px]"
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="inline-block size-3 rounded-full bg-rose-400/80" />
                    <span className="inline-block size-3 rounded-full bg-amber-400/80" />
                    <span className="inline-block size-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="ml-2 text-xs font-medium text-slate-400">
                    Admin Inbox · {APP_INFO.name}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {new Date().toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Rendered in Isolated IFrame */}
              <div className="bg-[#F5F0EC]">
                <EmailFrame key={`${current.id}-${viewport}`}>
                  <AdminNotification {...current.props} />
                </EmailFrame>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-2 px-2 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            Showing:{" "}
            <span className="font-semibold text-[#D3A753]">{current.tab}</span>{" "}
            notification template
          </p>
          <p className="text-xs text-slate-600">
            Edit{" "}
            <code className="text-[11px] text-[#E791A7]">
              emails/admin/admin-notification-card.tsx
            </code>{" "}
            — all {notifications.length} templates update automatically
          </p>
        </div>
      </main>
    </div>
  )
}
