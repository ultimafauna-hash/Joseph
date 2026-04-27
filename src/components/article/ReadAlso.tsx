import React from 'react';
import { FileText } from 'lucide-react';
import { Article } from '../../types';
import { cn, optimizeImage } from '../../lib/utils';

export const ReadAlso = ({ currentArticle, articles, onArticleClick, onAuthorClick }: { currentArticle: Article, articles: Article[], onArticleClick: (a: Article) => void, onAuthorClick?: (name: string) => void }) => {
  const related = (Array.isArray(articles) ? articles : [])
    .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
    .slice(0, 2);
  
  if (related.length === 0) return null;

  return (
    <div className="my-10 p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <FileText size={18} />
        </div>
        <h4 className="font-display font-black text-slate-900 uppercase tracking-widest text-xs">À lire aussi</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
        {related.map(article => (
          <button 
            key={article.id}
            id={`read-also-${article.id}`}
            onClick={() => onArticleClick(article)}
            className="flex gap-4 group text-left w-full items-start"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
              <img 
                src={optimizeImage(article.image, 300)} 
                alt={article.title} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded-full">
                  {article.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">{article.readingtime}</span>
              </div>
              <h5 className="font-display font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-3 text-sm md:text-base">
                {article.title}
              </h5>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
