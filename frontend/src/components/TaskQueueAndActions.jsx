import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  Download, 
  ListOrdered, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function TaskQueueAndActions({
  status = 'idle', // idle, processing, paused, completed, failed
  onTriggerAction = () => {},
  onSelectAgentRun = () => {}
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 'task-1', name: 'Chief Innovation Officer - Pitch Validation', status: 'completed', duration: '1.4s', priority: 'CRITICAL', agent: 'Idea Validation' },
    { id: 'task-2', name: 'Market Analyst - TAM/SAM & Competitor Scrape', status: 'running', duration: '1.1s', priority: 'HIGH', agent: 'Market Intelligence' },
    { id: 'task-3', name: 'Strategy Consultant - Unit Economics Moat', status: 'queued', duration: '--', priority: 'HIGH', agent: 'Business Strategy' },
    { id: 'task-4', name: 'Chartered Analyst - 5-Year Break-Even', status: 'queued', duration: '--', priority: 'NORMAL', agent: 'Finance Intelligence' },
    { id: 'task-5', name: 'Legal Consultant - Regulatory Compliance Audit', status: 'queued', duration: '--', priority: 'HIGH', agent: 'Legal Guardian' },
    { id: 'task-6', name: 'Marketing Director - Growth Funnel & CAC', status: 'queued', duration: '--', priority: 'NORMAL', agent: 'Marketing Studio' }
  ]);

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      onTriggerAction('resume-workflow');
    } else {
      setIsPaused(true);
      onTriggerAction('pause-workflow');
    }
  };

  const handleRetryFailed = () => {
    setTasks((prev) =>
      prev.map((t) => (t.status === 'failed' ? { ...t, status: 'queued' } : t))
    );
    onTriggerAction('restart-failed');
  };

  const handleCancelTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    onTriggerAction('cancel-task');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Quick Actions Panel (5 Cols) */}
      <div className="lg:col-span-5 glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              Quick Actions Center
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono font-bold">OPERATOR CONTROLS</span>
          </div>

          <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-4">
            Dispatch orchestrator directives across active cognitive nodes, control execution flow, or generate instant reports.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Run All Agents */}
            <button
              onClick={() => onTriggerAction('run-all')}
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] hover:from-[#FFD95A] hover:to-[#D4AF37] text-black text-xs font-extrabold p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D4AF37]/10"
            >
              <Play className="w-3.5 h-3.5 fill-black" /> Run All Agents
            </button>

            {/* Pause / Resume Workflow */}
            <button
              onClick={handlePauseResume}
              className={`border text-xs font-bold p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isPaused 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />}
              {isPaused ? 'Resume Workflow' : 'Pause Workflow'}
            </button>

            {/* Run Selected Agent */}
            <button
              onClick={() => onSelectAgentRun('validation')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Run Selected Agent
            </button>

            {/* Restart Failed Agent */}
            <button
              onClick={handleRetryFailed}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Restart Failed
            </button>

            {/* Generate Report */}
            <button
              onClick={() => onTriggerAction('generate-report')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Generate Report
            </button>

            {/* Export Results */}
            <button
              onClick={() => onTriggerAction('export-results')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" /> Export Results
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold">
          <span>LATENCY TARGET: &lt;1.5s PER NODE</span>
          <span className="text-[#D4AF37]">SYSTEM ACTIVE</span>
        </div>
      </div>

      {/* Task Queue Manager Panel (7 Cols) */}
      <div className="lg:col-span-7 glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-white flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-[#D4AF37]" />
              Live Task Queue & Execution Sequence
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Running: {tasks.filter(t => t.status === 'running').length}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                Queued: {tasks.filter(t => t.status === 'queued').length}
              </span>
            </div>
          </div>

          {/* Queue List */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {tasks.map((task) => {
              let statusBadge = (
                <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> QUEUED
                </span>
              );

              if (task.status === 'running') {
                statusBadge = (
                  <span className="text-[9px] font-mono uppercase font-bold text-[#FFD95A] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin text-[#FFD95A]" /> RUNNING
                  </span>
                );
              } else if (task.status === 'completed') {
                statusBadge = (
                  <span className="text-[9px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> DONE
                  </span>
                );
              } else if (task.status === 'failed') {
                statusBadge = (
                  <span className="text-[9px] font-mono uppercase font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <XCircle className="w-2.5 h-2.5" /> FAILED
                  </span>
                );
              }

              let priorityColor = 'text-zinc-500 bg-zinc-900';
              if (task.priority === 'CRITICAL') priorityColor = 'text-rose-400 bg-rose-950/60 border border-rose-800/50';
              else if (task.priority === 'HIGH') priorityColor = 'text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30';

              return (
                <div
                  key={task.id}
                  className="bg-zinc-950/70 border border-white/5 hover:border-[#D4AF37]/20 rounded-xl p-3 flex items-center justify-between gap-3 text-xs transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[8.5px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase ${priorityColor}`}>
                      {task.priority}
                    </span>
                    <span className="text-zinc-200 font-bold truncate">{task.name}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-500">{task.duration}</span>
                    {statusBadge}
                    
                    <button
                      onClick={() => handleCancelTask(task.id)}
                      className="p-1 rounded text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Cancel Task"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex justify-between items-center text-[10px] font-mono text-zinc-500 font-bold">
          <span>DISPATCHER: LANGGRAPH PIPELINE SCHEDULER</span>
          <button 
            onClick={handleRetryFailed}
            className="text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Retry Failed Tasks
          </button>
        </div>
      </div>

    </div>
  );
}
