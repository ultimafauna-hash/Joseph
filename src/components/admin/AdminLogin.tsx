import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, LogIn } from 'lucide-react';

export const AdminLogin = ({ onLogin }: { onLogin: (login?: string, pass?: string) => void }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) return;
    setIsSubmitting(true);
    await onLogin(login, password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center gap-6 mb-8 text-center">
          <img 
            src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
            className="w-20 h-20 rounded-2xl border border-slate-100 p-1 object-contain" 
            alt="Logo" 
          />
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
              <span className="text-slate-950">AKWABA</span> <span className="text-primary">INFO</span>
            </h1>
            <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Espace Administration</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Identifiant</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="Admin / Email" 
                className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-100"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Mot de passe</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-100"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-[2rem] hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
          >
            {isSubmitting ? "Connexion..." : (
              <>
                <LogIn size={20} />
                Se connecter
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-[10px] text-slate-400 mt-8 font-bold uppercase tracking-widest leading-relaxed">
          Accès restreint aux administrateurs. Akwaba Info v2.4.0
        </p>
      </motion.div>
    </div>
  );
};
