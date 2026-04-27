import React, { useState } from 'react';
import { ArrowLeft, Save, User, Twitter, Linkedin, Mail, X, Plus } from 'lucide-react';
import { Author } from '../../types';
import { MediaUpload } from './MediaUpload';

export const AuthorEditor = ({ author, onSave, onCancel }: { author: Partial<Author>, onSave: (a: Author) => void, onCancel: () => void }) => {
  const [formData, setFormData] = useState<Author>({
    id: author.id || Date.now().toString(),
    name: author.name || '',
    role: author.role || '',
    bio: author.bio || '',
    image: author.image || '',
    socials: author.socials || {},
    specialties: author.specialties || []
  });

  const [newSpecialty, setNewSpecialty] = useState('');

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
        <div className="flex flex-col md:flex-row gap-10">
           <div className="w-full md:w-1/3 space-y-6">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2 italic">Photo de Profil</label>
              <div className="relative group">
                <div className="w-full aspect-square rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={48} className="text-slate-200" />
                  )}
                </div>
                <div className="mt-4">
                  <MediaUpload 
                    value={formData.image || ''}
                    onChange={(val) => setFormData({...formData, image: val})}
                    placeholder="https://... (image)"
                  />
                </div>
              </div>
           </div>

           <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-primary italic px-2 flex items-center gap-2">
                  <User size={16} /> Nom Complet
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Koffi Kouakou..."
                  className="w-full bg-slate-50 border-none rounded-3xl px-8 py-6 text-xl font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 italic px-2">Rôle / Titre</label>
                <input 
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="Ex: Rédacteur en Chef..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none"
                />
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase text-slate-400 px-2 italic">Biographie</label>
           <textarea 
            placeholder="Parlez-nous de cet auteur..."
            className="w-full bg-slate-50 border-none rounded-[32px] px-8 py-6 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[150px]"
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-6">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2">Réseaux Sociaux</label>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                    <Twitter size={16} className="text-blue-400" />
                    <input 
                      type="text" 
                      placeholder="Twitter URL"
                      className="bg-transparent border-none outline-none text-xs font-bold flex-1"
                      value={formData.socials.twitter || ''}
                      onChange={e => setFormData({...formData, socials: {...formData.socials, twitter: e.target.value}})}
                    />
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                    <Linkedin size={16} className="text-blue-700" />
                    <input 
                      type="text" 
                      placeholder="LinkedIn URL"
                      className="bg-transparent border-none outline-none text-xs font-bold flex-1"
                      value={formData.socials.linkedin || ''}
                      onChange={e => setFormData({...formData, socials: {...formData.socials, linkedin: e.target.value}})}
                    />
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                    <Mail size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Email"
                      className="bg-transparent border-none outline-none text-xs font-bold flex-1"
                      value={formData.socials.mail || ''}
                      onChange={e => setFormData({...formData, socials: {...formData.socials, mail: e.target.value}})}
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[10px] font-black uppercase text-slate-400 px-2">Spécialités</label>
              <div className="flex flex-wrap gap-2 mb-4">
                 {(Array.isArray(formData.specialties) ? formData.specialties : []).map(spec => (
                    <span key={spec} className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-2">
                       {spec}
                       <button onClick={() => setFormData({...formData, specialties: (Array.isArray(formData.specialties) ? formData.specialties : []).filter(s => s !== spec)})}>
                          <X size={10} />
                       </button>
                    </span>
                 ))}
              </div>
              <div className="flex gap-2">
                 <input 
                  type="text"
                  placeholder="Ajouter spécialité..."
                  className="bg-slate-50 rounded-xl px-4 py-2 text-xs font-bold flex-1 border-none outline-none"
                  value={newSpecialty}
                  onChange={e => setNewSpecialty(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newSpecialty.trim()) {
                      if (!(Array.isArray(formData.specialties) ? formData.specialties : []).includes(newSpecialty.trim())) {
                        setFormData({...formData, specialties: [...(Array.isArray(formData.specialties) ? formData.specialties : []), newSpecialty.trim()]});
                      }
                      setNewSpecialty('');
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (newSpecialty.trim()) {
                      if (!(Array.isArray(formData.specialties) ? formData.specialties : []).includes(newSpecialty.trim())) {
                        setFormData({...formData, specialties: [...(Array.isArray(formData.specialties) ? formData.specialties : []), newSpecialty.trim()]});
                      }
                      setNewSpecialty('');
                    }
                  }}
                  className="p-2 bg-primary text-white rounded-xl"
                >
                  <Plus size={16} />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
