import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, X } from 'lucide-react';

export const TopNotice = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <motion.div 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    exit={{ y: -100 }}
    className="bg-primary text-slate-950 py-2.5 px-4 relative z-[200] flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
  >
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <TrendingUp size={12} />
      </motion.div>
      <span>{message}</span>
    </div>
    <motion.button 
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClose} 
      className="absolute right-4 text-slate-900/40 hover:text-slate-900 transition-colors"
    >
      <X size={14} />
    </motion.button>
  </motion.div>
);
