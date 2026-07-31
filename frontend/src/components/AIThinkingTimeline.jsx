import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Compass, 
  Cpu, 
  Layers 
} from 'lucide-react';

export default function AIThinkingTimeline({
  status = 'processing', // idle, processing, completed
  currentStepIndex = 3,
  ideaText = 'Solar precision agricultural drone service'
}) {
  const steps = [
    { label: 'Understanding Startup Concept', desc: 'Parsing pitch deck payload and extracting core domain intent', agent: 'Master Orchestrator' },
    { label: 'Validating Idea Feasibility', desc: 'Evaluating market pain points, TAM/SAM, and problem statement uniqueness', agent: 'Chief Innovation Officer' },
    { label: 'Researching Market Intelligence', desc: 'Scraping competitor benchmarks, web signals, and pricing structures', agent: 'Market Research Analyst' },
    { label: 'Building Business Strategy', desc: 'Structuring SaaS/service monetization tiers, viral flywheels, and defensive moats', agent: 'Startup Strategy Consultant' },
    { label: 'Forecasting Financial Model', desc: 'Constructing 5-year P&L break-even projections and unit economics', agent: 'Chartered Financial Analyst' },
    { label: 'Checking Regulatory Compliance', desc: 'Auditing liability exposure, IP ownership, and legal frameworks', agent: 'AI Legal Consultant' },
    { label: 'Creating Marketing Strategy Plan', desc: 'Formulating acquisition channels, CAC targets, and pitch positioning', agent: 'Growth Marketing Director' },
    { label: 'Generating Executive Master Report', desc: 'Compiling structured report schema, charts, and database records', agent: 'Report Compiler Engine' }
  ];

  return (
    <div className="glass-panel border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD95A] animate-ping" />
            <span className="text-[10px] uppercase font-mono font-extrabold text-[#D4AF37] tracking-widest">
              Live AI Execution Pipeline
            </span>
          </div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" /> AI Thinking Timeline
          </h3>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2 font-bold">
          <Compass className="w-4 h-4 text-[#D4AF37] animate-spin" />
          <span>Stage {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}</span>
        </div>
      </div>

      {/* Startup Payload Snippet */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">Target Pitch Payload</span>
          <p className="text-xs text-zinc-200 font-semibold italic truncate max-w-xl">
            "{ideaText}"
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#D4AF37] font-bold shrink-0 bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
          CONCURRENT STREAM
        </span>
      </div>

      {/* Steps Timeline List */}
      <div className="space-y-3 relative">
        
        {/* Vertical Connecting Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-zinc-800 pointer-events-none" />

        {steps.map((step, idx) => {
          const isDone = status === 'completed' || idx < currentStepIndex;
          const isActive = status === 'processing' && idx === currentStepIndex;
          const isPending = !isDone && !isActive;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-start gap-4 p-3.5 rounded-2xl transition-all duration-300 relative z-10 ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : isDone
                  ? 'bg-zinc-950/50 border border-emerald-500/20'
                  : 'bg-zinc-950/20 border border-zinc-900 opacity-60'
              }`}
            >
              {/* Icon Indicator */}
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : isActive ? (
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/30 border border-[#FFD95A] flex items-center justify-center text-[#FFD95A] animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FFD95A]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-extrabold tracking-tight ${
                    isDone ? 'text-emerald-300' : isActive ? 'text-[#FFD95A]' : 'text-zinc-400'
                  }`}>
                    {isDone ? `✓ ${step.label}` : isActive ? `Processing: ${step.label}...` : step.label}
                  </h4>
                  <span className="text-[9.5px] font-mono text-zinc-400 uppercase font-bold shrink-0">
                    {step.agent}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
