import React, { useState } from 'react';
import { ArrowLeft, Save, TrendingUp, Plus, Trash, Youtube } from 'lucide-react';
import { format } from 'date-fns';
import { LiveBlog, LiveUpdate } from '../../types';
import { cn } from '../../lib/utils';
import { LiveUpdateEditor } from './LiveUpdateEditor';

export const LiveBlogEditor = ({ blog, onSave, onCancel }: { blog: Partial<LiveBlog>, onSave: (b: LiveBlog) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<LiveBlog>({
    id: blog.id || Date.now().toString(),
    articleid: blog.articleid || '',
    title: blog.title || '',
    updates: blog.updates || [],
    status: blog.status || 'live',
    createdat: blog.createdat || new Date().toISOString()
  });
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);

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
            <TrendingUp size={16} /> Titre de l'événement en direct
          </label>
          <input 
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Ex: Élections Présidentielles 2026..."
            className="w-full bg-slate-50 border-none rounded-3xl px-8 py-6 text-2xl font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2">Statut du Direct</label>
              <div className="flex bg-slate-50 p-1 rounded-2xl">
                 <button 
                  onClick={() => setFormData({...formData, status: 'live'})}
                  className={cn("flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all", formData.status === 'live' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400")}
                 >
                   En Direct
                 </button>
                 <button 
                  onClick={() => setFormData({...formData, status: 'ended'})}
                  className={cn("flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all", formData.status === 'ended' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}
                 >
                   Terminé
                 </button>
              </div>
           </div>
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2">Date d'initialisation</label>
              <input 
                type="date" 
                value={(formData.createdat || '').split('T')[0]} 
                onChange={e => {
                  const sanitized = e.target.value ? e.target.value.replace(/[٠-٩]/g, (d:any) => (d.charCodeAt(0) - 1632).toString()).replace(/[۰-۹]/g, (d:any) => (d.charCodeAt(0) - 1776).toString()) : null;
                  setFormData({...formData, createdat: sanitized ? new Date(sanitized).toISOString() : new Date().toISOString()});
                }}
                className="w-full bg-slate-50 rounded-2xl px-6 py-3 text-xs font-bold outline-none border border-slate-100"
              />
           </div>
        </div>

        <div className="space-y-8 pt-8 border-t border-slate-50">
           <div className="flex items-center justify-between">
              <h4 className="text-xl font-black italic">Fil d'actualité ({formData.updates.length})</h4>
              <button 
                onClick={() => setIsAddingUpdate(true)}
                className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Ajouter une Mise à Jour
              </button>
           </div>

           <div className="space-y-6">
              {isAddingUpdate && (
                <LiveUpdateEditor 
                  update={{}} 
                  onCancel={() => setIsAddingUpdate(false)}
                  onSave={(update) => {
                    setFormData({...formData, updates: [update, ...formData.updates]});
                    setIsAddingUpdate(false);
                  }}
                />
              )}

              {formData.updates.map((update, idx) => (
                <div key={update.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-6 items-start relative group">
                   <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <div className="w-0.5 flex-1 bg-slate-100" />
                   </div>
                   <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                          {format(new Date(update.date), 'HH:mm')} • {update.type.toUpperCase()}
                        </span>
                        <button 
                          onClick={() => {
                            if(confirm("Supprimer cette mise à jour ?")) {
                              setFormData({
                                ...formData,
                                updates: (Array.isArray(formData.updates) ? formData.updates : []).filter(u => u.id !== update.id)
                              });
                            }
                          }}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash size={16}/>
                        </button>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{update.content}</p>
                      <div className="flex gap-4">
                        {update.imageurl && <img src={update.imageurl} className="w-20 h-20 rounded-xl object-cover border border-slate-200" referrerPolicy="no-referrer" />}
                        {update.videourl && (
                          <div className="w-20 h-20 rounded-xl bg-slate-900 flex items-center justify-center text-red-500 border border-slate-200">
                            <Youtube size={24} />
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              ))}

              {formData.updates.length === 0 && !isAddingUpdate && (
                <div className="py-12 bg-slate-50 rounded-3xl text-center space-y-4 border border-dashed border-slate-200">
                   <TrendingUp className="mx-auto text-slate-200" size={32} />
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Le fil est vide. Commencez à publier.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
