import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Cpu, 
  Lightbulb, 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Rocket, 
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function WorkflowVisualizer({ status = 'idle', activeAgentId = null, failedAgentId = null }) {
  // Determine overall flow status
  const isRunning = status === 'created' || status === 'processing';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  // 9 Node layout sequence as explicitly required:
  // User -> Master AI -> Idea Validation -> Market Intelligence -> Business Strategy -> Finance Intelligence -> Legal Guardian -> Marketing Studio -> Executive Report
  const nodes = [
    { id: 'user', label: 'User', subLabel: 'Pitch Payload', icon: User, type: 'trigger' },
    { id: 'master', label: 'Master AI', subLabel: 'LangGraph Orchestrator', icon: Cpu, type: 'orchestrator' },
    { id: 'validation', label: 'Idea Validation', subLabel: 'Chief Innovation Officer', icon: Lightbulb, type: 'agent' },
    { id: 'market', label: 'Market Intelligence', subLabel: 'Market Analyst', icon: BarChart, type: 'agent' },
    { id: 'strategy', label: 'Business Strategy', subLabel: 'Strategy Consultant', icon: TrendingUp, type: 'agent' },
    { id: 'finance', label: 'Finance Intelligence', subLabel: 'Chartered Analyst', icon: DollarSign, type: 'agent' },
    { id: 'legal', label: 'Legal Guardian', subLabel: 'Legal Consultant', icon: Shield, type: 'agent' },
    { id: 'marketing', label: 'Marketing Studio', subLabel: 'Growth Director', icon: Rocket, type: 'agent' },
    { id: 'report', label: 'Executive Report', subLabel: 'Report Compiler', icon: FileCheck, type: 'output' }
  ];

  // Helper to determine single node state: 'completed', 'active', 'failed', 'waiting'
  const getNodeState = (node, index) => {
    if (isFailed && (failedAgentId === node.id || index === 3)) return 'error';

    if (isCompleted) return 'completed';

    if (isRunning) {
      if (node.id === 'user') return 'completed';
      if (node.id === 'master') return 'active';
      if (activeAgentId) {
        if (node.id === activeAgentId) return 'active';
        // Nodes before active are completed
        const activeIdx = nodes.findIndex(n => n.id === activeAgentId);
        if (activeIdx > 0 && index < activeIdx) return 'completed';
      } else {
        // default sequence progress simulation during processing
        if (index <= 4) return 'completed';
        if (index === 5) return 'active';
      }
      return 'waiting';
    }

    return 'waiting';
  };

  return (
    <div className="w-full glass-panel border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      
      {/* Background radial glows */}
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-[#D4AF37]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            React Flow Live Orchestration Visualization
          </h3>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">
            Real-time particle flow & continuous node status monitoring stream.
          </p>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-300" />
            <span className="text-emerald-400">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD95A] animate-ping" />
            <span className="text-[#FFD95A]">Active Pulse</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
            <span className="text-zinc-500">Waiting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-rose-400">Error</span>
          </div>
        </div>
      </div>

      {/* Horizontal Flow Container with Golden Particles along connections */}
      <div className="relative w-full overflow-x-auto scrollbar-thin select-none py-6">
        <div className="min-w-[1150px] relative flex justify-between items-center px-4 py-8">
          
          {/* SVG Connection Edges with Animated Golden Particles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="gold-flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#FFD95A" stopOpacity="1" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
              </linearGradient>
              
              <filter id="gold-particle-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {nodes.map((_, idx) => {
              if (idx === nodes.length - 1) return null;
              
              // Calculate horizontal positions between consecutive nodes
              const startX = 65 + idx * 130;
              const endX = startX + 70;
              const y = 60;
              const pathId = `flow-path-${idx}`;

              return (
                <g key={`edge-${idx}`}>
                  {/* Base Connection Edge Line */}
                  <path
                    id={pathId}
                    d={`M ${startX} ${y} L ${endX} ${y}`}
                    stroke={isRunning || isCompleted ? '#D4AF37' : '#27272a'}
                    strokeWidth={isRunning ? '2.5' : '1.5'}
                    strokeDasharray={isRunning ? '6,4' : 'none'}
                    fill="none"
                    className={isRunning ? 'animate-flow-dash' : ''}
                  />

                  {/* Golden Traveling Particle Streams along connections */}
                  {(isRunning || isCompleted) && (
                    <circle r="4" fill="#FFD95A" filter="url(#gold-particle-glow)">
                      <animateMotion
                        path={`M ${startX} ${y} L ${endX} ${y}`}
                        dur={`${1.2 + (idx % 3) * 0.3}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {(isRunning || isCompleted) && (
                    <circle r="2.5" fill="#FFFFFF" filter="url(#gold-particle-glow)">
                      <animateMotion
                        path={`M ${startX} ${y} L ${endX} ${y}`}
                        dur={`${1.2 + (idx % 3) * 0.3}s`}
                        begin="0.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render 9 Flow Sequence Nodes */}
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const state = getNodeState(node, index);

            // Styling based on state: completed (green), active (gold pulse), error (red), waiting (gray)
            let borderStyle = 'border-zinc-800 bg-zinc-950/90 text-zinc-500';
            let iconStyle = 'text-zinc-650';
            let badgeComponent = <span className="w-2 h-2 rounded-full bg-zinc-700" />;
            let isPulsing = false;

            if (state === 'completed') {
              borderStyle = 'border-emerald-500/60 bg-emerald-950/20 text-emerald-400 shadow-[0_0_20px_rgba(46,204,113,0.25)]';
              iconStyle = 'text-emerald-400';
              badgeComponent = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            } else if (state === 'active') {
              borderStyle = 'border-[#FFD95A] bg-black text-[#FFD95A] shadow-[0_0_30px_rgba(212,175,55,0.55)]';
              iconStyle = 'text-[#FFD95A] animate-bounce';
              badgeComponent = <span className="w-2.5 h-2.5 rounded-full bg-[#FFD95A] animate-ping" />;
              isPulsing = true;
            } else if (state === 'error') {
              borderStyle = 'border-rose-500 bg-rose-950/40 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.4)]';
              iconStyle = 'text-rose-400';
              badgeComponent = <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
            }

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: isPulsing ? [1, 1.06, 1] : 1,
                  y: isPulsing ? [-2, 2, -2] : 0
                }}
                transition={{ repeat: isPulsing ? Infinity : 0, duration: 1.8, ease: 'easeInOut' }}
                className="z-10 flex flex-col items-center group cursor-pointer"
              >
                {/* Node Box */}
                <div className={`w-28 h-24 rounded-2xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-300 relative ${borderStyle}`}>
                  
                  {/* Active ambient spin ring */}
                  {isPulsing && (
                    <div className="absolute inset-[-4px] border border-dashed border-[#D4AF37]/50 rounded-[18px] animate-spin pointer-events-none" style={{ animationDuration: '8s' }} />
                  )}

                  <div className="mb-1 flex items-center justify-center relative">
                    <Icon className={`w-6 h-6 ${iconStyle}`} />
                  </div>

                  <span className="text-[11px] font-extrabold tracking-tight truncate max-w-[100px] leading-tight">
                    {node.label}
                  </span>

                  <span className="text-[8.5px] font-mono font-medium text-zinc-400 truncate max-w-[100px] mt-0.5">
                    {node.subLabel}
                  </span>

                  {/* Corner Badge */}
                  <div className="absolute -top-1.5 -right-1.5">
                    {badgeComponent}
                  </div>
                </div>

                {/* Step Index Pill */}
                <span className="mt-2 text-[9px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase">
                  Node 0{index + 1}
                </span>
              </motion.div>
            );
          })}

        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-zinc-500 font-bold gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#D4AF37]">FLOW PATH:</span>
          <span>User → Master AI → Validation → Market → Strategy → Finance → Legal → Marketing → Report</span>
        </div>
        <span className="text-emerald-400">GOLDEN PARTICLE STREAM: ONLINE</span>
      </div>

    </div>
  );
}
