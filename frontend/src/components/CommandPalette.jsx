import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  Lightbulb, 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Rocket, 
  Folder, 
  Cpu, 
  FileText, 
  Settings,
  Play,
  Presentation,
  FileCode,
  Sliders
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onNavigate, onTriggerAction }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Commands list as explicitly requested
  const commands = [
    { id: 'run-workflow', label: 'Run Workflow (All Cognitive Agents)', category: 'Execution', icon: Play, action: () => onTriggerAction('run-all') },
    { id: 'search-reports', label: 'Search Reports & Executive Insights', category: 'Search', icon: Search, action: () => onNavigate('reports') },
    { id: 'open-project', label: 'Open Project Database', category: 'Database', icon: Folder, action: () => onNavigate('projects') },
    { id: 'generate-pdf', label: 'Generate PDF Executive Report', category: 'Export', icon: FileText, action: () => onTriggerAction('generate-pdf') },
    { id: 'generate-ppt', label: 'Generate PPT Slide Deck', category: 'Export', icon: Presentation, action: () => onTriggerAction('generate-ppt') },
    { id: 'settings', label: 'System & Agent Settings', category: 'Settings', icon: Settings, action: () => onNavigate('settings') },

    // Additional Navigation
    { id: 'go-dashboard', label: 'Go to AI Command Center Dashboard', category: 'Navigation', icon: Terminal, action: () => onNavigate('dashboard') },
    { id: 'go-validation', label: 'Idea Validation Board', category: 'Navigation', icon: Lightbulb, action: () => onNavigate('validation') },
    { id: 'go-market', label: 'Market Intelligence Analyst', category: 'Navigation', icon: BarChart, action: () => onNavigate('market') },
    { id: 'go-strategy', label: 'Business Strategy Consultant', category: 'Navigation', icon: TrendingUp, action: () => onNavigate('strategy') },
    { id: 'go-finance', label: 'Finance Modeling Workspace', category: 'Navigation', icon: DollarSign, action: () => onNavigate('finance') },
    { id: 'go-legal', label: 'Legal Guardian Console', category: 'Navigation', icon: Shield, action: () => onNavigate('legal') },
    { id: 'go-marketing', label: 'Growth Marketing Studio', category: 'Navigation', icon: Rocket, action: () => onNavigate('marketing') }
  ];

  // Filter commands by query
  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-[#0F0F10] border border-[#D4AF37]/30 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.2)] relative z-10 overflow-hidden flex flex-col"
          >
            
            {/* Search Input */}
            <div className="h-14 border-b border-zinc-800 flex items-center px-4 gap-3 bg-zinc-950/80">
              <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search (e.g. Run Workflow, Generate PDF)..."
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none h-full font-medium"
              />
              <span className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 uppercase">
                CTRL + K / ESC
              </span>
            </div>

            {/* Command List */}
            <div className="max-h-[340px] overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filtered.length > 0 ? (
                filtered.map((cmd, idx) => {
                  const CmdIcon = cmd.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between text-xs transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent text-white border-l-[3px] border-[#D4AF37] pl-3' 
                          : 'text-zinc-400 hover:bg-zinc-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <CmdIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FFD95A]' : 'text-zinc-500'}`} />
                        <span className="font-bold">{cmd.label}</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono text-zinc-500 font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {cmd.category}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-zinc-500 text-xs font-semibold">
                  No matching commands found
                </div>
              )}
            </div>

            {/* Keyboard Guide Footer */}
            <div className="h-10 border-t border-zinc-800 px-4 bg-zinc-950/60 flex items-center justify-between text-[9px] uppercase font-mono text-zinc-400 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>Command Palette (CTRL + K)</span>
              </span>
              <span>Press <kbd className="bg-zinc-900 px-1 rounded text-zinc-300">⏎ Enter</kbd> to execute</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
