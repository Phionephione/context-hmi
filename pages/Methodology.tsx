
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Settings, Shield } from 'lucide-react';
import { LITERATURE_REVIEW } from '../constants';
import { SectionHeader, GlowingCard } from '../components/UI';

const Methodology = () => {
  const steps = [
    { icon: <Search />, title: 'Sensor Integration', desc: 'Connecting Jetson Nano (CSI Camera) and Raspberry Pi (GPS/IMU).' },
    { icon: <Settings />, title: 'Data Processing', desc: 'Deploying facial landmark AI and Fuzzy Logic control scripts.' },
    { icon: <BookOpen />, title: 'Decision Logic', desc: 'Evaluating contextual risk to define TOR severity (Low, Medium, High).' },
    { icon: <Shield />, title: 'Real-time Execution', desc: 'Triggering sub-100ms haptic and visual feedback via STM32.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader title="Research & Methodology" subtitle="Academic grounding and implementation roadmap." />

      {/* Literature Review */}
      <h3 className="text-2xl font-bold mb-8 flex items-center">
        <BookOpen className="text-cyan-400 mr-2" /> Literature Foundation
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {LITERATURE_REVIEW.map((paper, i) => (
          <GlowingCard key={i}>
            <p className="text-cyan-400 font-mono text-xs mb-2">{paper.authors} ({paper.year})</p>
            <h4 className="font-bold text-lg mb-3 leading-tight text-white">{paper.title}</h4>
            <div className="h-px w-full bg-slate-800 my-3" />
            <p className="text-slate-400 text-sm italic">"{paper.focus}"</p>
          </GlowingCard>
        ))}
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800" />
        <h3 className="text-2xl font-bold mb-12 ml-16">Development Roadmap</h3>
        
        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative ml-16"
            >
              <div className="absolute -left-[49px] w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400 z-10">
                {step.icon}
              </div>
              <div className="glass p-6 rounded-xl border border-slate-800 max-w-2xl">
                <h4 className="text-xl font-bold mb-2 text-white">{step.title}</h4>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Methodology;
