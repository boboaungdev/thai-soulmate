"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa"
import { X, Sparkles, MessageCircle } from "lucide-react"
import { CONTACT } from "@/constants"

export function FloatingWhatsapp() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Prompt speech bubble appears smoothly after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsOpen(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [isDismissed])

  const prefilledMessage = encodeURIComponent(
    "Hello Thai Soulmate team, I would like to inquire about your personal matchmaking service."
  )
  const whatsappUrl = `${CONTACT.whatsapp}?text=${prefilledMessage}`

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(false)
    setIsDismissed(true)
  }

  return (
    <aside
      aria-label="WhatsApp live chat support"
      className="fixed right-5 bottom-6 z-50 flex items-end justify-end sm:right-7 sm:bottom-7"
    >
      {/* Speech Bubble Callout Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute right-0 bottom-[74px] mb-2 w-[290px] sm:right-[76px] sm:bottom-0 sm:mb-0 sm:w-[320px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#D3A753]/40 bg-card/95 p-4 text-left shadow-2xl backdrop-blur-xl">
              {/* Top Golden Light Edge */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D3A753]/70 to-transparent" />

              {/* Ambient Glow */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-[#25D366]/15 blur-xl" />

              {/* Header: Concierge Badge + Dismiss Button */}
              <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                    <MessageCircle className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">
                        Matchmaker Agent
                      </span>
                      <Sparkles className="size-3 text-[#D3A753]" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      <span>Online & Ready to Help</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  aria-label="Dismiss chat prompt"
                  className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Message Body */}
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                👋 Hi there! Looking for your life partner in Thailand? Chat
                directly with our private matchmaking agent on WhatsApp.
              </p>

              {/* Action Button inside Bubble */}
              <div className="mt-3 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/35 hover:brightness-110"
                >
                  <FaWhatsapp className="size-4" />
                  <span>Start Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating WhatsApp Trigger Button */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.08, y: -7 }}
        whileTap={{ scale: 0.94 }}
        className="relative"
      >
        {/* Pulsing Radar Aura Ring */}
        <div className="pointer-events-none absolute -inset-1 rounded-full bg-[#25D366]/30 blur-md transition-all group-hover:bg-[#25D366]/50" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open live chat with Thai Soulmate agent on WhatsApp"
          className="group relative flex size-14 items-center justify-center rounded-full border-2 border-[#D3A753]/40 bg-gradient-to-br from-[#25D366] via-[#20BA56] to-[#128C7E] text-white shadow-2xl shadow-[#25D366]/40 transition-all duration-300 hover:border-[#D3A753] hover:shadow-2xl hover:shadow-[#25D366]/60 sm:size-16"
        >
          {/* WhatsApp Icon */}
          <FaWhatsapp className="size-7 transition-transform duration-300 group-hover:scale-110 sm:size-8" />

          {/* Active Online Radar Beacon (Positioned at bottom) */}
          <span className="absolute right-0 bottom-0 flex size-4 sm:right-0 sm:bottom-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex size-4 rounded-full border-2 border-background bg-emerald-500" />
          </span>
        </a>
      </motion.div>
    </aside>
  )
}

export default FloatingWhatsapp
