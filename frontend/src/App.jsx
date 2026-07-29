import React, { useState, useEffect, useRef } from 'react';
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
  Database,
  Activity,
  Layers,
  Settings,
  User,
  LogOut,
  Folder,
  Cpu,
  BarChart,
  Shield,
  Rocket,
  Search,
  Bell,
  Sliders,
  Play,
  Square,
  FileCheck,
  Send,
  Zap,
  Info,
  Clock
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  // Navigation & Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, settings, validation, strategy, market, finance, legal, marketing, projects, memory, reports
  const [activeTab, setActiveTab] = useState('validation'); // Inner result tabs
  
  // App States
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, completed, failed
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Settings & System Metadata
  const [systemStatus, setSystemStatus] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  // Agent Config States (for UI Settings panel)
  const [tempVal, setTempVal] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  
  // Interactive UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [projectsList, setProjectsList] = useState([]);
  
  // Simulated Vector Memory database
  const [memoryInput, setMemoryInput] = useState('');
  const [vectorDb, setVectorDb] = useState([
    { id: 1, vector: '[0.12, -0.85, 0.45...]', tag: 'agri-drones', content: 'Agricultural drone precision spraying parameters and drift thresholds.' },
    { id: 2, vector: '[-0.32, 0.92, -0.11...]', tag: 'sql-ai', content: 'SQL semantic translation schemas and standard dialect mappings.' },
    { id: 3, vector: '[0.67, -0.05, 0.78...]', tag: 'pricing-model', content: 'SaaS monetization metrics: Starter, Pro, and Enterprise definitions.' }
  ]);

  // Real-time AI Ticker Logs
  const [tickerLogs, setTickerLogs] = useState([
    { id: 1, time: '12:30:15', agent: 'System', log: 'AI Operating System Online. Connected to SQLite Database.' },
    { id: 2, time: '12:31:02', agent: 'Idea Validation', log: 'Agent compiled with schema constraints.' },
    { id: 3, time: '12:31:05', agent: 'Business Strategy', log: 'Decoupled API key GROQ_STRATEGY_API_KEY detected.' }
  ]);

  // Fetch SQLite Stats
  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch system status:', err);
    }
  };

  // Fetch Projects List for Table View
  const fetchProjects = async () => {
    try {
      // Mocking project history listing or pulling from DB if we want, but since backend startup/:id is detail, 
      // we can simulate records using database values or mock projects
      setProjectsList([
        { id: 1, idea: 'Autonomous drone-as-a-service for precision crop spraying.', status: 'completed', score: 85, created_at: '2026-07-28 09:12' },
        { id: 2, idea: 'AI platform that translates natural language text into optimized SQL queries.', status: 'completed', score: 85, created_at: '2026-07-28 09:53' },
        { id: 3, idea: 'P2P marketplace for pre-loved books with local exchanges.', status: 'failed', score: 0, created_at: '2026-07-28 10:07' },
        { id: 4, idea: 'Automated locker drop-off systems for residential complexes.', status: 'completed', score: 80, created_at: '2026-07-28 12:15' }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    fetchProjects();
    
    // Add real-time logs simulator
    const interval = setInterval(() => {
      const agents = ['Idea Validation', 'Business Strategy', 'System', 'Vector Memory', 'Database Server'];
      const actions = [
        'Memory vector index flushed.',
        'API transaction checked. Code 200.',
        'Simulating context injection.',
        'Listening on port 8000.',
        'Background pipeline idle.'
      ];
      const randomAgent = agents[Math.floor(randomVal() * agents.length)];
      const randomAction = actions[Math.floor(randomVal() * actions.length)];
      const timeStr = new Date().toTimeString().split(' ')[0];
      
      setTickerLogs(prev => [
        { id: Date.now(), time: timeStr, agent: randomAgent, log: randomAction },
        ...prev.slice(0, 15)
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const randomVal = () => Math.random();

  // Poll backend for progress
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
            fetchSystemStatus();
            fetchProjects();
          } else if (data.status === 'failed') {
            setErrorMsg(data.results.idea_validation_error?.error || 'Validation failed. Check API Keys.');
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
      
      // Update ticker
      setTickerLogs(prev => [
        { id: Date.now(), time: new Date().toTimeString().split(' ')[0], agent: 'System', log: `Project ${data.project_id} initialized.` },
        ...prev
      ]);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
      setStatus('failed');
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await fetch('http://localhost:8000/api/system/test-connection', {
        method: 'POST'
      });
      const data = await res.json();
      setTestResult(data);
      fetchSystemStatus();
    } catch (err) {
      setTestResult({ success: false, detail: 'Failed to connect to backend.' });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!memoryInput.trim()) return;
    const mockVector = `[${(randomVal() - 0.5).toFixed(2)}, ${(randomVal() - 0.5).toFixed(2)}, ${(randomVal() - 0.5).toFixed(2)}...]`;
    setVectorDb(prev => [
      { id: Date.now(), vector: mockVector, tag: 'custom-input', content: memoryInput },
      ...prev
    ]);
    setMemoryInput('');
  };

  // AI Workforce menu items definition
  const workforce = [
    { id: 'validation', name: 'Idea Validation', icon: Lightbulb, model: 'llama-3.3-70b-versatile', desc: 'Chief Innovation Officer', active: true, accuracy: '94.5%', latency: '1.4s' },
    { id: 'market', name: 'Market Intelligence', icon: BarChart, model: 'llama-3.3-70b-versatile', desc: 'Market Research Analyst', active: true, accuracy: '89.2%', latency: '1.1s' },
    { id: 'strategy', name: 'Strategy Planning', icon: Cpu, model: 'llama-3.3-70b-versatile', desc: 'Startup Strategy Consultant', active: true, accuracy: '92.8%', latency: '1.6s' },
    { id: 'finance', name: 'Finance modeling', icon: DollarSign, model: 'llama-3.3-70b-versatile', desc: 'Chartered Financial Analyst', active: true, accuracy: '95.1%', latency: '1.8s' },
    { id: 'legal', name: 'Legal & Risk', icon: Shield, model: 'llama-3.3-70b-versatile', desc: 'AI Legal Consultant', active: true, accuracy: '95.0%', latency: '2.1s' },
    { id: 'marketing', name: 'Growth Marketing', icon: Rocket, model: 'llama-3.1-8b-instant', desc: 'Marketing Director', active: true, accuracy: '88.7%', latency: '0.9s' }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 selection:bg-amber-500 selection:text-black">
        {/* Luxury circular backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[30%] w-[80%] h-[80%] rounded-full bg-radial from-amber-500/5 to-transparent blur-3xl"></div>
          <div className="absolute -bottom-[30%] -right-[30%] w-[80%] h-[80%] rounded-full bg-radial from-amber-500/3 to-transparent blur-3xl"></div>
        </div>

        {/* Login Container */}
        <div className="w-full max-w-md relative animate-fade-in">
          
          {/* Hex Circuit Logo decoration */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30 transform hover:rotate-45 transition-all duration-700 cursor-pointer mb-4">
              <Layers className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              InnovationHub AI
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Autonomous AI Operating System</p>
          </div>

          <div className="glass-panel border-amber-500/15 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            
            {/* Corner ambient glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-amber-500/10 blur-xl"></div>
            
            <h2 className="text-xl font-bold text-white mb-1">Access Console</h2>
            <p className="text-xs text-zinc-450 mb-6">Enter credentials to authenticate with the AI workforce.</p>

            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-450 tracking-wider mb-1.5">Username or ID</label>
                <input 
                  type="text" 
                  defaultValue="admin"
                  placeholder="enter username"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none transition-all placeholder-zinc-700"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-450 tracking-wider mb-1.5">Security Token</label>
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  placeholder="enter passcode"
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none transition-all placeholder-zinc-700"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-black font-bold py-3.5 rounded-xl border border-amber-400/20 shadow-md shadow-amber-500/15 transition-all text-xs uppercase tracking-wider cursor-pointer"
                >
                  Verify & Connect
                </button>
              </div>
            </form>
          </div>
          
          <div className="text-center mt-6">
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Secure sandbox v1.0.4</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-black">
      
      {/* Golden subtle ambient nodes */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[100px] left-[20%] w-[600px] h-[300px] rounded-full bg-radial from-amber-500/4 to-transparent blur-3xl"></div>
        <div className="absolute top-[200px] right-[10%] w-[400px] h-[400px] rounded-full bg-radial from-amber-500/2 to-transparent blur-3xl"></div>
      </div>

      <div className="flex flex-1 z-10 relative">
        
        {/* LEFT SIDEBAR */}
        <aside className={`${sidebarExpanded ? 'w-64' : 'w-20'} shrink-0 bg-zinc-950 border-r border-zinc-900 flex flex-col transition-all duration-300 z-40 relative`}>
          
          {/* Hexagonal Circuit Logo */}
          <div className="h-20 border-b border-zinc-900 flex items-center px-5 gap-3.5">
            <div 
              onClick={() => setCurrentView('dashboard')}
              className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center border border-amber-400/20 shadow-md shadow-amber-500/10 hover:rotate-45 cursor-pointer transition-all duration-500 shrink-0"
            >
              <Layers className="w-5 h-5 text-black" />
            </div>
            {sidebarExpanded && (
              <div>
                <h1 className="text-sm font-extrabold text-white tracking-wide">InnovationHub AI</h1>
                <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">OS Core v1.4</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 overflow-y-auto px-3 space-y-7">
            
            {/* OS Workforce Submenu */}
            <div className="space-y-1.5">
              <span className={`px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-3 ${!sidebarExpanded && 'text-center'}`}>
                {sidebarExpanded ? '🧠 AI Workforce' : '🧠'}
              </span>
              
              <div className="space-y-1">
                {workforce.map((agent) => {
                  const Icon = agent.icon;
                  const isRouteActive = currentView === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setCurrentView(agent.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3.5 transition-all relative group cursor-pointer ${
                        isRouteActive 
                          ? 'bg-zinc-900 text-amber-500 border-l-[3px] border-amber-500 pl-[9px] shadow-sm shadow-amber-500/5' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isRouteActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      {sidebarExpanded && (
                        <div className="flex-1 flex justify-between items-center">
                          <span>{agent.name}</span>
                          {!agent.active && (
                            <span className="text-[9px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800/60 uppercase">Mock</span>
                          )}
                        </div>
                      )}
                      
                      {/* Gold Hover Glow Border */}
                      <div className="absolute inset-0 rounded-xl border border-amber-500/0 group-hover:border-amber-500/10 pointer-events-none transition-all"></div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General OS Navigation */}
            <div className="space-y-1.5">
              <span className={`px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-3 ${!sidebarExpanded && 'text-center'}`}>
                {sidebarExpanded ? '📂 System Repository' : '📂'}
              </span>
              
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('projects')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'projects' ? 'bg-zinc-900 text-amber-500' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <Folder className="w-4 h-4 text-zinc-500" />
                  {sidebarExpanded && <span>Startup Projects</span>}
                </button>

                <button
                  onClick={() => setCurrentView('memory')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'memory' ? 'bg-zinc-900 text-amber-500' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  {sidebarExpanded && <span>Shared Memory</span>}
                </button>

                <button
                  onClick={() => setCurrentView('reports')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'reports' ? 'bg-zinc-900 text-amber-500' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-zinc-500" />
                  {sidebarExpanded && <span>Agent Reports</span>}
                </button>

                <button
                  onClick={() => setCurrentView('settings')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'settings' ? 'bg-zinc-900 text-amber-500' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <Settings className="w-4 h-4 text-zinc-500" />
                  {sidebarExpanded && <span>System Settings</span>}
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar Footer User profile */}
          <div className="p-4 border-t border-zinc-900 space-y-3">
            {sidebarExpanded && (
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 font-black text-xs uppercase shadow">
                  ad
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">Console Admin</h4>
                  <span className="text-[9px] text-zinc-500 mt-1 block">Root developer access</span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full text-left px-3 py-2 text-zinc-500 hover:text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-3.5 hover:bg-rose-500/5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {sidebarExpanded && <span>Log Out</span>}
            </button>
          </div>

        </aside>

        {/* MAIN BODY CONTEXT */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* TOP NAVBAR */}
          <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
            
            {/* Left page indicator */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="p-1.5 rounded-lg border border-zinc-900 text-zinc-500 hover:text-white bg-zinc-950 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-zinc-500 uppercase tracking-widest">Active Workspace:</span>
                <span className="text-amber-500 uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                  {currentView === 'dashboard' ? 'Overview OS' : currentView}
                </span>
              </div>
            </div>

            {/* Right utilities */}
            <div className="flex items-center gap-6">
              
              {/* Search Bar */}
              <div className="relative w-64 hidden sm:block">
                <Search className="w-4 h-4 text-zinc-650 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Command search..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all"
                />
              </div>

              {/* Notification Ticker */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl border border-zinc-900 bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 glass-panel border-zinc-900 rounded-2xl p-4 shadow-xl z-50 text-xs space-y-3">
                    <h4 className="font-bold text-white border-b border-zinc-900 pb-2">Recent Notifications</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-900">
                        <span className="text-[9px] text-amber-500 font-bold uppercase block">System Verification</span>
                        <span className="text-zinc-300 mt-1 block">Groq client connection test passed.</span>
                      </div>
                      <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-900">
                        <span className="text-[9px] text-amber-500 font-bold uppercase block">Startup Project #10</span>
                        <span className="text-zinc-300 mt-1 block">Validation and strategy files saved.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sandbox online status badge */}
              <div className="hidden lg:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-[10px] font-bold text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </div>

            </div>
          </header>

          {/* WORKSPACE PAGES PANEL */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col xl:flex-row gap-8">
            
            {/* Left Content Area */}
            <div className="flex-1 min-w-0 space-y-8">
              
              {/* PAGE 1: SYSTEM EXECUTIVE DASHBOARD */}
              {currentView === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Executive Hero Banner */}
                  <div className="glass-panel border-amber-500/10 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    
                    {/* Golden circuit overlay */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-radial from-amber-500/5 to-transparent blur-2xl pointer-events-none"></div>
                    
                    <div className="space-y-2">
                      <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent">
                        InnovationHub AI
                      </h2>
                      <p className="text-base text-zinc-300 font-medium">The Autonomous AI Co-Founder Operating System.</p>
                      <p className="text-xs text-zinc-500 max-w-xl">
                        Synthesize, evaluate, and formulate complete enterprise structures from ideas using dual concurrent Llama 70B cognitive pipelines.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => setCurrentView('validation')}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5" /> Validate Idea
                      </button>
                      <button 
                        onClick={() => setCurrentView('settings')}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-zinc-500" /> API Settings
                      </button>
                    </div>
                  </div>

                  {/* Core Statistics grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">System Health</span>
                      <span className="block text-2xl font-black text-emerald-400">99.9%</span>
                      <span className="text-[9px] text-zinc-500 block mt-1">Vite + FastAPI pipeline</span>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Active APIs</span>
                      <span className="block text-2xl font-black text-amber-500">2 Live</span>
                      <span className="text-[9px] text-zinc-500 block mt-1">Llama 70b-versatile</span>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Vector Memory</span>
                      <span className="block text-2xl font-black text-white">{vectorDb.length} nodes</span>
                      <span className="text-[9px] text-zinc-500 block mt-1">Active memory space</span>
                    </div>

                    <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Projects Analyzed</span>
                      <span className="block text-2xl font-black text-white">{projectsList.length}</span>
                      <span className="text-[9px] text-zinc-500 block mt-1">Stored in SQLite</span>
                    </div>

                  </div>

                  {/* Analytical Charts / Custom visual bars */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Startup Score index */}
                    <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                      <div>
                        <h3 className="font-bold text-sm text-white">Startup Evaluation Metrics</h3>
                        <p className="text-xs text-zinc-500">Comparing performance metrics across active sandbox projects.</p>
                      </div>
                      
                      <div className="space-y-3.5 pt-2">
                        {projectsList.filter(p => p.score > 0).map((proj, idx) => (
                          <div key={proj.id} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-zinc-300 truncate max-w-[250px]">{proj.idea}</span>
                              <span className="text-amber-500 font-bold">{proj.score}%</span>
                            </div>
                            <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800/80">
                              <div 
                                className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full" 
                                style={{ width: `${proj.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* System Memory allocation */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white">Memory Allocation</h3>
                        <p className="text-xs text-zinc-500">Vector database retrieval threshold indexes.</p>
                      </div>

                      {/* Concentric rings or simple SVG graph */}
                      <div className="flex justify-center items-center py-4">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="56" cy="56" r="46" className="stroke-zinc-900" strokeWidth="6" fill="transparent" />
                            <circle cx="56" cy="56" r="46" className="stroke-amber-500" strokeWidth="6" fill="transparent" strokeDasharray={289} strokeDashoffset={70} strokeLinecap="round" />
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-lg font-black text-white">75%</span>
                            <span className="text-[9px] text-zinc-500 block uppercase font-semibold">Load</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-[10px] text-zinc-400 border-t border-zinc-900 pt-3 flex justify-between">
                        <span>Retrieve Threshold: <strong className="text-amber-500">0.78</strong></span>
                        <span>Vector Space: <strong className="text-white">1536 dim</strong></span>
                      </div>
                    </div>

                  </div>

                  {/* Recent Startup Projects Table */}
                  <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-sm text-white">Recent Projects Repository</h3>
                        <p className="text-xs text-zinc-500">Select, review, or verify evaluation states.</p>
                      </div>
                      <button 
                        onClick={() => setCurrentView('projects')}
                        className="text-xs text-amber-500 hover:text-amber-400 font-bold transition-all cursor-pointer"
                      >
                        View All Projects
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-900 text-zinc-500 font-bold">
                            <th className="py-3 px-2">Project Idea</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Score</th>
                            <th className="py-3 px-2">Date Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectsList.slice(0, 3).map((proj) => (
                            <tr key={proj.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-zinc-300 font-semibold transition-all">
                              <td className="py-3.5 px-2 truncate max-w-[280px]">{proj.idea}</td>
                              <td className="py-3.5 px-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  proj.status === 'completed' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {proj.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-2 text-white">{proj.score > 0 ? `${proj.score}/100` : '—'}</td>
                              <td className="py-3.5 px-2 text-zinc-500">{proj.created_at}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* PAGE 2: IDEA VALIDATION AGENT VIEW */}
              {currentView === 'validation' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Agent Header info */}
                  <div className="glass-panel border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl border border-amber-400/20 shadow-md shadow-amber-500/10 text-black">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-white">Idea Validation Agent</h2>
                        <p className="text-xs text-zinc-500 font-semibold mt-0.5">Role: Chief Innovation Officer | System Model: {selectedModel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-emerald-400">Agent Online</span>
                    </div>
                  </div>

                  {/* Agent Pitch Submission panel */}
                  <div className="glass-panel rounded-2xl p-6 border-white/5">
                    <h3 className="text-sm font-bold text-white mb-2">🚀 Pitch Startup Idea to validation</h3>
                    <p className="text-xs text-zinc-550 mb-4">
                      Describe your startup concept. The validation agent will assess originality, score feasibility, target audience groups, and point out execution hurdles.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        disabled={loading}
                        placeholder='Example: "A local peer-to-peer agricultural marketplace for drone operations, enabling farmers to hire local pilots on-demand."'
                        className="w-full min-h-[120px] bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-650 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm leading-relaxed"
                      />
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex gap-4 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                          <span>Model: <strong className="text-white">{selectedModel}</strong></span>
                          <span>Temp: <strong className="text-white">{tempVal}</strong></span>
                        </div>
                        
                        <button
                          type="submit"
                          disabled={loading || !idea.trim()}
                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 text-black font-bold px-6 py-3 rounded-xl border border-amber-400/20 shadow-md shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing Pitch...
                            </>
                          ) : (
                            <>
                              Run Validation Agent <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Error guide if any */}
                  {errorMsg && (
                    <div className="glass-card border-rose-500/20 bg-rose-500/5 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-3 text-rose-450">
                        <ShieldAlert className="w-6 h-6 shrink-0" />
                        <h3 className="font-bold">Agent Pipeline Error</h3>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Failed to connect to LLM. Error log detail:
                        <code className="block bg-zinc-950 px-3 py-2 rounded-lg mt-2 text-rose-350 font-mono text-xs border border-rose-950">
                          {errorMsg}
                        </code>
                      </p>
                    </div>
                  )}

                  {/* Live Progress loading card */}
                  {loading && status !== 'completed' && (
                    <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[250px]">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin"></div>
                        <Compass className="w-5 h-5 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">
                          {status === 'processing' 
                            ? 'Startup Strategy Consultant is formulating plan...' 
                            : 'Chief Innovation Officer is validating idea...'}
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-1.5 max-w-sm leading-relaxed">
                          {status === 'processing'
                            ? 'Designing monetization models, pricing structures, competitive moats, and roadmap timelines.'
                            : 'Calculating uniqueness, estimating feasibility, defining target users, and summarizing product risk matrices.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Completed validation panel results */}
                  {status === 'completed' && results && results.idea_validation && (
                    <div className="space-y-6">
                      
                      {/* Results toggle buttons */}
                      <div className="flex border-b border-zinc-900 gap-6">
                        <button
                          type="button"
                          onClick={() => setActiveTab('validation')}
                          className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                            activeTab === 'validation'
                              ? 'border-amber-500 text-white font-extrabold shadow-sm'
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Validation Report
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('strategy')}
                          className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                            activeTab === 'strategy'
                              ? 'border-amber-500 text-white font-extrabold shadow-sm'
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Business Strategy
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('finance')}
                          className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                            activeTab === 'finance'
                              ? 'border-amber-500 text-white font-extrabold shadow-sm'
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Financial Projections
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('market')}
                          className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                            activeTab === 'market'
                              ? 'border-amber-500 text-white font-extrabold shadow-sm'
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Market Intelligence
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('legal')}
                          className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                            activeTab === 'legal'
                              ? 'border-amber-500 text-white font-extrabold shadow-sm'
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Legal & Risk
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('marketing')}
                          className={`pb-3 text-xs font-bold tracking-wide uppercase transition-all border-b-2 cursor-pointer ${
                            activeTab === 'marketing'
                              ? 'border-amber-500 text-white font-extrabold shadow-sm'
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Growth Marketing
                        </button>
                      </div>

                      {activeTab === 'validation' && (
                        <div className="space-y-6 animate-fade-in">
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Score ring */}
                            <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
                              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4">Innovation Index</h3>
                              <div className="relative flex items-center justify-center">
                                <svg className="w-28 h-28 transform -rotate-90">
                                  <circle cx="56" cy="56" r="46" className="stroke-zinc-900" strokeWidth="7" fill="transparent" />
                                  <circle cx="56" cy="56" r="46" className="stroke-amber-500" strokeWidth="7" fill="transparent" strokeDasharray={289} strokeDashoffset={289 - (289 * results.idea_validation.innovation_score) / 100} strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-center">
                                  <span className="text-2xl font-black text-white">{results.idea_validation.innovation_score}</span>
                                  <span className="text-[9px] text-zinc-500 block">/ 100</span>
                                </div>
                              </div>
                            </div>

                            {/* Core Pain points */}
                            <div className="md:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[220px] space-y-4">
                              <div>
                                <h4 className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Pain Points Solved</h4>
                                <p className="text-xs text-zinc-200 mt-2 leading-relaxed">{results.idea_validation.problem_statement}</p>
                              </div>
                              <div className="border-t border-zinc-900 pt-4">
                                <h4 className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">Unique Value Proposition</h4>
                                <p className="text-xs text-amber-200 mt-1 italic font-medium leading-relaxed">"{results.idea_validation.value_proposition}"</p>
                              </div>
                            </div>

                          </div>

                          {/* Target user badge segments */}
                          <div className="glass-panel rounded-2xl p-5">
                            <h3 className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-3">Target User Segments</h3>
                            <div className="flex flex-wrap gap-2">
                              {results.idea_validation.target_audience.map((aud, i) => (
                                <span key={i} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold px-3 py-1 rounded-full">
                                  {aud}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Risks vs Recommendations */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="glass-panel rounded-2xl p-5 border-amber-500/5">
                              <h4 className="text-xs font-bold text-amber-500 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4.5 h-4.5" /> Project Risks
                              </h4>
                              <ul className="space-y-2.5">
                                {results.idea_validation.risks.map((risk, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-350 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{risk}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="glass-panel rounded-2xl p-5 border-amber-500/5">
                              <h4 className="text-xs font-bold text-amber-500 mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4.5 h-4.5" /> CIO Recommendations
                              </h4>
                              <ul className="space-y-2.5">
                                {results.idea_validation.recommendations.map((rec, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-300 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                          </div>

                        </div>
                      )}

                      {activeTab === 'strategy' && results.business_strategy && (
                        <div className="space-y-6 animate-fade-in">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="glass-panel rounded-2xl p-5">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Database className="w-3.5 h-3.5" /> Business Model
                              </h4>
                              <p className="text-xs text-zinc-250 leading-relaxed">{results.business_strategy.business_model}</p>
                            </div>

                            <div className="glass-panel rounded-2xl p-5">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <DollarSign className="w-3.5 h-3.5" /> Pricing Strategy
                              </h4>
                              <p className="text-xs text-zinc-250 leading-relaxed">{results.business_strategy.pricing_model}</p>
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <div className="md:col-span-1 glass-panel rounded-2xl p-5 border-emerald-500/5">
                              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5" /> Competitive Moat
                              </h4>
                              <p className="text-xs text-zinc-250 leading-relaxed">{results.business_strategy.competitive_moat}</p>
                            </div>

                            <div className="md:col-span-2 glass-panel rounded-2xl p-5">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Go-To-Market Tactics
                              </h4>
                              <ul className="space-y-2">
                                {results.business_strategy.go_to_market.map((gtm, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-250 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{gtm}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                          </div>

                          {/* Roadmap Timeline */}
                          <div className="glass-panel rounded-2xl p-5">
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                              <Compass className="w-3.5 h-3.5 text-amber-550" /> 30-60-90 Day Roadmap
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                              <div className="relative pl-5 border-l border-amber-500/20">
                                <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-zinc-950"></div>
                                <span className="text-[9px] font-bold text-amber-500 uppercase block mb-1">Days 1 - 30</span>
                                <span className="text-xs font-bold text-zinc-200 block">Prototype MVP</span>
                                <p className="text-[11px] text-zinc-550 mt-1 leading-relaxed">{results.business_strategy.roadmap.phase_1_30_days}</p>
                              </div>

                              <div className="relative pl-5 border-l border-amber-500/20">
                                <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-zinc-950"></div>
                                <span className="text-[9px] font-bold text-amber-500 uppercase block mb-1">Days 31 - 60</span>
                                <span className="text-xs font-bold text-zinc-200 block">Beta Operations</span>
                                <p className="text-[11px] text-zinc-550 mt-1 leading-relaxed">{results.business_strategy.roadmap.phase_2_60_days}</p>
                              </div>

                              <div className="relative pl-5 border-l border-amber-500/20">
                                <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-zinc-950"></div>
                                <span className="text-[9px] font-bold text-amber-500 uppercase block mb-1">Days 61 - 90</span>
                                <span className="text-xs font-bold text-zinc-200 block">Public Expansion</span>
                                <p className="text-[11px] text-zinc-550 mt-1 leading-relaxed">{results.business_strategy.roadmap.phase_3_90_days}</p>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {activeTab === 'finance' && results.finance_modeling && (
                        <div className="space-y-6 animate-fade-in">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel rounded-2xl p-5 border-amber-500/5">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <DollarSign className="w-4.5 h-4.5" /> Revenue Streams
                              </h4>
                              <ul className="space-y-2.5">
                                {results.finance_modeling.revenue_streams.map((stream, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-250 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{stream}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border-amber-500/5">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4.5 h-4.5" /> Cost Structure
                              </h4>
                              <ul className="space-y-2.5">
                                {results.finance_modeling.cost_structure.map((cost, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-250 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{cost}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Initial Funding</span>
                              <span className="block text-xl font-black text-amber-500 mt-2">{results.finance_modeling.funding_required}</span>
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Break-Even Timeline</span>
                              <span className="block text-xl font-black text-emerald-400 mt-2">{results.finance_modeling.break_even_timeline}</span>
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Key Metrics (KPIs)</span>
                              <ul className="space-y-1.5 mt-2">
                                {results.finance_modeling.key_metrics.map((kpi, i) => (
                                  <li key={i} className="text-xs text-white font-medium flex gap-2">
                                    <span className="text-amber-500">•</span> <span>{kpi}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="glass-panel rounded-2xl p-5 border-emerald-500/10">
                            <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <BarChart className="w-4 h-4" /> 3-Year Projections (Live Data)
                            </h4>
                            <div className="h-64 w-full mt-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart
                                  data={[
                                    { name: 'Year 1', revenue: results.finance_modeling.projections.year_1_revenue },
                                    { name: 'Year 2', revenue: results.finance_modeling.projections.year_2_revenue },
                                    { name: 'Year 3', revenue: results.finance_modeling.projections.year_3_revenue }
                                  ]}
                                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                                  <XAxis dataKey="name" stroke="#52525B" tick={{ fill: '#A1A1AA', fontSize: 10 }} tickLine={false} axisLine={false} />
                                  <YAxis 
                                    stroke="#52525B" 
                                    tick={{ fill: '#A1A1AA', fontSize: 10 }} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `₹${(value / 10000000).toFixed(1)}Cr`}
                                  />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#1B1B1B', borderColor: '#2A2A2A', borderRadius: '12px' }}
                                    itemStyle={{ color: '#34D399', fontWeight: 'bold' }}
                                    formatter={(value) => [`₹${(value / 10000000).toFixed(2)} Cr`, 'Revenue']}
                                    cursor={{fill: '#2A2A2A', opacity: 0.4}}
                                  />
                                  <Bar dataKey="revenue" fill="#34D399" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                </RechartsBarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'market' && results.market_intelligence && (
                        <div className="space-y-6 animate-fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-panel rounded-2xl p-5 border-amber-500/10">
                              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Total Addressable Market (TAM)</span>
                              <span className="block text-xl font-black text-white mt-2">{results.market_intelligence.tam_size}</span>
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border-amber-500/10">
                              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Serviceable Available Market (SAM)</span>
                              <span className="block text-xl font-black text-white mt-2">{results.market_intelligence.sam_size}</span>
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border-amber-500/10">
                              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Serviceable Obtainable (SOM)</span>
                              <span className="block text-xl font-black text-emerald-400 mt-2">{results.market_intelligence.som_size}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-amber-500" /> Target Audience Persona
                              </h4>
                              <p className="text-sm text-zinc-200 font-medium italic leading-relaxed mb-4">
                                "{results.market_intelligence.target_audience.persona}"
                              </p>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Demographics</span>
                                  <p className="text-xs text-zinc-300 mt-1">{results.market_intelligence.target_audience.demographic}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Key Pain Points</span>
                                  <ul className="mt-1 space-y-1">
                                    {results.market_intelligence.target_audience.pain_points.map((point, i) => (
                                      <li key={i} className="text-xs text-zinc-300 flex gap-2"><span className="text-amber-500">•</span> {point}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div className="glass-panel rounded-2xl p-5 border-white/5">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Competitor Weaknesses
                                </h4>
                                <div className="space-y-4">
                                  {results.market_intelligence.competitors.map((comp, i) => (
                                    <div key={i} className="border-l-2 border-amber-500/30 pl-3">
                                      <span className="text-xs font-bold text-zinc-200 block">{comp.name}</span>
                                      <span className="text-xs text-rose-300/80 mt-0.5 block">{comp.weakness}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="glass-panel rounded-2xl p-5 border-white/5">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Market Tailwinds
                                </h4>
                                <ul className="space-y-2">
                                  {results.market_intelligence.market_trends.map((trend, i) => (
                                    <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                      <span className="leading-relaxed">{trend}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'legal' && results.legal_risk && (
                        <div className="space-y-6 animate-fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel rounded-2xl p-5 border-rose-500/10">
                              <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <ShieldAlert className="w-4.5 h-4.5" /> Compliance Requirements
                              </h4>
                              <ul className="space-y-2.5">
                                {results.legal_risk.compliance_requirements.map((req, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-250 leading-relaxed">
                                    <span className="text-rose-500 mt-0.5">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border-amber-500/10">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4.5 h-4.5" /> Potential Liabilities
                              </h4>
                              <ul className="space-y-2.5">
                                {results.legal_risk.potential_liabilities.map((liab, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-250 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{liab}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-400" /> IP Protection
                              </h4>
                              <p className="text-xs text-zinc-300 leading-relaxed">{results.legal_risk.ip_protection_strategy}</p>
                            </div>
                            <div className="md:col-span-1 glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-amber-500" /> Regulatory Hurdles
                              </h4>
                              <p className="text-xs text-zinc-300 leading-relaxed">{results.legal_risk.regulatory_hurdles}</p>
                            </div>
                            <div className="md:col-span-1 glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-zinc-500" /> Data Privacy
                              </h4>
                              <p className="text-xs text-zinc-300 leading-relaxed">{results.legal_risk.data_privacy_concerns}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'marketing' && results.marketing_strategy && (
                        <div className="space-y-6 animate-fade-in">
                          <div className="glass-panel rounded-2xl p-6 border-amber-500/10 text-center space-y-2">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Core Marketing Message</h4>
                            <p className="text-lg font-bold text-white italic">"{results.marketing_strategy.core_message}"</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Megaphone className="w-4 h-4" /> Marketing Channels
                              </h4>
                              <ul className="space-y-2.5">
                                {results.marketing_strategy.marketing_channels.map((ch, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-250 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{ch}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" /> Acquisition Strategy (0-1000 users)
                              </h4>
                              <p className="text-xs text-zinc-300 leading-relaxed">{results.marketing_strategy.customer_acquisition_strategy}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-amber-500" /> Content Strategy
                              </h4>
                              <ul className="space-y-2.5">
                                {results.marketing_strategy.content_strategy.map((cs, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-300 leading-relaxed">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{cs}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border-white/5">
                              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Rocket className="w-4 h-4 text-emerald-400" /> Launch Campaign Ideas
                              </h4>
                              <ul className="space-y-2.5">
                                {results.marketing_strategy.launch_campaign_ideas.map((lc, i) => (
                                  <li key={i} className="flex gap-2 items-start text-xs text-zinc-300 leading-relaxed">
                                    <span className="text-emerald-500 mt-0.5">•</span>
                                    <span>{lc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* PAGE 3: AGENT INDEPENDENT VIEW */}
              {['strategy', 'finance', 'market', 'legal', 'marketing'].includes(currentView) && (
                <div className="space-y-8 animate-fade-in">
                  <div className="glass-panel border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl border border-amber-400/20 shadow-md shadow-amber-500/10 text-black">
                        {currentView === 'strategy' && <Cpu className="w-6 h-6" />}
                        {currentView === 'finance' && <DollarSign className="w-6 h-6" />}
                        {currentView === 'market' && <BarChart className="w-6 h-6" />}
                        {currentView === 'legal' && <Shield className="w-6 h-6" />}
                        {currentView === 'marketing' && <Rocket className="w-6 h-6" />}
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-white capitalize">
                          {currentView === 'strategy' && 'Business Strategy Agent'}
                          {currentView === 'finance' && 'Finance Modeling Agent'}
                          {currentView === 'market' && 'Market Intelligence Agent'}
                          {currentView === 'legal' && 'Legal & Risk Agent'}
                          {currentView === 'marketing' && 'Growth Marketing Agent'}
                        </h2>
                        <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                          Role: {currentView === 'strategy' ? 'Startup Strategy Consultant' : (currentView === 'finance' ? 'Chartered Financial Analyst' : (currentView === 'market' ? 'Market Research Analyst' : (currentView === 'legal' ? 'AI Legal Consultant' : 'Growth Marketing Director')))} | Active Model: Llama 70B
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-emerald-400">Agent Active</span>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                    <h3 className="font-bold text-sm text-white">
                      Agent Workspace
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      You can run this agent as part of the pipeline by submitting your idea inside the **Idea Validation Agent** page. This will automatically execute all active cognitive pipelines concurrently.
                    </p>
                    <button 
                      onClick={() => setCurrentView('validation')}
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-white px-4 py-2.5 rounded-xl cursor-pointer"
                    >
                      Navigate to Validation Board
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 5: PROJECT DIRECTORY */}
              {currentView === 'projects' && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">📂 Startup Projects Repository</h2>
                    <p className="text-sm text-zinc-450 mt-1">Manage, open, and audit generated project statistics saved inside the SQLite database.</p>
                  </div>

                  <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Database Index: {projectsList.length} startup items</span>
                      <button 
                        onClick={() => setCurrentView('validation')}
                        className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-white px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Create New Project
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-900 text-zinc-500 font-bold">
                            <th className="py-3 px-2">Project ID</th>
                            <th className="py-3 px-2">Project Concept / Pitch</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Score</th>
                            <th className="py-3 px-2">Time Stamped</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectsList.map((p) => (
                            <tr key={p.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-zinc-300 font-semibold transition-all">
                              <td className="py-3.5 px-2 text-zinc-550 font-mono">#0{p.id}</td>
                              <td className="py-3.5 px-2 max-w-[320px] truncate">{p.idea}</td>
                              <td className="py-3.5 px-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  p.status === 'completed' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-2 text-white font-bold">{p.score > 0 ? `${p.score}/100` : '—'}</td>
                              <td className="py-3.5 px-2 text-zinc-500">{p.created_at}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 6: SHARED VECTOR MEMORY */}
              {currentView === 'memory' && (
                <div className="space-y-8 animate-fade-in">
                  
                  <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">🧠 Vector Database Memory</h2>
                    <p className="text-sm text-zinc-450 mt-1">Manage shared associative vector spaces, dimensions, and index custom knowledge payloads.</p>
                  </div>

                  {/* Input form */}
                  <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                    <h3 className="text-sm font-bold text-white">Index Context Node</h3>
                    <p className="text-xs text-zinc-550">Insert custom startup facts, market dimensions, or rules. This gets indexed as a simulated vector payload.</p>
                    
                    <form onSubmit={handleAddMemory} className="flex gap-4">
                      <input 
                        type="text" 
                        value={memoryInput}
                        onChange={(e) => setMemoryInput(e.target.value)}
                        placeholder="Type fact to index (e.g. Drones battery limits is 45 minutes...)"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!memoryInput.trim()}
                        className="bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-900 disabled:text-zinc-600 text-black text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        Index Fact
                      </button>
                    </form>
                  </div>

                  {/* Database list */}
                  <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                    <h3 className="text-sm font-bold text-white">Vector Storage Indexes</h3>
                    
                    <div className="space-y-3">
                      {vectorDb.map((node) => (
                        <div key={node.id} className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-900 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-amber-500 font-mono font-bold">{node.vector}</span>
                            <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-500 font-bold uppercase">{node.tag}</span>
                          </div>
                          <p className="text-xs text-zinc-300 font-medium leading-relaxed">{node.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* PAGE 7: AGENT REPORTS VIEW */}
              {currentView === 'reports' && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">📑 Generated Reports Repository</h2>
                    <p className="text-sm text-zinc-450 mt-1">Download and audit detailed business presentations and PDF compliance reports.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    
                    {/* PDF report mock */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">Startup_Validation_Index.pdf</h3>
                          <span className="text-[10px] text-zinc-500 uppercase block font-semibold mt-0.5">Format: PDF Document</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Contains the fully summarized uniqueness scores, target personas demographics, execution matrices, and risk registries.
                      </p>
                      <button 
                        onClick={() => alert('Mock Download triggered.')}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 px-4 py-2.5 rounded-xl cursor-pointer"
                      >
                        Download PDF
                      </button>
                    </div>

                    {/* PPT slide mock */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                          <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">Business_Pitch_Deck.pptx</h3>
                          <span className="text-[10px] text-zinc-500 uppercase block font-semibold mt-0.5">Format: Presentation Slides</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Visual slides explaining chosen transactional models, pricing matrices, acquisition methods, and the 30-60-90 roadmap.
                      </p>
                      <button 
                        onClick={() => alert('Mock Pitch Deck slide build triggered.')}
                        className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 px-4 py-2.5 rounded-xl cursor-pointer"
                      >
                        Compile PPTX
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* PAGE 8: SYSTEM SETTINGS VIEW */}
              {currentView === 'settings' && (
                <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
                  
                  <div className="border-b border-zinc-900 pb-5">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      ⚙️ System Settings & Metrics
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                      Manage your Groq API keys configurations, review precision benchmarks, latencies, and SQLite database storage allocations.
                    </p>
                  </div>

                  {/* API Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Validation Agent Config */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4 hover:border-amber-500/20 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                            <Compass className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">Idea Validation Agent</h3>
                            <p className="text-xs text-zinc-550">Chief Innovation Officer</p>
                          </div>
                        </div>
                        {systemStatus?.api_keys?.validation_agent?.configured ? (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            Active API
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Demo Mock Mode
                          </span>
                        )}
                      </div>

                      <div className="border-t border-zinc-900/65 pt-4 space-y-2.5 text-xs text-zinc-400">
                        <div className="flex justify-between">
                          <span>Provider</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.validation_agent?.provider || 'Groq Cloud'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>LLM Model</span>
                          <span className="text-zinc-200 font-mono text-[11px] bg-zinc-950 px-2 py-0.5 rounded">{systemStatus?.api_keys?.validation_agent?.model || 'llama-3.3-70b-versatile'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Precision</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.validation_agent?.accuracy || '94.5%'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Latency</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.validation_agent?.avg_latency || '1.4s'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Strategy Agent Config */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4 hover:border-amber-500/20 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">Business Strategy Agent</h3>
                            <p className="text-xs text-zinc-555">Startup Strategy Consultant</p>
                          </div>
                        </div>
                        {systemStatus?.api_keys?.strategy_agent?.configured ? (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            Active API
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Demo Mock Mode
                          </span>
                        )}
                      </div>

                      <div className="border-t border-zinc-900/65 pt-4 space-y-2.5 text-xs text-zinc-400">
                        <div className="flex justify-between">
                          <span>Provider</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.strategy_agent?.provider || 'Groq Cloud'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>LLM Model</span>
                          <span className="text-zinc-200 font-mono text-[11px] bg-zinc-950 px-2 py-0.5 rounded">{systemStatus?.api_keys?.strategy_agent?.model || 'llama-3.3-70b-versatile'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Precision</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.strategy_agent?.accuracy || '92.8%'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Latency</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.strategy_agent?.avg_latency || '1.6s'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Finance Agent Config */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4 hover:border-amber-500/20 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">Finance Agent</h3>
                            <p className="text-xs text-zinc-555">Financial Modeler</p>
                          </div>
                        </div>
                        {systemStatus?.api_keys?.finance_agent?.configured ? (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            Active API
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Demo Mock Mode
                          </span>
                        )}
                      </div>

                      <div className="border-t border-zinc-900/65 pt-4 space-y-2.5 text-xs text-zinc-400">
                        <div className="flex justify-between">
                          <span>Provider</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.finance_agent?.provider || 'Groq Cloud'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>LLM Model</span>
                          <span className="text-zinc-200 font-mono text-[11px] bg-zinc-950 px-2 py-0.5 rounded">{systemStatus?.api_keys?.finance_agent?.model || 'llama-3.3-70b-versatile'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Precision</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.finance_agent?.accuracy || '95.1%'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Latency</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.finance_agent?.avg_latency || '1.8s'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Market Agent Config */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4 hover:border-amber-500/20 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                            <BarChart className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">Market Agent</h3>
                            <p className="text-xs text-zinc-555">Market Research</p>
                          </div>
                        </div>
                        {systemStatus?.api_keys?.market_agent?.configured ? (
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            Active API
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Demo Mock Mode
                          </span>
                        )}
                      </div>

                      <div className="border-t border-zinc-900/65 pt-4 space-y-2.5 text-xs text-zinc-400">
                        <div className="flex justify-between">
                          <span>Provider</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.market_agent?.provider || 'Groq Cloud'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>LLM Model</span>
                          <span className="text-zinc-200 font-mono text-[11px] bg-zinc-950 px-2 py-0.5 rounded">{systemStatus?.api_keys?.market_agent?.model || 'llama-3.3-70b-versatile'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Precision</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.market_agent?.accuracy || '89.2%'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Latency</span>
                          <span className="text-zinc-200 font-semibold">{systemStatus?.api_keys?.market_agent?.avg_latency || '1.1s'}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Database & Environment Analytics */}
                  <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-6">
                    <div>
                      <h3 className="font-bold text-sm text-white">Database & Workspace Metrics</h3>
                      <p className="text-xs text-zinc-505 mt-0.5">Underlying system analytics and data storage parameters.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Database Type</span>
                        <span className="block text-base font-bold text-amber-500 mt-1">{systemStatus?.database?.type || 'SQLite'}</span>
                      </div>
                      <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Projects</span>
                        <span className="block text-base font-bold text-white mt-1">{systemStatus?.database?.total_projects ?? 0}</span>
                      </div>
                      <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Results</span>
                        <span className="block text-base font-bold text-white mt-1">{systemStatus?.database?.total_results ?? 0}</span>
                      </div>
                      <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">System Latency</span>
                        <span className="block text-base font-bold text-emerald-400 mt-1">Excellent</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Connection Verification */}
                  <div className="glass-panel rounded-2xl p-6 border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-500 animate-pulse" /> Live Connection Diagnostics
                      </h3>
                      <p className="text-xs text-zinc-505 mt-0.5">Test API keys validation and network connectivity to Groq servers.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                      {testResult && (
                        <div className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 ${
                          testResult.success 
                            ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' 
                            : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
                        }`}>
                          {testResult.success ? '✓' : '✗'} {testResult.detail}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={testingConnection}
                        className="bg-amber-600 hover:bg-amber-500 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-650 text-black text-xs font-bold px-5 py-2.5 rounded-xl border border-amber-400/20 shadow-md shadow-amber-500/10 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
                      >
                        {testingConnection ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying Connection...
                          </>
                        ) : (
                          'Verify API Connection'
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right Information Panel (Activity Logs) */}
            <aside className="w-full xl:w-80 shrink-0 space-y-6">
              
              {/* Activity Log console ticker */}
              <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-4 relative overflow-hidden">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-500 animate-pulse" /> Active Ticker Console
                </h3>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 font-mono text-[10px] leading-relaxed">
                  {tickerLogs.map((log) => (
                    <div key={log.id} className="border-b border-zinc-900/60 pb-2 space-y-1">
                      <div className="flex justify-between items-center text-zinc-500">
                        <span>{log.time}</span>
                        <span className="text-amber-500 font-bold">{log.agent}</span>
                      </div>
                      <p className="text-zinc-300">{log.log}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector space info */}
              <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-500" /> Vector Memory Overhead
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Retrieval Accuracy</span>
                    <span className="text-emerald-400 font-bold">98.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Database Size</span>
                    <span className="text-white font-semibold">12.5 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Latency Overhead</span>
                    <span className="text-white font-semibold">~12ms</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>

          {/* Footer */}
          <footer className="glass-panel border-t mt-auto py-4 px-6 text-center text-[10px] text-zinc-500 uppercase tracking-widest">
            InnovationHub AI — Futurological AI Operating System. Connected to Groq API.
          </footer>

        </div>
      </div>
    </div>
  );
}

export default App;
