import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  HardDrive, 
  Zap, 
  Clock, 
  Activity, 
  CheckCircle2, 
  FileCheck2,
  TrendingUp
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function PerformanceMonitor({
  cpuUsage = 24.5,
  memoryUsage = 1.42,
  maxMemory = 4.0,
  apiCalls = 348,
  avgLatency = 1.15,
  workflowDuration = 3.42,
  successRate = 99.2,
  totalReports = 28
}) {
  const kpis = [
    {
      label: 'CPU Usage',
      value: cpuUsage,
      decimals: 1,
      suffix: '%',
      icon: Cpu,
      color: 'text-[#D4AF37]',
      bgGlow: 'from-[#D4AF37]/10',
      subText: 'Multi-Core Load'
    },
    {
      label: 'Memory Usage',
      value: memoryUsage,
      decimals: 2,
      suffix: ` / ${maxMemory} GB`,
      icon: HardDrive,
      color: 'text-amber-400',
      bgGlow: 'from-amber-500/10',
      subText: 'RAM Buffer'
    },
    {
      label: 'API Calls',
      value: apiCalls,
      decimals: 0,
      suffix: '',
      icon: Zap,
      color: 'text-blue-400',
      bgGlow: 'from-blue-500/10',
      subText: 'Groq & Web Requests'
    },
    {
      label: 'Average Latency',
      value: avgLatency,
      decimals: 2,
      suffix: 's',
      icon: Clock,
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10',
      subText: 'Node Response Time'
    },
    {
      label: 'Workflow Duration',
      value: workflowDuration,
      decimals: 2,
      suffix: 's',
      icon: Activity,
      color: 'text-purple-400',
      bgGlow: 'from-purple-500/10',
      subText: 'Total Pipeline Run'
    },
    {
      label: 'Agent Success Rate',
      value: successRate,
      decimals: 1,
      suffix: '%',
      icon: CheckCircle2,
      color: 'text-emerald-300',
      bgGlow: 'from-emerald-400/10',
      subText: 'Zero-Fail Metrics'
    },
    {
      label: 'Reports Generated',
      value: totalReports,
      decimals: 0,
      suffix: ' Reports',
      icon: FileCheck2,
      color: 'text-[#FFD95A]',
      bgGlow: 'from-[#FFD95A]/10',
      subText: 'SQLite Sync Database'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          Performance Monitor & KPI Diagnostics
        </h3>
        <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Real-Time Telemetry</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass-panel border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-4 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${kpi.bgGlow} to-transparent blur-xl pointer-events-none group-hover:scale-125 transition-transform`} />
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider truncate">{kpi.label}</span>
                <Icon className={`w-3.5 h-3.5 ${kpi.color} shrink-0`} />
              </div>

              <div className={`text-xl font-black ${kpi.color} tracking-tight group-hover:scale-105 transition-transform origin-left`}>
                <AnimatedCounter value={kpi.value} decimals={kpi.decimals} suffix={kpi.suffix} />
              </div>

              <span className="text-[8.5px] text-zinc-500 font-mono block mt-1 font-semibold truncate">
                {kpi.subText}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
