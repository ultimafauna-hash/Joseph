import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../../types';
import { cn, optimizeImage, safeFormatDate } from '../../lib/utils';
import { Badge } from '../widgets/Badge';

export const HeroSlideshow = ({ 
  articles, 
  onArticleClick, 
  onBookmark, 
  bookmarkedIds,
  onAuthorClick,
  categoryIcons
}: { 
  articles: Article[]; 
  onArticleClick: (a: Article) => void; 
  onBookmark: (e: React.MouseEvent, id: string) => void;
  bookmarkedIds: Set<string>;
  onAuthorClick?: (name: string) => void;
  categoryIcons?: Record<string, string>;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!articles || articles.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  return (
    <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={articles[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => onArticleClick(articles[currentIndex])}
        >
          {articles[currentIndex].image && (
            <img 
              src={optimizeImage(articles[currentIndex].image, 1200)} 
              alt={articles[currentIndex].title}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute top-6 right-6 z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); onBookmark(e, articles[currentIndex].id); }}
              className={cn(
                "p-3 rounded-full backdrop-blur-md transition-all shadow-xl",
                bookmarkedIds.has(articles[currentIndex].id) ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white/40"
              )}
            >
              <Bookmark size={24} fill={bookmarkedIds.has(articles[currentIndex].id) ? "currentColor" : "none"} />
            </button>
          </div>
          
          {/* Slider Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handlePrev}
              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleNext}
              className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
            <Badge category={articles[currentIndex].category} icon={categoryIcons?.[articles[currentIndex].category]}>{articles[currentIndex].category}</Badge>
            <h2 className="text-white font-display font-black text-2xl md:text-4xl mt-4 leading-[1.1] tracking-tight">
              {articles[currentIndex].title}
            </h2>
            <div className="flex items-center gap-4 mt-4 text-white/70 text-sm font-medium">
              <span>{safeFormatDate(articles[currentIndex].date, 'dd MMM yyyy')}</span>
              <span>•</span>
              <span 
                onClick={(e) => { e.stopPropagation(); onAuthorClick?.(articles[currentIndex].author); }}
                className="hover:text-white cursor-pointer transition-colors"
              >
                {articles[currentIndex].author}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === currentIndex ? "bg-primary w-6" : "bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};
