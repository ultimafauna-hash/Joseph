import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { cn } from '../../lib/utils';

interface ArticleCarouselProps {
  articles: any[];
  onArticleClick: (article: any) => void;
  onBookmark: (e: React.MouseEvent, id: string) => void;
  bookmarkedIds: Set<string>;
  onAuthorClick: (name: string) => void;
}

export const ArticleCarousel = ({
  articles,
  onArticleClick,
  onBookmark,
  bookmarkedIds,
  onAuthorClick
}: ArticleCarouselProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!articles || articles.length === 0) return null;

  return (
    <section className="space-y-8 pt-12 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Newspaper size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">À Découvrir Également</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-3 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onWheel={(e) => {
          const container = e.currentTarget;
          container.scrollTo({
            left: container.scrollLeft + e.deltaY,
            behavior: 'auto'
          });
        }}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 -mx-4 px-4 md:mx-0 md:px-0"
      >
        {articles.map((article) => (
          <div key={article.id} className="min-w-[300px] md:min-w-[350px]">
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
