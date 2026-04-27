import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Plus, MonitorOff, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/api';
import { UserProfile } from '../../types';

export const PremiumUserList = ({ onUpgrade, onUpdateStatus }: { onUpgrade: (uid: string) => Promise<void>, onUpdateStatus: (uid: string, date: string | null) => Promise<void> }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [subSearch, setSubSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const u = await api.getAllUsers();
        setUsers((Array.isArray(u) ? u : []).filter(user => user.role !== 'admin'));
      } catch (err) {
        console.error("Erreur chargement utilisateurs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = (Array.isArray(users) ? users : []).filter(u => 
    (u.displayname || '').toLowerCase().includes(subSearch.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(subSearch.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <>
      <div className="p-6 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..."
            className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-6 py-3 text-xs font-bold outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary/20"
            value={subSearch}
            onChange={e => setSubSearch(e.target.value)}
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="p-10 text-center text-slate-400 font-medium italic">Aucun utilisateur trouvé.</div>
      ) : (
        filtered.map(user => (
          <div key={user.uid} className="grid grid-cols-12 px-6 py-5 items-center hover:bg-slate-50/50 transition-colors group">
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-[18px] overflow-hidden bg-slate-100 border-2 border-white shadow-md">
                <img src={user.photourl || `https://ui-avatars.com/api/?name=${user.displayname}`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 truncate text-[13px] tracking-tight">{user.displayname}</p>
                <p className="text-[10px] text-slate-500 truncate font-medium">{user.email}</p>
              </div>
            </div>
            <div className="col-span-3">
              {user.ispremium ? (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                    <CheckCircle size={10} /> Abonné Actif
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Expire le {user.premiumuntil ? format(new Date(user.premiumuntil), 'dd/MM/yyyy') : 'N/A'}
                  </span>
                </div>
              ) : (
                <span className="text-slate-300 text-[10px] font-bold uppercase italic">Membre Gratuit</span>
              )}
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">{user.paymentmethod || 'MANUEL'}</span>
            </div>
            <div className="col-span-3 flex justify-end gap-2">
              {user.ispremium ? (
                <div className="flex gap-2">
                   <button 
                    onClick={() => {
                      const days = prompt("Nombre de jours à ajouter ?", "30");
                      if (days) {
                        const current = user.premiumuntil ? new Date(user.premiumuntil) : new Date();
                        const next = new Date(current.getTime() + parseInt(days) * 24 * 60 * 60 * 1000).toISOString();
                        onUpdateStatus(user.uid, next);
                      }
                    }}
                    className="p-2 bg-slate-100 text-slate-400 hover:text-primary rounded-xl transition-all"
                    title="Prolonger"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm(`Bloquer l'accès premium de ${user.displayname} ?`)) {
                        onUpdateStatus(user.uid, null);
                      }
                    }}
                    className="p-2 bg-slate-100 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                    title="Bloquer Premium"
                  >
                    <MonitorOff size={18} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onUpgrade(user.uid)}
                  className="bg-primary text-white text-[10px] font-black px-5 py-2.5 rounded-[12px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <TrendingUp size={14} /> ACTIVER PREMIUM
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
};
