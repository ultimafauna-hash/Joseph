import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Share2, MessageSquare, AlertCircle } from 'lucide-react';
import { safeFormatDate } from '../../lib/utils';
import { LiveBlog } from '../../types';

interface LiveBlogViewProps {
  blog: LiveBlog;
  onBack: () => void;
}

export const LiveBlogView = ({ blog, onBack }: LiveBlogViewProps) => {
  return (
    <motion.div 
      key="live-blog"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-10 space-y-12"
    >
      <div className="space-y-6 text-center">
        <button onClick={onBack} className="text-primary text-xs font-bold flex items-center gap-1 mx-auto mb-4">
          <ArrowLeft size={14} /> Accueil
        </button>
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
           <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" /> EN DIRECT
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight uppercase max-w-3xl mx-auto">{blog.title}</h1>
      </div>

      <div className="relative space-y-10 before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-1 before:bg-slate-100">
        <AnimatePresence mode="popLayout">
          {blog.updates?.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((update, index) => (
            <motion.div 
              key={update.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-14 space-y-6"
            >
              <div className="absolute left-0 top-1 w-10 h-10 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-primary z-10 shadow-sm">
                 <Clock size={16} strokeWidth={3} />
              </div>
              <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 space-y-6 hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between">
                   <div className="text-sm font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full">
                     {safeFormatDate(update.date, 'HH:mm')}
                   </div>
                   {update.type === 'urgent' && (
                     <div className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-[0.2em]">
                       <AlertCircle size={14} /> Flash Info
                     </div>
                   )}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{update.content}</p>
                {update.imageurl && (
                  <div className="rounded-[2.5rem] overflow-hidden shadow-lg aspect-video">
                    <img src={update.imageurl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                        <MessageSquare size={18} />
                        <span className="text-xs font-bold">Réagir</span>
                      </button>
                   </div>
                   <button className="text-slate-400 hover:text-primary transition-colors">
                      <Share2 size={18} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
