import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  Clock, 
  Target, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function InvestorReadiness({
  readinessStatus = 'YES - HIGHLY READY',
  fundingStage = 'SEED STAGE (SERIES PRE-A)',
  investorConfidence = 96.8,
  estimatedRoi = 5.4,
  valuation = 4.5, // Million
  breakEvenMonths = 14,
  runwayMonths = 18,
  fundingNeeded = 500 // K
}) {
  const cards = [
    {
      title: 'Investment Ready',
      value: readinessStatus,
      isText: true,
      icon: Briefcase,
      color: 'text-emerald-400',
      desc: 'Institutional Grade Pitch & Data Room'
    },
    {
      title: 'Funding Stage',
      value: fundingStage,
      isText: true,
      icon: Target,
      color: 'text-[#D4AF37]',
      desc: 'Early Stage B2B Expansion'
    },
    {
      title: 'Investor Confidence',
      value: investorConfidence,
      decimals: 1,
      suffix: '%',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      desc: 'Venture Capital Score Benchmark'
    },
    {
      title: 'Estimated ROI',
      value: estimatedRoi,
      decimals: 1,
      suffix: 'x',
      icon: TrendingUp,
      color: 'text-[#FFD95A]',
      desc: '5-Year Projected Multiple'
    },
    {
      title: 'Expected Valuation',
      value: valuation,
      decimals: 1,
      prefix: '$',
      suffix: 'M',
      icon: PieChart,
      color: 'text-purple-400',
      desc: 'Post-Money Valuation Model'
    },
    {
      title: 'Break-even Horizon',
      value: breakEvenMonths,
      decimals: 0,
      suffix: ' Months',
      icon: Clock,
      color: 'text-blue-400',
      desc: 'Unit Economics Positive'
    },
    {
      title: 'Cash Runway',
      value: runwayMonths,
      decimals: 0,
      suffix: ' Months',
      icon: Clock,
      color: 'text-amber-400',
      desc: 'Operational Buffer Period'
    },
    {
      title: 'Funding Needed',
      value: fundingNeeded,
      decimals: 0,
      prefix: '$',
      suffix: 'K',
      icon: DollarSign,
      color: 'text-emerald-300',
      desc: 'Target Raise Capacity'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#D4AF37]" />
          Investor Readiness & Venture Valuation
        </h3>
        <span className="text-[10px] text-zinc-500 font-mono font-bold">VC DUE DILIGENCE SYNC</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="glass-panel rounded-3xl p-5 border-white/5 hover:border-[#D4AF37]/30 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider truncate">{card.title}</span>
                <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-800 ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className={`text-xl font-black ${card.color} tracking-tight group-hover:scale-105 transition-transform origin-left`}>
                {card.isText ? (
                  <span>{card.value}</span>
                ) : (
                  <AnimatedCounter value={card.value} decimals={card.decimals} prefix={card.prefix} suffix={card.suffix} />
                )}
              </div>

              <span className="text-[9px] text-zinc-500 font-mono block mt-1.5 font-bold truncate">
                {card.desc}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
