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
  FileCheck 
} from 'lucide-react';

export default function WorkflowVisualizer({ status = 'idle' }) {
  // Determine node states based on system status
  // status: idle, created, processing, completed, failed
  const isRunning = status === 'created' || status === 'processing';
  const isCompleted = status === 'completed';

  const agents = [
    { id: 'validation', name: 'Idea Validation', icon: Lightbulb },
    { id: 'market', name: 'Market Intelligence', icon: BarChart },
    { id: 'strategy', name: 'Business Strategy', icon: TrendingUp },
    { id: 'finance', name: 'Finance Intelligence', icon: DollarSign },
    { id: 'legal', name: 'Legal Guardian', icon: Shield },
    { id: 'marketing', name: 'Marketing Studio', icon: Rocket }
  ];

  return (
    <div className="w-full bg-[#0F0F10] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
      
      {/* Background glow overlay */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4AF37]/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFD95A]/3 blur-3xl pointer-events-none rounded-full" />

      <h3 className="text-xs uppercase font-bold tracking-widest text-[#AAAAAA] mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        AI Pipeline Core Graph
      </h3>

      {/* SVG Container for Drawing Paths */}
      <div className="relative w-full overflow-x-auto select-none min-h-[380px] flex items-center justify-center">
        <div className="w-[800px] h-[360px] relative flex justify-between items-center px-4 shrink-0">
          
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#FFD95A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FFD95A" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Link lines from User to Master AI */}
            <path
              d="M 68 180 L 160 180"
              stroke={isRunning || isCompleted ? '#D4AF37' : '#222222'}
              strokeWidth="2"
              fill="none"
              className={isRunning ? 'animate-flow-dash' : ''}
              style={{ strokeDasharray: isRunning ? '8,4' : 'none', transition: 'stroke 0.5s' }}
            />

            {/* Fan out connections from Master AI to 6 Agents */}
            {agents.map((_, index) => {
              // Master AI center coordinate: (200, 180)
              // Agent column coordinates: (450, Y_coord)
              const startX = 240;
              const startY = 180;
              const endX = 420;
              const endY = 40 + index * 56; // spaced out between 40 and 320
              
              // Draw bezier paths for high tech circuit look
              const pathD = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`;
              
              let strokeColor = '#222222';
              if (isCompleted) strokeColor = 'rgba(212, 175, 55, 0.4)';
              else if (isRunning) strokeColor = 'url(#gold-glow)';

              return (
                <path
                  key={`to-agent-${index}`}
                  d={pathD}
                  stroke={strokeColor}
                  strokeWidth={isRunning ? '2.5' : '1.5'}
                  fill="none"
                  className={isRunning ? 'animate-flow-dash' : ''}
                  style={{ strokeDasharray: isRunning ? '6,4' : 'none', transition: 'stroke 0.5s' }}
                />
              );
            })}

            {/* Fan in connections from 6 Agents to Report Generator */}
            {agents.map((_, index) => {
              // Agent coordinates: (560, Y_coord)
              // Report Generator coordinates: (720, 180)
              const startX = 580;
              const startY = 40 + index * 56;
              const endX = 700;
              const endY = 180;

              const pathD = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`;
              
              let strokeColor = '#222222';
              if (isCompleted) strokeColor = 'rgba(212, 175, 55, 0.5)';
              else if (isRunning && status === 'processing') strokeColor = 'url(#gold-glow)';

              return (
                <path
                  key={`from-agent-${index}`}
                  d={pathD}
                  stroke={strokeColor}
                  strokeWidth={isRunning ? '2.5' : '1.5'}
                  fill="none"
                  className={isRunning && status === 'processing' ? 'animate-flow-dash' : ''}
                  style={{ strokeDasharray: isRunning && status === 'processing' ? '6,4' : 'none', transition: 'stroke 0.5s' }}
                />
              );
            })}
          </svg>

          {/* Node 1: User Input Node (Left) */}
          <div className="absolute left-0 top-[140px] z-10 flex flex-col items-center">
            <motion.div
              animate={{ 
                boxShadow: isRunning ? '0 0 25px rgba(212, 175, 55, 0.4)' : '0 0 10px rgba(0, 0, 0, 0.5)',
                borderColor: isRunning || isCompleted ? '#D4AF37' : '#333333'
              }}
              className="w-16 h-16 rounded-2xl bg-[#0F0F10] border-2 flex items-center justify-center relative group"
            >
              <User className={`w-7 h-7 ${isRunning || isCompleted ? 'text-[#D4AF37]' : 'text-zinc-650'}`} />
              {isRunning && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
              )}
            </motion.div>
            <span className="text-[10px] uppercase font-bold text-[#AAAAAA] mt-2 tracking-wide">Client Pitch</span>
          </div>

          {/* Node 2: Master AI Controller (Mid-Left) */}
          <div className="absolute left-[160px] top-[140px] z-10 flex flex-col items-center">
            <motion.div
              animate={{ 
                boxShadow: isRunning ? '0 0 35px rgba(212, 175, 55, 0.6)' : isCompleted ? '0 0 20px rgba(212, 175, 55, 0.2)' : '0 0 10px rgba(0,0,0,0.5)',
                borderColor: isRunning || isCompleted ? '#D4AF37' : '#333333',
                scale: isRunning ? [1, 1.05, 1] : 1
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 rounded-full bg-black border-2 flex items-center justify-center relative"
            >
              <div className="absolute inset-1.5 border border-dashed border-white/10 rounded-full animate-spin" style={{ animationDuration: '6s' }} />
              <Cpu className={`w-8 h-8 ${isRunning || isCompleted ? 'text-[#D4AF37] animate-pulse' : 'text-zinc-650'}`} />
            </motion.div>
            <span className="text-[10px] uppercase font-bold text-white mt-2 tracking-wide glow-text-gold">Master AI Co-Founder</span>
          </div>

          {/* Center Column: 6 Parallel Agents */}
          <div className="absolute left-[400px] top-0 bottom-0 flex flex-col justify-between py-1 z-10 w-[200px]">
            {agents.map((agent, index) => {
              const AgentIcon = agent.icon;
              
              // Define node state styles
              let nodeColorClass = 'border-zinc-800 text-zinc-600 bg-zinc-950/90';
              let isAgentPulsing = false;

              if (isCompleted) {
                nodeColorClass = 'border-[#D4AF37]/50 text-[#D4AF37] bg-black shadow-[0_0_15px_rgba(212,175,55,0.15)]';
              } else if (isRunning) {
                if (status === 'processing') {
                  nodeColorClass = 'border-[#FFD95A] text-[#FFD95A] bg-black shadow-[0_0_20px_rgba(212,175,55,0.35)]';
                  isAgentPulsing = true;
                } else {
                  nodeColorClass = 'border-zinc-700 text-zinc-400 bg-zinc-950';
                }
              }

              return (
                <motion.div
                  key={agent.id}
                  animate={{
                    scale: isAgentPulsing ? [1, 1.02, 1] : 1,
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.1 }}
                  className={`h-11 rounded-xl border flex items-center px-3 gap-2.5 transition-all duration-300 relative group cursor-pointer ${nodeColorClass}`}
                >
                  <AgentIcon className={`w-4 h-4 shrink-0 ${isAgentPulsing ? 'animate-bounce' : ''}`} />
                  <span className="text-[10.5px] font-bold tracking-wide whitespace-nowrap">{agent.name}</span>
                  
                  {/* Glowing active point indicator */}
                  {isAgentPulsing && (
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FFD95A] rounded-full animate-ping" />
                  )}
                  {isCompleted && (
                    <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Node 3: Report Generator Node (Right) */}
          <div className="absolute right-[16px] top-[140px] z-10 flex flex-col items-center">
            <motion.div
              animate={{ 
                boxShadow: isCompleted ? '0 0 30px rgba(212,175,55,0.45)' : '0 0 10px rgba(0,0,0,0.5)',
                borderColor: isCompleted ? '#D4AF37' : '#333333'
              }}
              className="w-18 h-18 rounded-2xl bg-[#0F0F10] border-2 flex items-center justify-center relative"
            >
              <FileCheck className={`w-8 h-8 ${isCompleted ? 'text-[#D4AF37]' : 'text-zinc-650'}`} />
              {isCompleted && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-black font-extrabold">✓</span>
              )}
            </motion.div>
            <span className="text-[10px] uppercase font-bold text-[#AAAAAA] mt-2 tracking-wide">Report Compiler</span>
          </div>

        </div>
      </div>

      <div className="mt-4 border-t border-white/5 pt-4 flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono tracking-wider font-bold">
        <span>Pipeline Execution Stream</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#222222]" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD95A] animate-pulse" />
            <span>Thinking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>Compiled</span>
          </div>
        </div>
      </div>

    </div>
  );
}
