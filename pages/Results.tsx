
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, TrendingUp, Compass } from 'lucide-react';
import { RESULTS_CHECKLIST } from '../constants';
import { SectionHeader, GlowingCard } from '../components/UI';

const Results = () => {
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
          <p className="text-slate-400 mb-6">
            The integration of the STM32 feedback controller with the Jetson Nano’s AI perception resulted in a significant reduction in transition latency compared to standard single-modality systems.
          </p>
          <div className="h-32 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
            <p className="text-slate-600 font-mono text-sm">[ Chart Visualization: Reaction Time Improvement ]</p>
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
        <p className="text-slate-400 leading-relaxed italic">
          "A safer autonomous transition is not just about the vehicle's capability to drive, but its capability to communicate and understand the human element within the cabin."
        </p>
      </div>
    </div>
  );
};

export default Results;
