import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import { Poll } from '../../types';
import { cn } from '../../lib/utils';

export const PollEditor = ({ poll, onSave, onCancel }: { poll: Partial<Poll>, onSave: (p: Poll) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Poll>({
    id: poll.id || Date.now().toString(),
    question: poll.question || '',
    options: poll.options || [
      { id: '1', text: '', votes: 0 },
      { id: '2', text: '', votes: 0 }
    ],
    startdate: poll.startdate || new Date().toISOString().split('T')[0],
    enddate: poll.enddate || null,
    active: poll.active !== undefined ? poll.active : true
  });

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: (formData.options.length + 1).toString(), text: '', votes: 0 }]
    });
  };

  const handleRemoveOption = (id: string) => {
    if (formData.options.length <= 2) return;
    setFormData({
      ...formData,
      options: (Array.isArray(formData.options) ? formData.options : []).filter(o => o.id !== id)
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
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

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 space-y-10">
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-primary italic px-2">Question du Sondage</label>
          <input 
            type="text"
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            placeholder="Ex: Pensez-vous que..."
            className="w-full bg-slate-50 border-none rounded-3xl px-8 py-6 text-2xl font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Options de réponse</label>
            <button 
              onClick={handleAddOption}
              className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Ajouter une option
            </button>
          </div>
          <div className="grid gap-4">
            {formData.options.map((option, idx) => (
              <div key={option.id} className="flex gap-4">
                <div className="flex-1 relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                    {idx + 1}
                  </div>
                  <input 
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[idx].text = e.target.value;
                      setFormData({...formData, options: newOptions});
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-16 pr-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>
                <button 
                   type="button"
                  onClick={() => handleRemoveOption(option.id)}
                  className="p-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                   <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
           <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2 italic">Date de début</label>
            <input 
              type="date"
              value={(formData.startdate || '').split('T')[0]}
              onChange={(e) => setFormData({...formData, startdate: e.target.value || null})}
              className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2 italic">Statut</label>
            <div className="flex bg-slate-50 p-1 rounded-2xl">
              <button 
                onClick={() => setFormData({...formData, active: true})}
                className={cn(
                  "flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all",
                  formData.active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400"
                )}
              >
                Actif
              </button>
              <button 
                onClick={() => setFormData({...formData, active: false})}
                className={cn(
                  "flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all",
                  !formData.active ? "bg-amber-500 text-white shadow-lg" : "text-slate-400"
                )}
              >
                Terminé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
