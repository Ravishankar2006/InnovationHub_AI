import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  Compass, 
  Lock, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  ShieldAlert, 
  Megaphone,
  Key,
  Database
} from 'lucide-react';

function App() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, validating, completed, failed
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('validation');

  // We can poll backend for progress
  useEffect(() => {
    let intervalId;
    if (projectId && (status === 'created' || status === 'validating' || status === 'processing')) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/startup/${projectId}`);
          if (!res.ok) throw new Error('Failed to fetch status');
          const data = await res.json();
          
          setStatus(data.status);
          if (data.status === 'completed') {
            setResults(data.results);
            setLoading(false);
            clearInterval(intervalId);
          } else if (data.status === 'failed') {
            setErrorMsg(data.results.idea_validation_error?.error || 'Validation failed. Check API Key.');
            setLoading(false);
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [projectId, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResults(null);
    setStatus('created');

    try {
      const res = await fetch('http://localhost:8000/api/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to submit idea');
      }

      const data = await res.json();
      setProjectId(data.project_id);
      setStatus(data.status);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
      setStatus('failed');
    }
  };

  const agents = [
    { id: 'validation', name: 'Idea Validation', icon: Compass, active: true, desc: 'Chief Innovation Officer', status: status === 'completed' ? 'done' : status === 'validating' || status === 'processing' || status === 'created' ? 'running' : 'idle' },
    { id: 'market', name: 'Market Research', icon: TrendingUp, active: false, desc: 'Market Research Analyst', status: 'locked' },
    { id: 'strategy', name: 'Business Strategy', icon: Database, active: true, desc: 'Startup Strategy Consultant', status: status === 'completed' ? 'done' : status === 'validating' || status === 'processing' || status === 'created' ? 'running' : 'idle' },
    { id: 'finance', name: 'Finance', icon: DollarSign, active: false, desc: 'Chartered Financial Analyst', status: 'locked' },
    { id: 'legal', name: 'Legal & Compliance', icon: FileText, active: false, desc: 'AI Legal Consultant', status: 'locked' },
    { id: 'marketing', name: 'Marketing & Pitch', icon: Megaphone, active: false, desc: 'Marketing Director', status: 'locked' },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col">
      {/* Header */}
      <header className="glass-panel border-b sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              InnovationHub AI
            </h1>
            <p className="text-xs text-slate-400">The Autonomous AI Co-Founder</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          FastAPI & SQLite Sandbox Online
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - AI Workforce */}
        <section className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 px-1">
            Startup Consulting Cohort
          </h2>
          <div className="space-y-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div 
                  key={agent.id} 
                  className={`p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    agent.active 
                      ? 'glass-card border-indigo-500/30 bg-slate-900/40' 
                      : 'opacity-50 bg-slate-950/20 border border-slate-900'
                  }`}
                >
                  {/* Status Indicator */}
                  {!agent.active && (
                    <div className="absolute top-2 right-2 p-1 bg-slate-900 border border-slate-800 rounded-md text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${
                      agent.active 
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">{agent.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{agent.desc}</p>
                      
                      {/* Active Agent Statuses */}
                      {agent.active && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px]">
                          {agent.status === 'idle' && (
                            <span className="text-slate-500 bg-slate-900/80 border border-slate-850 px-2 py-0.5 rounded-full">
                              Waiting
                            </span>
                          )}
                          {agent.status === 'running' && (
                            <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                              <Loader2 className="w-3 h-3 animate-spin" /> Analyzing
                            </span>
                          )}
                          {agent.status === 'done' && (
                            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Completed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Dashboard Body */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Idea Input Card */}
          <div className="glass-panel rounded-2xl p-6 glow-border">
            <h2 className="text-lg font-bold text-white mb-2">🚀 Pitch Your Startup Idea</h2>
            <p className="text-sm text-slate-400 mb-4">
              Describe your business concept in a few sentences. Our Chief Innovation Officer agent will validate it, calculate originality, and flag potential roadblocks.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={loading}
                placeholder='Example: "I want to build an AI-powered drone platform for agriculture that monitors crop health and automates pesticide spraying."'
                className="w-full min-h-[100px] bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  Phase 1: Validating startup idea feasibility
                </div>
                <button
                  type="submit"
                  disabled={loading || !idea.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold px-5 py-2.5 rounded-xl border border-indigo-400/20 shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Validate Idea
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Error Message & Setup Guide */}
          {errorMsg && (
            <div className="glass-card border-rose-500/20 bg-rose-500/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <h3 className="font-bold">Agent Execution Failed</h3>
              </div>
              <p className="text-sm text-slate-300">
                The agent was unable to connect to the Groq LLM engine. Reason:
                <code className="block bg-slate-950 px-3 py-2 rounded-lg mt-2 text-rose-300 font-mono text-xs border border-rose-950">
                  {errorMsg}
                </code>
              </p>
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Quick Configuration Guide
                </h4>
                <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                  <li>
                    Generate a key at the{' '}
                    <a 
                      href="https://console.groq.com/keys" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-indigo-400 underline hover:text-indigo-300"
                    >
                      Groq Console Keys dashboard
                    </a>.
                  </li>
                  <li>
                    Create or open the backend <span className="font-mono text-slate-200">.env</span> file at:
                    <code className="block bg-slate-950 px-2 py-1 rounded text-slate-300 font-mono mt-1 text-[11px]">
                      InnovationHubAI/backend/.env
                    </code>
                  </li>
                  <li>
                    Paste the key:
                    <code className="block bg-slate-950 px-2 py-1 rounded text-slate-300 font-mono mt-1 text-[11px]">
                      GROQ_API_KEY=your_copied_api_key
                    </code>
                  </li>
                  <li>Save the file and try validating again.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Live Progress Banner */}
          {loading && status !== 'completed' && (
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                <Compass className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  {status === 'processing' 
                    ? 'Startup Strategy Consultant is formulating plan...' 
                    : 'Chief Innovation Officer is validating idea...'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {status === 'processing'
                    ? 'Designing monetization models, pricing structures, competitive moats, and roadmap timelines.'
                    : 'Calculating uniqueness, estimating feasibility, defining target users, and summarizing product risk matrices.'}
                </p>
              </div>
              <div className="w-48 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-indigo-500 h-full w-2/3 rounded-full animate-[pulse-glow_1.5s_infinite_ease-in-out]"></div>
              </div>
            </div>
          )}

          {/* Validation & Strategy Results Dashboard */}
          {status === 'completed' && results && results.idea_validation && (
            <div className="space-y-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 gap-6 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('validation')}
                  className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                    activeTab === 'validation'
                      ? 'border-indigo-500 text-white font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-350'
                  }`}
                >
                  Validation Report
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('strategy')}
                  className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                    activeTab === 'strategy'
                      ? 'border-indigo-500 text-white font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-350'
                  }`}
                >
                  Business Strategy
                </button>
              </div>

              {activeTab === 'validation' && (
                <div className="space-y-6">
                  {/* Score & Summary Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Score Dial */}
                    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                        Innovation Score
                      </h3>
                      <div className="relative flex items-center justify-center">
                        {/* Ring background */}
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle 
                            cx="64" 
                            cy="64" 
                            r="52" 
                            className="stroke-slate-800" 
                            strokeWidth="8" 
                            fill="transparent" 
                          />
                          <circle 
                            cx="64" 
                            cy="64" 
                            r="52" 
                            className="stroke-indigo-500" 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={326.7}
                            strokeDashoffset={326.7 - (326.7 * results.idea_validation.innovation_score) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-3xl font-extrabold tracking-tight text-white">
                            {results.idea_validation.innovation_score}
                          </span>
                          <span className="text-xs text-slate-500 block">/ 100</span>
                        </div>
                      </div>
                    </div>

                    {/* Problem Statement & Value Proposition */}
                    <div className="md:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Core Pain Points Addressed
                        </h3>
                        <p className="text-sm text-slate-205 leading-relaxed">
                          {results.idea_validation.problem_statement}
                        </p>
                      </div>
                      <div className="border-t border-slate-900 pt-4 mt-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                          Proposed Value Proposition
                        </h3>
                        <p className="text-sm text-indigo-200/90 italic font-medium leading-relaxed">
                          "{results.idea_validation.value_proposition}"
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Target Audience Badge list */}
                  <div className="glass-panel rounded-2xl p-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Target User Segments
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.idea_validation.target_audience.map((audience, idx) => (
                        <span 
                          key={idx} 
                          className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full"
                        >
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Risks vs Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Risk Register */}
                    <div className="glass-panel rounded-2xl p-6 border-amber-500/10">
                      <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Potential Obstacles & Risks
                      </h3>
                      <ul className="space-y-3">
                        {results.idea_validation.risks.map((risk, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-350 leading-relaxed">
                            <span className="text-amber-500 mt-1 shrink-0">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="glass-panel rounded-2xl p-6 border-indigo-500/15">
                      <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" /> Strategic Recommendations
                      </h3>
                      <ul className="space-y-3">
                        {results.idea_validation.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-300 leading-relaxed">
                            <span className="text-indigo-400 mt-1 shrink-0">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'strategy' && results.business_strategy && (
                <div className="space-y-6">
                  
                  {/* Grid for Business Model and Pricing Model */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Business Model */}
                    <div className="glass-panel rounded-2xl p-6 border-indigo-500/10">
                      <h3 className="text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-500" /> Business Model
                      </h3>
                      <p className="text-sm text-slate-205 leading-relaxed">
                        {results.business_strategy.business_model}
                      </p>
                    </div>

                    {/* Pricing Model */}
                    <div className="glass-panel rounded-2xl p-6 border-indigo-500/10">
                      <h3 className="text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-indigo-500" /> Pricing Strategy
                      </h3>
                      <p className="text-sm text-slate-205 leading-relaxed">
                        {results.business_strategy.pricing_model}
                      </p>
                    </div>

                  </div>

                  {/* Moat & GTM */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Competitive Moat */}
                    <div className="md:col-span-1 glass-panel rounded-2xl p-6 border-emerald-500/10">
                      <h3 className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Competitive Moat
                      </h3>
                      <p className="text-sm text-slate-205 leading-relaxed">
                        {results.business_strategy.competitive_moat}
                      </p>
                    </div>

                    {/* Go-To-Market Tactics */}
                    <div className="md:col-span-2 glass-panel rounded-2xl p-6 border-indigo-500/10">
                      <h3 className="text-xs font-bold text-indigo-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-500" /> Go-To-Market Tactics
                      </h3>
                      <ul className="space-y-3">
                        {results.business_strategy.go_to_market.map((tactic, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-205 leading-relaxed">
                            <span className="text-indigo-400 mt-1 shrink-0">•</span>
                            <span>{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Roadmap Timeline */}
                  <div className="glass-panel rounded-2xl p-6 border-slate-800">
                    <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                      <Compass className="w-4 h-4 text-indigo-400" /> 30-60-90 Day Roadmap
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                      
                      {/* Day 30 */}
                      <div className="relative pl-6 border-l-2 border-indigo-500/30 hover:border-indigo-500 transition-all duration-300">
                        <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-950"></div>
                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Days 1 - 30</h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                          Product MVP & Validation
                        </p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {results.business_strategy.roadmap.phase_1_30_days}
                        </p>
                      </div>

                      {/* Day 60 */}
                      <div className="relative pl-6 border-l-2 border-indigo-500/30 hover:border-indigo-500 transition-all duration-300">
                        <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-950"></div>
                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Days 31 - 60</h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                          Beta Operations & Feedback
                        </p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {results.business_strategy.roadmap.phase_2_60_days}
                        </p>
                      </div>

                      {/* Day 90 */}
                      <div className="relative pl-6 border-l-2 border-indigo-500/30 hover:border-indigo-500 transition-all duration-300">
                        <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-950"></div>
                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">Days 61 - 90</h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                          Public Launch & Traction
                        </p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {results.business_strategy.roadmap.phase_3_90_days}
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t mt-auto py-4 px-6 text-center text-xs text-slate-500">
        InnovationHub AI — Phase 1: Idea Validation Agent. React 19 + Tailwind v4 + FastAPI SQLite.
      </footer>
    </div>
  );
}

export default App;
