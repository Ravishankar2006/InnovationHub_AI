import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Brain, 
  Database, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function EnterpriseCommandCenter({
  status = 'idle', // idle, processing, completed, failed
  activeWorkflow = 'Multi-Agent Autonomous Enterprise Pipeline',
  currentStage = 'System Standing By',
  activeAgent = 'Master Orchestrator',
  executionMode = 'Parallel Async Stream (6 Nodes)',
  progress = 0,
  confidence = 98.4,
  executionTime = 0,
  avgResponseTime = 1.2,
  tokensUsed = 14820,
  apiCalls = 142,
  vectorMemoryStatus = 'Synced (1,536 Dims)',
  llmStatus = 'Llama-3.3-70B Operational',
  tavilyStatus = 'Connected (380ms)'
}) {
  const getStatusBadge = () => {
    switch (status) {
      case 'processing':
        return (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FFD95A] text-xs font-mono font-bold tracking-wider animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#FFD95A] animate-ping" />
            ORCHESTRATING RUN
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PIPELINE COMPILED
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            EXECUTION ERROR
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
            IDLE / READY
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
    >
      {/* Dynamic ambient glass light glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#D4AF37]/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-radial from-amber-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-zinc-800/80 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B38F24] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-extrabold text-[#D4AF37] tracking-widest">
                  LangGraph v0.2.8 Workflow Engine
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[10px] uppercase font-mono font-bold text-zinc-400">Enterprise Operations</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3 mt-0.5">
                AI Command Center
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {getStatusBadge()}
          <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-2 font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Mode: {executionMode}</span>
          </div>
        </div>
      </div>

      {/* Grid Status Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-zinc-800/80 relative z-10">
        
        {/* Active Workflow */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 space-y-1 hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Active Workflow</span>
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <p className="text-sm font-extrabold text-white truncate">{activeWorkflow}</p>
          <span className="text-[10px] text-zinc-500 font-mono block">Sequential & Parallel Dispatch</span>
        </div>

        {/* Current Processing Stage */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 space-y-1 hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Current Stage</span>
            <Activity className="w-3.5 h-3.5 text-[#FFD95A] animate-pulse" />
          </div>
          <p className="text-sm font-extrabold text-[#FFD95A] truncate">{currentStage}</p>
          <span className="text-[10px] text-zinc-500 font-mono block">Node Execution Active</span>
        </div>

        {/* Current Active Agent */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 space-y-1 hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Active Agent</span>
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-sm font-extrabold text-white truncate">{activeAgent}</p>
          <span className="text-[10px] text-zinc-500 font-mono block">Context Thread Locked</span>
        </div>

        {/* Master Orchestrator Status */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-4 space-y-1 hover:border-[#D4AF37]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Master Orchestrator</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <p className="text-sm font-extrabold text-[#D4AF37] truncate capitalize">{status === 'idle' ? 'Ready for Payload' : status}</p>
          <span className="text-[10px] text-zinc-500 font-mono block">Groq Llama 3.3 70B Engine</span>
        </div>

      </div>

      {/* Main Metric Counters Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 relative z-10">
        
        {/* Overall Progress Percentage */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/5 rounded-2xl p-4 text-center space-y-1.5 hover:border-[#D4AF37]/30 transition-all">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Overall Progress</span>
          <div className="text-2xl font-black text-[#D4AF37] glow-text-gold">
            <AnimatedCounter value={progress} decimals={1} suffix="%" />
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
            <motion.div 
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* AI Confidence */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/5 rounded-2xl p-4 text-center space-y-1.5 hover:border-[#D4AF37]/30 transition-all">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">AI Confidence</span>
          <div className="text-2xl font-black text-emerald-400">
            <AnimatedCounter value={confidence} decimals={1} suffix="%" />
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">Consensus Metric</span>
        </div>

        {/* Total Execution Time */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/5 rounded-2xl p-4 text-center space-y-1.5 hover:border-[#D4AF37]/30 transition-all">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Execution Time</span>
          <div className="text-2xl font-black text-white">
            <AnimatedCounter value={executionTime} decimals={2} suffix="s" />
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">Live Runtime</span>
        </div>

        {/* Avg Agent Response Time */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/5 rounded-2xl p-4 text-center space-y-1.5 hover:border-[#D4AF37]/30 transition-all">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Avg Latency</span>
          <div className="text-2xl font-black text-amber-300">
            <AnimatedCounter value={avgResponseTime} decimals={2} suffix="s" />
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">Per Agent Node</span>
        </div>

        {/* Total Tokens Used */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/5 rounded-2xl p-4 text-center space-y-1.5 hover:border-[#D4AF37]/30 transition-all">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Tokens Processed</span>
          <div className="text-2xl font-black text-white">
            <AnimatedCounter value={tokensUsed} decimals={0} />
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">Prompt & Completion</span>
        </div>

        {/* Total API Calls */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/5 rounded-2xl p-4 text-center space-y-1.5 hover:border-[#D4AF37]/30 transition-all">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Total API Calls</span>
          <div className="text-2xl font-black text-[#D4AF37]">
            <AnimatedCounter value={apiCalls} decimals={0} />
          </div>
          <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold block">LLM / Tavily Requests</span>
        </div>

      </div>

      {/* Sub-system Status Ticker Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono relative z-10">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-zinc-500 font-bold">Vector Memory:</span>
            <span className="text-zinc-200 font-semibold">{vectorMemoryStatus}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-500 font-bold">LLM Model:</span>
            <span className="text-zinc-200 font-semibold">{llmStatus}</span>
          </div>

          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-zinc-500 font-bold">Tavily Search:</span>
            <span className="text-zinc-200 font-semibold">{tavilyStatus}</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-550 uppercase tracking-widest font-bold">
          NASA / OpenAI Ops Spec Compliant
        </div>
      </div>
    </motion.div>
  );
}
