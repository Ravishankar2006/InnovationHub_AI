import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Flame, 
  Percent, 
  CreditCard, 
  PieChart 
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function BusinessMetrics({
  tamSize = 4.8, // $B
  revenueY1 = 1.2, // $M
  revenueY3 = 8.5, // $M
  growthRate = 185, // %
  cac = 420, // $
  ltv = 3800, // $
  expectedProfit = 34.5, // %
  monthlyExpenses = 32.5, // $K
  burnRate = 14.2, // $K
  grossMargin = 78.5 // %
}) {
  const metrics = [
    {
      title: 'Market Size (TAM)',
      value: tamSize,
      decimals: 1,
      prefix: '$',
      suffix: ' Billion',
      icon: BarChart,
      color: 'text-[#D4AF37]',
      desc: 'Global Total Addressable Market'
    },
    {
      title: 'Y3 Revenue Projection',
      value: revenueY3,
      decimals: 1,
      prefix: '$',
      suffix: ' Million',
      icon: TrendingUp,
      color: 'text-emerald-400',
      desc: 'Scaled Annual Run Rate'
    },
    {
      title: 'YoY Growth Rate',
      value: growthRate,
      decimals: 0,
      suffix: '%',
      icon: Percent,
      color: 'text-[#FFD95A]',
      desc: 'Projected Compound Annual Growth'
    },
    {
      title: 'CAC vs LTV Ratio',
      value: (ltv / cac),
      decimals: 1,
      prefix: 'LTV:CAC = ',
      suffix: 'x',
      icon: Users,
      color: 'text-[#D4AF37]',
      desc: `CAC: $${cac} | LTV: $${ltv.toLocaleString()}`
    },
    {
      title: 'Expected Net Profit',
      value: expectedProfit,
      decimals: 1,
      suffix: '%',
      icon: DollarSign,
      color: 'text-emerald-300',
      desc: 'Margin Post Operational Expense'
    },
    {
      title: 'Monthly OPEX',
      value: monthlyExpenses,
      decimals: 1,
      prefix: '$',
      suffix: 'K / mo',
      icon: CreditCard,
      color: 'text-[#D4AF37]',
      desc: 'Payroll, Cloud Infrastructure & R&D'
    },
    {
      title: 'Monthly Net Burn',
      value: burnRate,
      decimals: 1,
      prefix: '$',
      suffix: 'K / mo',
      icon: Flame,
      color: 'text-amber-400',
      desc: 'Pre-Revenue Capital Consumption'
    },
    {
      title: 'Gross Margin',
      value: grossMargin,
      decimals: 1,
      suffix: '%',
      icon: PieChart,
      color: 'text-[#FFD95A]',
      desc: 'Software & DaaS Unit Margin'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          Financial & Business Performance Metrics
        </h3>
        <span className="text-[10px] text-zinc-500 font-mono font-bold">5-YEAR FINANCIAL MODEL</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="glass-panel rounded-3xl p-5 border-white/5 hover:border-[#D4AF37]/30 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider truncate">{metric.title}</span>
                <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-800 ${metric.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className={`text-xl font-black ${metric.color} tracking-tight group-hover:scale-105 transition-transform origin-left`}>
                <AnimatedCounter value={metric.value} decimals={metric.decimals} prefix={metric.prefix} suffix={metric.suffix} />
              </div>

              <span className="text-[9px] text-zinc-500 font-mono block mt-1.5 font-bold truncate">
                {metric.desc}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
