import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Send, X, ArrowRight } from 'lucide-react';

export default function CommandCenter({ onNavigate, onTriggerAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, sender: 'assistant', text: 'InnovationHub AI Assistant Online. Ready to orchestrate cognitive pipelines.' }
  ]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, logs]);

  const quickActions = [
    { label: 'Run All Agents', action: 'run-all' },
    { label: 'Flush Memory', action: 'reset-memory' },
    { label: 'Audit Settings', action: 'go-settings' },
    { label: 'View Reports', action: 'go-reports' }
  ];

  const handleSend = (textToSend = input) => {
    const text = textToSend.trim();
    if (!text) return;

    // Add user log
    const userLog = { id: Date.now(), sender: 'user', text };
    setLogs((prev) => [...prev, userLog]);
    setInput('');

    // Simulate agent reaction
    setTimeout(() => {
      let replyText = '';
      const textLower = text.toLowerCase();

      if (textLower.includes('run all') || textLower.includes('all agents')) {
        replyText = 'Initiating full concurrent startup pipelines. Spawning validation, strategy, finance, market, legal, and growth marketing agents.';
        onTriggerAction('run-all');
      } else if (textLower.includes('flush') || textLower.includes('memory')) {
        replyText = 'Flushing index namespaces. All vector connections are reset to core node definitions.';
        onTriggerAction('reset-memory');
      } else if (textLower.includes('settings')) {
        replyText = 'Routing to system configurations dashboard.';
        onNavigate('settings');
      } else if (textLower.includes('reports') || textLower.includes('report')) {
        replyText = 'Opening agent reports database compiler.';
        onNavigate('reports');
      } else if (textLower.includes('finance') || textLower.includes('financial')) {
        replyText = 'Focusing workspace on Finance Modeling Agent.';
        onNavigate('finance');
      } else if (textLower.includes('legal') || textLower.includes('guardian')) {
        replyText = 'Focusing workspace on Legal Guardian Agent.';
        onNavigate('legal');
      } else if (textLower.includes('strategy') || textLower.includes('business')) {
        replyText = 'Focusing workspace on Business Strategy Agent.';
        onNavigate('strategy');
      } else if (textLower.includes('validation') || textLower.includes('idea')) {
        replyText = 'Focusing workspace on Chief Innovation Officer (Idea Validation).';
        onNavigate('validation');
      } else {
        replyText = `Orchestrator instruction received: "${text}". Command compiled successfully. Launching agent thread.`;
      }

      setLogs((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'assistant', text: replyText }
      ]);
    }, 850);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.85, y: 50, filter: 'blur(10px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 glass-panel border-[#D4AF37]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[400px]"
          >
            {/* Header */}
            <div className="h-12 border-b border-zinc-900 px-4 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Command Console</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Logs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex flex-col max-w-[85%] ${
                    log.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[8px] uppercase font-mono text-zinc-650 font-bold mb-0.5">
                    {log.sender === 'user' ? 'Operator' : 'OS Assistant'}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed font-semibold ${
                      log.sender === 'user'
                        ? 'bg-[#D4AF37] text-[#070707] rounded-tr-none'
                        : 'bg-zinc-900 text-zinc-300 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {log.text}
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Quick action buttons list */}
            <div className="px-4 py-2 border-t border-zinc-900/60 bg-zinc-950/20 flex flex-wrap gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.label)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="h-12 border-t border-zinc-900 px-3 py-2 bg-zinc-950 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-600 shrink-0" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Instruct workspace co-founder..."
                className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-1.5 bg-[#D4AF37] disabled:bg-zinc-900 disabled:text-zinc-650 text-black rounded-lg transition-all cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD95A] shadow-[0_0_20px_rgba(212,175,55,0.45)] border border-[#FFD95A]/30 flex items-center justify-center cursor-pointer text-black"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
      </motion.button>
    </div>
  );
}
