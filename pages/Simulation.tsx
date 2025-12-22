
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Eye, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Volume2, 
  Smartphone, 
  Compass
} from 'lucide-react';
import { SectionHeader, GlowingCard } from '../components/UI';

const Simulation = () => {
  // Simulator State
  const [attention, setAttention] = useState(85); // 0-100
  const [complexity, setComplexity] = useState(20); // 0-100
  
  // Derived Logic (The HMI Decision Engine)
  const riskScore = useMemo(() => {
    const attentionWeight = 0.7;
    const complexityWeight = 0.3;
    const risk = ((100 - attention) * attentionWeight) + (complexity * complexityWeight);
    return Math.min(100, Math.max(0, risk));
  }, [attention, complexity]);

  const hmiMode = useMemo(() => {
    if (riskScore > 70) return 'URGENT';
    if (riskScore > 40) return 'ADVISORY';
    return 'NOMINAL';
  }, [riskScore]);

  // Color mapping
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

  // Gauge Math
  const radius = 100;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // We'll use a 240-degree arc (traditional automotive gauge)
  const totalAngle = 240;
  const arcLength = (totalAngle / 360) * circumference;
  const gapLength = circumference - arcLength;
  const progressOffset = arcLength - (riskScore / 100) * arcLength;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader 
        title="Logic Simulator" 
        subtitle="Experience how the Context-Aware Decision Core balances driver state and environment to determine Take-Over severity."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Simulation Controls */}
        <div className="lg:col-span-4 space-y-6">
          <GlowingCard className="p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Compass className="text-cyan-400" size={20} />
              Input Parameters
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Eye size={14} className="text-cyan-400" />
                    Driver Attention
                  </label>
                  <span className={`font-mono text-xs font-bold transition-colors duration-300 ${attention < 40 ? 'text-amber-500' : 'text-cyan-400'}`}>
                    {attention}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={attention} 
                  onChange={(e) => setAttention(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <p className="text-[10px] text-slate-500 italic font-mono">Real-time Gaze Tracking Polling...</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Activity size={14} className="text-cyan-400" />
                    Env. Complexity
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {complexity}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={complexity} 
                  onChange={(e) => setComplexity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <p className="text-[10px] text-slate-500 italic font-mono">Fusing IMU + GPS telemetry...</p>
              </div>

              <div className="h-px w-full bg-slate-800" />
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 font-mono">
                <p className="text-xs text-slate-500 mb-2 uppercase">Decision Algorithm</p>
                <code className="text-[10px] text-cyan-400 block whitespace-pre leading-relaxed">
                  Risk = (1-Atten)*0.7 + (Env)*0.3{'\n'}
                  If Risk &gt; 70: STAGE_3_TOR{'\n'}
                  Else If Risk &gt; 40: STAGE_2_ADVISORY
                </code>
              </div>
            </div>
          </GlowingCard>
        </div>

        {/* Right Panel: The Dashboard Visualization */}
        <div className="lg:col-span-8">
          <motion.div 
            animate={{ 
              borderColor: hmiMode === 'URGENT' ? 'rgba(245,158,11,0.5)' : hmiMode === 'ADVISORY' ? 'rgba(255,255,255,0.3)' : 'rgba(34,211,238,0.2)',
              backgroundColor: hmiMode === 'URGENT' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.7)'
            }}
            className={`glass rounded-[3rem] p-12 border-2 transition-all duration-700 min-h-[640px] flex flex-col relative overflow-hidden bg-slate-950/40 ${bgGlow[hmiMode]}`}
          >
            {/* Background Logic Grid */}
            <div className="absolute inset-0 grid-lines opacity-[0.05] pointer-events-none" />

            {/* Dashboard Header */}
            <div className="flex justify-between items-start z-10 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-2 h-2 rounded-full ${hmiMode === 'URGENT' ? 'bg-amber-500' : hmiMode === 'ADVISORY' ? 'bg-white' : 'bg-cyan-400'}`} 
                  />
                  <span className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${modeColors[hmiMode]}`}>
                    HMI Logic State: {hmiMode}
                  </span>
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter">VIRTUAL COCKPIT</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block mb-1 tracking-widest uppercase">System Latency</span>
                <span className="text-2xl font-mono text-white">42.8ms</span>
              </div>
            </div>

            {/* Main Center Gauge */}
            <div className="flex-grow flex flex-col items-center justify-center relative z-10 py-10">
              <div className="relative w-72 h-72 flex items-center justify-center">
                
                {/* Gauge SVG */}
                <svg viewBox="0 0 250 250" className="absolute inset-0 w-full h-full transform rotate-[150deg]">
                  {/* Background Track (The whole 240 degrees) */}
                  <circle 
                    cx="125" cy="125" r={radius} 
                    fill="none" stroke="currentColor" strokeWidth={strokeWidth} 
                    strokeDasharray={`${arcLength} ${gapLength}`}
                    strokeLinecap="round"
                    className="text-slate-800/40"
                  />
                  
                  {/* Segments/Ticks Decoration */}
                  <circle 
                    cx="125" cy="125" r={radius - 12} 
                    fill="none" stroke="currentColor" strokeWidth="2" 
                    strokeDasharray="2 10"
                    className="text-slate-700/30"
                  />

                  {/* Active Progress Arc */}
                  <motion.circle 
                    cx="125" cy="125" r={radius} 
                    fill="none" stroke="currentColor" strokeWidth={strokeWidth} 
                    strokeDasharray={`${arcLength} ${gapLength}`}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    animate={{ strokeDashoffset: progressOffset }}
                    transition={{ type: 'spring', damping: 20, stiffness: 45 }}
                    className={`transition-colors duration-700 ${
                      hmiMode === 'URGENT' ? 'text-amber-500' : hmiMode === 'ADVISORY' ? 'text-white' : 'text-cyan-400'
                    }`}
                  />

                  {/* Glowing Cap Indicator */}
                  <motion.circle
                    cx="125" cy="125" r={radius}
                    fill="none" stroke="white" strokeWidth="2"
                    strokeDasharray="1 1000"
                    strokeDashoffset={progressOffset}
                    animate={{ strokeDashoffset: progressOffset }}
                    transition={{ type: 'spring', damping: 20, stiffness: 45 }}
                    className="drop-shadow-[0_0_8px_white]"
                  />
                </svg>

                <div className="text-center z-10 transform -mt-4">
                  <span className="text-slate-500 text-[10px] uppercase font-mono block tracking-[0.4em] mb-2 opacity-70">Aggregate Risk</span>
                  <div className="flex items-baseline justify-center">
                    <motion.span 
                      key={Math.round(riskScore)}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-7xl font-black text-white tracking-tighter"
                    >
                      {Math.round(riskScore)}
                    </motion.span>
                    <span className="text-slate-400 text-lg font-mono ml-2">%</span>
                  </div>
                  <div className="mt-4 flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-1 rounded-full transition-colors duration-500 ${
                          riskScore >= i * 20 
                            ? (hmiMode === 'URGENT' ? 'bg-amber-500' : 'bg-cyan-400') 
                            : 'bg-slate-800'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Multi-modal Indicators */}
              <div className="grid grid-cols-3 gap-8 w-full max-w-xl mt-16">
                <Indicator 
                  icon={<Smartphone />} 
                  label="Haptic" 
                  active={hmiMode !== 'NOMINAL'} 
                  intensity={hmiMode === 'URGENT' ? 'high' : 'low'} 
                />
                <Indicator 
                  icon={<Volume2 />} 
                  label="Audio" 
                  active={hmiMode === 'URGENT'} 
                  intensity="high" 
                />
                <Indicator 
                  icon={<ShieldCheck />} 
                  label="Safety Int." 
                  active={true} 
                  intensity="normal" 
                />
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-auto pt-8 border-t border-slate-800/50 flex justify-between items-center z-10">
              <div className="flex gap-16 font-mono">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Node Sync</p>
                  <p className="text-xs text-cyan-400 font-bold">100% SECURE</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">AI Context</p>
                  <p className="text-xs text-white font-bold tracking-tight">LEVEL 4 ACTIVE</p>
                </div>
              </div>
              <AnimatePresence>
                {hmiMode === 'URGENT' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    className="flex items-center gap-3 px-6 py-2.5 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/30"
                  >
                    <AlertTriangle size={18} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Take Over Required</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Indicator = ({ icon, label, active, intensity }: any) => {
  const vibrateVariants = {
    vibrate: {
      x: [-1, 1, -1, 1, 0],
      rotate: [-1, 1, -1, 1, 0],
      transition: { repeat: Infinity, duration: 0.15 }
    },
    idle: { x: 0, rotate: 0 }
  };

  return (
    <div className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border transition-all duration-700 ${
      active 
        ? 'bg-slate-900/90 border-slate-700 shadow-2xl' 
        : 'bg-transparent border-slate-900/40 opacity-30 grayscale-[0.8]'
    }`}>
      <div className={`p-4 rounded-2xl transition-all duration-700 ${
        active 
          ? (intensity === 'high' ? 'text-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'text-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]') 
          : 'text-slate-600 bg-slate-950/40'
      }`}>
        <motion.div
          animate={active && intensity === 'high' ? "vibrate" : (active ? { scale: 1.1 } : "idle")}
          variants={vibrateVariants}
        >
          {React.cloneElement(icon, { size: 32 })}
        </motion.div>
      </div>
      <div className="text-center">
        <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-colors ${active ? 'text-white' : 'text-slate-700'}`}>
          {label}
        </span>
        {active && intensity === 'high' && (
          <div className="flex gap-1.5 mt-2 justify-center">
            {[0, 0.2, 0.4].map((d, i) => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: d }}
                className="w-1 h-1 bg-amber-500 rounded-full" 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;
