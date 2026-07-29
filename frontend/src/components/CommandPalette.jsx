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
  Settings 
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onNavigate, onTriggerAction }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Command entries list
  const commands = [
    { id: 'go-dashboard', label: 'Go to Master OS Dashboard', category: 'Navigation', icon: Terminal, action: () => onNavigate('dashboard') },
    { id: 'go-validation', label: 'Go to Idea Validation Board', category: 'Navigation', icon: Lightbulb, action: () => onNavigate('validation') },
    { id: 'go-market', label: 'Go to Market Intelligence Analyst', category: 'Navigation', icon: BarChart, action: () => onNavigate('market') },
    { id: 'go-strategy', label: 'Go to Business Strategy Consultant', category: 'Navigation', icon: TrendingUp, action: () => onNavigate('strategy') },
    { id: 'go-finance', label: 'Go to Finance modeling Workspace', category: 'Navigation', icon: DollarSign, action: () => onNavigate('finance') },
    { id: 'go-legal', label: 'Go to Legal Guardian Console', category: 'Navigation', icon: Shield, action: () => onNavigate('legal') },
    { id: 'go-marketing', label: 'Go to Growth Marketing Studio', category: 'Navigation', icon: Rocket, action: () => onNavigate('marketing') },
    { id: 'go-projects', label: 'Go to Startup Projects database', category: 'Navigation', icon: Folder, action: () => onNavigate('projects') },
    { id: 'go-memory', label: 'Go to Shared Vector Memory graph', category: 'Navigation', icon: Cpu, action: () => onNavigate('memory') },
    { id: 'go-reports', label: 'Go to Agent Reports Compiler', category: 'Navigation', icon: FileText, action: () => onNavigate('reports') },
    { id: 'go-settings', label: 'Go to System Configurations Settings', category: 'Navigation', icon: Settings, action: () => onNavigate('settings') },
    
    // Quick executions
    { id: 'run-all', label: 'Execute All Cognitive Agents Pipeline', category: 'Actions', icon: Terminal, action: () => onTriggerAction('run-all') },
    { id: 'reset-memory', label: 'Flush Vector Memory Database', category: 'Actions', icon: Cpu, action: () => onTriggerAction('reset-memory') },
    { id: 'test-api', label: 'Run System Groq Connection Test', category: 'Actions', icon: Settings, action: () => onTriggerAction('test-connection') }
  ];

  // Filter commands by search input
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

  // Handle keyboard navigation inside command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
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
          
          {/* Backdrop Glass overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl bg-[#0F0F10] border border-[#D4AF37]/25 rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
          >
            
            {/* Search Input bar */}
            <div className="h-14 border-b border-zinc-900 flex items-center px-4 gap-3">
              <Search className="w-4 h-4 text-zinc-550 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search commands, navigate workspaces..."
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none h-full"
              />
              <span className="text-[9px] font-bold text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-900 uppercase">ESC</span>
            </div>

            {/* Commands List */}
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
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
                      className={`w-full text-left px-3 py-3 rounded-xl flex items-center justify-between text-xs transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#D4AF37]/10 text-white border-l-[3px] border-[#D4AF37] pl-[9px]' 
                          : 'text-zinc-400 hover:bg-zinc-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <CmdIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-zinc-650'}`} />
                        <span className="font-semibold">{cmd.label}</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono text-zinc-600 font-bold bg-zinc-950/80 border border-zinc-900 px-1.5 py-0.5 rounded">
                        {cmd.category}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-zinc-600 text-xs font-semibold">
                  No commands match your query
                </div>
              )}
            </div>

            {/* Bottom Keyboard Guide info */}
            <div className="h-10 border-t border-zinc-900 px-4 bg-zinc-950/50 flex items-center justify-between text-[9px] uppercase font-mono text-zinc-550 font-bold">
              <span>Use arrows to navigate</span>
              <span className="flex items-center gap-1">
                <span>Press</span>
                <kbd className="bg-zinc-900 px-1 rounded text-zinc-400">⏎ Enter</kbd>
                <span>to execute</span>
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
