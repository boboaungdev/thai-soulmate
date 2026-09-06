"use client"

import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Cta() {
  return (
    <section className="mx-auto w-full max-w-7xl pt-4 pb-12 sm:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-[#D3A753]/40 bg-gradient-to-br from-card/90 via-card/70 to-[#D3A753]/10 p-8 text-center backdrop-blur-sm sm:p-12">
          {/* Ambient subtle glow inside CTA */}
          <motion.div
            animate={{
              scale: [0.95, 1.15, 0.95],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#D3A753]/25 to-transparent blur-3xl"
          />
          <div className="mx-auto max-w-2xl space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#D3A753]/30 bg-[#D3A753]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#D3A753] uppercase"
            >
              <Compass className="size-3.5" />
              <span>Start Your Matchmaking Journey</span>
            </motion.div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              Ready to Meet Your Match in Thailand?
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Skip endless swiping and unverified profiles. Book a private,
              confidential consultation with your dedicated matchmaker in
              Thailand and begin meeting high-compatibility singles.
            </p>

            <div className="pt-2">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button
                  asChild
                  size="lg"
                  className="btn-gradient font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#D3A753]/25"
                >
                  <Link href="/#register-interest">
                    Arrange a Confidential Consultation
                  </Link>
                </Button>
              </motion.div>
            </div>

            <p className="text-xs text-muted-foreground">
              100% confidential • Hand-scouted matches • Zero pressure
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
