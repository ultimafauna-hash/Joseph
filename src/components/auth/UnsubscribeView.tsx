import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MonitorOff, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

export const UnsubscribeView = ({ onHome }: { onHome: () => void }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      handleUnsubscribe(emailParam);
    }
  }, []);

  const handleUnsubscribe = async (targetEmail: string) => {
    if (!targetEmail) return;
    setStatus('loading');
    try {
      await api.unsubscribe(targetEmail);
      setStatus('success');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-20 px-6 text-center space-y-8"
    >
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100 shadow-xl shadow-red-500/10">
        <MonitorOff size={40} />
      </div>
      
      {status === 'success' ? (
        <div className="space-y-6">
          <h2 className="text-4xl font-black tracking-tighter">Désabonnement réussi</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            L'adresse <span className="text-slate-900 font-black">{email}</span> a été retirée de notre liste de diffusion. Nous sommes désolés de vous voir partir.
          </p>
          <button 
            onClick={onHome}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
        </div>
      ) : status === 'error' ? (
        <div className="space-y-6">
          <h2 className="text-4xl font-black tracking-tighter text-red-500">Oups !</h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Une erreur est survenue lors de la tentative de désabonnement. Veuillez réessayer plus tard ou nous contacter directement.
          </p>
          <button 
            onClick={onHome}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-slate-900/20"
          >
            Retour à l'accueil
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-4xl font-black tracking-tighter">Traitement en cours...</h2>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}
    </motion.div>
  );
};
