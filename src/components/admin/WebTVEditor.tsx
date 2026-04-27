import React, { useState } from 'react';
import { ArrowLeft, Save, Video, Youtube } from 'lucide-react';
import { WebTV } from '../../types';
import { MediaUpload } from './MediaUpload';

export const WebTVEditor = ({ video, onSave, onCancel, categories }: { video: Partial<WebTV>, onSave: (v: WebTV) => void, onCancel: () => void, categories: string[] }) => {
  const [formData, setFormData] = useState<WebTV>({
    id: video.id || Date.now().toString(),
    title: video.title || '',
    description: video.description || '',
    videourl: video.videourl || '',
    thumbnail: video.thumbnail || '',
    category: video.category || categories[0] || 'Web TV',
    date: video.date || new Date().toISOString(),
    views: video.views || 0,
    ispremium: video.ispremium || false
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black transition-all text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={18} /> RETOUR
        </button>
        <button 
          onClick={() => onSave(formData)}
          className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest border-2 border-white"
        >
          <Save size={18} /> ENREGISTRER
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 space-y-12 African-pattern">
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-primary italic px-2 flex items-center gap-2">
            <Video size={16} /> Titre de la vidéo
          </label>
          <input 
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Ex: Interview exclusive du Ministre..."
            className="w-full bg-slate-50 border-none rounded-3xl px-8 py-6 text-2xl font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2">Catégorie</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-50 rounded-2xl px-6 py-3 text-xs font-bold outline-none border border-slate-100"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Web TV">Web TV</option>
              </select>
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2">Date de publication</label>
              <input 
                type="date" 
                value={(formData.date || '').split('T')[0]} 
                onChange={e => {
                  const sanitized = e.target.value ? e.target.value.replace(/[٠-٩]/g, (d:any) => (d.charCodeAt(0) - 1632).toString()).replace(/[۰-۹]/g, (d:any) => (d.charCodeAt(0) - 1776).toString()) : null;
                  setFormData({...formData, date: sanitized ? new Date(sanitized).toISOString() : new Date().toISOString()});
                }}
                className="w-full bg-slate-50 rounded-2xl px-6 py-3 text-xs font-bold outline-none border border-slate-100"
              />
           </div>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2 flex items-center gap-2">
                <Youtube size={14} className="text-red-500" /> Lien Vidéo YouTube (ou autre)
              </label>
              <input 
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-bold outline-none border border-slate-100"
                value={formData.videourl}
                onChange={e => setFormData({...formData, videourl: e.target.value})}
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2">Lien Miniature (Vignette)</label>
              <MediaUpload 
                value={formData.thumbnail || ''}
                onChange={(val) => setFormData({...formData, thumbnail: val})}
                placeholder="https://... (image)"
              />
           </div>
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase text-slate-400 px-2 italic">Description de la vidéo</label>
           <textarea 
            placeholder="Détails sur le contenu de cette émission..."
            className="w-full bg-slate-50 border-none rounded-[32px] px-8 py-6 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[150px]"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};
