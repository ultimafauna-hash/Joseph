import React from 'react';
import { motion } from 'motion/react';
import { X, Bell } from 'lucide-react';

interface TopNoticeProps {
  message: string;
  onClose: () => void;
}

export const TopNotice = ({ message, onClose }: TopNoticeProps) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-slate-900 text-white relative z-[100] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="hidden sm:flex p-1.5 bg-primary/20 rounded-lg text-primary shrink-0">
            <Bell size={14} className="animate-bounce" />
          </div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.05em] truncate">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
      <div className="h-0.5 w-full bg-primary/20">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="h-full bg-primary origin-left"
        />
      </div>
    </motion.div>
  );
};
