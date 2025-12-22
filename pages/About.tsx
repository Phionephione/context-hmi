
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { PAIN_POINTS } from '../constants';
import { SectionHeader, GlowingCard } from '../components/UI';

const About = () => {
  const saeLevels = [
    { level: 0, title: 'No Automation', active: false },
    { level: 1, title: 'Driver Assistance', active: false },
    { level: 2, title: 'Partial Automation', active: true },
    { level: 3, title: 'Conditional Automation', active: true },
    { level: 4, title: 'High Automation', active: true },
    { level: 5, title: 'Full Automation', active: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader title="The Challenge" subtitle="Drawbacks of existing Human-Machine Interfaces." accent="text-amber-500" />
          <div className="space-y-4">
            {PAIN_POINTS.map((point, i) => (
              <div key={i} className="flex items-start p-4 glass border-l-4 border-amber-500 rounded-r-lg">
                <AlertCircle className="text-amber-500 mr-4 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">{point.title}</h4>
                  <p className="text-sm text-slate-400">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader title="The Solution" subtitle="Engineering an intelligent, adaptive ecosystem." accent="text-cyan-400" />
          <p className="text-slate-300 leading-relaxed mb-8">
            Our project proposes a context-aware HMI that bridges the perceptual gap between the vehicle's AI and the driver. By monitoring cognitive load and external risk simultaneously, the system dynamically scales alert modalities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlowingCard>
              <CheckCircle2 className="text-cyan-400 mb-2" />
              <h4 className="font-bold mb-1">Adaptive Control</h4>
              <p className="text-xs text-slate-400">System adjusts based on driver readiness levels.</p>
            </GlowingCard>
            <GlowingCard>
              <CheckCircle2 className="text-cyan-400 mb-2" />
              <h4 className="font-bold mb-1">Multi-Modal Focus</h4>
              <p className="text-xs text-slate-400">Integrated visual, audio, and haptic feedback loops.</p>
            </GlowingCard>
          </div>
        </motion.div>
      </div>

      {/* SAE Levels Visualization */}
      <section className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
        <SectionHeader 
          title="SAE Autonomy Mapping" 
          subtitle="How this project targets the critical transition gap in Levels 2, 3, and 4."
        />
        
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {saeLevels.map((l) => (
            <div 
              key={l.level}
              className={`flex-1 min-w-[140px] p-6 rounded-xl border transition-all text-center ${
                l.active 
                  ? 'bg-slate-800 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                  : 'bg-slate-950 border-slate-800 opacity-40 grayscale'
              }`}
            >
              <span className={`text-4xl font-black mb-2 block ${l.active ? 'text-cyan-400' : 'text-slate-700'}`}>
                L{l.level}
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-white leading-tight">
                {l.title}
              </p>
              {l.active && (
                <div className="mt-4 flex items-center justify-center text-[10px] text-cyan-400 bg-cyan-400/10 py-1 rounded">
                  <Info size={10} className="mr-1" /> CORE TARGET
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
