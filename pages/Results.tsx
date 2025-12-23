import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, TrendingUp, Compass, FileText } from 'lucide-react';
import { RESULTS_CHECKLIST } from '../constants';
import { SectionHeader, GlowingCard } from '../components/UI';

const Results = () => {
  const chartData = [
    { label: 'Standard HMI', value: 1200, color: '#475569' },
    { label: 'Context-Aware', value: 850, color: '#22d3ee' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader title="Outcomes & Conclusion" subtitle="Validation of the context-aware HMI architecture." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-8 rounded-3xl border border-cyan-500/20"
        >
          <div className="flex items-center mb-6">
            <Trophy className="text-cyan-400 mr-4 w-8 h-8" />
            <h3 className="text-2xl font-bold">Key Deliverables</h3>
          </div>
          <div className="space-y-4">
            {RESULTS_CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-300">
                <CheckCircle className="text-cyan-400 w-5 h-5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-3xl border border-amber-500/20"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="text-amber-500 mr-4 w-8 h-8" />
            <h3 className="text-2xl font-bold">Performance Impact</h3>
          </div>
          <p className="text-slate-400 mb-6 text-sm">
            Take-Over Reaction (TOR) time comparison (ms). Lower latency indicates safer transitions.
          </p>
          <div className="h-48 bg-slate-900/50 rounded-xl p-8 flex items-end justify-around border border-slate-800 relative">
             {chartData.map((d, i) => (
               <div key={i} className="flex flex-col items-center gap-3 w-24">
                 <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(d.value / 1500) * 100}%` }}
                    viewport={{ once: true }}
                    className="w-full rounded-t-lg shadow-lg relative"
                    style={{ backgroundColor: d.color }}
                 >
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white font-bold">{d.value}ms</span>
                 </motion.div>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{d.label}</span>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      <section>
        <SectionHeader title="Future Scope" subtitle="The road towards Level 5 and beyond." accent="text-amber-500" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlowingCard color="amber">
            <Compass className="text-amber-500 mb-4" />
            <h4 className="text-xl font-bold mb-2">LiDAR & V2X</h4>
            <p className="text-slate-400">Integration with surrounding infrastructure (Vehicle-to-Everything) to predict hazards before they are visible.</p>
          </GlowingCard>
          <GlowingCard color="amber">
            <TrendingUp className="text-amber-500 mb-4" />
            <h4 className="text-xl font-bold mb-2">Extended User Trials</h4>
            <p className="text-slate-400">Moving from simulator tests to controlled real-world environment testing with a larger demographic pool.</p>
          </GlowingCard>
        </div>
      </section>

      <div className="mt-32 text-center glass p-12 rounded-3xl border border-slate-800 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Project Conclusion</h2>
        <p className="text-slate-400 leading-relaxed italic mb-8">
          "A safer autonomous transition is not just about the vehicle's capability to drive, but its capability to communicate and understand the human element within the cabin."
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="original_prompt.txt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono border border-cyan-400/30 px-6 py-3 rounded-xl transition-all hover:bg-cyan-400/5"
          >
            <FileText size={16} /> View Original Project Brief
          </a>
        </div>
      </div>
    </div>
  );
};

export default Results;