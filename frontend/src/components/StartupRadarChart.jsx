import React from 'react';
import { motion } from 'framer-motion';
import { 
  RadarChart as RechartsRadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Compass, Sparkles } from 'lucide-react';

export default function StartupRadarChart({
  scores = {
    innovation: 94,
    market: 89,
    strategy: 92,
    finance: 95,
    legal: 95,
    marketing: 88
  }
}) {
  const radarData = [
    { subject: 'Innovation', A: scores.innovation || 94, fullMark: 100 },
    { subject: 'Market', A: scores.market || 89, fullMark: 100 },
    { subject: 'Business', A: scores.strategy || 92, fullMark: 100 },
    { subject: 'Finance', A: scores.finance || 95, fullMark: 100 },
    { subject: 'Legal', A: scores.legal || 95, fullMark: 100 },
    { subject: 'Marketing', A: scores.marketing || 88, fullMark: 100 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
        <div>
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            Startup Capabilities Radar Vector
          </h3>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">
            Multi-dimensional evaluation index across all 6 cognitive agent domains.
          </p>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">6-AXIS RADAR</span>
      </div>

      <div className="h-[340px] w-full relative select-none">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#27272a" strokeWidth={1.5} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#FFD95A', fontSize: 11, fontWeight: 'bold' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525b" />
            <Radar
              name="Startup Health"
              dataKey="A"
              stroke="#D4AF37"
              strokeWidth={3}
              fill="#D4AF37"
              fillOpacity={0.4}
              dot={{ r: 5, fill: '#FFD95A', stroke: '#070707', strokeWidth: 2 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F0F10', borderColor: '#D4AF37', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              itemStyle={{ color: '#FFD95A' }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold">
        <span>OVERALL HARMONIC MEAN: 92.2%</span>
        <span className="text-emerald-400">OPTIMAL EQUILIBRIUM</span>
      </div>
    </motion.div>
  );
}
