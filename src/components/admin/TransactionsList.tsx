import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CreditCard, TrendingUp } from 'lucide-react';
import api from '../../lib/api';
import { cn } from '../../lib/utils';

export const TransactionsList = ({ onValidate }: { onValidate?: (tid: string, uid: string) => Promise<void> }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleValidate = async (tid: string, uid: string) => {
    if (!onValidate) return;
    if (confirm("Valider ce paiement et activer l'accès premium ?")) {
      try {
        await onValidate(tid, uid);
        fetchTransactions();
      } catch (err) {
        alert("Erreur lors de la validation.");
      }
    }
  };

  if (loading) return <div className="p-10 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6 mt-16 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black">Journal des Transactions</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{transactions.length} transactions</span>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-12 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="col-span-3">Utilisateur / Email</div>
            <div className="col-span-2">Montant</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Méthode</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-2 text-right">Statut / Actions</div>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <div className="p-10 text-center text-slate-400 font-medium italic">Aucune transaction enregistrée.</div>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 transition-colors text-xs">
                  <div className="col-span-3 truncate font-bold text-slate-900" title={t.email}>{t.email}</div>
                  <div className="col-span-2 font-black text-slate-700">{t.amount.toLocaleString()} XOF</div>
                  <div className="col-span-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                      t.type === 'subscription' ? "bg-primary/10 text-primary" : "bg-red-50 text-red-600"
                    )}>{t.type === 'subscription' ? 'Abonnement' : 'Don'}</span>
                  </div>
                  <div className="col-span-2 font-medium uppercase text-slate-400 tracking-tighter">{t.method}</div>
                  <div className="col-span-1 text-[10px] text-slate-400">{format(new Date(t.date), 'dd/MM HH:mm')}</div>
                  <div className="col-span-2 text-right flex items-center justify-end gap-3">
                    {t.status === 'pending' && t.type === 'subscription' && (
                      <button 
                        onClick={() => handleValidate(t.id, t.userid)}
                        className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        VALIDER
                      </button>
                    )}
                    <span className={cn(
                      "inline-block w-2.5 h-2.5 rounded-full",
                      t.status === 'success' ? "bg-emerald-500" : (t.status === 'failed' ? "bg-red-500" : "bg-amber-500")
                    )} title={t.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
