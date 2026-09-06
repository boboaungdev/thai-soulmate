"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { APP_INFO } from "@/constants"

export function HeroSoulWaves() {
  return (
    <div className="relative mx-auto flex h-36 w-full max-w-lg items-center justify-center sm:h-44 md:h-48">
      {/* SVG Container for the converging energy waves */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 500 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Gentleman Wave Gradient */}
          <linearGradient id="goldWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D3A753" stopOpacity="0" />
            <stop offset="30%" stopColor="#D3A753" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#F5D77F" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Rose Lady Wave Gradient */}
          <linearGradient id="roseWaveGrad" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#CA617D" stopOpacity="0" />
            <stop offset="30%" stopColor="#CA617D" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#E791A7" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Fusion Burst Glow Filter */}
          <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="roseGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Central Radial Fusion Flare */}
          <radialGradient id="fusionBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#F5D77F" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#E791A7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CA617D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Wave 1: Gentleman Gold Energy Wave (Approaches from Left) */}
        <motion.path
          d="M 10 70 C 90 20, 150 190, 200 130 C 220 100, 235 95, 250 120"
          stroke="url(#goldWaveGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#goldGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1],
            opacity: [0, 1, 1, 0.45],
          }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Wave 2: Thai Lady Rose Energy Wave (Approaches from Right) */}
        <motion.path
          d="M 490 170 C 410 220, 350 50, 300 110 C 280 140, 265 145, 250 120"
          stroke="url(#roseWaveGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#roseGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1],
            opacity: [0, 1, 1, 0.45],
          }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* Orbiting Spark 1 (Gold) */}
        <motion.circle
          r="3"
          fill="#F5D77F"
          filter="url(#goldGlow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            cx: [10, 130, 210, 250],
            cy: [70, 170, 110, 120],
          }}
          transition={{
            duration: 1.1,
            ease: "easeInOut",
          }}
        />

        {/* Orbiting Spark 2 (Rose) */}
        <motion.circle
          r="3"
          fill="#E791A7"
          filter="url(#roseGlow)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            cx: [490, 370, 290, 250],
            cy: [170, 70, 130, 120],
          }}
          transition={{
            duration: 1.1,
            ease: "easeInOut",
          }}
        />

        {/* Central Fusion Flare (Collides and Blooms at Center) */}
        <motion.circle
          cx="250"
          cy="120"
          r="75"
          fill="url(#fusionBloom)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.6, 1.2, 0],
            opacity: [0, 0.95, 0.6, 0],
          }}
          transition={{
            duration: 0.9,
            delay: 0.9,
            ease: "easeOut",
          }}
        />
      </svg>

      {/* Atmospheric Breathing Halo (Persistent Ambient Glow) */}
      <motion.div
        animate={{
          scale: [0.92, 1.08, 0.92],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -z-10 h-40 w-40 rounded-full bg-gradient-to-tr from-[#D3A753]/35 via-[#E791A7]/25 to-[#CA617D]/30 blur-2xl sm:h-52 sm:w-52"
      />

      {/* The Logo Crest: Emerges from the Fusion Flare + Continuous Floating Physics */}
      <motion.div
        initial={{ scale: 0.45, opacity: 0, filter: "blur(12px)" }}
        animate={{
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 0.95,
          delay: 0.95,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            y: [0, -7, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.9,
          }}
          whileHover={{
            scale: 1.08,
            transition: { duration: 0.3 },
          }}
          className="cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt={`${APP_INFO.name} Logo`}
            width={160}
            height={160}
            className="h-24 w-24 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:h-32 sm:w-32 md:h-36 md:w-36"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
