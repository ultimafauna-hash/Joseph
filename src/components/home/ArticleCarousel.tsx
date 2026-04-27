import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../../types';
import { cn } from '../../lib/utils';
import { ArticleCard } from './ArticleCard';

export const ArticleCarousel = ({ 
  articles, 
  onArticleClick, 
  onBookmark, 
  bookmarkedIds,
  onAuthorClick,
  categoryIcons
}: { 
  articles: Article[], 
  onArticleClick: (a: Article) => void,
  onBookmark: (e: React.MouseEvent, id: string) => void,
  bookmarkedIds: Set<string>,
  onAuthorClick?: (name: string) => void,
  categoryIcons?: Record<string, string>
}) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, articles.length - itemsPerPage);
  const next = () => setScrollIndex(prev => Math.min(prev + 1, maxIndex));
  const prev = () => setScrollIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Continuer la lecture</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prev} 
            disabled={scrollIndex === 0}
            className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <span className="text-[8px] opacity-30">·</span>
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next} 
            disabled={scrollIndex === maxIndex}
            className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <span className="text-[8px] opacity-30">·</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden -mx-4 px-4">
        <motion.div 
          animate={{ x: `-${scrollIndex * (100 / itemsPerPage)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex gap-6"
        >
          {articles.map((article) => (
            <div 
              key={article.id} 
              className={cn(
                "shrink-0",
                itemsPerPage === 1 ? "w-full" : 
                itemsPerPage === 2 ? "w-[calc(50%-12px)]" : 
                "w-[calc(25%-18px)]"
              )}
            >
              <ArticleCard 
                article={article} 
                variant="vertical" 
                onClick={() => onArticleClick(article)} 
                onBookmark={onBookmark}
                isBookmarked={bookmarkedIds.has(article.id)}
                onAuthorClick={onAuthorClick}
                categoryIcon={categoryIcons?.[article.category]}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1.5 pt-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setScrollIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              scrollIndex === i 
                ? "w-6 bg-primary" 
                : "w-1.5 bg-slate-200 hover:bg-slate-300"
            )}
            title={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
