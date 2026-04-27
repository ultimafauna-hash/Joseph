import React from 'react';
import { motion } from 'motion/react';
import { Clock, Eye, Bookmark, Award, Heart, MessageSquare, ChevronRight } from 'lucide-react';
import { cn, optimizeImage, safeFormatDate } from '../../lib/utils';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'vertical' | 'horizontal' | 'compact' | 'hero';
  onClick: () => void;
  onBookmark: (e: React.MouseEvent, id: string) => void;
  isBookmarked: boolean;
  onAuthorClick?: (author: string) => void;
  categoryIcons?: Record<string, string>;
}

export const ArticleCard = ({
  article,
  variant = 'vertical',
  onClick,
  onBookmark,
  isBookmarked,
  onAuthorClick,
  categoryIcons = {}
}: ArticleCardProps) => {
  if (variant === 'hero') {
    return (
      <div 
        onClick={onClick}
        className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden cursor-pointer group shadow-2xl"
      >
        <img 
          src={optimizeImage(article.image || '', 1200)} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          alt={article.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-4 md:space-y-6">
           <div className="flex items-center gap-3">
              <div className="bg-primary px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
                {categoryIcons[article.category] || '📰'} {article.category}
              </div>
              {article.ispremium && (
                <div className="bg-amber-500 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-lg shadow-amber-500/20">
                  <Award size={14} fill="white" /> PREMIUM
                </div>
              )}
           </div>
           
           <h2 className="text-3xl md:text-6xl font-black text-white italic leading-[1.1] tracking-tighter max-w-4xl group-hover:text-primary transition-colors">
              {article.title}
           </h2>
           
           <div className="flex flex-wrap items-center gap-6 text-white/60 text-xs md:text-sm font-bold">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/20">
                    {(article.author || 'R')[0]}
                 </div>
                 <span className="hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); onAuthorClick?.(article.author); }}>
                   {article.author}
                 </span>
              </div>
              <div className="flex items-center gap-2">
                 <Clock size={14} />
                 {safeFormatDate(article.date, 'dd MMMM yyyy')}
              </div>
              <div className="flex items-center gap-2">
                 <Eye size={14} />
                 {article.views?.toLocaleString() || 0}
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         onClick={onClick}
         className="group bg-white rounded-[2.5rem] p-4 flex flex-col sm:flex-row gap-6 cursor-pointer border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
       >
         <div className="sm:w-2/5 aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-lg">
           <img 
             src={optimizeImage(article.image || '', 600)} 
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
             alt={article.title}
             referrerPolicy="no-referrer"
           />
           {article.ispremium && (
             <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <Award size={10} fill="white" /> PREMIUM
             </div>
           )}
         </div>
         <div className="sm:w-3/5 flex flex-col justify-center space-y-4 pr-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                {categoryIcons[article.category] || '📰'} {article.category}
              </span>
              <button 
                onClick={(e) => onBookmark(e, article.id)}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isBookmarked ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-slate-100 hover:text-primary"
                )}
              >
                <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            </div>
            <h3 className="text-xl md:text-2xl font-black leading-[1.2] tracking-tight group-hover:text-primary transition-colors italic">
               {article.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
               {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <div className="flex items-center gap-1.5">
                  <Clock size={12} /> {safeFormatDate(article.date, 'dd MMM yyyy')}
               </div>
               <div className="flex items-center gap-1.5">
                  <Eye size={12} /> {article.views?.toLocaleString() || 0}
               </div>
            </div>
         </div>
       </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="group flex flex-col cursor-pointer bg-white rounded-[3rem] p-3 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 h-full"
    >
      <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-5 shadow-xl">
        <img 
          src={optimizeImage(article.image || '', 600)} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={article.title}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Indicators Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-lg">
             {categoryIcons[article.category] || '📰'} {article.category}
           </div>
        </div>
        
        <button 
          onClick={(e) => onBookmark(e, article.id)}
          className={cn(
            "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg",
            isBookmarked ? "bg-primary text-white" : "bg-white/80 text-slate-400 hover:text-primary hover:bg-white"
          )}
        >
          <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
        </button>

        {article.ispremium && (
           <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
              <Award size={12} fill="white" /> PREMIUM CONTENT
           </div>
        )}
      </div>

      <div className="px-3 pb-6 flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] italic">
           <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-primary font-bold" /> {safeFormatDate(article.date, 'dd MMM yyyy')}
           </div>
           <span className="w-1 h-1 bg-slate-300 rounded-full" />
           <div className="flex items-center gap-1.5">
              <Eye size={12} /> {article.views?.toLocaleString() || 0}
           </div>
        </div>
        
        <h3 className="font-black text-xl leading-[1.2] italic tracking-tight group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
           <div className="flex items-center gap-2 group/author" onClick={(e) => { e.stopPropagation(); onAuthorClick?.(article.author); }}>
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/10 group-hover/author:bg-primary group-hover/author:text-white transition-all">
                {(article.author || 'R')[0]}
              </div>
              <span className="text-[10px] font-bold text-slate-500 hover:text-primary">{article.author}</span>
           </div>
           <div className="flex gap-3 text-slate-300">
              <div className="flex items-center gap-1">
                 <Heart size={12} />
                 <span className="text-[9px] font-bold">{article.likes}</span>
              </div>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-primary" />
           </div>
        </div>
      </div>
    </motion.div>
  );
};
