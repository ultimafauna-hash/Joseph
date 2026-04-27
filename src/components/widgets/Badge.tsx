import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const Badge = ({ children, category, icon, className }: { children: React.ReactNode; category?: string; icon?: string; className?: string }) => {
  const colors: Record<string, string> = {
    'À LA UNE': 'bg-primary text-white shadow-primary/20',
    'INFO PAR PAYS': 'bg-blue-600 text-white shadow-blue-500/20',
    'AFRIQUE': 'bg-orange-600 text-white shadow-orange-500/20',
    'COMMUNIQUÉS': 'bg-slate-700 text-white shadow-slate-500/20',
    'SONDAGE': 'bg-purple-600 text-white shadow-purple-500/20',
    'NOS THEMES': 'bg-amber-600 text-white shadow-amber-500/20',
    'Afrique': 'bg-orange-500 text-white shadow-orange-500/20',
    'Monde': 'bg-blue-500 text-white shadow-blue-500/20',
    'Tech': 'bg-slate-500 text-white shadow-slate-500/20',
    'Économie': 'bg-emerald-600 text-white shadow-emerald-600/20',
    'Politique': 'bg-red-600 text-white shadow-red-600/20',
    'Culture': 'bg-amber-500 text-white shadow-amber-500/20',
    'Urgent': 'bg-red-700 text-white animate-pulse shadow-red-700/20',
    'Science': 'bg-purple-600 text-white shadow-purple-600/20',
    'Santé': 'bg-teal-500 text-white shadow-teal-500/20',
    'Sport': 'bg-indigo-600 text-white shadow-indigo-600/20',
    'Société': 'bg-sky-600 text-white shadow-sky-600/20',
  };

  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit relative overflow-hidden shadow-sm backdrop-blur-[2px] border border-white/10",
      category ? colors[category] || 'bg-slate-200 text-slate-700 shadow-slate-200/20' : 'bg-slate-200 text-slate-700 shadow-slate-200/20',
      className
    )}>
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </motion.span>
  );
};
