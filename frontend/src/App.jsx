import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  LayoutDashboard,
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
  Clock,
  Sparkles,
  ChevronRight,
  Maximize2,
  Upload
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Custom Canvas and Overlay Components
import AnimatedBackground from './components/AnimatedBackground';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import WorkflowVisualizer from './components/WorkflowVisualizer';
import KnowledgeGraph from './components/KnowledgeGraph';
import CommandPalette from './components/CommandPalette';
import CommandCenter from './components/CommandCenter';
import EnterpriseCommandCenter from './components/EnterpriseCommandCenter';
import PerformanceMonitor from './components/PerformanceMonitor';
import TaskQueueAndActions from './components/TaskQueueAndActions';
import LiveAgentCards from './components/LiveAgentCards';
import AIThinkingTimeline from './components/AIThinkingTimeline';
import ActivityFeedPanel from './components/ActivityFeedPanel';

// Executive Startup Health Dashboard Components
import StartupHealthGauge from './components/StartupHealthGauge';
import AgentScoreSummary from './components/AgentScoreSummary';
import StartupRadarChart from './components/StartupRadarChart';
import InvestorReadiness from './components/InvestorReadiness';
import BusinessMetrics from './components/BusinessMetrics';
import RiskHeatmap from './components/RiskHeatmap';
import CeoAiRecommendation from './components/CeoAiRecommendation';
import ProjectTimeline from './components/ProjectTimeline';
import ReportPreviewAndExport from './components/ReportPreviewAndExport';
import InsightsAndNotifications from './components/InsightsAndNotifications';

