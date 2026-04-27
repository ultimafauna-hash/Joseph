import React, { useState, useEffect } from 'react';
import { X, Mail, Gift, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsletterSignup } from './NewsletterSignup';
import { cn } from '../lib/utils';

interface NewsletterModalProps {
  delay?: number; // Delay in ms before showing
  onPrivacyClick?: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ 
  delay = 10000,
  onPrivacyClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasBeenShown = localStorage.getItem('akwaba_newsletter_shown');
    if (hasBeenShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('akwaba_newsletter_shown', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white max-w-2xl w-full rounded-2xl md:rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row mx-2 md:mx-0 max-h-[95vh] md:max-h-none overflow-y-auto md:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Visual/Promo */}
            <div className="w-full md:w-5/12 bg-primary p-5 md:p-10 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
              <div className="absolute inset-0 African-pattern opacity-10" />
              <div className="relative z-10 space-y-3 md:space-y-6">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Mail className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black italic tracking-tighter leading-tight">
                    Restez <br className="hidden md:block" /> Connecté.
                  </h2>
                  <p className="text-white/70 text-[9px] md:text-xs font-bold mt-1 md:mt-2 uppercase tracking-widest">
                    L'info du monde en un clic
                  </p>
                </div>

                <div className="hidden sm:block space-y-2 md:space-y-3 pt-2 md:pt-6">
                  {[
                    "Éditions spéciales matinales",
                    "Alertes infos urgentes",
                    "Analyses exclusives"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80">
                      <ArrowRight size={10} className="text-secondary" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-4 md:mt-10 p-3 md:p-4 bg-white/10 rounded-xl md:rounded-2xl border border-white/10 flex items-center gap-3">
                 <Gift className="text-secondary shrink-0 w-5 h-5 md:w-6 md:h-6" />
                 <p className="text-[9px] md:text-[10px] font-bold">Inscrivez-vous et recevez notre guide.</p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full md:w-7/12 p-5 md:p-14 space-y-5 md:space-y-8 relative">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors z-20"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              <div className="space-y-1 md:space-y-2 pt-2 md:pt-0">
                <h3 className="text-xl md:text-2xl font-black African-text">Inscrivez-vous</h3>
                <p className="text-slate-500 text-xs md:text-sm font-medium">Rejoignez plus de 10,000 lecteurs qui nous font confiance chaque jour.</p>
              </div>

              <NewsletterSignup 
                variant="minimal" 
                className="bg-transparent border-0 p-0 shadow-none" 
                onPrivacyClick={onPrivacyClick}
              />

              <div className="pt-4 border-t border-slate-100 italic">
                <p className="text-[8px] md:text-[9px] text-slate-400 font-medium">
                  Votre vie privée compte. Nous ne partagerons jamais vos informations. 
                  Consultez notre <button onClick={onPrivacyClick} className="font-bold text-primary hover:underline">politique de confidentialité</button>.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
