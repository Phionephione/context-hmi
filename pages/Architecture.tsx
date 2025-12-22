
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Eye as EyeIcon, 
  Radio, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Activity, 
  Camera,
  Layers,
  Network,
  Monitor,
  Navigation,
  Battery,
  BellRing
} from 'lucide-react';
import { ARCHITECTURE_MODULES } from '../constants';
import { SectionHeader, GlowingCard } from '../components/UI';

// Data flow annotation type
interface DataFlow {
  from: string;
  to: string;
  label: string;
  isActive: boolean;
  path: string; // SVG path data
}

const TechnicalNode = ({ module, isActive, onClick, icon: Icon, className = "" }: any) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(module.id)}
      className={`absolute cursor-pointer flex flex-col p-4 glass rounded-xl border transition-all duration-500 w-48 h-32 z-20 ${
        isActive 
          ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-slate-900/90' 
          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
          <Icon size={18} />
        </div>
        <div className="text-right">
          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{module.role}</p>
        </div>
      </div>
      
      <h3 className={`text-sm font-bold mb-1 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
        {module.name}
      </h3>
      <p className="text-[9px] text-slate-500 font-mono leading-tight">{module.hardware}</p>

      {isActive && (
        <motion.div 
          layoutId="active-node-border"
          className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 pointer-events-none"
        />
      )}
    </motion.div>
  );
};

const AuxiliaryNode = ({ icon: Icon, label, className = "" }: any) => (
  <div className={`absolute flex flex-col items-center gap-2 z-10 ${className}`}>
    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-full text-slate-400">
      <Icon size={16} />
    </div>
    <span className="text-[9px] font-mono uppercase text-slate-500 tracking-tighter whitespace-nowrap">{label}</span>
  </div>
);