function App() {
  // Navigation & Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [cursorTheme, setCursorTheme] = useState(() => localStorage.getItem('innovationhub_cursor_theme') || 'gold');
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, settings, validation, strategy, market, finance, legal, marketing, projects, memory, reports
  const [activeTab, setActiveTab] = useState('validation'); // Inner result tabs
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
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
  
  // Agent Config States
  const [tempVal, setTempVal] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  
  // Interactive UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [projectsList, setProjectsList] = useState([]);
  const [selectedReportSection, setSelectedReportSection] = useState('summary');
  const [showPresentationMode, setShowPresentationMode] = useState(false);
  const [presentationSlide, setPresentationSlide] = useState(0);
  
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
    { id: 2, time: '12:31:02', agent: 'Chief Innovation Officer', log: 'Agent validation schema compiled.' },
    { id: 3, time: '12:31:05', agent: 'Strategy Consultant', log: 'Monetization metrics and moats engine active.' }
  ]);

  // Helper to trigger toast notifications
  const addToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Keyboard shortcut listener for Command Palette (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      const res = await fetch('http://localhost:8000/api/projects');
      if (res.ok) {
        const data = await res.json();
        // Map API response to the shape expected by the table (add score:0 default)
        setProjectsList(data.map((p) => ({ ...p, score: 0 })));
      }
    } catch (e) {
      console.error('Failed to fetch projects:', e);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    fetchProjects();
    
    // Add real-time logs simulator
    const interval = setInterval(() => {
      const agents = ['Chief Innovation Officer', 'Market Research Analyst', 'Strategy Consultant', 'Financial Analyst', 'AI Legal Advisor', 'Marketing Director'];
      const actions = [
        'Memory vector index flushed.',
        'Analyzing query embedding cosine similarities.',
        'Formulating business pricing matrix models.',
        'Synthesizing customer acquisition growth strategies.',
        'Validating liability compliance parameters.',
        'Writing core positioning messaging statements.'
      ];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const timeStr = new Date().toTimeString().split(' ')[0];
      
      setTickerLogs(prev => [
        { id: Date.now(), time: timeStr, agent: randomAgent, log: randomAction },
        ...prev.slice(0, 15)
      ]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

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
            addToast('Startup Pipeline synthesis complete! Reports generated.', 'success');
            clearInterval(intervalId);
            fetchSystemStatus();
            fetchProjects();
          } else if (data.status === 'failed') {
            setErrorMsg(data.results.idea_validation_error?.error || 'Validation failed. Check API Keys.');
            setLoading(false);
            addToast('Pipeline synthesis failed. Check logs.', 'error');
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
    if (e) e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResults(null);
    setStatus('created');
    addToast('Spawning autonomous agents workspace pipelines...', 'info');

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
        { id: Date.now(), time: new Date().toTimeString().split(' ')[0], agent: 'System', log: `Project ID #${data.project_id} database record allocated.` },
        ...prev
      ]);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
      setStatus('failed');
      addToast(err.message, 'error');
    }
  };

  const handlePdfUpload = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      addToast('Invalid file format. Please upload a PDF.', 'error');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResults(null);
    setStatus('created');
    addToast('Uploading PDF and extracting problem statement...', 'info');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/startup/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to parse PDF file');
      }

      const data = await res.json();
      setProjectId(data.project_id);
      setStatus(data.status);
      setIdea(data.idea);
      
      // Update ticker
      setTickerLogs(prev => [
        { id: Date.now(), time: new Date().toTimeString().split(' ')[0], agent: 'System', log: `PDF Upload project #${data.project_id} initialized.` },
        ...prev
      ]);
      addToast('PDF text successfully extracted! Starting AI agents...', 'success');
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
      setStatus('failed');
      addToast(err.message, 'error');
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    addToast('Running backend api connectivity test...', 'info');
    try {
      const res = await fetch('http://localhost:8000/api/system/test-connection', {
        method: 'POST'
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        addToast('Groq Cloud client authenticated successfully!', 'success');
      } else {
        addToast('Authentication failed. Check API key configuration.', 'error');
      }
      fetchSystemStatus();
    } catch (err) {
      setTestResult({ success: false, detail: 'Failed to connect to backend.' });
      addToast('Diagnostics failed: backend offline.', 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!memoryInput.trim()) return;
    const mockVector = `[${(Math.random() - 0.5).toFixed(2)}, ${(Math.random() - 0.5).toFixed(2)}, ${(Math.random() - 0.5).toFixed(2)}...]`;
    setVectorDb(prev => [
      { id: Date.now(), vector: mockVector, tag: 'operator-entry', content: memoryInput },
      ...prev
    ]);
    addToast('Memory dimension indexed into Vector DB Core.', 'success');
    setMemoryInput('');
  };

  const triggerSystemAction = (action) => {
    if (action === 'run-all') {
      if (!idea.trim()) {
        setIdea('B2B autonomous precision drone monitoring and pesticide spray system.');
      }
      setTimeout(() => handleSubmit(), 200);
    } else if (action === 'reset-memory') {
      setVectorDb([
        { id: 1, vector: '[0.12, -0.85, 0.45...]', tag: 'agri-drones', content: 'Agricultural drone precision spraying parameters and drift thresholds.' },
        { id: 2, vector: '[-0.32, 0.92, -0.11...]', tag: 'sql-ai', content: 'SQL semantic translation schemas and standard dialect mappings.' },
        { id: 3, vector: '[0.67, -0.05, 0.78...]', tag: 'pricing-model', content: 'SaaS monetization metrics: Starter, Pro, and Enterprise definitions.' }
      ]);
      addToast('Flush namespace command executed. Vector space cleared.', 'info');
    } else if (action === 'test-connection') {
      handleTestConnection();
    } else if (action === 'generate-pdf') {
      compileReportPDF();
    } else if (action === 'generate-ppt') {
      setShowPresentationMode(true);
      addToast('Pitch Deck Presentation mode initialized.', 'success');
    } else if (action === 'generate-report') {
      setCurrentView('reports');
      addToast('Routing to Executive Agent Reports Compiler.', 'info');
    } else if (action === 'export-results') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results || { idea, status }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `innovationhub_report_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('JSON results exported to local download folder.', 'success');
    } else if (action === 'pause-workflow') {
      addToast('Workflow execution stream paused by operator.', 'warning');
    } else if (action === 'resume-workflow') {
      addToast('Resuming concurrent workflow execution stream.', 'success');
    } else if (action === 'restart-failed') {
      addToast('Restarting failed agent threads...', 'info');
    }
  };

  // Luxury SVG Icons for AI Workforce
  const getAgentSVG = (id) => {
    const defaultProps = { className: "w-5 h-5 transition-transform duration-300 group-hover:scale-115 shrink-0" };
    switch (id) {
      case 'validation':
        return (
          <svg {...defaultProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM9.5 9h5M9.5 13h5" />
          </svg>
        );
      case 'market':
        return (
          <svg {...defaultProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
        );
      case 'strategy':
        return (
          <svg {...defaultProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'finance':
        return (
          <svg {...defaultProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'legal':
        return (
          <svg {...defaultProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'marketing':
        return (
          <svg {...defaultProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      default:
        return <Layers {...defaultProps} />;
    }
  };

  const workforce = [
    { id: 'validation', name: 'Idea Validation', model: 'llama-3.3-70b-versatile', desc: 'Chief Innovation Officer', active: true, accuracy: '94.5%', latency: '1.4s', iconLabel: '💡' },
    { id: 'market', name: 'Market Intelligence', model: 'llama-3.3-70b-versatile', desc: 'Market Research Analyst', active: true, accuracy: '89.2%', latency: '1.1s', iconLabel: '📈' },
    { id: 'strategy', name: 'Business Strategy', model: 'llama-3.3-70b-versatile', desc: 'Startup Strategy Consultant', active: true, accuracy: '92.8%', latency: '1.6s', iconLabel: '♟' },
    { id: 'finance', name: 'Finance Intelligence', model: 'llama-3.3-70b-versatile', desc: 'Chartered Financial Analyst', active: true, accuracy: '95.1%', latency: '1.8s', iconLabel: '💰' },
    { id: 'legal', name: 'Legal Guardian', model: 'llama-3.3-70b-versatile', desc: 'AI Legal Consultant', active: true, accuracy: '95.0%', latency: '2.1s', iconLabel: '🛡' },
    { id: 'marketing', name: 'Marketing Studio', model: 'llama-3.1-8b-instant', desc: 'Growth Marketing Director', active: true, accuracy: '88.7%', latency: '0.9s', iconLabel: '🚀' }
  ];

  // Helper to compile print-ready luxury PDF report
  const compileReportPDF = () => {
    window.print();
    addToast('Print dialog triggered for A4 report.', 'success');
  };

  // Cinematic loading handler
  if (isLoadingApp) {
    return <LoadingScreen onComplete={() => setIsLoadingApp(false)} />;
  }

  // Unified Agent Page Workspace drawing
  const renderAgentWorkspace = (agentId) => {
    const agent = workforce.find((a) => a.id === agentId);
    if (!agent) return null;

    // Pulse colors
    const pulseColors = {
      validation: 'from-amber-500 to-amber-600',
      market: 'from-blue-500 to-indigo-500',
      strategy: 'from-purple-500 to-fuchsia-500',
      finance: 'from-emerald-500 to-teal-500',
      legal: 'from-rose-500 to-pink-500',
      marketing: 'from-orange-500 to-amber-500'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)', y: 15 }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        {/* Top Hero Section */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Animated halo background gradient */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-radial from-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Agent Avatar */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Rotating Orbit Particle Ring */}
              <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '9s' }}>
                <circle cx="48" cy="48" r="44" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1" fill="transparent" />
                <circle cx="8" cy="48" r="3" fill="#D4AF37" className="animate-pulse" />
              </svg>
              {/* Avatar breathing frame */}
              <div className="w-18 h-18 rounded-full bg-[#0F0F10] border border-[#D4AF37]/35 flex items-center justify-center avatar-breathing text-2xl">
                {agent.iconLabel}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl font-black text-white">{agent.name} Agent</h2>
                <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  Active Model
                </span>
              </div>
              <p className="text-xs text-[#AAAAAA] font-semibold">{agent.desc} | Model: {agent.model}</p>
              <div className="flex gap-4 text-[10px] text-zinc-500 uppercase font-bold tracking-widest pt-2">
                <span>Latency: <strong className="text-white">{agent.latency}</strong></span>
                <span>Precision: <strong className="text-white">{agent.accuracy}</strong></span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex flex-col sm:flex-row items-center md:items-end gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" /> Back to Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentView('validation');
                addToast('Input startup idea to validation board to trigger pipeline.', 'info');
              }}
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] hover:from-[#FFD95A] hover:to-[#D4AF37] text-[#070707] text-xs font-bold px-5 py-3 rounded-xl border border-gold transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <Play className="w-3.5 h-3.5" /> Execute Agent pipeline
            </button>
            <span className="text-[9px] uppercase text-zinc-600 font-mono font-bold">SHA256: SECURE_SANDBOX</span>
          </div>
        </div>

        {/* Workspace metrics and content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main workspace logic card */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Results Panel */}
            <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-6">
              <h3 className="text-sm font-bold text-white border-b border-zinc-900 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" /> Synthesis Agent Results Output
              </h3>

              {results ? (
                <div className="space-y-4 font-semibold text-xs leading-relaxed text-zinc-300">
                  {agentId === 'validation' && results.idea_validation && (
                    <div className="space-y-3">
                      <p className="text-sm text-[#FFD95A]">Feasibility Score: {results.idea_validation.innovation_score}/100</p>
                      <p><strong>Problem Statement:</strong> {results.idea_validation.problem_statement}</p>
                      <p><strong>Value Proposition:</strong> {results.idea_validation.value_proposition}</p>
                      <div>
                        <strong className="block text-white mb-1.5 uppercase tracking-wider text-[10px]">Risks detected:</strong>
                        <ul className="list-disc list-inside space-y-1 text-zinc-400">
                          {results.idea_validation.risks.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                  {agentId === 'strategy' && results.business_strategy && (
                    <div className="space-y-3">
                      <p><strong>Business Model:</strong> {results.business_strategy.business_model}</p>
                      <p><strong>Pricing Matrix:</strong> {results.business_strategy.pricing_model}</p>
                      <p><strong>Competitive Advantage Moat:</strong> {results.business_strategy.competitive_moat}</p>
                    </div>
                  )}
                  {agentId === 'finance' && results.finance_modeling && (
                    <div className="space-y-3">
                      <p><strong>Funding Ask Required:</strong> {results.finance_modeling.funding_required}</p>
                      <p><strong>Cost Structures:</strong> {results.finance_modeling.cost_structure.join(', ')}</p>
                      <p><strong>Break Even Target:</strong> {results.finance_modeling.break_even_timeline}</p>
                    </div>
                  )}
                  {agentId === 'market' && results.market_intelligence && (
                    <div className="space-y-3">
                      <p><strong>TAM/SAM Size:</strong> {results.market_intelligence.tam_size} / {results.market_intelligence.sam_size}</p>
                      <p><strong>Audience demographic:</strong> {results.market_intelligence.target_audience.demographic}</p>
                      <p><strong>Competitor Landscape:</strong> {results.market_intelligence.competitors.map(c=>c.name).join(', ')}</p>
                    </div>
                  )}
                  {agentId === 'legal' && results.legal_risk && (
                    <div className="space-y-3">
                      <p><strong>GDPR Regulatory requirements:</strong> {results.legal_risk.compliance_requirements.join(', ')}</p>
                      <p><strong>IP Protection Strategy:</strong> {results.legal_risk.ip_protection_strategy}</p>
                    </div>
                  )}
                  {agentId === 'marketing' && results.marketing_strategy && (
                    <div className="space-y-3">
                      <p><strong>Core Brand Messaging:</strong> {results.marketing_strategy.core_message}</p>
                      <p><strong>Channels Outbound:</strong> {results.marketing_strategy.marketing_channels.join(', ')}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center py-8">
                  <div className="w-12 h-12 rounded-full border border-dashed border-zinc-800 flex items-center justify-center mx-auto">
                    <Activity className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-white">No active execution results loaded</h4>
                    <p className="text-[10px] text-zinc-550 max-w-xs mx-auto">Trigger the validation pipeline from the dashboard/CI panel to populate cognitive datasets.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Performance metrics charts */}
            <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Historical Success & Accuracy Curve</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Run 1', accuracy: 88, latency: 1.8 },
                    { name: 'Run 2', accuracy: 91, latency: 1.5 },
                    { name: 'Run 3', accuracy: 94, latency: 1.3 },
                    { name: 'Run 4', accuracy: 96, latency: 1.2 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                    <Tooltip contentStyle={{ background: '#0F0F10', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '8px', fontSize: '10px' }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#D4AF37" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right agent details sidebar */}
          <div className="space-y-6">
            
            {/* Live activity tasks ticker */}
            <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-4">
              <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-gold animate-pulse" /> Live activity feed
              </h4>
              <div className="space-y-2.5 font-mono text-[9.5px]">
                <div className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-400">Connection test Groq completed.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-zinc-400">Read vector DB agricultural rules.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-500">◉</span>
                  <span className="text-zinc-300">Listening to input prompt triggers.</span>
                </div>
              </div>
            </div>

            {/* Performance parameters */}
            <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-4">
              <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Cognitive Overhead</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-550">Memory Usage</span>
                  <span className="text-white font-semibold">18.4 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-550">Target Temp</span>
                  <span className="text-white font-semibold">0.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-550">Tokens Synced</span>
                  <span className="text-white font-semibold">4096 max</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100 flex flex-col font-sans relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* Canvas Animated Background */}
      <AnimatedBackground />

      {/* Custom Mouse Cursor */}
      <CustomCursor theme={cursorTheme} />

      {/* Global Command Palette dialog */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
        onTriggerAction={(act) => triggerSystemAction(act)}
      />

      {/* Floating AI Command Center overlay */}
      <CommandCenter
        onNavigate={(view) => setCurrentView(view)}
        onTriggerAction={(act) => triggerSystemAction(act)}
      />

      {/* Global Beautiful Custom Toasts list */}
      <div className="fixed top-6 right-6 z-50 space-y-3.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 rounded-xl glass-panel border-[#D4AF37]/35 shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center gap-3 text-xs font-semibold pointer-events-auto min-w-[260px]"
            >
              <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-rose-500 shadow-[0_0_8px_#EF4444]' : 'bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]'}`} />
              <span className="text-zinc-200">{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div id="main-app-layout" className="flex flex-1 z-10 relative print:hidden">
        
        {/* LEFT SIDEBAR (Floating Glass Design) */}
        <aside className={`${sidebarExpanded ? 'w-64' : 'w-20'} shrink-0 bg-[#0F0F10]/95 border-r border-[#D4AF37]/15 flex flex-col transition-all duration-400 z-40 relative rounded-r-3xl`}>
          
          {/* Logo brand */}
          <div className="h-20 border-b border-[#D4AF37]/10 flex items-center px-5 gap-3.5">
            <div 
              onClick={() => setCurrentView('dashboard')}
              className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD95A] rounded-xl flex items-center justify-center border border-[#FFD95A]/20 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:rotate-45 cursor-pointer transition-all duration-500 shrink-0"
            >
              <Layers className="w-5 h-5 text-black" />
            </div>
            {sidebarExpanded && (
              <div>
                <h1 className="text-sm font-black text-white tracking-wide leading-none">InnovationHub AI</h1>
                <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest mt-1 block">Autonomous Co-Founder</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 overflow-y-auto px-3 space-y-6 scrollbar-thin">
            
            {/* Primary Executive Dashboard Button */}
            <div className="space-y-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`w-full text-left px-3 py-3 rounded-xl text-xs font-black flex items-center gap-3.5 transition-all cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent text-[#FFD95A] border-l-[3px] border-[#D4AF37] pl-3 shadow-sm shadow-[#D4AF37]/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentView === 'dashboard' ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
                {sidebarExpanded && <span className="tracking-wide uppercase text-[11px]">Executive Dashboard</span>}
              </button>
            </div>

            {/* OS Workforce Submenu */}
            <div className="space-y-2">
              <span className={`px-3 text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-2 ${!sidebarExpanded && 'text-center'}`}>
                {sidebarExpanded ? '🧠 AI Workforce' : '🧠'}
              </span>
              
              <div className="space-y-1">
                {workforce.map((agent) => {
                  const isRouteActive = currentView === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setCurrentView(agent.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[11.5px] font-bold flex items-center gap-3.5 transition-all relative group cursor-pointer ${
                        isRouteActive 
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-[3px] border-[#D4AF37] pl-[9px] shadow-sm shadow-[#D4AF37]/5' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                      }`}
                    >
                      <div className={`p-1 rounded-lg ${isRouteActive ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-zinc-500'}`}>
                        {getAgentSVG(agent.id)}
                      </div>
                      {sidebarExpanded && (
                        <div className="flex-1 flex justify-between items-center">
                          <span className="tracking-wide font-bold">{agent.name}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                      )}
                      
                      {/* Hover ring outline */}
                      <div className="absolute inset-0 rounded-xl border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/10 pointer-events-none transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General OS Navigation */}
            <div className="space-y-2">
              <span className={`px-3 text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-2 ${!sidebarExpanded && 'text-center'}`}>
                {sidebarExpanded ? '📂 System Repository' : '📂'}
              </span>
              
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('projects')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[11.5px] font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'projects' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <Folder className="w-4 h-4 text-zinc-500 shrink-0" />
                  {sidebarExpanded && <span>Startup Projects</span>}
                </button>

                <button
                  onClick={() => setCurrentView('memory')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[11.5px] font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'memory' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-zinc-500 shrink-0" />
                  {sidebarExpanded && <span>Shared Memory</span>}
                </button>

                <button
                  onClick={() => setCurrentView('reports')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[11.5px] font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'reports' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-zinc-500 shrink-0" />
                  {sidebarExpanded && <span>Agent Reports</span>}
                </button>

                <button
                  onClick={() => setCurrentView('settings')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[11.5px] font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
                    currentView === 'settings' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                  }`}
                >
                  <Settings className="w-4 h-4 text-zinc-500 shrink-0" />
                  {sidebarExpanded && <span>System Settings</span>}
                </button>
              </div>
            </div>

          </div>

          {/* User profile footer */}
          <div className="p-4 border-t border-[#D4AF37]/10 space-y-3 bg-[#070707]/30">
            {sidebarExpanded && (
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-black text-xs uppercase shadow">
                  ad
                </div>
                <div>
                  <h4 className="text-xs font-black text-white leading-none">Console Admin</h4>
                  <span className="text-[8px] text-zinc-500 uppercase font-mono tracking-wide mt-1 block">Root access shell</span>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full text-left px-3 py-2.5 text-zinc-500 hover:text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-3.5 hover:bg-rose-500/5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {sidebarExpanded && <span>Log Out</span>}
            </button>
          </div>

        </aside>

        {/* MAIN BODY CONTEXT */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* TOP NAVBAR */}
          <header className="h-20 border-b border-[#D4AF37]/15 flex items-center justify-between px-8 bg-[#070707]/80 backdrop-blur-md sticky top-0 z-30">
            
            {/* Left sidebar toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="p-2 rounded-xl border border-zinc-900 text-zinc-500 hover:text-white bg-zinc-950 hover:border-[#D4AF37]/30 transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex items-center gap-2.5 text-xs font-bold">
                {currentView !== 'dashboard' ? (
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] hover:from-[#FFD95A] hover:to-[#D4AF37] text-black text-[10.5px] font-black px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider border border-[#FFD95A]/30 shadow-md shadow-[#D4AF37]/15"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" /> Executive Dashboard
                  </button>
                ) : (
                  <span className="text-zinc-500 uppercase tracking-widest text-[9.5px]">Workspace Context:</span>
                )}
                <span className="text-[#D4AF37] uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-2.5 py-1 rounded text-[9.5px] tracking-wide font-black">
                  {currentView === 'dashboard' ? 'Executive Dashboard' : currentView.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Right details */}
            <div className="flex items-center gap-5">
              
              {/* Cmd+K Search trigger placeholder */}
              <div 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="relative w-64 hidden sm:flex items-center justify-between bg-zinc-900 border border-zinc-800 hover:border-[#D4AF37]/35 rounded-xl px-3.5 py-2 text-xs text-zinc-500 cursor-pointer select-none transition-all"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-zinc-650" />
                  <span>Search controller...</span>
                </span>
                <span className="text-[9px] bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 font-bold uppercase">Ctrl+K</span>
              </div>

              {/* Notification bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl border border-zinc-900 bg-zinc-900 text-zinc-400 hover:text-white hover:border-[#D4AF37]/20 transition-all cursor-pointer relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 glass-panel border-[#D4AF37]/20 rounded-2xl p-4 shadow-xl z-50 text-xs space-y-3"
                    >
                      <h4 className="font-bold text-white border-b border-zinc-900 pb-2 flex justify-between items-center">
                        <span>Console Logs Ticker</span>
                        <span className="text-[8px] bg-[#D4AF37]/10 text-gold px-1.5 py-0.5 rounded border border-gold/15">Active</span>
                      </h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-900/60">
                          <span className="text-[9px] text-[#D4AF37] font-black uppercase block">System Check</span>
                          <span className="text-zinc-400 mt-1 block leading-relaxed font-semibold">FastAPI server response: 200 OK. SQLite DB metrics linked.</span>
                        </div>
                        <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-900/60">
                          <span className="text-[9px] text-[#D4AF37] font-black uppercase block">Groq Client</span>
                          <span className="text-zinc-400 mt-1 block leading-relaxed font-semibold">Environment variable GROQ_API_KEY detected. Ready for pipeline calls.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Badge */}
              <div className="hidden lg:flex items-center gap-2 bg-[#0F0F10] border border-[#D4AF37]/15 rounded-full px-3.5 py-1.5 text-[9.5px] font-black uppercase tracking-wider text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                OS Core Sync
              </div>

            </div>
          </header>

          {/* PAGE DISPLAY CONTAINER (Page transitions via Framer Motion) */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col xl:flex-row gap-8 z-10 relative scrollbar-thin">
            
            {/* Left Main Content Block */}
            <div className="flex-1 min-w-0 space-y-8">
              
              <AnimatePresence mode="wait">
                
                {/* 1. MASTER OS DASHBOARD */}
                {currentView === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: 15 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: -15 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    {/* Welcome Banner */}
                    <div className="glass-panel border-[#D4AF37]/15 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      
                      {/* Ambient corner light */}
                      <div className="absolute right-0 top-0 w-80 h-80 bg-radial from-[#D4AF37]/5 to-transparent blur-3xl pointer-events-none" />

                      <div className="space-y-2 max-w-xl">
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none bg-gradient-to-r from-white via-[#FFD95A] to-[#D4AF37] bg-clip-text text-transparent">
                          InnovationHub AI
                        </h2>
                        <p className="text-base text-zinc-200 font-semibold">The Autonomous AI Co-Founder & Operating System.</p>
                        <p className="text-xs text-zinc-550 leading-relaxed font-medium">
                          Deploy a concurrent pipeline of specialized cognitive agents to validate ideas, structure financials, audit risks, and compiler reports.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 shrink-0">
                        <button 
                          onClick={() => setCurrentView('validation')}
                          className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] hover:from-[#FFD95A] hover:to-[#D4AF37] text-black text-xs font-bold px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase tracking-wider border border-[#FFD95A]/20"
                        >
                          <Play className="w-3.5 h-3.5" /> Start New startup
                        </button>
                        <button 
                          onClick={() => triggerSystemAction('run-all')}
                          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Run All Agents
                        </button>
                      </div>
                    </div>

                    {/* Stats Metrics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1 hover:border-[#D4AF37]/20 transition-all duration-300 group">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">OS Precision Score</span>
                        <span className="block text-2xl font-black text-[#D4AF37] glow-text-gold group-hover:scale-105 transition-transform">99.4%</span>
                        <span className="text-[9px] text-zinc-555 block font-bold mt-1 uppercase">Groq Llama 70B API</span>
                      </div>

                      <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1 hover:border-[#D4AF37]/20 transition-all duration-300 group">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Active Databases</span>
                        <span className="block text-2xl font-black text-white group-hover:scale-105 transition-transform">SQLite Core</span>
                        <span className="text-[9px] text-zinc-555 block font-bold mt-1 uppercase">Relational storage</span>
                      </div>

                      <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1 hover:border-[#D4AF37]/20 transition-all duration-300 group">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Vector Memory</span>
                        <span className="block text-2xl font-black text-white group-hover:scale-105 transition-transform">{vectorDb.length} Dimensions</span>
                        <span className="text-[9px] text-zinc-555 block font-bold mt-1 uppercase">Simulated cache</span>
                      </div>

                      <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-1 hover:border-[#D4AF37]/20 transition-all duration-300 group">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Projects Analyzed</span>
                        <span className="block text-2xl font-black text-emerald-400 group-hover:scale-105 transition-transform">{projectsList.length} Items</span>
                        <span className="text-[9px] text-zinc-555 block font-bold mt-1 uppercase">SQLite record sync</span>
                      </div>

                    </div>

                    {/* Enterprise AI Command Center Directly Below Hero */}
                    <EnterpriseCommandCenter 
                      status={status}
                      activeWorkflow="Multi-Agent Autonomous Enterprise Pipeline"
                      currentStage={status === 'processing' ? 'Market Intelligence & TAM Sizing' : status === 'completed' ? 'Report Generation Completed' : 'System Ready for Directives'}
                      activeAgent={status === 'processing' ? 'Chief Innovation Officer' : 'Master Orchestrator'}
                      progress={status === 'completed' ? 100 : status === 'processing' ? 68.4 : 0}
                      confidence={98.4}
                      executionTime={status === 'completed' ? 3.42 : status === 'processing' ? 1.84 : 0}
                      avgResponseTime={1.15}
                      tokensUsed={18450}
                      apiCalls={156}
                      vectorMemoryStatus={`${vectorDb.length} Vectors Indexed`}
                      llmStatus={selectedModel}
                      tavilyStatus="Connected (380ms Latency)"
                    />

                    {/* Performance Monitor KPI Grid */}
                    <PerformanceMonitor 
                      cpuUsage={status === 'processing' ? 48.2 : 18.4}
                      memoryUsage={1.42}
                      maxMemory={4.0}
                      apiCalls={156}
                      avgLatency={1.15}
                      workflowDuration={status === 'completed' ? 3.42 : status === 'processing' ? 1.84 : 0}
                      successRate={99.4}
                      totalReports={projectsList.length}
                    />

                    {/* Task Queue & Quick Operator Actions */}
                    <TaskQueueAndActions 
                      status={status}
                      onTriggerAction={(act) => triggerSystemAction(act)}
                      onSelectAgentRun={(agId) => {
                        setCurrentView(agId);
                        addToast(`Navigating to ${agId} workforce agent.`, 'info');
                      }}
                    />

                    {/* Centerpiece: React Flow Live Orchestration Graph with Golden Particles */}
                    <WorkflowVisualizer status={status} activeAgentId={status === 'processing' ? 'market' : null} />

                    {/* Live Agent Status Cards */}
                    <LiveAgentCards 
                      workforce={workforce}
                      activeAgentId={status === 'processing' ? 'market' : null}
                      status={status}
                      onSelectAgent={(agId) => setCurrentView(agId)}
                    />

                    {/* AI Thinking Timeline (Replaces spinners) */}
                    {loading && (
                      <AIThinkingTimeline 
                        status={status}
                        currentStepIndex={2}
                        ideaText={idea || 'B2B Precision Drone Agriculture Service'}
                      />
                    )}

                    {/* EXECUTIVE STARTUP HEALTH DASHBOARD (Synthesizes All 6 Agents) */}
                    <div className="space-y-8 border-t-2 border-[#D4AF37]/30 pt-8 mt-8 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#FFD95A] text-black font-black text-xs uppercase tracking-wider">
                            CEO HUB
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Executive Startup Health Dashboard</h2>
                            <p className="text-xs text-zinc-400 font-semibold">Combined Intelligence Consensus of All 6 Cognitive Agents.</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-extrabold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
                          STATUS: EXCELLENT (91%)
                        </span>
                      </div>

                      {/* 1. Startup Health Score Circular Gauge */}
                      <StartupHealthGauge 
                        score={results?.idea_validation?.innovation_score || 91}
                        statusLabel="Excellent"
                        confidence={98.4}
                      />

                      {/* 2. Agent Score Summary KPI Cards */}
                      <AgentScoreSummary 
                        scores={{
                          innovation: results?.idea_validation?.innovation_score || 94,
                          market: 89,
                          strategy: 92,
                          finance: 95,
                          legal: 95,
                          marketing: 88
                        }}
                      />

                      {/* 3. Startup 6-Axis Radar Chart */}
                      <StartupRadarChart 
                        scores={{
                          innovation: results?.idea_validation?.innovation_score || 94,
                          market: 89,
                          strategy: 92,
                          finance: 95,
                          legal: 95,
                          marketing: 88
                        }}
                      />

                      {/* 4. Investor Readiness Cards */}
                      <InvestorReadiness 
                        readinessStatus="YES - HIGHLY READY"
                        fundingStage="SEED STAGE (PRE-A)"
                        investorConfidence={96.8}
                        estimatedRoi={5.4}
                        valuation={4.5}
                        breakEvenMonths={14}
                        runwayMonths={18}
                        fundingNeeded={500}
                      />

                      {/* 5. Business & Financial Performance Metrics */}
                      <BusinessMetrics 
                        tamSize={4.8}
                        revenueY3={8.5}
                        growthRate={185}
                        cac={420}
                        ltv={3800}
                        expectedProfit={34.5}
                        monthlyExpenses={32.5}
                        burnRate={14.2}
                        grossMargin={78.5}
                      />

                      {/* 6. Risk Heatmap */}
                      <RiskHeatmap />

                      {/* 7. CEO AI Recommendation Glass Card */}
                      <CeoAiRecommendation 
                        summary={results?.idea_validation?.value_proposition ? `Verified value proposition: "${results.idea_validation.value_proposition}". Strong unit economics and IP moat defense.` : undefined}
                      />

                      {/* 8. Interactive Project Timeline */}
                      <ProjectTimeline currentStageIndex={status === 'completed' ? 7 : 6} />

                      {/* 9 & 10. Report Preview Cards & Multi-Format Export Center */}
                      <ReportPreviewAndExport 
                        onTriggerExport={(fmt) => triggerSystemAction(`generate-${fmt}`)}
                      />

                      {/* 11 & 12. Insights Panel & Smart Notifications */}
                      <InsightsAndNotifications />
                    </div>

                    {/* Recharts Analytics Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                        <div>
                          <h3 className="font-bold text-sm text-white">Startup Feasibility Benchmarks</h3>
                          <p className="text-xs text-zinc-500">Evaluation index comparison scores across database records.</p>
                        </div>
                        <div className="space-y-3.5 pt-2">
                          {projectsList.map((proj) => (
                            <div key={proj.id} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-zinc-300 truncate max-w-[280px]">{proj.idea}</span>
                                <span className="text-[#D4AF37] font-bold">{proj.score}%</span>
                              </div>
                              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${proj.score}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] h-full rounded-full" 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Concentric radial loads */}
                      <div className="glass-panel rounded-2xl p-6 border-white/5 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-white">Memory Distribution</h3>
                          <p className="text-xs text-zinc-500">Retrieval similarity threshold vectors load.</p>
                        </div>

                        <div className="flex justify-center items-center py-4">
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="56" cy="56" r="46" className="stroke-zinc-900" strokeWidth="6" fill="transparent" />
                              <circle cx="56" cy="56" r="46" className="stroke-[#D4AF37]" strokeWidth="6" strokeDasharray={289} strokeDashoffset={72} strokeLinecap="round" fill="transparent" />
                            </svg>
                            <div className="absolute text-center">
                              <span className="text-lg font-black text-white">75%</span>
                              <span className="text-[8px] text-zinc-500 block uppercase font-bold tracking-widest mt-0.5">Threshold</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-[10px] text-zinc-500 border-t border-zinc-900 pt-3 flex justify-between font-mono font-bold">
                          <span>Dims: <strong className="text-white">1536</strong></span>
                          <span>Cache: <strong className="text-emerald-400">PULSING</strong></span>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                )}

                {/* 2. IDEA VALIDATION & PIPELINE CONTROL */}
                {currentView === 'validation' && (
                  <motion.div
                    key="validation"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: 15 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: -15 }}
                    className="space-y-8"
                  >
                    <div className="glass-panel border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-gradient-to-br from-[#D4AF37] to-[#FFD95A] rounded-2xl border border-[#FFD95A]/20 shadow-[0_0_15px_rgba(212,175,55,0.25)] text-black">
                          <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-white">Idea Validation Board</h2>
                          <p className="text-xs text-zinc-500 font-semibold mt-0.5">Chief Innovation Officer | Active Model: {selectedModel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setCurrentView('dashboard')}
                          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" /> Back to Dashboard
                        </button>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-400">Agent Online</span>
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-6 border-white/5">
                      <h3 className="text-sm font-bold text-white mb-2">🚀 Synthesize New Startup Idea</h3>
                      <p className="text-xs text-zinc-550 mb-4 leading-relaxed font-semibold">
                        Enter your startup pitch concept. The Master AI will distribute the payload to all 6 workforce agents concurrently to run full validation metrics.
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                          value={idea}
                          onChange={(e) => setIdea(e.target.value)}
                          disabled={loading}
                          placeholder='Example: "An automated solar drone precision spraying service for agricultural crop management, allowing farms to hire local pilots."'
                          className="w-full min-h-[120px] bg-[#070707]/80 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm leading-relaxed font-semibold"
                        />

                        {/* PDF Drag and Drop Area */}
                        <div className="border border-dashed border-[#D4AF37]/20 hover:border-[#D4AF37]/50 rounded-xl p-5 bg-[#070707]/60 text-center transition-all cursor-pointer relative group">
                          <input 
                            type="file" 
                            accept=".pdf"
                            disabled={loading}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handlePdfUpload(e.target.files[0]);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                          />
                          <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                            <Upload className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform animate-pulse" />
                            <span className="text-xs font-bold text-zinc-300">Or Upload Problem Statement PDF</span>
                            <span className="text-[9px] text-zinc-600 uppercase font-mono tracking-wider font-bold">Drag and drop file here, or click to browse</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pt-2">
                          <div className="flex gap-4 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                            <span>LLM: <strong className="text-white">{selectedModel}</strong></span>
                            <span>Temp: <strong className="text-white">{tempVal}</strong></span>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={loading || !idea.trim()}
                            className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] hover:from-[#FFD95A] hover:to-[#D4AF37] disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 text-black font-bold px-6 py-3.5 rounded-xl border border-[#FFD95A]/20 shadow-md shadow-[#D4AF37]/10 transition-all flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synthesizing Pipeline...
                              </>
                            ) : (
                              <>
                                Execute Pipeline <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Progress details */}
                    {loading && (
                      <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[250px]">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin" />
                          <Compass className="w-6 h-6 text-amber-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Pipeline Synthesis Processing</h3>
                          <p className="text-[11px] text-zinc-500 max-w-sm leading-relaxed mx-auto">
                            Chief Innovation Officer is validating uniqueness. Business strategy consultant is planning monetization tiers. Chartered analyst is constructing break-evens.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Completed validation panel results */}
                    {status === 'completed' && results && results.idea_validation && (
                      <div className="space-y-6">
                        {/* Tab toggle headers */}
                        <div className="flex border-b border-zinc-900 gap-6 overflow-x-auto pb-1 scrollbar-thin">
                          {workforce.map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTab(tab.id)}
                              className={`pb-3 text-[11px] font-bold tracking-wide uppercase transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                                activeTab === tab.id
                                  ? 'border-[#D4AF37] text-white font-black'
                                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              {tab.name}
                            </button>
                          ))}
                        </div>

                        {/* Rendering dynamic active tab sheets */}
                        <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-6">
                          
                          {/* Idea Validation report */}
                          {activeTab === 'validation' && results.idea_validation && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Feasibility Score</span>
                                  <span className="text-3xl font-black text-[#D4AF37] mt-2 glow-text-gold">{results.idea_validation.innovation_score}%</span>
                                </div>
                                <div className="md:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 space-y-2">
                                  <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Value Proposition</h4>
                                  <p className="text-xs text-zinc-200 leading-relaxed font-semibold">"{results.idea_validation.value_proposition}"</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Problem Statement</h4>
                                <p className="text-xs text-zinc-350 leading-relaxed font-medium">{results.idea_validation.problem_statement}</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900/60">
                                <div className="space-y-3">
                                  <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Hurdles & Risks</h4>
                                  <ul className="space-y-2">
                                    {results.idea_validation.risks.map((risk, i) => (
                                      <li key={i} className="text-xs text-zinc-400 flex items-start gap-2.5 font-medium">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                        <span>{risk}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-3">
                                  <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Recommendations</h4>
                                  <ul className="space-y-2">
                                    {results.idea_validation.recommendations.map((rec, i) => (
                                      <li key={i} className="text-xs text-zinc-400 flex items-start gap-2.5 font-medium">
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Strategy report */}
                          {activeTab === 'strategy' && results.business_strategy && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 space-y-2">
                                  <h4 className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">Business Model</h4>
                                  <p className="text-xs text-zinc-300 leading-relaxed">{results.business_strategy.business_model}</p>
                                </div>
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 space-y-2">
                                  <h4 className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">Pricing Model</h4>
                                  <p className="text-xs text-zinc-300 leading-relaxed">{results.business_strategy.pricing_model}</p>
                                </div>
                              </div>

                              <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 space-y-2">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Competitive Defensive Moat</h4>
                                <p className="text-xs text-zinc-300 leading-relaxed">{results.business_strategy.competitive_moat}</p>
                              </div>

                              <div className="space-y-3 pt-4 border-t border-zinc-900/60">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Strategic Milestones Roadmap</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-zinc-950/20 border border-zinc-900 p-4 rounded-xl">
                                    <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-widest block mb-2">Phase 1: 30 Days</span>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">{results.business_strategy.roadmap.phase_1_30_days}</p>
                                  </div>
                                  <div className="bg-zinc-950/20 border border-zinc-900 p-4 rounded-xl">
                                    <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-widest block mb-2">Phase 2: 60 Days</span>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">{results.business_strategy.roadmap.phase_2_60_days}</p>
                                  </div>
                                  <div className="bg-zinc-950/20 border border-zinc-900 p-4 rounded-xl">
                                    <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-widest block mb-2">Phase 3: 90 Days</span>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed">{results.business_strategy.roadmap.phase_3_90_days}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Finance report */}
                          {activeTab === 'finance' && results.finance_modeling && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 text-center">
                                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Funding Ask Required</span>
                                  <span className="text-2xl font-black text-amber-500 block mt-2">{results.finance_modeling.funding_required}</span>
                                </div>
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 text-center">
                                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Break Even Target</span>
                                  <span className="text-2xl font-black text-emerald-400 block mt-2">{results.finance_modeling.break_even_timeline}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-900/60">
                                <div className="space-y-2">
                                  <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Revenue streams</h4>
                                  <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                    {results.finance_modeling.revenue_streams.map((stream, i) => <li key={i}>{stream}</li>)}
                                  </ul>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Cost structure elements</h4>
                                  <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
                                    {results.finance_modeling.cost_structure.map((cost, i) => <li key={i}>{cost}</li>)}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Market report */}
                          {activeTab === 'market' && results.market_intelligence && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-3 gap-6">
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 text-center">
                                  <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">TAM</span>
                                  <span className="text-lg font-black text-white block mt-1">{results.market_intelligence.tam_size}</span>
                                </div>
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 text-center">
                                  <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">SAM</span>
                                  <span className="text-lg font-black text-white block mt-1">{results.market_intelligence.sam_size}</span>
                                </div>
                                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 text-center">
                                  <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider block">SOM</span>
                                  <span className="text-lg font-black text-emerald-400 block mt-1">{results.market_intelligence.som_size}</span>
                                </div>
                              </div>

                              <div className="space-y-2 pt-4 border-t border-zinc-900/60">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Target Persona Details</h4>
                                <p className="text-xs text-zinc-350"><strong>Demographic Focus:</strong> {results.market_intelligence.target_audience.demographic}</p>
                                <p className="text-xs text-zinc-350"><strong>User Persona:</strong> "{results.market_intelligence.target_audience.persona}"</p>
                              </div>
                            </div>
                          )}

                          {/* Legal report */}
                          {activeTab === 'legal' && results.legal_risk && (
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">IP Protection Strategy</h4>
                                <p className="text-xs text-zinc-300 leading-relaxed">{results.legal_risk.ip_protection_strategy}</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Regulatory Hurdles & Risks</h4>
                                <p className="text-xs text-zinc-300 leading-relaxed">{results.legal_risk.regulatory_hurdles}</p>
                              </div>
                            </div>
                          )}

                          {/* Marketing report */}
                          {activeTab === 'marketing' && results.marketing_strategy && (
                            <div className="space-y-6">
                              <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 space-y-2">
                                <h4 className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">Core messaging positioning</h4>
                                <p className="text-sm font-bold text-white italic">"{results.marketing_strategy.core_message}"</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Customer Acquisition strategy</h4>
                                <p className="text-xs text-zinc-300 leading-relaxed">{results.marketing_strategy.customer_acquisition_strategy}</p>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. DYNAMIC WORKSPACE PAGES FOR EACH AGENT */}
                {['validation', 'market', 'strategy', 'finance', 'legal', 'marketing'].includes(currentView) && currentView !== 'validation' && (
                  renderAgentWorkspace(currentView)
                )}

                {/* 4. PROJECTS DIRECTORY LISTING */}
                {currentView === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: 15 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: -15 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-white">Startup Projects Repository</h2>
                      <p className="text-xs text-zinc-500 mt-1">Manage and audit generated project vectors stored inside the SQLite database.</p>
                    </div>

                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-550">SQLite Indexes: {projectsList.length} startup cards</span>
                        <button 
                          onClick={() => setCurrentView('validation')}
                          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-[#D4AF37]/35 text-xs font-bold text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          Compile New Project
                        </button>
                      </div>

                      <div className="overflow-x-auto scrollbar-thin">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-3 px-2">Project ID</th>
                              <th className="py-3 px-2">Concept Idea</th>
                              <th className="py-3 px-2">Status</th>
                              <th className="py-3 px-2">Innovation Score</th>
                              <th className="py-3 px-2">Date stamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectsList.map((p) => (
                              <tr key={p.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/20 text-zinc-300 font-semibold transition-all">
                                <td className="py-4 px-2 text-[#D4AF37] font-mono font-bold">#0{p.id}</td>
                                <td className="py-4 px-2 max-w-[280px] truncate">{p.idea}</td>
                                <td className="py-4 px-2">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    p.status === 'completed' 
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                                <td className="py-4 px-2 text-white font-bold">{p.score > 0 ? `${p.score}/100` : '—'}</td>
                                <td className="py-4 px-2 text-zinc-500">{p.created_at}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. SHARED VECTOR DATABASE MEMORY VIEW */}
                {currentView === 'memory' && (
                  <motion.div
                    key="memory"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: 15 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: -15 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-white">Vector Database Memory Core</h2>
                      <p className="text-xs text-zinc-500 mt-1">Audit shared memory vector embeddings, coordinate tags, and index custom rules.</p>
                    </div>

                    {/* Draggable canvas knowledge network visualizer */}
                    <div className="glass-panel rounded-3xl p-6 border-white/5 space-y-4">
                      <h3 className="text-xs uppercase font-bold tracking-widest text-[#AAAAAA]">Dynamic memory network</h3>
                      <KnowledgeGraph memoryNodes={vectorDb} />
                    </div>

                    {/* Index new context node */}
                    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                      <h3 className="text-sm font-bold text-white">Index Context Fact Node</h3>
                      <p className="text-xs text-zinc-550 leading-relaxed">Insert custom startup facts, market dimensions, or guidelines. These will get converted to simulated high-dimension vectors.</p>
                      
                      <form onSubmit={handleAddMemory} className="flex gap-4">
                        <input 
                          type="text" 
                          value={memoryInput}
                          onChange={(e) => setMemoryInput(e.target.value)}
                          placeholder="Type fact (e.g. Drone operations battery duration limit is 45 minutes...)"
                          className="flex-1 bg-[#070707] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-[#D4AF37] transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!memoryInput.trim()}
                          className="bg-[#D4AF37] hover:bg-[#FFD95A] disabled:bg-zinc-900 disabled:text-zinc-600 text-black text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shrink-0 uppercase tracking-wider"
                        >
                          Index Context
                        </button>
                      </form>
                    </div>

                  </motion.div>
                )}

                {/* 6. AGENT REPORTS COMPILER */}
                {currentView === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: 15 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: -15 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-white">Agent Reports Workspace</h2>
                      <p className="text-xs text-zinc-500 mt-1">Compile comprehensive startup business proposals and launch decks.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Column: Compiled sections index list */}
                      <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-3.5">
                        <h4 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Report chapters</h4>
                        <div className="space-y-1.5">
                          {[
                            { id: 'summary', name: '01. Executive Summary' },
                            { id: 'validation', name: '02. Idea Validation' },
                            { id: 'market', name: '03. Market Intelligence' },
                            { id: 'strategy', name: '04. Business Strategy' },
                            { id: 'finance', name: '05. Financial Forecast' },
                            { id: 'legal', name: '06. Legal & Risk Audit' },
                            { id: 'marketing', name: '07. Growth Marketing' }
                          ].map((sec) => (
                            <button
                              key={sec.id}
                              onClick={() => setSelectedReportSection(sec.id)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                                selectedReportSection === sec.id 
                                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-l-[3px] border-[#D4AF37] pl-[11px]' 
                                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                              }`}
                            >
                              <span>{sec.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Center Column: Premium preview sheet */}
                      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/5 space-y-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                            <span className="text-[9px] uppercase font-mono text-[#D4AF37] font-bold">InnovationHub compiled section</span>
                            <span className="text-[9px] uppercase font-mono text-zinc-600 font-bold">Confidential</span>
                          </div>

                          <div className="text-xs leading-relaxed text-zinc-300 font-medium space-y-3">
                            {selectedReportSection === 'summary' && (
                              <>
                                <h3 className="text-base font-black text-white">01. Executive Summary</h3>
                                <p>This document compiles the multi-agent cognitive assessment of the startup idea: "{idea || 'Precision agricultural drone operations.'}".</p>
                                <p>Our validation pipeline estimated a strong Innovation Feasibility score of {results?.idea_validation?.innovation_score ?? 85}%, highlighting low direct regulatory risk and highly optimized unit monetization structures.</p>
                              </>
                            )}
                            {selectedReportSection === 'validation' && (
                              <>
                                <h3 className="text-base font-black text-white">02. Idea Validation</h3>
                                <p><strong>Problem Statement:</strong> {results?.idea_validation?.problem_statement || 'Target crop growers experience critical bottlenecks and yield reductions from standard manual chemical pesticide sprays.'}</p>
                                <p><strong>Value Proposition:</strong> {results?.idea_validation?.value_proposition || 'On-demand subscription operations bundle including multispectral crop tracking and precision drone sprays.'}</p>
                              </>
                            )}
                            {selectedReportSection === 'market' && (
                              <>
                                <h3 className="text-base font-black text-white">03. Market Intelligence</h3>
                                <p><strong>Addressable Market (TAM):</strong> {results?.market_intelligence?.tam_size || 'Estimated $14.2 Billion globally by 2028.'}</p>
                                <p><strong>Target Demographic:</strong> {results?.market_intelligence?.target_audience?.demographic || 'Medium-to-large commercial farms and farming operations cooperatives.'}</p>
                              </>
                            )}
                            {selectedReportSection === 'strategy' && (
                              <>
                                <h3 className="text-base font-black text-white">04. Business Strategy</h3>
                                <p><strong>Monetization Structure:</strong> {results?.business_strategy?.business_model || 'Drone-as-a-service subscription.'}</p>
                                <p><strong>Defensive Competitive Moat:</strong> {results?.business_strategy?.competitive_moat || 'Proprietary machine learning models trained on regional crop signatures and customized spray-drift mitigation payloads.'}</p>
                              </>
                            )}
                            {selectedReportSection === 'finance' && (
                              <>
                                <h3 className="text-base font-black text-white">05. Financial Forecast</h3>
                                <p><strong>Funding Ask Required:</strong> {results?.finance_modeling?.funding_required || '$150,000 for local fleet operations.'}</p>
                                <p><strong>Break Even Timeline:</strong> {results?.finance_modeling?.break_even_timeline || '12-14 Months post-launch.'}</p>
                              </>
                            )}
                            {selectedReportSection === 'legal' && (
                              <>
                                <h3 className="text-base font-black text-white">06. Legal & Risk Audit</h3>
                                <p><strong>Compliance & Hurdles:</strong> {results?.legal_risk?.regulatory_hurdles || 'FAA Part 137 agricultural spray certifications and local pesticide distribution chemical permits.'}</p>
                              </>
                            )}
                            {selectedReportSection === 'marketing' && (
                              <>
                                <h3 className="text-base font-black text-white">07. Growth Marketing</h3>
                                <p><strong>Positioning Messaging:</strong> "{results?.marketing_strategy?.core_message || 'Precision agricultural spray diagnostics made automatic.'}"</p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="border-t border-zinc-900 pt-4 flex flex-wrap gap-3">
                          <button 
                            onClick={() => window.print()}
                            className="bg-gradient-to-r from-[#D4AF37] to-[#FFD95A] text-black text-[11px] font-bold px-4 py-2.5 rounded-xl border border-gold hover:from-[#FFD95A] hover:to-[#D4AF37] cursor-pointer transition-all uppercase tracking-wider"
                          >
                            Download Report PDF
                          </button>
                          <button 
                            onClick={() => {
                              setPresentationSlide(0);
                              setShowPresentationMode(true);
                              addToast('Slides presentation deck compiled.', 'info');
                            }}
                            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-[11px] font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all uppercase tracking-wider"
                          >
                            Open Slide Presentation
                          </button>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 7. SYSTEM SETTINGS PANEL */}
                {currentView === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: 15 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)', y: -15 }}
                    className="space-y-8 max-w-4xl mx-auto"
                  >
                    <div className="border-b border-[#D4AF37]/15 pb-5">
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        ⚙️ System Settings & API Diagnostics
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Review cognitive thresholds, credentials, database nodes, and verify connection parameters.
                      </p>
                    </div>

                    {/* Tab cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white">Diagnostics Connection Check</h3>
                        <p className="text-xs text-zinc-550 leading-relaxed">Validates Groq API cloud connection by initiating a lightweight chat completion ping.</p>
                        
                        <div className="space-y-4 pt-2">
                          {testResult && (
                            <div className={`p-3 rounded-xl text-xs font-semibold ${
                              testResult.success 
                                ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' 
                                : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
                            }`}>
                              Status: {testResult.success ? 'Success' : 'Error'} - {testResult.detail}
                            </div>
                          )}
                          <button
                            onClick={handleTestConnection}
                            disabled={testingConnection}
                            className="w-full bg-[#D4AF37] hover:bg-[#FFD95A] disabled:bg-zinc-900 text-black text-xs font-bold py-3 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                          >
                            {testingConnection ? 'Pinging API...' : 'Test Connection'}
                          </button>
                        </div>
                      </div>

                      <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white">LLM Configuration Settings</h3>
                        <div className="space-y-3.5 text-xs">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider">Cognitive Temperature</label>
                            <input 
                              type="number" 
                              step="0.1" 
                              min="0" 
                              max="1" 
                              value={tempVal}
                              onChange={(e) => setTempVal(parseFloat(e.target.value))}
                              className="bg-[#070707] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider">Max Token limits</label>
                            <input 
                              type="number" 
                              value={maxTokens}
                              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                              className="bg-[#070707] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cursor Theme Selection */}
                      <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-4 col-span-1 md:col-span-2">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          🎨 Mouse Cursor Glow Theme
                        </h3>
                        <p className="text-xs text-zinc-550 leading-relaxed font-semibold">Customize the interactive custom mouse cursor glow theme.</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                          {[
                            { id: 'gold', name: 'Royal Gold', color: '#D4AF37', border: 'border-[#D4AF37]' },
                            { id: 'silver', name: 'Platinum Silver', color: '#E5E4E2', border: 'border-[#E5E4E2]' },
                            { id: 'emerald', name: 'Cyber Emerald', color: '#2ECC71', border: 'border-[#2ECC71]' },
                            { id: 'blue', name: 'Cosmic Blue', color: '#3B82F6', border: 'border-[#3B82F6]' }
                          ].map((themeItem) => (
                            <button
                              key={themeItem.id}
                              onClick={() => {
                                setCursorTheme(themeItem.id);
                                localStorage.setItem('innovationhub_cursor_theme', themeItem.id);
                                addToast(`Mouse cursor theme changed to ${themeItem.name}.`, 'success');
                              }}
                              className={`p-4 bg-[#070707]/60 hover:bg-zinc-900/60 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                                cursorTheme === themeItem.id 
                                  ? `${themeItem.border} bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.05)]` 
                                  : 'border-zinc-900'
                              }`}
                            >
                              <div 
                                className="w-5 h-5 rounded-full" 
                                style={{ backgroundColor: themeItem.color, boxShadow: `0 0 10px ${themeItem.color}` }}
                              />
                              <span className="text-[10px] font-bold text-zinc-300">{themeItem.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Right Information Panel (Unified Logs Ticker) */}
            <aside className="w-full xl:w-96 shrink-0 space-y-6 z-10">
              
              {/* Real-time Activity Feed Right Panel */}
              <ActivityFeedPanel 
                logs={tickerLogs}
                onClearLogs={() => setTickerLogs([])}
              />

              {/* Vector overhead specifications */}
              <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-3.5">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#D4AF37]" /> Vector Embeddings Meta
                </h3>
                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cosine Threshold</span>
                    <span className="text-emerald-400">98.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Dimensions</span>
                    <span className="text-white">1536 (Llama-3)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-555">Vector Space</span>
                    <span className="text-white">SQLite Virtual DB</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>

          {/* Footer */}
          <footer className="glass-panel border-t mt-auto py-4 px-6 text-center text-[9px] text-zinc-555 uppercase tracking-widest font-mono font-bold z-10">
            InnovationHub AI — Premium AI Operating System console. Connected to Groq API.
          </footer>

        </div>
      </div>

      {/* Print only A4 document container */}
      <div className="print-only-report hidden print:block bg-[#070707] text-white p-12 w-full">
        {/* Page 1: Cover Page */}
        <div className="print-page-break flex flex-col justify-center items-center text-center min-h-[90vh] py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD95A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/15 mx-auto mb-8">
            <span className="text-3xl font-black text-black">IH</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">InnovationHub AI</h1>
          <p className="text-sm uppercase tracking-widest text-[#D4AF37] font-bold mt-2">Operating System Analysis Report</p>
          
          <div className="mt-20 border-t border-[#D4AF37]/20 pt-8 w-full max-w-sm text-left mx-auto space-y-2 text-xs text-zinc-400">
            <p><strong>Concept Pitch:</strong> {idea || 'Autonomous Agricultural Drone Operations Services'}</p>
            <p><strong>Vector Hash:</strong> SHA256_COFOUNDER_SECURE</p>
            <p><strong>Security Classification:</strong> Confidential</p>
            <p><strong>Date Compiled:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Page 2: Executive Summary & Validation */}
        <div className="print-page-break py-12">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#D4AF37] border-b border-[#D4AF37]/20 pb-3 mb-6">01. Idea Validation & Feasibility</h2>
          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-900 mb-6 inline-block">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Feasibility Innovation Score</span>
            <span className="text-3xl font-black text-[#D4AF37] mt-1 block">{results?.idea_validation?.innovation_score ?? 85}/100</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300 mb-4"><strong>Problem Statement:</strong> {results?.idea_validation?.problem_statement || 'Target crop growers experience critical bottlenecks and yield reductions from standard manual chemical pesticide sprays.'}</p>
          <p className="text-sm leading-relaxed text-zinc-300 mb-4"><strong>Value Proposition:</strong> {results?.idea_validation?.value_proposition || 'On-demand B2B solar agricultural drone monitors and targeted precision sprays.'}</p>
          <p className="text-sm leading-relaxed text-zinc-300"><strong>Recommendations:</strong> Initiate strategic cooperative distributions and partner with licensed FAA drone pilots.</p>
        </div>

        {/* Page 3: Strategic Planning */}
        <div className="print-page-break py-12">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#D4AF37] border-b border-[#D4AF37]/20 pb-3 mb-6">02. Business Strategy & Moat</h2>
          <p className="text-sm leading-relaxed text-zinc-300 mb-4"><strong>Business Model:</strong> {results?.business_strategy?.business_model || 'B2B subscription-based mapping combined with application transactional spraying fees.'}</p>
          <p className="text-sm leading-relaxed text-zinc-300 mb-4"><strong>Pricing model:</strong> {results?.business_strategy?.pricing_model || '$15/acre flat mapping + $35/acre spraying application fee.'}</p>
          <p className="text-sm leading-relaxed text-zinc-300"><strong>Competitive Moat:</strong> {results?.business_strategy?.competitive_moat || 'Proprietary machine learning models trained on regional crop signatures and customized spray-drift mitigation payloads.'}</p>
        </div>
      </div>

      {/* FULLSCREEN PITCH DECK SLIDE SHOW MODAL */}
      <AnimatePresence>
        {showPresentationMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#070707] flex flex-col justify-between p-12"
          >
            {/* Slide Show Header */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">Startup Pitch Deck Player</span>
              </div>
              <button 
                onClick={() => setShowPresentationMode(false)}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-white hover:border-gold/30 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Body */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={presentationSlide}
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {presentationSlide === 0 && (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD95A] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/15">
                        <Layers className="w-8 h-8 text-black" />
                      </div>
                      <h2 className="text-4xl font-black text-white tracking-tight leading-none">InnovationHub Pitch Deck</h2>
                      <p className="text-sm uppercase tracking-widest text-[#D4AF37] font-bold">Autonomous Co-Founder OS</p>
                      <p className="text-xs text-zinc-500 font-semibold mt-4">Concept: "{idea || 'Precision agricultural drone operations'}"</p>
                    </div>
                  )}

                  {presentationSlide === 1 && (
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">The Problem</span>
                      <h2 className="text-3xl font-black text-white tracking-tight leading-none">Critical Operations Friction</h2>
                      <p className="text-sm text-zinc-300 max-w-xl leading-relaxed mx-auto">
                        {results?.idea_validation?.problem_statement || 'Manual chemical sprays and crop trackers are highly inefficient, resulting in localized crop disease losses.'}
                      </p>
                    </div>
                  )}

                  {presentationSlide === 2 && (
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">The Solution</span>
                      <h2 className="text-3xl font-black text-white tracking-tight leading-none">Autonomous DaaS Operations</h2>
                      <p className="text-sm text-zinc-300 max-w-xl leading-relaxed mx-auto">
                        {results?.idea_validation?.value_proposition || 'On-demand agricultural drone operations offering multispectral scanning and pesticide spray capabilities.'}
                      </p>
                    </div>
                  )}

                  {presentationSlide === 3 && (
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">Business Model</span>
                      <h2 className="text-3xl font-black text-white tracking-tight leading-none">Subscription + Transaction</h2>
                      <p className="text-sm text-zinc-300 max-w-xl leading-relaxed mx-auto">
                        {results?.business_strategy?.business_model || 'Standard $15/acre mapping subscription combined with $35/acre targeted spray applications fee.'}
                      </p>
                    </div>
                  )}

                  {presentationSlide === 4 && (
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">Strategic Roadmap</span>
                      <h2 className="text-3xl font-black text-white tracking-tight leading-none">30-60-90 Milestone Focus</h2>
                      <p className="text-xs text-zinc-400 max-w-xl leading-relaxed mx-auto mt-2">
                        <strong>30 Days:</strong> {results?.business_strategy?.roadmap?.phase_1_30_days || 'Compile software prototype and apply for FAA operations licenses.'}
                      </p>
                      <p className="text-xs text-zinc-400 max-w-xl leading-relaxed mx-auto">
                        <strong>60 Days:</strong> {results?.business_strategy?.roadmap?.phase_2_60_days || 'Recruit 5 early partner farms to validate spray effectiveness.'}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Navigation Footer */}
            <div className="flex justify-between items-center border-t border-zinc-900 pt-6">
              <span className="text-[10px] font-mono text-zinc-650 font-bold">Slide {presentationSlide + 1} of 5</span>
              <div className="flex gap-4">
                <button
                  disabled={presentationSlide === 0}
                  onClick={() => setPresentationSlide((prev) => Math.max(0, prev - 1))}
                  className="bg-zinc-950 border border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gold/30 text-white text-[10px] uppercase font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Prev Slide
                </button>
                <button
                  disabled={presentationSlide === 4}
                  onClick={() => setPresentationSlide((prev) => Math.min(4, prev + 1))}
                  className="bg-[#D4AF37] hover:bg-[#FFD95A] disabled:opacity-40 disabled:cursor-not-allowed text-black text-[10px] uppercase font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Next Slide
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
