
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Fixed: Added Activity icon to imports
import { ArrowRight, FileText, Activity } from 'lucide-react';
import { HIGHLIGHTS } from '../constants';
import { GlowingCard, SectionHeader } from '../components/UI';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        
        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-cyan-400 uppercase glass rounded-full border border-cyan-500/30">
              Future of Autonomous HMIs
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight">
              Bridging the Gap Between <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
                Human & Machine
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A Context-Aware Human-Machine Interface designed for safer, smoother transitions of control in SAE Level 2-4 driving environments.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/architecture"
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all flex items-center shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                Explore Architecture <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/results"
                className="px-8 py-4 glass hover:bg-slate-800 text-white font-bold rounded-lg transition-all flex items-center border border-slate-700"
              >
                View Documentation <FileText className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader 
            title="System Core Modules" 
            subtitle="The integrated hardware stack enabling real-time driver state estimation and adaptive feedback."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HIGHLIGHTS.map((h, i) => (
              <GlowingCard key={i} color={h.color as 'cyan' | 'amber'}>
                <div className={`mb-4 ${h.color === 'cyan' ? 'text-cyan-400' : h.color === 'amber' ? 'text-amber-500' : 'text-white'}`}>
                  {h.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{h.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{h.description}</p>
              </GlowingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Placeholder Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Real-Time Interaction Loop</h2>
            <p className="text-slate-400 mb-6">
              Our system utilizes high-frequency polling of internal driver states (Gaze, Drowsiness) paired with external context (Speed, Road Complexity) to determine the optimal Take-Over Request (TOR) modality.
            </p>
            <ul className="space-y-4">
              {['Vision Processing @ 30FPS', 'Sensor Fusion Latency < 10ms', 'Adaptive Warning Intensity'].map((item, idx) => (
                <li key={idx} className="flex items-center text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video glass rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center bg-slate-900 group">
              <img 
                src="https://picsum.photos/seed/hmi/800/600" 
                alt="System Dashboard Visualization"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 glass rounded-full">
                  <Activity className="w-12 h-12 text-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass p-4 border border-cyan-500/20 rounded-lg max-w-[200px] hidden sm:block">
              <p className="text-[10px] text-cyan-400 font-mono mb-1 uppercase tracking-widest">Live Telemetry</p>
              <div className="h-1 w-full bg-slate-800 rounded-full mb-2 overflow-hidden">
                <div className="h-full w-2/3 bg-cyan-400 animate-[shimmer_2s_infinite]" />
              </div>
              <p className="text-xs text-white">Driver Status: Alert</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
