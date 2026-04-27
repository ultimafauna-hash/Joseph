import React from 'react';
import { Globe, Languages } from 'lucide-react';

export const ExchangeRatesWidget = ({ rates }: { rates: Record<string, number> }) => (
  <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-white/10 overflow-hidden relative group">
    <div className="absolute top-0 right-0 p-3 opacity-10">
      <Globe size={80} />
    </div>
    <div className="flex items-center gap-2 mb-2">
      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
        <Languages size={18} />
      </div>
      <h3 className="font-black text-xs uppercase tracking-widest">Marché des Changes</h3>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(rates).map(([pair, rate]) => (
        <div key={pair} className="space-y-1">
          <div className="text-[10px] font-bold text-slate-400">{pair}</div>
          <div className="text-lg font-black tracking-tight">
            {typeof rate === 'number' ? rate.toFixed(2) : Number(rate).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
    <div className="pt-2 flex items-center gap-1 text-[8px] font-bold text-emerald-400 animate-pulse">
       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> EN DIRECT
    </div>
  </div>
);
