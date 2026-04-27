import React from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  onViewPolicy: () => void;
}

export const CookieBanner = ({ onAccept, onDecline, onViewPolicy }: CookieBannerProps) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-[400px] z-[120]"
    >
      <div className={cn(
        "p-6 rounded-3xl shadow-2xl border flex flex-col gap-4 bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Eye size={20} />
          </div>
          <h3 className="font-display font-bold text-lg">Respect de votre vie privée</h3>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et vous proposer des contenus adaptés.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Accepter tout
          </button>
          <button
            onClick={onDecline}
            className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            Refuser
          </button>
        </div>
        <button 
          onClick={onViewPolicy}
          className="text-[10px] text-slate-400 hover:text-primary transition-colors text-center uppercase font-bold tracking-widest"
        >
          En savoir plus sur notre politique
        </button>
      </div>
    </motion.div>
  );
};
