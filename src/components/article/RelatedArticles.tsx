import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Article } from '../../types';
import { ArticleCard } from './ArticleCard';

interface RelatedArticlesProps {
  currentArticle: Article;
  articles: Article[];
  onArticleClick: (article: Article) => void;
  onBookmark: (e: React.MouseEvent, id: string) => void;
  bookmarkedIds: Set<string>;
  onAuthorClick: (author: string) => void;
  categoryIcons?: Record<string, string>;
}

export const RelatedArticles = ({
  currentArticle,
  articles,
  onArticleClick,
  onBookmark,
  bookmarkedIds,
  onAuthorClick,
  categoryIcons = {}
}: RelatedArticlesProps) => {
  const related = (Array.isArray(articles) ? articles : [])
    .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-20 pt-20 border-t border-slate-100 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h3 className="text-3xl font-black tracking-tighter uppercase italic">À lire également</h3>
        </div>
        <button className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
          Voir Plus <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {related.map(article => (
          <ArticleCard 
            key={article.id}
            article={article}
            variant="vertical"
            onClick={() => onArticleClick(article)}
            onBookmark={onBookmark}
            isBookmarked={bookmarkedIds.has(article.id)}
            onAuthorClick={onAuthorClick}
            categoryIcons={categoryIcons}
          />
        ))}
      </div>
    </div>
  );
};
