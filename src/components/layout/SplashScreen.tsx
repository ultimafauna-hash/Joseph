import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className={cn(
        "fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 bg-[#F5F1EB]"
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        <img 
          src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
          alt="Akwaba Info Logo" 
          className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-[40px] shadow-2xl border border-white/20"
          referrerPolicy="no-referrer"
        />
        
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase"
          >
            <span className="text-[#000000]">AKWABA</span> <span className="text-[#1FA463]">INFO</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs md:text-sm"
          >
            L’info du monde en un clic
          </motion.p>
        </div>

        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden mt-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-widest"
        >
          Chargement de l'actualité...
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
