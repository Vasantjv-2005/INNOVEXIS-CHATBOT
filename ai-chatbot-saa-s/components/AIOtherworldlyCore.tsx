'use client'

import { motion } from 'framer-motion'
import { Sparkles, Shield, Cpu, Database } from 'lucide-react'

export default function AIOtherworldlyCore() {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center preserve-3d">
      
      {/* Outer Telemetry Coordinates / Grid Marks */}
      <div className="absolute inset-0 border border-white/5 rounded-full scale-110 pointer-events-none" />
      
      {/* Dynamic scanline overlay on core */}
      <div className="absolute w-72 h-72 rounded-full overflow-hidden pointer-events-none">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-20 absolute top-0 left-0 animate-scanline" />
      </div>

      {/* Outer Holographic Ring (Clockwise) */}
      <svg className="absolute w-[90%] h-[90%] animate-slow-spin text-teal-500/25" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="4 6 12 8"
        />
      </svg>

      {/* Middle Holographic Ring (Anticlockwise) */}
      <svg className="absolute w-[75%] h-[75%] animate-spin-reverse text-cyan-400/40" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="15 5 2 5"
        />
      </svg>

      {/* Inner Interface Ring (Clockwise) */}
      <svg className="absolute w-[60%] h-[60%] animate-slow-spin text-emerald-500/35" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="80 15 5 15"
        />
      </svg>

      {/* Floating Holographic Parameters around core */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-6 left-12 px-3 py-1 bg-black/85 border border-emerald-500/30 rounded-md text-[9px] font-mono text-emerald-300 tracking-wider flex items-center gap-1.5 shadow-glow"
      >
        <Cpu className="w-2.5 h-2.5 text-emerald-400" />
        SYS_STATUS: ACTIVE
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-6 right-8 px-3 py-1 bg-black/80 border border-cyan-500/30 rounded-md text-[9px] font-mono text-cyan-300 tracking-wider flex items-center gap-1.5 shadow-glow"
      >
        <Database className="w-2.5 h-2.5 text-cyan-400" />
        BW: 84.2 GBPS
      </motion.div>

      <motion.div
        animate={{ x: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[-2rem] top-1/3 px-2 py-1 bg-black/85 border border-teal-500/30 rounded-md text-[9px] font-mono text-teal-300 tracking-wider flex items-center gap-1 shadow-glow"
      >
        <Shield className="w-2.5 h-2.5 text-teal-400" />
        SEC: ON
      </motion.div>

      {/* Main Core Orb */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          boxShadow: [
            '0 0 40px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.2)',
            '0 0 70px rgba(6, 182, 212, 0.6), inset 0 0 30px rgba(6, 182, 212, 0.3)',
            '0 0 40px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.2)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-36 h-36 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 flex items-center justify-center relative overflow-hidden animate-pulse-3d border border-white/10"
      >
        {/* Mirror/Glass layer */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] saturate-150" />
        
        {/* Core spark */}
        <Sparkles className="w-12 h-12 text-white relative z-10 animate-pulse" />
      </motion.div>
    </div>
  )
}
