import React from 'react';
import { Bookmark, Eye, Heart } from 'lucide-react';
import { Article } from '../../types';
import { cn, optimizeImage, safeFormatDate } from '../../lib/utils';
import { Badge } from '../widgets/Badge';

export const ArticleCard = ({ article, onClick, variant = 'horizontal', onBookmark, isBookmarked, onAuthorClick, categoryIcon }: { 
  article: Article; 
  onClick: () => void; 
  variant?: 'horizontal' | 'vertical' | 'hero';
  onBookmark?: (e: React.MouseEvent, id: string) => void;
  isBookmarked?: boolean;
  onAuthorClick?: (name: string) => void;
  categoryIcon?: string;
}) => {
  if (!article) return null;

  if (variant === 'hero') {
    return (
      <div 
        id={`article-card-hero-${article.id}`}
        onClick={onClick}
        className="relative h-[240px] w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer group bg-slate-100"
      >
        {article.image && (
          <img 
            id={`article-img-hero-${article.id}`}
            src={optimizeImage(article.image, 600)} 
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onBookmark?.(e, article.id); }}
            className={cn(
              "p-2 rounded-full backdrop-blur-md transition-all",
              isBookmarked ? "bg-primary text-white" : "bg-black/20 text-white hover:bg-black/40"
            )}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <Badge category={article.category} icon={categoryIcon}>{article.category}</Badge>
          <h2 className="text-white font-display font-bold text-xl mt-2 leading-tight line-clamp-2">
            {article.title}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
            <span>{safeFormatDate(article.date, 'dd MMM yyyy')}</span>
            <span>•</span>
            <span 
              onClick={(e) => { e.stopPropagation(); onAuthorClick?.(article.author); }}
              className="hover:text-white cursor-pointer transition-colors font-bold"
            >
              {article.author}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`article-card-${variant}-${article.id}`}
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer flex transition-all duration-300 hover:shadow-md",
        variant === 'vertical' ? 'flex-col' : 'flex-row'
      )}
    >
      {article.image && (
        <div className={cn(
          "relative overflow-hidden",
          variant === 'vertical' ? 'w-full h-40' : 'w-24 h-24 shrink-0'
        )}>
          <img 
            id={`article-img-${variant}-${article.id}`}
            src={optimizeImage(article.image, variant === 'vertical' ? 500 : 200)} 
            alt={article.title}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
          {variant === 'vertical' && (
             <div className="absolute top-2 right-2 z-10">
                <button 
                  onClick={(e) => { e.stopPropagation(); onBookmark?.(e, article.id); }}
                  className={cn(
                    "p-1.5 rounded-full backdrop-blur-md transition-all",
                    isBookmarked ? "bg-primary text-white" : "bg-black/20 text-white hover:bg-black/40"
                  )}
                >
                  <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
             </div>
          )}
        </div>
      )}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <Badge category={article.category} icon={categoryIcon}>{article.category}</Badge>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 font-bold">{article.readingtime}</span>
              {variant === 'horizontal' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onBookmark?.(e, article.id); }}
                  className={cn(
                    "transition-colors",
                    isBookmarked ? "text-primary" : "text-slate-300 hover:text-primary"
                  )}
                >
                  <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              )}
            </div>
          </div>
          <h3 className={cn(
            "font-display font-bold text-slate-900 leading-snug line-clamp-2",
            variant === 'vertical' ? 'text-base' : 'text-sm'
          )}>
            {article.title}
          </h3>
          {variant === 'vertical' && article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[8px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600">
          <div className="flex items-center gap-2">
            <span 
              onClick={(e) => { e.stopPropagation(); onAuthorClick?.(article.author); }}
              className="font-black italic hover:text-primary cursor-pointer transition-colors text-slate-900"
            >
              {article.author}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-bold">{safeFormatDate(article.date, 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span className="flex items-center gap-0.5"><Eye size={10} /> {article.views}</span>
            <span className="flex items-center gap-0.5"><Heart size={10} /> {article.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
