import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Eye, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Volume2, 
  Smartphone, 
  Compass,
  Car as CarIcon,
  Wind,
  Navigation,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { SectionHeader, GlowingCard } from '../components/UI';

// --- Sub-component: Realistic Canvas Road Simulation ---
const RealisticRoad = ({ attention, complexity, hmiMode }: { attention: number, complexity: number, hmiMode: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drift, setDrift] = useState(0);
  const requestRef = useRef<number>(null);
  const stateRef = useRef({
    pos: 0,
    curve: 0,
    targetCurve: 0,
    speed: 0,
    drift: 0,
    time: 0
  });

  // Physics and Logic Loop
  useEffect(() => {
    const animate = (time: number) => {
      const state = stateRef.current;
      const targetSpeed = 0.15 + (complexity / 500);
      state.speed += (targetSpeed - state.speed) * 0.1;
      state.pos += state.speed;
      state.time += 0.01;

      // Road Curvature Logic
      if (Math.floor(state.pos / 50) % 2 === 0 && Math.abs(state.curve - state.targetCurve) < 0.01) {
        state.targetCurve = (Math.random() - 0.5) * (complexity / 40);
      }
      state.curve += (state.targetCurve - state.curve) * 0.02;

      // Drift Logic based on attention
      if (attention < 45) {
        const driftForce = (45 - attention) * 0.002;
        state.drift += (Math.sin(state.time * 2) * driftForce);
      } else {
        state.drift *= 0.94; // Lane keep assist
      }
      // Keep drift in bounds
      state.drift = Math.max(-1.5, Math.min(1.5, state.drift));
      setDrift(state.drift * 30); // Update state for the car component

      render();
      requestRef.current = requestAnimationFrame(animate);
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const horizon = h * 0.45;

      // 1. Background (Sky/Horizon)
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Horizon Glow
      const gradient = ctx.createLinearGradient(0, horizon - 50, 0, horizon);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizon - 50, w, 50);

      // 2. Draw Road Segments
      const totalSegments = 80;
      const segmentHeight = (h - horizon) / totalSegments;

      for (let i = totalSegments; i > 0; i--) {
        const z = i / totalSegments;
        const nextZ = (i - 1) / totalSegments;
        
        // Perspective mapping
        const perspective = (p: number) => (p / z);
        const y = horizon + (1 - z) * (h - horizon);
        const nextY = horizon + (1 - nextZ) * (h - horizon);
        
        const roadWidth = w * 0.8;
        const currentW = (roadWidth / z) * 0.3;
        const nextW = (roadWidth / nextZ) * 0.3;

        // Curvature offset
        const curveOffset = Math.pow(1 - z, 2) * stateRef.current.curve * 500;
        const nextCurveOffset = Math.pow(1 - nextZ, 2) * stateRef.current.curve * 500;

        const centerX = w / 2 + curveOffset;
        const nextCenterX = w / 2 + nextCurveOffset;

        // Asphalt
        ctx.fillStyle = (Math.floor(stateRef.current.pos + i) % 2 === 0) ? '#0f172a' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(centerX - currentW, y);
        ctx.lineTo(nextCenterX - nextW, nextY);
        ctx.lineTo(nextCenterX + nextW, nextY);
        ctx.lineTo(centerX + currentW, y);
        ctx.fill();

        // Lane Markings
        if (Math.floor(stateRef.current.pos + i) % 4 === 0) {
          ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
          const stripeW = currentW * 0.05;
          ctx.fillRect(centerX - stripeW / 2, y, stripeW, segmentHeight);
        }

        // Roadside Objects (Poles)
        if (Math.floor(stateRef.current.pos + i) % 15 === 0) {
          ctx.fillStyle = '#334155';
          const poleX = centerX - currentW - (20 / z);
          const poleH = 40 / z;
          ctx.fillRect(poleX, y - poleH, 2 / z, poleH);
        }
      }

      // 3. Vision Blur Layer
      if (attention < 40) {
        ctx.fillStyle = `rgba(2, 6, 23, ${(40 - attention) / 100})`;
        ctx.fillRect(0, 0, w, h);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [attention, complexity]);

  return (
    <div className="relative w-full h-80 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden mb-8 shadow-inner">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={320} 
        className="w-full h-full object-cover opacity-80"
      />

      {/* The Ego Vehicle (SVG Layer for crispness) */}
      <motion.div
        animate={{ 
          x: drift,
          rotate: drift / 4,
          y: [0, -1, 0] 
        }}
        transition={{ 
          x: { type: 'spring', damping: 20, stiffness: 60 },
          y: { repeat: Infinity, duration: 0.15 }
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <div className="relative group">
          {/* Car Shadow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/40 blur-md rounded-full" />
          
          {/* Car Body */}
          <div className={`p-4 rounded-xl transition-all duration-700 border-2 ${
            hmiMode === 'URGENT' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)]' : 
            hmiMode === 'ADVISORY' ? 'bg-slate-100/10 border-slate-200 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' :
            'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
          }`}>
            <CarIcon size={48} strokeWidth={1.5} />
            
            {/* Dynamic Taillights */}
            <div className="absolute -bottom-1 left-2 flex gap-8">
              <motion.div 
                animate={{ opacity: hmiMode === 'URGENT' ? [0.4, 1, 0.4] : 0.2 }}
                className={`w-3 h-1 rounded-full ${hmiMode === 'URGENT' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-900'}`} 
              />
              <motion.div 
                animate={{ opacity: hmiMode === 'URGENT' ? [0.4, 1, 0.4] : 0.2 }}
                className={`w-3 h-1 rounded-full ${hmiMode === 'URGENT' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-red-900'}`} 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
             <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800 backdrop-blur-md">
                <Navigation size={14} className="text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">NAV: ACTIVE</span>
             </div>
             <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800 backdrop-blur-md">
                <Wind size={14} className="text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">SPD: {Math.round(75 + complexity / 2)} KM/H</span>
             </div>
          </div>
          
          <div className={`flex items-center gap-3 px-5 py-2.5 bg-slate-950/90 rounded-xl border transition-all duration-500 backdrop-blur-md ${
            attention < 40 ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${attention < 40 ? 'bg-amber-500 animate-pulse' : 'bg-cyan-500'}`} />
            <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
              Driver: {attention < 40 ? 'DISTRACTED' : 'ENGAGED'}
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        <AnimatePresence>
          {hmiMode === 'URGENT' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="self-center bg-amber-500 text-slate-950 px-10 py-4 rounded-2xl font-black text-sm tracking-[0.3em] flex flex-col items-center gap-2 shadow-[0_0_50px_rgba(245,158,11,0.6)]"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="animate-bounce" />
                TAKE CONTROL IMMEDIATELY
              </div>
              <p className="text-[10px] opacity-70 font-mono">AUTOMATED SYSTEM DISENGAGING IN 2.4s</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Atmospheric Glare */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
    </div>
  );
};

const Simulation = () => {
  const [attention, setAttention] = useState(85);
  const [complexity, setComplexity] = useState(25);
  const [history, setHistory] = useState<any[]>([]);
  
  const riskScore = useMemo(() => {
    const risk = ((100 - attention) * 0.7) + (complexity * 0.3);
    return Math.min(100, Math.max(0, risk));
  }, [attention, complexity]);

  const hmiMode = useMemo(() => {
    if (riskScore > 65) return 'URGENT';
    if (riskScore > 35) return 'ADVISORY';
    return 'NOMINAL';
  }, [riskScore]);

  // Update telemetry history for Recharts
  useEffect(() => {
    const newPoint = {
      time: new Date().toLocaleTimeString(),
      attention,
      complexity,
      risk: Math.round(riskScore)
    };
    setHistory(prev => [...prev.slice(-20), newPoint]);
  }, [attention, complexity, riskScore]);

  const radarData = useMemo(() => [
    { subject: 'Attention', A: attention, fullMark: 100 },
    { subject: 'Complexity', A: complexity, fullMark: 100 },
    { subject: 'Risk', A: riskScore, fullMark: 100 },
    { subject: 'Latency', A: 15, fullMark: 100 },
    { subject: 'Load', A: 45, fullMark: 100 },
  ], [attention, complexity, riskScore]);

  const modeColors = {
    NOMINAL: 'text-cyan-400',
    ADVISORY: 'text-white',
    URGENT: 'text-amber-500'
  };

  const bgGlow = {
    NOMINAL: 'shadow-[0_0_40px_rgba(34,211,238,0.1)]',
    ADVISORY: 'shadow-[0_0_50px_rgba(255,255,255,0.05)]',
    URGENT: 'shadow-[0_0_60px_rgba(245,158,11,0.2)]'
  };

  const radius = 85;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (240 / 360) * circumference;
  const progressOffset = arcLength - (riskScore / 100) * arcLength;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader 
        title="Logic Simulator v2.0" 
        subtitle="A high-fidelity physics-based simulation of the Context-Aware Decision engine's response to environmental and human variables."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Simulation Controls */}
        <div className="lg:col-span-4 space-y-6">
          <GlowingCard className="p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Compass className="text-cyan-400" size={20} />
              Telemetry Adjustments
            </h3>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Eye size={14} className="text-cyan-400" />
                    Cognitive State
                  </label>
                  <span className={`font-mono text-sm font-bold ${attention < 40 ? 'text-amber-500' : 'text-cyan-400'}`}>
                    {attention}% Focus
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={attention} 
                  onChange={(e) => setAttention(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-cyan-400" />
                    Env. Difficulty
                  </label>
                  <span className="font-mono text-sm font-bold text-slate-400">
                    {complexity}% Load
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={complexity} 
                  onChange={(e) => setComplexity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="h-px w-full bg-slate-800" />
              
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 font-mono">
                <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest font-bold">Inference Logic</p>
                <code className="text-[10px] text-cyan-400/80 block whitespace-pre leading-relaxed">
                  // Real-time Fuzzy Logic{'\n'}
                  RiskValue = α(100 - Attention) + β(Complexity){'\n'}
                  α=0.7, β=0.3{'\n'}
                  Current Result: <span className={modeColors[hmiMode]}>{hmiMode}</span>
                </code>
              </div>
            </div>
          </GlowingCard>

          <GlowingCard color="amber" className="p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Zap size={18} className="text-amber-500" /> Multi-modal Feedback
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase tracking-widest font-bold">Vibration:</span>
                <span className={`px-3 py-1 rounded-full font-bold ${hmiMode === 'URGENT' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-600'}`}>
                  {hmiMode === 'URGENT' ? '240Hz PULSE' : hmiMode === 'ADVISORY' ? '40Hz ADVISORY' : 'OFF'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase tracking-widest font-bold">Audio:</span>
                <span className={`px-3 py-1 rounded-full font-bold ${hmiMode === 'URGENT' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-600'}`}>
                  {hmiMode === 'URGENT' ? 'CRITICAL ALERT' : 'SILENT'}
                </span>
              </div>
            </div>
          </GlowingCard>
        </div>

        {/* The Dashboard Visualization */}
        <div className="lg:col-span-8">
          <motion.div 
            animate={{ 
              borderColor: hmiMode === 'URGENT' ? 'rgba(245,158,11,0.5)' : hmiMode === 'ADVISORY' ? 'rgba(255,255,255,0.3)' : 'rgba(34,211,238,0.2)',
            }}
            className={`glass rounded-[3rem] p-10 border-2 transition-all duration-700 min-h-[720px] flex flex-col relative overflow-hidden bg-slate-950/40 ${bgGlow[hmiMode]}`}
          >
            <div className="absolute inset-0 grid-lines opacity-[0.03] pointer-events-none" />

            {/* Dashboard Header */}
            <div className="flex justify-between items-start z-10 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-2.5 h-2.5 rounded-full ${hmiMode === 'URGENT' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]' : hmiMode === 'ADVISORY' ? 'bg-white' : 'bg-cyan-400'}`} 
                  />
                  <span className={`text-xs font-black uppercase tracking-[0.4em] transition-colors duration-500 ${modeColors[hmiMode]}`}>
                    HMI SYSTEM STATUS: {hmiMode}
                  </span>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Virtual Cockpit</h2>
              </div>
              <div className="text-right glass p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 block mb-1 tracking-widest uppercase font-bold">Sync Latency</span>
                <span className="text-2xl font-mono text-cyan-400 font-bold">14.8ms</span>
              </div>
            </div>

            {/* Realistic Road Simulation */}
            <RealisticRoad attention={attention} complexity={complexity} hmiMode={hmiMode} />

            {/* Gauge and Indicators */}
            <div className="flex-grow flex flex-col items-center justify-center relative z-10">
              <div className="relative w-72 h-72 flex items-center justify-center">
                <svg viewBox="0 0 250 250" className="absolute inset-0 w-full h-full transform rotate-[150deg]">
                  <circle 
                    cx="125" cy="125" r={radius} 
                    fill="none" stroke="currentColor" strokeWidth={strokeWidth} 
                    strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                    strokeLinecap="round"
                    className="text-slate-900"
                  />
                  <motion.circle 
                    cx="125" cy="125" r={radius} 
                    fill="none" stroke="currentColor" strokeWidth={strokeWidth} 
                    strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: progressOffset }}
                    transition={{ type: 'spring', damping: 25, stiffness: 50 }}
                    className={`transition-colors duration-700 ${
                      hmiMode === 'URGENT' ? 'text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 
                      hmiMode === 'ADVISORY' ? 'text-slate-100' : 'text-cyan-400'
                    }`}
                  />
                </svg>

                <div className="text-center z-10 transform -mt-4">
                  <span className="text-slate-500 text-[10px] uppercase font-black block tracking-[0.5em] mb-3">Risk Assessment</span>
                  <div className="flex items-baseline justify-center">
                    <motion.span 
                      key={Math.round(riskScore)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-7xl font-black text-white tracking-tighter"
                    >
                      {Math.round(riskScore)}
                    </motion.span>
                    <span className="text-slate-400 text-xl font-mono ml-2">%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 mt-12">
                <Indicator icon={<Smartphone size={20} />} label="Haptic" active={hmiMode !== 'NOMINAL'} alert={hmiMode === 'URGENT'} />
                <Indicator icon={<Volume2 size={20} />} label="Audio" active={hmiMode === 'URGENT'} alert={hmiMode === 'URGENT'} />
                <Indicator icon={<ShieldCheck size={20} />} label="Security" active={true} alert={false} />
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-slate-800/50 flex justify-between items-end z-10">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Process ID</p>
                  <p className="text-xs text-cyan-400 font-mono font-bold tracking-tighter">THREAD_0x4A29B</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">IO Buffer</p>
                  <p className="text-xs text-white font-mono font-bold">1024 KB/s</p>
                </div>
              </div>
              <div className="bg-slate-900/60 px-6 py-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">CPU LOAD 01/02/03</p>
                 <div className="flex gap-1.5 items-end">
                   {[40, 70, 30, 90, 50, 80, 45, 65, 35, 75, 55, 85].map((v, i) => (
                     <div key={i} className="w-2 h-4 bg-slate-800 rounded-sm relative overflow-hidden">
                       <motion.div 
                        animate={{ height: [`${v}%`, '100%', `${v}%`] }} 
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.05 }}
                        className="absolute bottom-0 w-full bg-cyan-500/80" 
                       />
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Analytics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlowingCard className="p-8 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <TrendingUp className="text-cyan-400" />
              Real-time Inference History
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Buffer: 20 Samples</span>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} isAnimationActive={false} />
                <Area type="monotone" dataKey="attention" stroke="#475569" fill="transparent" strokeWidth={1} strokeDasharray="4 4" isAnimationActive={false} />
                <Area type="monotone" dataKey="complexity" stroke="#f59e0b" fill="transparent" strokeWidth={1} strokeDasharray="4 4" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlowingCard>

        <GlowingCard className="p-8 h-[400px] flex flex-col">
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <BarChart3 className="text-cyan-400" />
              State Decomposition
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Correlation Analysis</span>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Radar
                  name="SystemState"
                  dataKey="A"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlowingCard>
      </section>
    </div>
  );
};

const Indicator = ({ icon, label, active, alert }: any) => (
  <div className={`px-5 py-3 rounded-2xl border flex items-center gap-4 transition-all duration-500 backdrop-blur-md ${
    active 
      ? (alert ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]') 
      : 'bg-slate-900/40 border-slate-800 text-slate-700'
  }`}>
    <div className={active && alert ? 'animate-pulse' : ''}>
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export default Simulation;