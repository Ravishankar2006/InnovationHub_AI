import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Rocket, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  Zap,
  Sparkles
} from 'lucide-react';

export default function LiveAgentCards({
  workforce = [],
  activeAgentId = null,
  status = 'idle',
  onSelectAgent = () => {}
}) {
  // Default values mapping for workforce agents
  const agentTasks = {
    validation: 'Validating uniqueness, TAM sizing, and core problem statement fit',
    market: 'Scraping competitor benchmarks, web intelligence, and market dynamics',
    strategy: 'Formulating monetization tiers, expansion flywheels, and defensive moats',
    finance: 'Constructing 5-year P&L forecasts, unit economics, and break-even points',
    legal: 'Auditing regulatory compliance risks, IP protection, and liability structures',
    marketing: 'Synthesizing viral acquisition loops, CAC targets, and channel strategy'
  };

  const agentIcons = {
    validation: Lightbulb,
    market: BarChart,
    strategy: TrendingUp,
    finance: DollarSign,
    legal: Shield,
    marketing: Rocket
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          Live Agent Status & Workforce Telemetry
        </h3>
        <span className="text-[10px] text-zinc-500 font-mono font-bold">6 CONCURRENT AGENTS ACTIVE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workforce.map((agent) => {
          const Icon = agentIcons[agent.id] || Sparkles;
          
          // Determine agent specific status: 'Running', 'Completed', 'Waiting', 'Failed'
          let agentStatus = 'Waiting';
          let confidence = parseFloat(agent.accuracy) || 94.5;
          let executionTime = agent.latency || '1.4s';
          let currentTask = agentTasks[agent.id] || 'Standing by for payload instruction';

          if (status === 'completed') {
            agentStatus = 'Completed';
          } else if (status === 'processing') {
            if (activeAgentId === agent.id) {
              agentStatus = 'Running';
            } else if (activeAgentId) {
              const order = ['validation', 'market', 'strategy', 'finance', 'legal', 'marketing'];
              if (order.indexOf(agent.id) < order.indexOf(activeAgentId)) {
                agentStatus = 'Completed';
              } else {
                agentStatus = 'Waiting';
              }
            } else {
              // Simulating parallel running
              agentStatus = 'Running';
            }
          } else if (status === 'failed' && agent.id === 'finance') {
            agentStatus = 'Failed';
          }

          // Card styles based on agent status
          let borderClass = 'border-white/5 hover:border-[#D4AF37]/30';
          let glowClass = '';
          let statusBadge = (
            <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" /> Waiting
            </span>
          );

          if (agentStatus === 'Running') {
            borderClass = 'border-[#FFD95A] gold-glow-border';
            glowClass = 'shadow-[0_0_30px_rgba(212,175,55,0.25)]';
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#FFD95A] text-[10px] font-mono font-bold flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-[#FFD95A]" /> Running
              </span>
            );
          } else if (agentStatus === 'Completed') {
            borderClass = 'border-emerald-500/40 hover:border-emerald-500';
            glowClass = 'shadow-[0_0_20px_rgba(46,204,113,0.15)]';
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
              </span>
            );
          } else if (agentStatus === 'Failed') {
            borderClass = 'border-rose-500/60 hover:border-rose-500';
            glowClass = 'shadow-[0_0_20px_rgba(244,63,94,0.2)]';
            statusBadge = (
              <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400" /> Failed
              </span>
            );
          }

          return (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.01, y: -3 }}
              onClick={() => onSelectAgent(agent.id)}
              className={`glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer ${borderClass} ${glowClass}`}
            >
              {/* Top Bar: Icon, Name & Status */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  
                  {/* Progress Ring around Agent Icon */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" className="stroke-zinc-800" strokeWidth="3" fill="transparent" />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className={agentStatus === 'Completed' ? 'stroke-emerald-400' : 'stroke-[#D4AF37]'}
                        strokeWidth="3"
                        strokeDasharray={125}
                        strokeDashoffset={agentStatus === 'Completed' ? 0 : agentStatus === 'Running' ? 40 : 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">{agent.name}</h4>
                    <span className="text-xs text-zinc-400 font-semibold">{agent.desc}</span>
                  </div>
                </div>

                {statusBadge}
              </div>

              {/* Current Task Description */}
              <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-3 mb-4 space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-400 block">Current Task</span>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed truncate">
                  {currentTask}
                </p>
              </div>

              {/* Metrics Footer */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Confidence:</span>
                  <span className="text-emerald-400 font-bold">{confidence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Exec Time:</span>
                  <span className="text-white font-bold">{executionTime}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
