import React, { useState } from 'react';
import { X, Check, Camera, Youtube } from 'lucide-react';
import { LiveUpdate } from '../../types';
import { cn } from '../../lib/utils';
import { MediaUpload } from './MediaUpload';

export const LiveUpdateEditor = ({ update, onSave, onCancel }: { update: Partial<LiveUpdate>, onSave: (u: LiveUpdate) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<LiveUpdate>({
    id: update.id || Date.now().toString(),
    content: update.content || '',
    date: update.date || new Date().toISOString(),
    type: update.type || 'info', 
    imageurl: update.imageurl || '',
    videourl: update.videourl || '',
    author: update.author || 'Rédaction'
  });

  return (
    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-6 relative overflow-hidden African-pattern-light">
      <div className="flex items-center justify-between relative z-10">
         <h5 className="text-[10px] font-black uppercase tracking-widest text-primary italic">Nouvelle Mise à Jour</h5>
         <div className="flex gap-2">
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={18}/></button>
            <button onClick={() => onSave(formData)} className="p-2 bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all"><Check size={18}/></button>
         </div>
      </div>

      <div className="space-y-4 relative z-10">
        <textarea 
          placeholder="Détail de l'information en direct..."
          className="w-full bg-white rounded-2xl p-4 text-sm font-medium border-none outline-none focus:ring-4 focus:ring-primary/10 min-h-[120px]"
          value={formData.content}
          onChange={e => setFormData({...formData, content: e.target.value})}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 px-2">Lien Image (Optionnel)</label>
              <MediaUpload 
                value={formData.imageurl || ''}
                onChange={(val) => setFormData({...formData, imageurl: val, type: val ? 'media' : formData.type})}
                placeholder="https://... (image)"
                icon={Camera}
                inputClassName="bg-white border border-slate-100 py-2.5"
              />
           </div>
           <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 px-2">Lien Vidéo YouTube (Optionnel)</label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={12} />
                <input 
                  type="text"
                  placeholder="https://youtube.com/..."
                  className="w-full bg-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold outline-none border border-slate-100"
                  value={formData.videourl}
                  onChange={e => setFormData({...formData, videourl: e.target.value, type: e.target.value ? 'media' : formData.type})}
                />
              </div>
           </div>
        </div>

        <div className="flex bg-white/50 p-1 rounded-xl w-fit">
           {(['info', 'urgent'] as const).map(t => (
             <button 
              key={t}
              onClick={() => setFormData({...formData, type: t})}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all",
                formData.type === t ? "bg-slate-900 text-white" : "text-slate-400"
              )}
             >
               {t === 'info' ? 'Info' : 'Urgent'}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};