const AnimatedPath = ({ d, isActive, color = "cyan" }: { d: string; isActive: boolean; color?: "cyan" | "amber" }) => (
  <g>
    <path
      d={d}
      fill="none"
      stroke={isActive ? (color === "cyan" ? "rgba(34, 211, 238, 0.4)" : "rgba(245, 158, 11, 0.4)") : "rgba(30, 41, 59, 0.4)"}
      strokeWidth="2"
      strokeDasharray="4 4"
      className="transition-colors duration-500"
    />
    {isActive && (
      <motion.path
        d={d}
        fill="none"
        stroke={color === "cyan" ? "#22d3ee" : "#f59e0b"}
        strokeWidth="2"
        strokeDasharray="10 200"
        animate={{ strokeDashoffset: [210, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      />
    )}
  </g>
);

const Architecture = () => {
  const [selectedId, setSelectedId] = useState('module2');
  const activeModule = ARCHITECTURE_MODULES.find(m => m.id === selectedId) || ARCHITECTURE_MODULES[1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader 
        title="Context-Aware HMI Architecture" 
        subtitle="A modular, distributed computing framework designed for safety-critical automotive control transitions, featuring asynchronous hardware nodes."
      />

      {/* Interactive Topology Section */}
      <section className="mb-20">
        <div className="relative glass rounded-[3rem] border border-slate-800 bg-slate-950/40 overflow-hidden min-h-[600px] flex items-center justify-center">
          {/* Background Grid */}
          <div className="absolute inset-0 grid-lines opacity-[0.05] pointer-events-none" />
          
          {/* Main SVG Connection Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
            {/* Core Data Path: Jetson -> RPi */}
            <AnimatedPath 
              d="M 320 300 L 480 300" 
              isActive={selectedId === 'module1' || selectedId === 'module2'} 
            />
            {/* Core Data Path: RPi -> Nucleo */}
            <AnimatedPath 
              d="M 672 300 L 832 300" 
              isActive={selectedId === 'module2' || selectedId === 'module3'} 
            />
            
            {/* Auxiliary Paths */}
            <AnimatedPath d="M 224 180 L 224 236" isActive={selectedId === 'module1'} /> {/* Power to Jetson */}
            <AnimatedPath d="M 576 180 L 576 236" isActive={selectedId === 'module2'} /> {/* Power to RPi */}
            <AnimatedPath d="M 400 300 Q 400 380 500 450" isActive={selectedId === 'module2'} /> {/* Jetson to Screen */}
            <AnimatedPath d="M 576 300 L 576 430" isActive={selectedId === 'module2'} /> {/* RPi to Screen */}
            <AnimatedPath d="M 780 200 Q 700 200 650 250" isActive={selectedId === 'module2'} /> {/* GPS to RPi */}
            <AnimatedPath d="M 780 400 Q 700 400 650 350" isActive={selectedId === 'module2'} /> {/* IMU to RPi */}
            <AnimatedPath d="M 576 236 L 576 150" isActive={selectedId === 'module3'} color="amber" /> {/* RPi to Buzzer */}
          </svg>

          {/* Topology Nodes - Fixed positions for Diagram logic */}
          <div className="relative w-full h-full max-w-5xl h-[500px]">
            
            {/* Core Modules */}
            <TechnicalNode 
              module={ARCHITECTURE_MODULES[0]} 
              icon={EyeIcon} 
              isActive={selectedId === 'module1'} 
              onClick={setSelectedId}
              className="left-[10%] top-[40%]" 
            />
            
            <TechnicalNode 
              module={ARCHITECTURE_MODULES[1]} 
              icon={Database} 
              isActive={selectedId === 'module2'} 
              onClick={setSelectedId}
              className="left-[40%] top-[40%]"
            />

            <TechnicalNode 
              module={ARCHITECTURE_MODULES[2]} 
              icon={Radio} 
              isActive={selectedId === 'module3'} 
              onClick={setSelectedId}
              className="left-[70%] top-[40%]"
            />

            {/* Auxiliary Assets */}
            <AuxiliaryNode icon={Battery} label="Power Supply" className="left-[15%] top-[15%]" />
            <AuxiliaryNode icon={Navigation} label="GPS Module" className="left-[75%] top-[20%]" />
            <AuxiliaryNode icon={Layers} label="IMU System" className="left-[75%] top-[70%]" />
            <AuxiliaryNode icon={BellRing} label="Buzzer/Audio" className="left-[47.5%] top-[10%]" />
            <AuxiliaryNode icon={Monitor} label="Cockpit Screen" className="left-[47.5%] top-[80%]" />
            <AuxiliaryNode icon={Camera} label="CSI Camera" className="left-[5%] top-[45%]" />
          </div>

          {/* Legend */}
          <div className="absolute bottom-8 right-8 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-cyan-400" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Data Stream</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-amber-500" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Actuation Signal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-[2.5rem] p-10 border border-slate-800 h-full"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Module Logic Inspection</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2">{activeModule.name}</h2>
                  <p className="text-slate-500 font-mono text-sm tracking-tight">{activeModule.role}</p>
                </div>
                
                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <Cpu className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Compute Core</p>
                    <span className="font-bold text-white tracking-tight">{activeModule.hardware}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                    Firmware Tasks
                    <div className="h-px flex-grow bg-slate-800" />
                  </h4>
                  <ul className="space-y-5">
                    {activeModule.responsibilities.map((resp, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4 group"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:shadow-[0_0_8px_cyan] transition-all" />
                        <span className="text-slate-300 text-sm leading-relaxed font-medium">{resp}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                      Telemetry Profile
                      <div className="h-px flex-grow bg-slate-800" />
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">Protocol</p>
                        <p className="text-white text-xs font-black uppercase tracking-widest">
                          {selectedId === 'module1' ? 'CSI / MIPI' : selectedId === 'module2' ? 'I2C / SPI' : 'PWM / GPIO'}
                        </p>
                      </div>
                      <div className="p-5 bg-slate-900/40 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase tracking-widest">Cycle Time</p>
                        <p className="text-white text-xs font-black uppercase tracking-widest">
                          {selectedId === 'module1' ? '33ms' : selectedId === 'module2' ? '100ms' : '5ms'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-4">Real-time Node Health</p>
                    <div className="flex items-center gap-5">
                      <div className="h-2 flex-grow bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '98%' }}
                          transition={{ duration: 1.5 }}
                          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        />
                      </div>
                      <span className="text-[10px] font-mono font-black text-cyan-400">98% NOMINAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Side Panel Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <GlowingCard className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <ShieldCheck className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Fault Tolerance</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              The distributed ARM architecture allows for graceful degradation. If vision nodes fail, hardware-level sensors maintain transition capability.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em]">
                <span className="text-slate-500">Sync Stability</span>
                <span className="text-cyan-400 font-bold">1.2ms Jitter</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: [-200, 400] }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }} 
                  className="w-40 h-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" 
                />
              </div>
            </div>
          </GlowingCard>

          <GlowingCard color="amber" className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Zap className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Actuation Latency</h3>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-5xl font-black text-white tracking-tighter">12</span>
              <span className="text-amber-500 font-mono text-sm font-black">MS</span>
            </div>
            <div className="h-24 bg-slate-950/80 rounded-2xl border border-slate-800 p-6 flex items-end gap-1.5 overflow-hidden">
              {[0.4, 0.6, 0.3, 0.8, 0.5, 0.9, 0.4, 0.7, 0.6, 0.5, 0.8, 0.4, 0.6].map((v, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${v * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex-1 bg-amber-500/30 rounded-t-sm"
                />
              ))}
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-4 text-center">Nucleo Actuator Response Buffer</p>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};

export default Architecture;
