
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Eye as EyeIcon, 
  Radio, 
  Database, 
  ShieldCheck, 
  Zap, 
  Camera,
  Layers,
  Monitor,
  Navigation,
  Battery,
  BellRing,
  Activity,
  Info
} from 'lucide-react';
import { ARCHITECTURE_MODULES } from '../constants';
import { SectionHeader, GlowingCard } from '../components/UI';

// Define the virtual grid (1000x1000)
const GRID = {
  W: 1000,
  H: 600,
  NODES: {
    monitoring: { x: 200, y: 350 },
    decision:   { x: 500, y: 350 },
    feedback:   { x: 800, y: 350 },
    power:      { x: 200, y: 150 },
    buzzer:     { x: 500, y: 150 },
    gps:        { x: 800, y: 150 },
    imu:        { x: 800, y: 500 },
    screen:     { x: 500, y: 500 },
    camera:     { x: 100, y: 350 }
  }
};

const TechnicalNode = ({ module, isActive, isHighlighted, onClick, icon: Icon, pos }: any) => {
  return (
    <motion.div
      onClick={() => onClick(module.id)}
      style={{ 
        left: `${(pos.x / GRID.W) * 100}%`, 
        top: `${(pos.y / GRID.H) * 100}%`,
        transform: 'translate(-50%, -50%)'
      }}
      className={`absolute cursor-pointer flex flex-col p-4 glass rounded-2xl border transition-all duration-500 w-56 z-20 ${
        isActive 
          ? 'border-cyan-500 bg-slate-900/95 shadow-[0_0_40px_rgba(34,211,238,0.25)]' 
          : isHighlighted 
            ? 'border-cyan-400 bg-slate-900/80 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
            : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl transition-colors ${isActive || isHighlighted ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
          <Icon size={22} />
        </div>
        <div className="text-right">
          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">{module.role}</p>
          <div className={`h-1.5 w-6 ml-auto rounded-full ${isActive || isHighlighted ? 'bg-cyan-400' : 'bg-slate-800'}`} />
        </div>
      </div>
      
      <h3 className={`text-base font-bold mb-1 transition-colors ${isActive || isHighlighted ? 'text-white' : 'text-slate-400'}`}>
        {module.name}
      </h3>
      <p className="text-[10px] text-slate-500 font-mono tracking-tight">{module.hardware}</p>

      {(isActive || isHighlighted) && (
        <motion.div 
          layoutId={`node-active-ring-${module.id}`}
          className={`absolute inset-0 rounded-2xl border-2 pointer-events-none ${isHighlighted ? 'border-cyan-400/20' : 'border-cyan-400/30'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

const Peripheral = ({ icon: Icon, label, pos, isHighlighted }: any) => (
  <div 
    style={{ 
      left: `${(pos.x / GRID.W) * 100}%`, 
      top: `${(pos.y / GRID.H) * 100}%`,
      transform: 'translate(-50%, -50%)'
    }}
    className="absolute flex flex-col items-center gap-2 z-10"
  >
    <div className={`p-3 glass border rounded-xl transition-all cursor-crosshair ${
      isHighlighted 
        ? 'text-cyan-400 border-cyan-400/40 bg-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
        : 'border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-900 bg-slate-900/60'
    }`}>
      <Icon size={20} />
    </div>
    <span className={`text-[9px] font-mono uppercase tracking-tighter whitespace-nowrap transition-colors ${isHighlighted ? 'text-cyan-400' : 'text-slate-600'}`}>{label}</span>
  </div>
);

const TraceLine = ({ d, isActive, color = "cyan", onHover, onLeave }: any) => (
  <g className="group cursor-help" onMouseEnter={onHover} onMouseLeave={onLeave}>
    {/* Hit area - invisible wider path for easier hovering */}
    <path d={d} fill="none" stroke="transparent" strokeWidth="20" pointerEvents="all" />
    
    <path
      d={d}
      fill="none"
      stroke={isActive ? (color === "cyan" ? "rgba(34, 211, 238, 0.4)" : "rgba(245, 158, 11, 0.4)") : "rgba(30, 41, 59, 0.15)"}
      strokeWidth="2"
      className="transition-colors duration-700"
    />
    {isActive && (
      <motion.path
        d={d}
        fill="none"
        stroke={color === "cyan" ? "#22d3ee" : "#f59e0b"}
        strokeWidth="2.5"
        strokeDasharray="12 120"
        strokeLinecap="round"
        animate={{ strokeDashoffset: [132, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
      />
    )}
  </g>
);

const Architecture = () => {
  const [selectedId, setSelectedId] = useState('module2');
  const [hoveredTrace, setHoveredTrace] = useState<{ nodes: string[], dataType: string } | null>(null);
  
  const activeModule = ARCHITECTURE_MODULES.find(m => m.id === selectedId) || ARCHITECTURE_MODULES[1];
  const n = GRID.NODES;

  const isNodeHighlighted = (id: string) => hoveredTrace?.nodes.includes(id) || false;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader 
        title="Hardware Topology" 
        subtitle="Exploring the distributed architecture across NVIDIA, Broadcom, and STMicro ecosystems."
      />

      {/* Main Diagram Canvas */}
      <section className="mb-20">
        <div className="relative glass rounded-[3rem] border border-slate-800 bg-slate-950/40 overflow-hidden min-h-[600px] flex items-center justify-center p-8">
          <div className="absolute inset-0 grid-lines opacity-[0.02] pointer-events-none" />
          
          <svg 
            viewBox={`0 0 ${GRID.W} ${GRID.H}`} 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          >
            {/* Core Logic Traces */}
            <TraceLine 
              d={`M ${n.monitoring.x + 112} ${n.monitoring.y} L ${n.decision.x - 112} ${n.decision.y}`} 
              isActive={selectedId === 'module1' || selectedId === 'module2'} 
              onHover={() => setHoveredTrace({ nodes: ['module1', 'module2'], dataType: 'AI Perception Stream (Facial Landmarks)' })}
              onLeave={() => setHoveredTrace(null)}
            />
            <TraceLine 
              d={`M ${n.decision.x + 112} ${n.decision.y} L ${n.feedback.x - 112} ${n.feedback.y}`} 
              isActive={selectedId === 'module2' || selectedId === 'module3'} 
              color="amber"
              onHover={() => setHoveredTrace({ nodes: ['module2', 'module3'], dataType: 'Actuation Commands (TOR Priority)' })}
              onLeave={() => setHoveredTrace(null)}
            />

            {/* Power Bus */}
            <TraceLine 
              d={`M ${n.power.x} ${n.power.y + 25} L ${n.power.x} ${n.monitoring.y - 72}`} 
              isActive={selectedId === 'module1'}
              onHover={() => setHoveredTrace({ nodes: ['power', 'module1'], dataType: '5V DC Power Delivery' })}
              onLeave={() => setHoveredTrace(null)}
            />
            <TraceLine 
              d={`M ${n.power.x} ${n.power.y} L ${n.decision.x} ${n.power.y} L ${n.decision.x} ${n.decision.y - 72}`} 
              isActive={selectedId === 'module2'} 
              onHover={() => setHoveredTrace({ nodes: ['power', 'module2'], dataType: '5V DC Power Delivery' })}
              onLeave={() => setHoveredTrace(null)}
            />

            {/* Sensor Traces */}
            <TraceLine 
              d={`M ${n.camera.x + 25} ${n.camera.y} L ${n.monitoring.x - 112} ${n.monitoring.y}`} 
              isActive={selectedId === 'module1'} 
              onHover={() => setHoveredTrace({ nodes: ['camera', 'module1'], dataType: 'Raw MIPI/CSI Video Data' })}
              onLeave={() => setHoveredTrace(null)}
            />
            <TraceLine 
              d={`M ${n.gps.x} ${n.gps.y + 25} L ${n.gps.x} ${n.feedback.y - 72}`} 
              isActive={selectedId === 'module3'} color="amber" 
              onHover={() => setHoveredTrace({ nodes: ['gps', 'module3'], dataType: 'NMEA Geo-Location Stream' })}
              onLeave={() => setHoveredTrace(null)}
            />
            <TraceLine 
              d={`M ${n.imu.x} ${n.imu.y - 25} L ${n.imu.x} ${n.feedback.y + 72}`} 
              isActive={selectedId === 'module3'} color="amber" 
              onHover={() => setHoveredTrace({ nodes: ['imu', 'module3'], dataType: '6-Axis IMU Telemetry (I2C)' })}
              onLeave={() => setHoveredTrace(null)}
            />
            
            {/* Display Feed */}
            <TraceLine 
              d={`M ${n.decision.x} ${n.decision.y + 72} L ${n.decision.x} ${n.screen.y - 25}`} 
              isActive={selectedId === 'module2'} 
              onHover={() => setHoveredTrace({ nodes: ['decision', 'screen'], dataType: 'HDMI/SPI Display Buffer' })}
              onLeave={() => setHoveredTrace(null)}
            />
            <TraceLine 
              d={`M ${n.buzzer.x} ${n.buzzer.y + 25} L ${n.buzzer.x} ${n.decision.y - 72}`} 
              isActive={selectedId === 'module2'} 
              onHover={() => setHoveredTrace({ nodes: ['buzzer', 'decision'], dataType: 'Audio PWM Modulation' })}
              onLeave={() => setHoveredTrace(null)}
            />
          </svg>

          {/* Tooltip Overlay */}
          <AnimatePresence>
            {hoveredTrace && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 z-50 glass px-6 py-3 rounded-full border border-cyan-500/30 flex items-center gap-3 shadow-2xl pointer-events-none"
              >
                <Info size={16} className="text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white tracking-wide uppercase">
                  Data: <span className="text-cyan-400">{hoveredTrace.dataType}</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative w-full h-[600px]">
            {/* Core Modules */}
            <TechnicalNode module={ARCHITECTURE_MODULES[0]} icon={EyeIcon} isActive={selectedId === 'module1'} isHighlighted={isNodeHighlighted('module1')} onClick={setSelectedId} pos={n.monitoring} />
            <TechnicalNode module={ARCHITECTURE_MODULES[1]} icon={Database} isActive={selectedId === 'module2'} isHighlighted={isNodeHighlighted('module2')} onClick={setSelectedId} pos={n.decision} />
            <TechnicalNode module={ARCHITECTURE_MODULES[2]} icon={Radio} isActive={selectedId === 'module3'} isHighlighted={isNodeHighlighted('module3')} onClick={setSelectedId} pos={n.feedback} />

            {/* Peripherals */}
            <Peripheral icon={Battery} label="DC Power Hub" pos={n.power} isHighlighted={isNodeHighlighted('power')} />
            <Peripheral icon={BellRing} label="Alert Buzzer" pos={n.buzzer} isHighlighted={isNodeHighlighted('buzzer')} />
            <Peripheral icon={Navigation} label="GPS Receiver" pos={n.gps} isHighlighted={isNodeHighlighted('gps')} />
            <Peripheral icon={Camera} label="IMX219 Camera" pos={n.camera} isHighlighted={isNodeHighlighted('camera')} />
            <Peripheral icon={Layers} label="6-Axis IMU" pos={n.imu} isHighlighted={isNodeHighlighted('imu')} />
            <Peripheral icon={Monitor} label="OLED HUD" pos={n.screen} isHighlighted={isNodeHighlighted('screen')} />
          </div>
        </div>
      </section>

      {/* Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-[2.5rem] p-10 border border-slate-800 h-full"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-8 bg-cyan-400 rounded-full" />
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Subsystem Profile</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-3">{activeModule.name}</h2>
                  <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">{activeModule.role}</p>
                </div>
                
                <div className="flex items-center gap-5 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
                  <div className="p-3.5 bg-cyan-500/10 rounded-xl">
                    <Cpu className="text-cyan-400" size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Processor SOC</p>
                    <span className="font-bold text-white tracking-tight">{activeModule.hardware}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-4">
                    Core Services
                    <div className="h-px flex-grow bg-slate-800" />
                  </h4>
                  <ul className="space-y-4">
                    {activeModule.responsibilities.map((resp, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />
                        <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{resp}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-8">
                  <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800/50">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">I/O Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Latency:</span>
                        <span className="text-cyan-400 font-mono font-bold">{selectedId === 'module1' ? '< 33ms' : selectedId === 'module2' ? '< 100ms' : '< 5ms'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Node Priority:</span>
                        <span className="text-white font-mono">{selectedId === 'module3' ? 'CRITICAL' : 'HIGH'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/20">
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-4">Link Utilization</p>
                    <div className="flex items-center gap-5">
                      <div className="h-2 flex-grow bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: selectedId === 'module1' ? '85%' : '45%' }}
                          className="h-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <GlowingCard className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <ShieldCheck className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Security & Safety</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Hardware-level interrupts on the STM32 ensure that feedback triggers bypass high-level OS scheduling for deterministic performance.
            </p>
            <div className="p-5 bg-slate-950/60 rounded-xl border border-slate-800 border-l-cyan-500 border-l-4">
              <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">Standard Compliance</p>
              <p className="text-white text-xs font-bold tracking-tight italic">ISO-26262 ASIL-B Compatible</p>
            </div>
          </GlowingCard>

          <GlowingCard color="amber" className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Activity className="text-amber-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Bus Telemetry</h3>
            </div>
            <div className="h-32 bg-slate-950/80 rounded-2xl border border-slate-800 p-6 flex items-end gap-1.5 overflow-hidden">
              {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.9, 0.5, 0.7, 0.3, 0.6].map((v, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${v * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="flex-1 bg-amber-500/30 rounded-t-sm"
                />
              ))}
            </div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-6 text-center">Inter-process communication jitter</p>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
};

export default Architecture;
