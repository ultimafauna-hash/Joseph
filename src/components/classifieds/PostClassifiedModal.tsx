import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const PostClassifiedModal = ({ onClose, onPost }: { onClose: () => void, onPost: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'emploi',
    location: '',
    imageurl: '',
    contact: '',
    contactMethod: 'email' as 'email' | 'phone'
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] max-w-lg w-full p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-2xl font-black">Publier une annonce</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors p-2"><X size={24}/></button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-6 flex-1">
          <input 
            type="text" 
            placeholder="Titre de l'annonce"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <select 
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 text-xs"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value as any})}
            >
              <option value="emploi">Emploi</option>
              <option value="immobilier">Immobilier</option>
              <option value="véhicules">Véhicules</option>
              <option value="services">Services</option>
              <option value="divers">Divers</option>
            </select>
            <input 
              type="text" 
              placeholder="Prix (ex: 5000 F)"
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 text-xs"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <input 
            type="text" 
            placeholder="Localisation"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 text-xs"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="URL de l'image"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 text-xs"
            value={formData.imageurl}
            onChange={e => setFormData({...formData, imageurl: e.target.value})}
          />
          
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Moyen de contact préféré</label>
             <div className="flex gap-4">
                <button 
                  onClick={() => setFormData({...formData, contactMethod: 'email'})}
                  className={cn(
                    "flex-1 py-3 rounded-xl border-2 text-[10px] font-black transition-all",
                    formData.contactMethod === 'email' ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-400"
                  )}
                >
                  📧 EMAIL
                </button>
                <button 
                  onClick={() => setFormData({...formData, contactMethod: 'phone'})}
                  className={cn(
                    "flex-1 py-3 rounded-xl border-2 text-[10px] font-black transition-all",
                    formData.contactMethod === 'phone' ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-400"
                  )}
                >
                  📱 TÉLÉPHONE
                </button>
             </div>
             <input 
                type={formData.contactMethod === 'email' ? 'email' : 'tel'} 
                placeholder={formData.contactMethod === 'email' ? "Votre email de contact" : "Votre numéro (ex: +225...)"}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                value={formData.contact}
                onChange={e => setFormData({...formData, contact: e.target.value})}
             />
          </div>

          <textarea 
            placeholder="Description détaillée..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none text-xs"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button 
          onClick={() => onPost(formData)}
          className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          PUBLIER L'ANNONCE
        </button>
      </motion.div>
    </motion.div>
  );
};
