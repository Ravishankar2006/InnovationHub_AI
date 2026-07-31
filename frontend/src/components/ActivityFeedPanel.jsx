import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, Activity, Filter, Trash2, CheckCircle2, Clock } from 'lucide-react';

export default function ActivityFeedPanel({
  logs = [],
  onClearLogs = () => {}
}) {
  const scrollRef = useRef(null);

  // Auto-scroll to newest item
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel border border-[#D4AF37]/20 rounded-3xl p-6 flex flex-col h-full min-h-[480px] justify-between relative overflow-hidden shadow-2xl">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-white">
              Real-Time Activity Feed
            </h3>
            <span className="text-[9px] font-mono text-zinc-500 font-bold block">
              LIVE TELEMETRY STREAMS
            </span>
          </div>
        </div>

        <button
          onClick={onClearLogs}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
          title="Clear Logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auto-scrolling Logs Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto my-4 space-y-2.5 pr-1 font-mono text-xs scrollbar-thin relative z-10 max-h-[420px]"
      >
        <AnimatePresence initial={false}>
          {logs.map((log, index) => {
            const isNewest = index === logs.length - 1;

            return (
              <motion.div
                key={log.id || index}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={`p-3 rounded-xl border transition-all duration-300 flex items-start justify-between gap-3 ${
                  isNewest
                    ? 'bg-gradient-to-r from-[#D4AF37]/15 to-transparent border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'bg-zinc-950/60 border-zinc-900 text-zinc-400'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-bold">{log.time}</span>
                    <span className="text-zinc-600">•</span>
                    <span className={`text-[10px] uppercase font-bold ${isNewest ? 'text-[#D4AF37]' : 'text-zinc-400'}`}>
                      {log.agent || 'Orchestrator'}
                    </span>
                    {isNewest && (
                      <span className="px-1.5 py-0.2 text-[8px] bg-[#D4AF37] text-black font-extrabold rounded uppercase tracking-wider animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed font-semibold ${isNewest ? 'text-white' : 'text-zinc-300'}`}>
                    {log.log || log.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SOCKET STREAM CONNECTED</span>
        </span>
        <span>{logs.length} EVENTS RECORDED</span>
      </div>
    </div>
  );
}
