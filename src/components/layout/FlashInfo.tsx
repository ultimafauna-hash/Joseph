import React from 'react';
import { motion } from 'motion/react';

export const FlashInfo = ({ articles }: { articles: string[] }) => {
  return (
    <div className="bg-slate-900 text-white overflow-hidden h-10 flex items-center relative z-[60]">
      <div className="bg-red-600 px-4 h-full flex items-center font-black text-[10px] uppercase tracking-widest shrink-0 relative z-10 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
        Dernières Nouvelles
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {articles.map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-tight">{text}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {articles.map((text, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-tight">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
