import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Share2, Heart, Award, ChevronRight } from 'lucide-react';
import { optimizeImage, safeFormatDate } from '../../lib/utils';
import { CulturePost } from '../../types';
import ReactMarkdown from 'react-markdown';

interface CultureDetailViewProps {
  post: CulturePost;
  onBack: () => void;
}

export const CultureDetailView = ({ post, onBack }: CultureDetailViewProps) => {
  return (
    <motion.div 
      key="culture-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-10 space-y-10"
    >
      <div className="space-y-6">
        <button onClick={onBack} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
          <ArrowLeft size={14} /> Histoire & Culture
        </button>
        
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-amber-600">
              <Award size={20} />
              <span className="text-xs font-black uppercase tracking-widest">{post.category || 'Culture'}</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[1.1]">{post.title}</h1>
           <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                 <Clock size={14} /> {safeFormatDate(post.date, 'dd MMMM yyyy')}
              </div>
           </div>
        </div>

        <div className="aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl relative group">
           <img 
             src={optimizeImage(post.image || '', 1200)} 
             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
             referrerPolicy="no-referrer"
             alt={post.title}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        </div>

        <div className="flex items-center justify-between py-6 border-y border-slate-100">
           <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors font-bold text-sm">
                 <Heart size={20} /> Like
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-sm">
                 <Share2 size={20} /> Partager
              </button>
           </div>
        </div>

        <div className="markdown-body text-lg leading-relaxed text-slate-700 font-medium">
           <ReactMarkdown>{post.content || post.excerpt || ''}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};
