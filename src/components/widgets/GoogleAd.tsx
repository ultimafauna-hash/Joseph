import React from 'react';
import { cn } from '../../lib/utils';

export const GoogleAd = ({ className, label = "Annonce Google" }: { className?: string, label?: string }) => (
  <div className={cn("bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[100px]", className)}>
    <div className="absolute top-0 right-0 bg-slate-200 px-2 py-0.5 text-[8px] font-bold text-slate-500 uppercase">Ad</div>
    <span className="text-[9px] text-slate-400 uppercase font-bold mb-1">{label}</span>
    <div className="w-12 h-px bg-slate-200 mb-2" />
    <div className="text-slate-300 font-bold text-sm">Espace Publicitaire</div>
  </div>
);
