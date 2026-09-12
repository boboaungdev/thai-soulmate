"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { APP_INFO } from "@/constants"

export function HeroSoulWaves() {
  // Wave path definitions forming the heart:
  // Both waves come from far off-screen (-350 and 1350), surge across the canvas,
  // meet at the bottom tip of the heart (500, 360), sweep up the lobes,
  // and converge at the top cleft (500, 150).
  const goldHeartPath =
    "M -350 70 C -180 370, 40 30, 200 330 C 280 460, 410 360, 500 360 C 450 360, 320 265, 320 200 C 320 135, 420 105, 500 150"
  const roseHeartPath =
    "M 1350 70 C 1180 370, 960 30, 800 330 C 720 460, 590 360, 500 360 C 550 360, 680 265, 680 200 C 680 135, 580 105, 500 150"
  const closedHeartPath =
    "M 500 150 C 420 105, 320 135, 320 200 C 320 265, 450 360, 500 360 C 550 360, 680 265, 680 200 C 680 135, 580 105, 500 150 Z"

  return (
    <div className="relative mx-auto flex h-40 w-full max-w-lg items-center justify-center sm:h-48 md:h-52">
      {/* SVG Container for the converging energy waves from far away */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1000 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Gentleman Big Wave Gradient */}
          <linearGradient
            id="goldWaveGradBig"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#D3A753" stopOpacity="0" />
            <stop offset="25%" stopColor="#D3A753" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#F5D77F" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Rose Lady Big Wave Gradient */}
          <linearGradient
            id="roseWaveGradBig"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#CA617D" stopOpacity="0" />
            <stop offset="25%" stopColor="#CA617D" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#E791A7" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Deep Cinematic Glow Filters */}
          <filter id="goldGlowBig" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="roseGlowBig" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Central Radial Fusion Flare */}
          <radialGradient id="fusionBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#F5D77F" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#E791A7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#CA617D" stopOpacity="0" />
          </radialGradient>

          {/* Heart Silhouette Glow */}
          <linearGradient
            id="heartFillGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#D3A753" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#E791A7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#CA617D" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* 1. Gold Wave: Outer Radiant Aura (Gentleman, from far left) */}
        <motion.path
          d={goldHeartPath}
          stroke="url(#goldWaveGradBig)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#goldGlowBig)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 1],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.0,
            times: [0, 0.72, 0.85, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* 1b. Gold Wave: Inner Bright Core Strand */}
        <motion.path
          d={goldHeartPath}
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 1],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: 3.0,
            times: [0, 0.72, 0.85, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* 2. Rose Wave: Outer Radiant Aura (Thai Lady, from far right) */}
        <motion.path
          d={roseHeartPath}
          stroke="url(#roseWaveGradBig)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#roseGlowBig)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 1],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.0,
            times: [0, 0.72, 0.85, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* 2b. Rose Wave: Inner Bright Core Strand */}
        <motion.path
          d={roseHeartPath}
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 1],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: 3.0,
            times: [0, 0.72, 0.85, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* 3. Heart Shape Bloom Flash when the two waves complete the heart */}
        <motion.path
          d={closedHeartPath}
          fill="url(#heartFillGrad)"
          filter="url(#goldGlowBig)"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.85, 1.08, 1, 0.85],
            opacity: [0, 0.8, 0.4, 0],
          }}
          transition={{
            duration: 1.2,
            delay: 2.15,
            ease: "easeOut",
          }}
          style={{ transformOrigin: "500px 245px" }}
        />

        {/* 4. Central Radiant Fusion Bloom (Collides at Center as Heart Closes) */}
        <motion.circle
          cx="500"
          cy="245"
          r="160"
          fill="url(#fusionBloom)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.8, 1.1, 0],
            opacity: [0, 1, 0.7, 0],
          }}
          transition={{
            duration: 1.1,
            delay: 2.1,
            ease: "easeOut",
          }}
        />
      </svg>

      {/* Atmospheric Breathing Halo (Remains softly glowing after waves dissolve into logo) */}
      <motion.div
        animate={{
          scale: [0.92, 1.1, 0.92],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -z-10 h-44 w-44 rounded-full bg-gradient-to-tr from-[#D3A753]/35 via-[#E791A7]/25 to-[#CA617D]/30 blur-2xl sm:h-56 sm:w-56"
      />

      {/* The Logo Crest: Emerges from the Heart Fusion Bloom + Continuous Weightless Floating */}
      <motion.div
        initial={{ scale: 0.35, opacity: 0, filter: "blur(14px)" }}
        animate={{
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.0,
          delay: 2.2,
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
            delay: 3.2,
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
            width={200}
            height={200}
            className="h-48 w-48 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:h-52 sm:w-52 md:h-52 md:w-52"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
