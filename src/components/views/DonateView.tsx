import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, TrendingUp, Heart, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';

interface DonateViewProps {
  goHome: () => void;
  donationSuccess: boolean;
  setDonationSuccess: (b: boolean) => void;
  selectedAmount: string;
  setSelectedAmount: (s: string) => void;
  selectedPayment: string | null;
  setSelectedPayment: (s: string) => void;
  siteSettings: any;
  getPaymentIcon: (method: string, active: boolean) => React.ReactNode;
  getPaymentLabel: (method: string) => string;
  transactionId: string;
  setTransactionId: (s: string) => void;
  handleConfirmPayment: (amount: number, method: string, type: string, txId: string) => Promise<void>;
}

export const DonateView = ({
  goHome,
  donationSuccess,
  setDonationSuccess,
  selectedAmount,
  setSelectedAmount,
  selectedPayment,
  setSelectedPayment,
  siteSettings,
  getPaymentIcon,
  getPaymentLabel,
  transactionId,
  setTransactionId,
  handleConfirmPayment
}: DonateViewProps) => {
  return (
    <motion.div 
      key="donate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto py-12 px-4"
    >
      <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2 space-y-12 lg:sticky lg:top-24">
            <button 
              onClick={goHome} 
              className="group inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Retour à l'accueil
            </button>

            <div className="space-y-6">
               <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                  Soutenez la <br/>
                  <span className="text-primary italic">Liberté</span> de <br/>
                  l'information.
               </h2>
               <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                  Akwaba Info est un média 100% indépendant. Chaque don nous permet de financer nos reporters sur le terrain et de maintenir notre plateforme sans publicité intrusive.
               </p>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8 border border-slate-100">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Objectif du mois</h4>
                  <span className="text-primary font-black italic">75% atteint</span>
               </div>
               <div className="space-y-4">
                  <div className="h-6 bg-white rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-slate-100">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '75%' }}
                       transition={{ duration: 1.5, ease: "circOut" }}
                       className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full shadow-lg shadow-primary/20 relative"
                     >
                        <div className="absolute inset-0 bg-white/20 African-pattern opacity-30" />
                     </motion.div>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                     <span>0 FCFA</span>
                     <span className="text-slate-900">1 000 000 FCFA</span>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <TrendingUp size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">PLUS DE 142 DONATEURS ONT DÉJÀ CONTRIBUÉ CE MOIS-CI.</p>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <AnimatePresence mode="wait">
              {donationSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden"
                >
                  <div className="absolute inset-0 African-pattern opacity-5 pointer-events-none" />
                  <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Heart size={48} fill="currentColor" className="animate-pulse" />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 border-4 border-primary rounded-full" 
                    />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-4xl font-black italic tracking-tighter">Générosité Infinie.</h2>
                     <p className="text-slate-500 font-medium max-w-sm mx-auto">
                        Votre contribution de <span className="font-bold text-slate-900">{selectedAmount} FCFA</span> a été enregistrée. Merci de faire partie de l'aventure Akwaba Info.
                     </p>
                  </div>
                  <div className="pt-8 space-y-4">
                     <button 
                       onClick={() => { setDonationSuccess(false); goHome(); }}
                       className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl"
                     >
                       Retour aux actualités
                     </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-12"
                >
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2rem] italic">Étape 1 : Le Montant</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[5000, 10000, 25000, 50000, 100000].map(amount => (
                        <button 
                          key={amount} 
                          onClick={() => setSelectedAmount(amount.toString())}
                          className={cn(
                            "px-6 py-5 rounded-[2rem] text-sm font-black transition-all flex flex-col items-center gap-1",
                            selectedAmount === amount.toString() 
                              ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          <span>{amount.toLocaleString()}</span>
                          <span className="text-[8px] opacity-70">FCFA</span>
                        </button>
                      ))}
                      <div className="relative">
                         <input 
                            type="number" 
                            placeholder="Autre..." 
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setSelectedAmount(e.target.value)}
                            className="w-full h-full bg-slate-50 border border-transparent rounded-[2rem] px-6 text-sm font-black outline-none focus:border-primary transition-all text-center placeholder:text-slate-300"
                         />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2rem] italic">Étape 2 : Mode de Paiement</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(siteSettings.activepaymentmethods || {}).filter(([_, active]) => active).map(([method]) => (
                        <button 
                          key={method}
                          onClick={() => setSelectedPayment(method)}
                          className={cn(
                            "group flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] border-2 transition-all aspect-square",
                            selectedPayment === method
                              ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                              : "border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200"
                          )}
                        >
                          <div className="p-2 transition-transform group-hover:scale-110">
                             {getPaymentIcon(method, selectedPayment === method)}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-center">{getPaymentLabel(method)}</span>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {selectedPayment && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-4"
                        >
                          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 African-pattern opacity-10 pointer-events-none" />
                             <div className="text-center space-y-6 relative z-10">
                                {(() => {
                                  const details = (() => {
                                    switch(selectedPayment) {
                                      case 'paypal': return siteSettings.paymentlinks?.paypal;
                                      case 'stripe': return siteSettings.paymentlinks?.stripe;
                                      case 'flutterwave': return siteSettings.paymentlinks?.flutterwave;
                                      case 'orangeMoney': return siteSettings.orangemoneynumber;
                                      case 'wave': return siteSettings.wavenumber;
                                      case 'mtn': return siteSettings.mtnmoneynumber;
                                      case 'moov': return siteSettings.moovmoneynumber;
                                      default: return "INSTRUCTIONS";
                                    }
                                  })();
                                  
                                  const isUrl = details?.toString().startsWith('http');
                                  
                                  if (isUrl) {
                                    return (
                                      <div className="space-y-6">
                                        <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Paiement Sécurisé via Portail</p>
                                        <a href={details} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                                          Ouvrir {getPaymentLabel(selectedPayment)} <ExternalLink size={14} />
                                        </a>
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <div className="space-y-10">
                                      <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase text-primary tracking-[0.3em]">Numéro du Receveur</p>
                                        <p className="text-4xl font-black tracking-tighter italic">{details || "00 00 00 00"}</p>
                                      </div>
                                      <div className="space-y-4 text-left">
                                         <label className="text-[9px] font-black uppercase text-white/40 tracking-widest px-1">ID de Transaction / Référence SMS</label>
                                         <input 
                                           type="text"
                                           placeholder="Collez ici le code de confirmation..."
                                           value={transactionId}
                                           onChange={(e) => setTransactionId(e.target.value)}
                                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-white placeholder:text-white/20"
                                         />
                                      </div>
                                    </div>
                                  );
                                })()}
                             </div>
                          </div>
                          
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (!transactionId && !siteSettings.paymentlinks?.[selectedPayment as keyof typeof siteSettings.paymentlinks]?.toString().startsWith('http')) {
                                alert("Veuillez entrer la référence de transaction.");
                                return;
                              }
                              const amountVal = parseInt(selectedAmount) || 0;
                              handleConfirmPayment(amountVal, selectedPayment!, 'donation', transactionId).then(() => {
                                 confetti({
                                   particleCount: 150,
                                   spread: 70,
                                   origin: { y: 0.6 },
                                   colors: ['#1FA463', '#000000', '#FFCC00']
                                 });
                                 setDonationSuccess(true);
                              });
                            }}
                            className="w-full mt-6 bg-primary text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/30"
                          >
                            Confirmer mon don de {parseInt(selectedAmount).toLocaleString()} FCFA
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>
    </motion.div>
  );
};
