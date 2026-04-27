import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Map as MapIcon, Smartphone, Send } from 'lucide-react';

interface ContactViewProps {
  goHome: () => void;
  siteSettings: any;
  handleContactSubmit: (e: React.FormEvent) => void;
}

export const ContactView = ({
  goHome,
  siteSettings,
  handleContactSubmit
}: ContactViewProps) => {
  return (
    <motion.div 
      key="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto py-10 space-y-12"
    >
      <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Retour à l'accueil
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-black">Contactez-nous</h2>
          <p className="text-slate-600 leading-relaxed">
            Une question ? Une suggestion ? Ou vous souhaitez simplement nous dire Akwaba ? Notre équipe est à votre écoute.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <MapIcon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adresse</p>
                <p className="font-bold">{siteSettings.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Smartphone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                <p className="font-bold">{siteSettings.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Send size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="font-bold">{siteSettings.email}</p>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleContactSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nom complet</label>
              <input type="text" name="name" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <input type="email" name="email" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sujet</label>
              <input type="text" name="subject" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message</label>
              <textarea name="message" required rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none" />
           </div>
           <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
              Envoyer le message
           </button>
        </form>
      </div>
    </motion.div>
  );
};
