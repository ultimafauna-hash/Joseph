import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Article } from '../../types';
import { Badge } from '../widgets/Badge';
import { optimizeImage } from '../../lib/utils';

export const RecommendedForYou = ({ articles, history, onArticleClick, onAuthorClick }: { articles: Article[], history: any[], onArticleClick: (a: Article) => void, onAuthorClick?: (name: string) => void }) => {
  const historySet = new Set(history.map(h => h.articleId));
  const recommended = (Array.isArray(articles) ? articles : [])
    .filter(a => !historySet.has(a.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <div className="space-y-6 pt-10 border-t border-slate-100">
       <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
         <TrendingUp size={16} /> Recommandés pour vous
       </h4>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommended.map(a => (
            <div key={a.id} onClick={() => onArticleClick(a)} className="flex gap-4 group cursor-pointer" id={`rec-article-${a.id}`}>
               <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                  <img src={optimizeImage(a.image || "", 200)} className="w-full h-full object-cover" />
               </div>
               <div className="space-y-1">
                  <Badge category={a.category}>{a.category}</Badge>
                  <h5 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{a.title}</h5>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};
