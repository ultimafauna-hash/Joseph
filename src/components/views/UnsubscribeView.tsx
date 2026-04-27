import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BellOff, CheckCircle, Home, Send, XCircle } from 'lucide-react';

interface UnsubscribeViewProps {
  onHome: () => void;
}

export const UnsubscribeView = ({ onHome }: UnsubscribeViewProps) => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulation
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl border border-slate-100 text-center space-y-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-primary to-orange-500" />
        
        {status === 'success' ? (
          <div className="space-y-8 py-4 animate-in zoom-in fade-in duration-500">
             <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={48} strokeWidth={2.5} />
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-black italic tracking-tighter">C'EST FAIT !</h2>
                <p className="text-slate-500 font-medium">Votre adresse <span className="font-bold text-slate-900">{email}</span> a été retirée de notre liste de diffusion. Nous sommes tristes de vous voir partir !</p>
             </div>
             <button 
              onClick={onHome}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20"
             >
               <Home size={18} /> Retour à l'accueil
             </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                  <BellOff size={40} />
               </div>
               <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Désinscription</h1>
               <p className="text-slate-400 font-medium text-sm">Vous ne recevrez plus nos actualités quotidiennes. <br/>Dites-nous ce qui n'allait pas pour nous aider à nous améliorer.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Votre Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Raison du départ (optionnel)</label>
                  <select 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                  >
                     <option value="">Sélectionnez une raison</option>
                     <option value="too-many">Trop d'emails</option>
                     <option value="not-relevant">Contenu non pertinent</option>
                     <option value="already-member">Je suis déjà membre premium</option>
                     <option value="other">Autre raison</option>
                  </select>
               </div>
               
               <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={onHome}
                    className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-3 bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 disabled:opacity-50"
                  >
                    {status === 'loading' ? 'En cours...' : 'Se désabonner'} <Send size={18} />
                  </button>
               </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};
