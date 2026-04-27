import React from 'react';
import { motion } from 'motion/react';
import { Star, ChevronRight, User } from 'lucide-react';
import { Article } from '../../types';
import { cn, optimizeImage, safeFormatDate } from '../../lib/utils';
import { Badge } from '../widgets/Badge';

interface FeaturedSectionProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  categoryIcons?: Record<string, string>;
}

export const FeaturedSection = ({ articles, onArticleClick, categoryIcons }: FeaturedSectionProps) => {
  const featuredArticles = articles
    .filter(a => a.is_featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (featuredArticles.length === 0) return null;

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg shadow-red-600/20">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">
              Actualités <span className="text-red-600 underline decoration-red-600/30 underline-offset-4">à la Une</span>
            </h2>
            <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Les incontournables du moment</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onArticleClick(article)}
            className="group relative bg-white rounded-[32px] overflow-hidden border-2 border-slate-100/50 hover:border-red-600/20 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-red-600/10 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-48 md:h-56 overflow-hidden">
              {article.image && (
                <img
                  src={optimizeImage(article.image, 600)}
                  alt={article.title}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-4 left-4">
                <Badge 
                  category={article.category} 
                  icon={categoryIcons?.[article.category]}
                  className="shadow-xl"
                >
                  {article.category}
                </Badge>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <ChevronRight size={20} />
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <User size={12} className="text-red-500" />
                  <span className="text-slate-900 italic">{article.author}</span>
                </div>
                <span className="text-slate-200">|</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {safeFormatDate(article.date, 'dd MMM yyyy')}
                </span>
              </div>

              <h3 className="text-xl font-display font-black text-slate-900 leading-[1.3] mb-4 group-hover:text-red-600 transition-colors line-clamp-2 uppercase italic tracking-tight">
                {article.title}
              </h3>

              <p className="text-sm font-medium text-slate-500 line-clamp-3 leading-relaxed mb-6">
                {article.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Lire l'article</span>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{article.readingtime || '5 min'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
