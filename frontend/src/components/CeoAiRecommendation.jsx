import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Rocket, 
  Calendar, 
  TrendingUp, 
  Award,
  ArrowRight
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function CeoAiRecommendation({
  summary = "The startup concept demonstrates exceptional product-market fit potential with strong unit economics ($15 mapping + $35 spraying fee). The proprietary AI crop-disease diagnostic algorithms create a durable competitive moat against non-technical local applicators.",
  topStrengths = [
    "Durable IP Moat via automated crop multispectral signatures",
    "High gross margin software + DaaS revenue model (78.5% margin)",
    "Favorable LTV to CAC ratio (9.0x multiple)"
  ],
  majorWeaknesses = [
    "Initial capital expenditure requirement for specialized drone fleet",
    "Dependency on regional pilot licensing and FAA Part 107 compliance"
  ],
  criticalRisks = [
    "Weather dependency for seasonal spraying windows",
    "Potential regulatory shifts in autonomous commercial drone BVLOS rules"
  ],
  immediateActions = [
    "Finalize pilot partnership agreement with initial 5 regional farm co-ops",
    "Deploy Groq API fast-inference pipeline to drone edge units",
    "File provisional patent for crop-drift predictive algorithms"
  ],
  roadmap30 = "Complete software MVP, execute 5 pilot farm letters of intent, and file FAA waivers.",
  roadmap90 = "Deploy 3 active drone operational units, reach $25K MRR, and open Seed funding round.",
  launchRecommendation = "GO FOR LAUNCH — PROCEED TO SEED FUNDING",
  successProbability = 91.5,
  growthPotential = "VERY HIGH (10x AGTECH VECTOR)"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 25 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6"
    >
      {/* Background ambient gold glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[#D4AF37]/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-zinc-800/80 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD95A] animate-ping" />
            <span className="text-[10px] uppercase font-mono font-extrabold text-[#D4AF37] tracking-widest">
              AI Co-Founder Executive Brief
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
            CEO AI Recommendation & Strategic Directive
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] text-black font-black text-xs uppercase tracking-wider shadow-md shadow-[#D4AF37]/20 flex items-center gap-2">
            <Award className="w-4 h-4" /> {launchRecommendation}
          </div>
        </div>
      </div>

      {/* Probability & Growth Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className="bg-zinc-950/80 border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Probability of Success</span>
            <span className="text-3xl font-black text-emerald-400 glow-text-gold">
              <AnimatedCounter value={successProbability} decimals={1} suffix="%" />
            </span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-zinc-950/80 border border-[#D4AF37]/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Growth Potential Vector</span>
            <span className="text-xl font-black text-[#FFD95A]">
              {growthPotential}
            </span>
          </div>
          <TrendingUp className="w-8 h-8 text-[#D4AF37] opacity-80" />
        </div>
      </div>

      {/* Overall Executive Summary */}
      <div className="bg-zinc-950/70 border border-white/5 rounded-2xl p-5 space-y-2 relative z-10">
        <h3 className="text-xs uppercase font-extrabold text-[#D4AF37] tracking-wider">Overall Executive Summary</h3>
        <p className="text-xs text-zinc-200 font-semibold leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Strengths, Weaknesses & Critical Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Top Strengths */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs uppercase font-extrabold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Top Strengths
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300 font-medium">
            {topStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Major Weaknesses */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs uppercase font-extrabold text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Major Weaknesses
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300 font-medium">
            {majorWeaknesses.map((wk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Risks */}
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs uppercase font-extrabold text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Critical Risks
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300 font-medium">
            {criticalRisks.map((rk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{rk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Immediate Actions & Roadmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* Immediate Actions */}
        <div className="bg-zinc-950/70 border border-[#D4AF37]/20 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs uppercase font-extrabold text-[#D4AF37] flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#D4AF37]" /> Immediate Operator Actions
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-200 font-semibold">
            {immediateActions.map((act, idx) => (
              <li key={idx} className="flex items-center gap-3 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  0{idx + 1}
                </span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 30-Day & 90-Day Roadmap */}
        <div className="bg-zinc-950/70 border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs uppercase font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]" /> Execution Milestone Roadmap
          </h4>

          <div className="space-y-3">
            <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
              <span className="text-[9.5px] uppercase font-mono font-bold text-[#D4AF37] block">30-Day Focus Milestone</span>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                {roadmap30}
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-1">
              <span className="text-[9.5px] uppercase font-mono font-bold text-emerald-400 block">90-Day Expansion Milestone</span>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                {roadmap90}
              </p>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
