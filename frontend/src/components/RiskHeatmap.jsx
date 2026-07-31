import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function RiskHeatmap({
  risks = [
    { title: 'Technology Risk', level: 'LOW', score: 18, color: 'emerald', desc: 'Core LLM API integrations and SQLite persistence verified with low latency.', mitigation: 'Maintain multi-model fallback routines.' },
    { title: 'Financial Risk', level: 'MODERATE', score: 42, color: 'amber', desc: 'Pre-revenue burn requires tight cash management until pilot conversion.', mitigation: 'Secure $500K Seed funding to ensure 18-month runway.' },
    { title: 'Legal Risk', level: 'LOW', score: 15, color: 'emerald', desc: 'Standard Terms of Service and data protection frameworks compliant.', mitigation: 'Review commercial contracts with legal counsel.' },
    { title: 'Operational Risk', level: 'MODERATE', score: 38, color: 'amber', desc: 'Hardware pilot drone maintenance and partner logistics scaling needed.', mitigation: 'Partner with certified local FAA operators.' },
    { title: 'Marketing Risk', level: 'LOW', score: 22, color: 'emerald', desc: 'Strong initial inbound interest from target agricultural cooperatives.', mitigation: 'Focus on direct B2B channel distribution.' },
    { title: 'Competition Risk', level: 'MODERATE', score: 48, color: 'amber', desc: 'Incumbent manual service providers exist in local farming hubs.', mitigation: 'Differentiate with real-time AI multispectral insights.' }
  ]
}) {
  const [selectedRisk, setSelectedRisk] = useState(null);

  const getBadge = (level) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9.5px] font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> LOW RISK
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[9.5px] font-mono font-bold flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> CRITICAL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9.5px] font-mono font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> MODERATE
          </span>
        );
    }
  };

  return (
    <div className="glass-panel border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
            Enterprise Risk Heatmap & Governance
          </h3>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">
            Interactive risk matrix evaluation across 6 critical operational vectors.
          </p>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">ZERO CRITICAL HIGH RISKS DETECTED</span>
      </div>

      {/* 6 Risk Grid Cards with interactive hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {risks.map((risk, idx) => {
          let cardBorder = 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10';
          let barBg = 'bg-emerald-500';
          let textColor = 'text-emerald-400';

          if (risk.level === 'HIGH') {
            cardBorder = 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10';
            barBg = 'bg-rose-500';
            textColor = 'text-rose-400';
          } else if (risk.level === 'MODERATE') {
            cardBorder = 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/10';
            barBg = 'bg-amber-400';
            textColor = 'text-amber-300';
          }

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setSelectedRisk(risk)}
              className={`glass-panel rounded-3xl p-6 border relative overflow-hidden transition-all duration-300 cursor-pointer shadow-xl ${cardBorder}`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <h4 className="text-sm font-extrabold text-white">{risk.title}</h4>
                {getBadge(risk.level)}
              </div>

              {/* Progress Risk Bar */}
              <div className="space-y-1.5 my-3">
                <div className="flex justify-between text-[10px] font-mono font-bold">
                  <span className="text-zinc-500">Risk Severity Score:</span>
                  <span className={textColor}>{risk.score} / 100</span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                  <motion.div
                    className={`${barBg} h-full rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${risk.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
              </div>

              <p className="text-xs text-zinc-400 font-medium leading-relaxed truncate">
                {risk.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
