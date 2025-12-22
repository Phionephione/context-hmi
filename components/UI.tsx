
import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeader: React.FC<{ title: string; subtitle?: string; accent?: string }> = ({ 
  title, subtitle, accent = 'text-cyan-400' 
}) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
    >
      <span className={accent}>|</span> {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-slate-400 max-w-2xl"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export const GlowingCard: React.FC<{ children: React.ReactNode; className?: string; color?: 'cyan' | 'amber' }> = ({ 
  children, className = '', color = 'cyan' 
}) => {
  const shadowClass = color === 'cyan' ? 'hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]';
  const borderClass = color === 'cyan' ? 'border-cyan-500/20' : 'border-amber-500/20';
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass rounded-xl p-6 border transition-all duration-300 ${shadowClass} ${borderClass} ${className}`}
    >
      {children}
    </motion.div>
  );
};
