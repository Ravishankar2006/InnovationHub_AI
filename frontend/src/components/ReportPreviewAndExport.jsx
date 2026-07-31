import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  FileSpreadsheet, 
  Presentation, 
  FileCode, 
  CheckCircle2, 
  X, 
  Printer,
  Sparkles,
  Layers
} from 'lucide-react';

export default function ReportPreviewAndExport({
  onTriggerExport = () => {},
  onOpenReportModal = () => {}
}) {
  const [selectedPreview, setSelectedPreview] = useState(null);

  const reports = [
    { id: 'exec', title: 'Executive Master Report', pages: 14, date: '2026-07-31', status: 'Compiled', icon: FileText, previewText: 'Comprehensive startup evaluation summarizing feasibility scores, business strategy, break-evens, risk heatmaps, and 90-day roadmaps.' },
    { id: 'finance', title: 'Financial Model & P&L Report', pages: 8, date: '2026-07-31', status: 'Compiled', icon: FileSpreadsheet, previewText: '5-year financial breakdown, unit economics, gross margins (78.5%), CAC/LTV benchmarks, and break-even horizon (14 months).' },
    { id: 'legal', title: 'Legal & Compliance Audit', pages: 6, date: '2026-07-31', status: 'Compiled', icon: FileText, previewText: 'Regulatory compliance checks, liability protection frameworks, IP ownership safeguards, and FAA commercial drone operation terms.' },
    { id: 'marketing', title: 'Growth Marketing Studio Report', pages: 7, date: '2026-07-31', status: 'Compiled', icon: Presentation, previewText: 'Customer acquisition strategy, viral flywheels, campaign positioning, B2B cooperative channel strategies, and CAC targets.' },
    { id: 'business', title: 'Business Strategy & Moat', pages: 9, date: '2026-07-31', status: 'Compiled', icon: Layers, previewText: 'Monetization tiers, pricing matrix ($15/acre flat + $35/acre spraying fee), TAM/SAM calculations, and competitive moat analysis.' }
  ];

  const exportFormats = [
    { id: 'pdf', label: 'PDF Document', ext: '.pdf', icon: FileText, color: 'text-rose-400 bg-rose-950/40 border-rose-800' },
    { id: 'docx', label: 'Word Document', ext: '.docx', icon: FileText, color: 'text-blue-400 bg-blue-950/40 border-blue-800' },
    { id: 'ppt', label: 'PowerPoint Deck', ext: '.pptx', icon: Presentation, color: 'text-amber-400 bg-amber-950/40 border-amber-800' },
    { id: 'excel', label: 'Excel Financials', ext: '.xlsx', icon: FileSpreadsheet, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800' },
    { id: 'json', label: 'JSON Data Stream', ext: '.json', icon: FileCode, color: 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Report Preview Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            Generated Intelligence Reports & Previews
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono font-bold">5 MASTER COMPILATIONS READY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const Icon = report.icon;

            return (
              <motion.div
                key={report.id}
                whileHover={{ scale: 1.01, y: -3 }}
                className="glass-panel rounded-3xl p-6 border-white/5 hover:border-[#D4AF37]/40 relative overflow-hidden transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[#D4AF37]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white">{report.title}</h4>
                        <span className="text-[9.5px] text-zinc-500 font-mono font-bold block">{report.pages} Pages • {report.date}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-medium leading-relaxed line-clamp-3">
                    {report.previewText}
                  </p>
                </div>

                {/* Preview & Download Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900">
                  <button
                    onClick={() => setSelectedPreview(report)}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> Preview
                  </button>

                  <button
                    onClick={() => onTriggerExport('pdf')}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] hover:from-[#FFD95A] hover:to-[#D4AF37] text-black text-xs font-extrabold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/10"
                  >
                    <Download className="w-3.5 h-3.5 fill-black" /> Download
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Export Center Section */}
      <div className="glass-panel border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#D4AF37]" />
              Enterprise Report Export Center
            </h3>
            <p className="text-xs text-zinc-400 font-semibold mt-0.5">
              Export full intelligence artifacts into raw data streams or presentation packages.
            </p>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">5 FORMATS SUPPORTED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {exportFormats.map((fmt) => {
            const FmtIcon = fmt.icon;

            return (
              <button
                key={fmt.id}
                onClick={() => onTriggerExport(fmt.id)}
                className="bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-[#D4AF37]/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 cursor-pointer group"
              >
                <div className={`p-3 rounded-xl border ${fmt.color}`}>
                  <FmtIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-white">{fmt.label}</span>
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase">{fmt.ext}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Modal Dialog */}
      <AnimatePresence>
        {selectedPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPreview(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0F0F10] border border-[#D4AF37]/40 rounded-3xl p-6 relative z-10 space-y-4 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#D4AF37]/15 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">{selectedPreview.title}</h4>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold">PREVIEW MODE • {selectedPreview.pages} PAGES</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPreview(null)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 border border-zinc-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 text-xs text-zinc-300 font-semibold leading-relaxed space-y-3 max-h-[300px] overflow-y-auto font-mono scrollbar-thin">
                <span className="text-[#D4AF37] font-bold block uppercase">[CLASSIFIED INNOVATIONHUB BRIEF]</span>
                <p>{selectedPreview.previewText}</p>
                <p>Status: {selectedPreview.status} with 99.4% precision index across database vectors.</p>
                <p>Compiled on: {selectedPreview.date} via Groq Llama 3.3 70B Multi-Agent Execution Stream.</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-mono text-zinc-500 font-bold">READY FOR PRINT & EXPORT</span>
                <button
                  onClick={() => {
                    setSelectedPreview(null);
                    window.print();
                  }}
                  className="bg-[#D4AF37] hover:bg-[#FFD95A] text-black text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
