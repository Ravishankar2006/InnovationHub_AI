import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  DollarSign, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function InsightsAndNotifications({
  recommendedMarket = "Precision Agriculture & B2B Crop Protection",
  recommendedPricing = "$15/acre mapping flat + $35/acre spraying application fee",
  businessModel = "DaaS (Drone-as-a-Service) + SaaS Multispectral Analytics",
  customerSegment = "Mid to Large Scale Agricultural Cooperatives (500+ Acres)",
  topCompetitor = "Manual Applicator Services & Legacy Fixed-Wing Surveyors",
  growthStrategy = "Partner with regional farm co-ops for exclusive channel distribution",
  fundingAdvice = "Target $500K Seed round for 18-month operational runway"
}) {
  const notifications = [
    { id: 1, title: 'Market Analysis Completed', time: 'Just now', type: 'success', icon: CheckCircle2, text: 'TAM calculated at $4.8B with 18.5% CAGR in agricultural precision robotics.' },
    { id: 2, title: 'Financial Model Verified', time: '1 min ago', type: 'success', icon: CheckCircle2, text: '14-month break-even horizon with 78.5% gross software margin.' },
    { id: 3, title: 'Legal Compliance Passed', time: '2 mins ago', type: 'success', icon: ShieldCheck, text: 'FAA Part 107 regulatory compliance and IP liability protections confirmed.' },
    { id: 4, title: 'Marketing Strategy Generated', time: '3 mins ago', type: 'success', icon: CheckCircle2, text: 'Viral farmer referral flywheel constructed with $420 target CAC.' },
    { id: 5, title: 'Executive Report Ready', time: '4 mins ago', type: 'info', icon: Sparkles, text: '14-page master synthesis report compiled into SQLite database storage.' }
  ];

  const insights = [
    { label: 'Recommended Market', value: recommendedMarket, icon: Target, color: 'text-[#D4AF37]' },
    { label: 'Recommended Pricing', value: recommendedPricing, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Business Model', value: businessModel, icon: Briefcase, color: 'text-[#FFD95A]' },
    { label: 'Customer Segment', value: customerSegment, icon: Users, color: 'text-blue-400' },
    { label: 'Top Competitor', value: topCompetitor, icon: Target, color: 'text-rose-400' },
    { label: 'Growth Strategy', value: growthStrategy, icon: TrendingUp, color: 'text-[#D4AF37]' },
    { label: 'Funding Advice', value: fundingAdvice, icon: Sparkles, color: 'text-emerald-300' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Insights Panel (7 Cols) */}
      <div className="lg:col-span-7 glass-panel border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
                Executive AI Insights Panel
              </h3>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                Key strategic recommendations derived from multi-agent data fusion.
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">7 STRATEGIC INSIGHTS</span>
          </div>

          <div className="space-y-3 pt-4">
            {insights.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div 
                  key={idx}
                  className="bg-zinc-950/70 border border-zinc-900 hover:border-[#D4AF37]/30 rounded-2xl p-3.5 flex items-start gap-3 transition-all"
                >
                  <div className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 ${item.color} shrink-0 mt-0.5`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[9.5px] uppercase font-mono font-bold text-zinc-400 block">{item.label}</span>
                    <p className="text-xs text-white font-extrabold leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold">
          <span>AI AGENT CONSENSUS RATE: 98.4%</span>
          <span className="text-emerald-400">HIGH CONFIDENCE RECOMMENDATIONS</span>
        </div>
      </div>

      {/* 2. Smart Notifications Panel (5 Cols) */}
      <div className="lg:col-span-5 glass-panel border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                Smart Telemetry Notifications
              </h3>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                Real-time pipeline milestone alerts and status checks.
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">LIVE FEED</span>
          </div>

          <div className="space-y-3 pt-4">
            {notifications.map((notif) => {
              const Icon = notif.icon;

              return (
                <div
                  key={notif.id}
                  className="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-3.5 space-y-1 transition-all"
                >
                  <div className="flex justify-between items-center text-xs font-extrabold">
                    <span className="flex items-center gap-2 text-white">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      {notif.title}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">{notif.time}</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    {notif.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold">
          <span>PIPELINE HEALTH: OPTIMAL</span>
          <span className="text-[#D4AF37]">5 NOTIFICATIONS SYNCHRONIZED</span>
        </div>
      </div>

    </div>
  );
}
