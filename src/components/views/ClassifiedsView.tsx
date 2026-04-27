import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Tag, MapPin, Smartphone, Plus } from 'lucide-react';
import { optimizeImage, safeFormatDate } from '../../lib/utils';
import { Classified } from '../../types';

interface ClassifiedsViewProps {
  classifieds: Classified[];
  onBack: () => void;
  onAddClick: () => void;
}

export const ClassifiedsView = ({ classifieds, onBack, onAddClick }: ClassifiedsViewProps) => {
  return (
    <motion.div 
      key="classifieds"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto py-10 space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <button onClick={onBack} className="text-primary text-xs font-bold flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Accueil
          </button>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">Petites <span className="text-primary">Annonces</span></h1>
          <p className="text-slate-500 font-medium max-w-xl">Achetez, vendez ou proposez vos services en toute sécurité sur Akwaba Info.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-3xl font-black shadow-2xl hover:bg-primary transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          <Plus size={24} /> Déposer une annonce
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {classifieds?.map((ad) => (
          <motion.div 
            key={ad.id}
            whileHover={{ y: -10 }}
            className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-100 flex flex-col group"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
               <img 
                 src={optimizeImage(ad.imageurl || '', 600)} 
                 alt={ad.title}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
                    {ad.category}
                  </div>
               </div>
               <div className="absolute bottom-4 right-4 animate-in fade-in zoom-in">
                  <div className="bg-primary text-white px-5 py-2.5 rounded-2xl text-lg font-black italic shadow-xl shadow-primary/20">
                    {ad.price} XOF
                  </div>
               </div>
            </div>
            <div className="p-8 flex-1 flex flex-col gap-4">
              <h3 className="font-black text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">{ad.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{ad.description}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {ad.location}</div>
                    <div>{safeFormatDate(ad.date, 'dd MMM')}</div>
                 </div>
                 <button className="w-full bg-slate-50 text-slate-900 border border-slate-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                   <Smartphone size={16} /> Contacter le vendeur
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
