import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  CheckCircle2, 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Rocket, 
  Flag,
  Sparkles
} from 'lucide-react';

export default function ProjectTimeline({ currentStageIndex = 6 }) {
  const [activeStep, setActiveStep] = useState(currentStageIndex);

  const stages = [
    { id: 'idea', label: 'Idea', desc: 'Concept Synthesis', icon: Lightbulb, details: 'Initial concept intake and problem identification phase.' },
    { id: 'validation', label: 'Validation', desc: 'CIO Analysis', icon: CheckCircle2, details: 'Feasibility evaluation, pain point validation, and unique value proposition.' },
    { id: 'market', label: 'Market', desc: 'Market Research', icon: BarChart, details: 'TAM/SAM estimation, competitor scraping, and industry growth vectors.' },
    { id: 'business', label: 'Business', desc: 'Strategy Moat', icon: TrendingUp, details: 'Monetization strategy, SaaS pricing tiers, and competitive moats.' },
    { id: 'finance', label: 'Finance', desc: 'P&L Model', icon: DollarSign, details: '5-year financial breakdown, unit economics, and break-even calculations.' },
    { id: 'legal', label: 'Legal', desc: 'Compliance Audit', icon: Shield, details: 'Liability protection, IP safeguards, and regulatory framework checks.' },
    { id: 'marketing', label: 'Marketing', desc: 'Growth Funnel', icon: Rocket, details: 'Acquisition channels, CAC targets, and viral expansion flywheels.' },
    { id: 'launch', label: 'Launch', desc: 'Market Entry', icon: Flag, details: 'Commercial pilot deployment, seed fundraising, and public launch.' }
  ];

  return (
    <div className="glass-panel border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Interactive Project Milestone Timeline
          </h3>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">
            Click any milestone node to view stage intelligence and execution status.
          </p>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">8-STAGE LIFECYCLE</span>
      </div>

      {/* Horizontal Interactive Timeline Bar */}
      <div className="relative w-full overflow-x-auto scrollbar-thin py-4">
        <div className="min-w-[900px] relative flex justify-between items-center px-6">
          
          {/* Background Progress Line */}
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-zinc-800 z-0" />
          <motion.div 
            className="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] z-0"
            initial={{ width: '0%' }}
            animate={{ width: `${(activeStep / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx <= currentStageIndex;
            const isSelected = idx === activeStep;

            return (
              <motion.div
                key={stage.id}
                whileHover={{ scale: 1.1 }}
                onClick={() => setActiveStep(idx)}
                className="z-10 flex flex-col items-center cursor-pointer group"
              >
                <div 
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'border-[#FFD95A] bg-black text-[#FFD95A] shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-110'
                      : isCompleted
                      ? 'border-[#D4AF37] bg-[#0F0F10] text-[#D4AF37]'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <span className={`text-xs font-extrabold mt-2 ${isSelected ? 'text-[#FFD95A]' : isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                  {stage.label}
                </span>

                <span className="text-[8.5px] font-mono text-zinc-500 font-semibold">
                  0{idx + 1}
                </span>
              </motion.div>
            );
          })}

        </div>
      </div>

      {/* Selected Step Detail Panel */}
      {stages[activeStep] && (
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950/80 border border-[#D4AF37]/20 rounded-2xl p-5 flex items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <span className="text-[9.5px] uppercase font-mono font-bold text-[#D4AF37]">
              Stage 0{activeStep + 1}: {stages[activeStep].label} - {stages[activeStep].desc}
            </span>
            <p className="text-xs text-zinc-200 font-semibold leading-relaxed">
              {stages[activeStep].details}
            </p>
          </div>
          <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            {activeStep <= currentStageIndex ? 'MILESTONE PASSED' : 'NEXT STAGE'}
          </span>
        </motion.div>
      )}

    </div>
  );
}
