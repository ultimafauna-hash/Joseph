import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { ArticleCard } from './ArticleCard';

interface TrendingSectionProps {
  articles: any[];
  onArticleClick: (article: any) => void;
  onBookmark: (e: React.MouseEvent, id: string) => void;
  bookmarkedIds: Set<string>;
  onAuthorClick: (name: string) => void;
  categoryIcons?: Record<string, string>;
  onSeeMore: () => void;
}

export const TrendingSection = ({
  articles,
  onArticleClick,
  onBookmark,
  bookmarkedIds,
  onAuthorClick,
  onSeeMore
}: TrendingSectionProps) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
            <TrendingUp size={24} className="animate-bounce" />
          </div>
          <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter italic">Tendances (48h)</h2>
        </div>
        <button 
          onClick={onSeeMore}
          className="group flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:translate-x-1 transition-all"
        >
          Tout voir <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, idx) => (
          <div key={article.id} className="relative group">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center font-black text-2xl italic text-slate-100 group-hover:text-primary/20 transition-colors z-10 border border-slate-50">
              0{idx + 1}
            </div>
            <ArticleCard 
              article={article}
              variant="vertical"
              onClick={() => onArticleClick(article)}
              onBookmark={onBookmark}
              isBookmarked={bookmarkedIds.has(article.id)}
              onAuthorClick={onAuthorClick}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
