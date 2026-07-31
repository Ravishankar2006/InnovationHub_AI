import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function StartupHealthGauge({
  score = 91,
  statusLabel = 'Excellent',
  confidence = 98.4
}) {
  // SVG Gauge calculations
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
    >
      {/* Background ambient radial light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-radial from-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Left Text summary */}
      <div className="space-y-3 max-w-md text-center md:text-left relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFD95A] animate-pulse" />
          <span className="text-[10px] uppercase font-mono font-extrabold text-[#D4AF37] tracking-widest">
            Executive Synthesis Engine
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          Startup Health Score
        </h2>

        <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
          Aggregated artificial intelligence consensus compiled across all 6 specialized cognitive workforce agents.
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
          <div className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FFD95A] text-xs font-mono font-extrabold flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FFD95A]" />
            Status: {statusLabel}
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-extrabold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            AI Confidence: {confidence}%
          </div>
        </div>
      </div>

      {/* Right Circular Gauge */}
      <div className="relative w-56 h-56 flex items-center justify-center shrink-0 relative z-10">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="gold-gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFD95A" />
              <stop offset="100%" stopColor="#B38F24" />
            </linearGradient>
            
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track Circle */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-zinc-900"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Value Circle */}
          <motion.circle
            cx="112"
            cy="112"
            r={radius}
            stroke="url(#gold-gauge-grad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
            filter="url(#gauge-glow)"
          />
        </svg>

        {/* Center Text Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-0.5">
          <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse mb-1" />
          <div className="text-4xl font-black text-white tracking-tight glow-text-gold">
            <AnimatedCounter value={score} decimals={0} suffix="%" />
          </div>
          <span className="text-[9px] uppercase font-mono font-extrabold text-[#D4AF37] tracking-widest block">
            Health Index
          </span>
        </div>
      </div>

    </motion.div>
  );
}
