import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const WeatherWidget = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex flex-col items-end gap-0.5 text-[10px] font-black uppercase tracking-widest text-slate-600 border-r border-slate-100 pr-4 mr-4">
      <div className="flex items-center gap-1.5 text-slate-900">
        <Clock size={12} className="text-primary" />
        {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div>{date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
    </div>
  );
};
