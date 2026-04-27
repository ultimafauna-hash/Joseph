import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, TrendingUp, CheckCircle, ArrowRight, Shield, Globe, Smartphone, ExternalLink, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SiteSettings } from '../../types';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: (method: string, tid: string) => void;
  price: number;
  activeMethods: Record<string, boolean>;
  settings: SiteSettings;
  getPaymentIcon: (m: string, s: boolean) => React.ReactNode;
  getPaymentLabel: (m: string) => string;
}

export const PremiumModal = ({ onClose, onUpgrade, price, activeMethods, settings, getPaymentIcon, getPaymentLabel }: PremiumModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    if (activeMethods && !selectedMethod) {
      const firstActive = Object.entries(activeMethods).find(([_, active]) => active)?.[0];
      if (firstActive) setSelectedMethod(firstActive);
    }
  }, [activeMethods, selectedMethod]);

  const getPaymentDetails = (method: string) => {
    switch(method) {
      case 'paypal': return settings.paymentlinks?.paypal || (settings.paypalid ? `ID: ${settings.paypalid}` : null);
      case 'stripe': return settings.paymentlinks?.stripe || (settings.stripepublickey ? "Paiement par Carte" : null);
      case 'flutterwave': return settings.paymentlinks?.flutterwave || "Paiement via Flutterwave";
      case 'orangeMoney': return settings.orangemoneynumber ? `Transfert au ${settings.orangemoneynumber}` : null;
      case 'wave': return settings.wavenumber ? `Transfert au ${settings.wavenumber}` : null;
      case 'mtn': return settings.mtnmoneynumber ? `Transfert au ${settings.mtnmoneynumber}` : null;
      case 'moov': return settings.moovmoneynumber ? `Transfert au ${settings.moovmoneynumber}` : null;
      default: return (settings.paymentlinks as any)?.[method] || null;
    }
  };

  const paymentValue = getPaymentDetails(selectedMethod);
  const isUrl = typeof paymentValue === 'string' && paymentValue.startsWith('http');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 z-50">
          <X size={24} />
        </button>

        <div className="md:w-2/5 relative overflow-hidden bg-slate-900 p-8 md:p-10 flex flex-col justify-end text-white shrink-0 min-h-[200px] md:min-h-full">
           <div className="absolute inset-0 African-pattern opacity-10" />
           <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 mb-4 md:mb-6">
                 <TrendingUp size={28} className="md:hidden" />
                 <TrendingUp size={32} className="hidden md:block" />
              </div>
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter leading-none uppercase">Akwaba<br/>Premium</h2>
              <p className="text-slate-400 text-[10px] md:text-sm font-medium">L'information exclusive à portée de main.</p>
              
              <div className="pt-4 md:pt-6 space-y-2 md:space-y-3 hidden sm:block">
                 {[
                   "Articles & Investigations exclusifs",
                   "Web TV & Live Streaming illimité",
                   "Événements & Agenda VIP",
                   "Accès prioritaire aux petites annonces",
                   "Expérience sans publicité"
                 ].map((benefit, i) => (
                   <div key={i} className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-300">
                     <CheckCircle size={10} className="text-primary md:hidden" />
                     <CheckCircle size={12} className="text-primary hidden md:block" />
                     {benefit}
                   </div>
                 ))}
              </div>

              <div className="pt-4 md:pt-8 border-t border-white/10 mt-4 md:mt-8">
                 <span className="text-xl md:text-3xl font-black">{price} XOF</span>
                 <span className="text-[10px] md:text-xs text-slate-500 font-bold ml-2">/ MOIS</span>
              </div>
           </div>
        </div>

        <div className="md:w-3/5 p-6 md:p-12 space-y-8 bg-white overflow-y-auto custom-scrollbar">
              {!paymentInitiated ? (
                <>
                  <div className="space-y-6">
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Choisir votre moyen de paiement</h3>
                     <div className="grid grid-cols-2 gap-3">
                        {Object.entries(activeMethods).filter(([_, active]) => active).map(([name]) => (
                          <button 
                            key={name}
                            onClick={() => setSelectedMethod(name)}
                            className={cn(
                              "group relative flex flex-col p-4 border-2 rounded-2xl transition-all h-24 items-start justify-between overflow-hidden",
                              selectedMethod === name ? "border-primary bg-primary/5" : "border-slate-100 hover:bg-slate-50"
                            )}
                          >
                            {selectedMethod === name && (
                              <div className="absolute top-2 right-2 text-primary animate-in zoom-in">
                                 <CheckCircle size={16} fill="white" />
                              </div>
                            )}
                            {getPaymentIcon(name, selectedMethod === name)}
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest leading-none text-slate-500",
                              selectedMethod === name && "text-slate-900"
                            )}>{getPaymentLabel(name)}</span>
                          </button>
                        ))}
                     </div>
                  </div>

                  {selectedMethod && (
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2 animate-in fade-in slide-in-from-top-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paiement via {selectedMethod}</p>
                       <p className="text-xs font-bold text-slate-900 line-clamp-2">
                          {isUrl ? "Un lien de paiement externe sera utilisé pour cette transaction." : paymentValue || "Paiement via transfert manuel sécurisé."}
                       </p>
                    </div>
                  )}

                  <div className="space-y-4">
                     <button 
                      onClick={() => {
                        setPaymentInitiated(true);
                      }}
                      className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 group"
                    >
                      VOIR LES INSTRUCTIONS
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold italic">
                       <Shield size={12} /> Transaction 100% sécurisée
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-8 py-4 animate-in fade-in zoom-in">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-2xl w-fit text-primary">
                       {isUrl ? <Globe size={32} /> : <Smartphone size={32} />}
                    </div>
                    <h3 className="text-2xl font-black">{isUrl ? "Paiement en ligne" : "Finaliser votre Transfert"}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {isUrl 
                        ? `Cliquez sur le bouton ci-dessous pour payer ${price} XOF via le portail sécurisé ${selectedMethod}.`
                        : `Veuillez effectuer le transfert de ${price} XOF vers le numéro suivant :`
                      }
                    </p>
                  </div>

                  <div className="p-8 bg-slate-900 rounded-[30px] text-white space-y-4 text-center relative overflow-hidden">
                     <div className="absolute inset-0 African-pattern opacity-10" />
                     {isUrl ? (
                        <a 
                          href={paymentValue || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-primary text-white font-black px-8 py-4 rounded-2xl relative z-10 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                        >
                          Lancer le paiement {selectedMethod} <ExternalLink size={20} />
                        </a>
                     ) : (
                        <>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Numéro de réception</p>
                          <p className="text-3xl font-black tracking-widest relative z-10">{paymentValue?.toString().split(' ').pop() || "NON CONFIGURÉ"}</p>
                        </>
                     )}

                     <div className="pt-4 border-t border-white/10 relative z-10">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">ID de Transaction / Référence</p>
                        <input 
                          type="text"
                          placeholder="Ex: T240122.1234.C..."
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-600"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
                       <Info size={18} className="text-amber-500 shrink-0" />
                       <p className="text-[10px] text-amber-800 font-bold leading-tight">
                         {isUrl 
                          ? "Une fois le paiement effectué sur le site partenaire, revenez ici et cliquez sur 'J'AI PAYÉ' pour que nous puissions valider votre abonnement."
                          : "Une fois le transfert effectué, veuillez cliquer sur 'J'AI PAYÉ'. Un administrateur vérifiera la transaction et activera votre compte."
                         }
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <button 
                        onClick={() => setPaymentInitiated(false)}
                        className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                       >
                         Retour
                       </button>
                       <button 
                        onClick={() => {
                          if (!transactionId || transactionId.length < 5) {
                            alert("Veuillez entrer l'ID de transaction pour vérification.");
                            return;
                          }
                          onUpgrade(selectedMethod, transactionId);
                        }}
                        className="py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all text-center flex items-center justify-center font-display"
                       >
                         ✅ CONFIRMER PAIEMENT
                       </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-50">
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                   En vous abonnant, vous acceptez nos conditions d'utilisation. Pour les paiements manuels, l'activation nécessite une vérification humaine.
                 </p>
              </div>
           </div>
       </motion.div>
     </motion.div>
  );
};
