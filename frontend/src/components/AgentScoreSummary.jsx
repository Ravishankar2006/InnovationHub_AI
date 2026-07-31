import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  BarChart2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Rocket, 
  ArrowUpRight, 
  Sparkles 
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function AgentScoreSummary({
  scores = {
    innovation: 94,
    market: 89,
    strategy: 92,
    finance: 95,
    legal: 95,
    marketing: 88
  }
}) {
  const cards = [
    {
      title: 'Innovation Score',
      score: scores.innovation || 94,
      confidence: '95.2%',
      trend: '+12.4% vs Avg',
      agent: 'Chief Innovation Officer',
      icon: Lightbulb,
      color: 'text-[#D4AF37]',
      sparkline: 'M0,25 Q15,10 30,20 T60,5 T90,15 T120,2'
    },
    {
      title: 'Market Score',
      score: scores.market || 89,
      confidence: '91.8%',
      trend: '+8.6% Growth TAM',
      agent: 'Market Research Analyst',
      icon: BarChart2,
      color: 'text-amber-400',
      sparkline: 'M0,20 Q15,25 30,12 T60,18 T90,8 T120,4'
    },
    {
      title: 'Business Strategy Score',
      score: scores.strategy || 92,
      confidence: '94.0%',
      trend: 'High Moat Defense',
      agent: 'Startup Strategy Consultant',
      icon: TrendingUp,
      color: 'text-purple-400',
      sparkline: 'M0,28 Q15,18 30,22 T60,10 T90,12 T120,3'
    },
    {
      title: 'Finance Score',
      score: scores.finance || 95,
      confidence: '96.5%',
      trend: '14 Mo Break-Even',
      agent: 'Chartered Financial Analyst',
      icon: DollarSign,
      color: 'text-emerald-400',
      sparkline: 'M0,24 Q15,15 30,19 T60,8 T90,10 T120,1'
    },
    {
      title: 'Legal Readiness Score',
      score: scores.legal || 95,
      confidence: '95.0%',
      trend: 'Zero High Risks',
      agent: 'AI Legal Consultant',
      icon: ShieldCheck,
      color: 'text-blue-400',
      sparkline: 'M0,22 Q15,12 30,16 T60,6 T90,8 T120,2'
    },
    {
      title: 'Marketing Score',
      score: scores.marketing || 88,
      confidence: '90.4%',
      trend: 'Low CAC Acquisition',
      agent: 'Growth Marketing Director',
      icon: Rocket,
      color: 'text-[#FFD95A]',
      sparkline: 'M0,26 Q15,20 30,15 T60,12 T90,6 T120,5'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          Cognitive Agent Score Summary
        </h3>
        <span className="text-[10px] text-zinc-500 font-mono font-bold">6 AGENT INTELLIGENCE PIPELINE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="glass-panel rounded-3xl p-6 border-white/5 hover:border-[#D4AF37]/40 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1 shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{card.title}</h4>
                    <span className="text-[9.5px] text-zinc-500 font-mono font-bold block">{card.agent}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <ArrowUpRight className="w-3 h-3" />
                  {card.trend}
                </div>
              </div>

              {/* Main Score & Sparkline Chart */}
              <div className="flex items-end justify-between my-2">
                <div>
                  <div className={`text-3xl font-black ${card.color} tracking-tight glow-text-gold`}>
                    <AnimatedCounter value={card.score} decimals={0} suffix="%" />
                  </div>
                  <span className="text-[9px] text-zinc-400 font-mono font-bold block mt-0.5">
                    Confidence: <strong className="text-white">{card.confidence}</strong>
                  </span>
                </div>

                {/* Micro SVG Sparkline Chart */}
                <div className="w-28 h-10 relative shrink-0">
                  <svg className="w-full h-full overflow-visible">
                    <path
                      d={card.sparkline}
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
