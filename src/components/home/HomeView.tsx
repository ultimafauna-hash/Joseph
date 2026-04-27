import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Check, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RUBRICS } from '../../constants';
import { HeroSlideshow } from './HeroSlideshow';
import { FeaturedSection } from './FeaturedSection';
import { CultureSection } from './CultureSection';
import { EventSection } from './EventSection';
import { ArticleCard } from './ArticleCard';
import { NewsletterSignup } from '../NewsletterSignup';
import { ChevronRight } from 'lucide-react';
import { ArticleSkeleton } from '../Skeleton';
import { TrendingSection } from './TrendingSection';
import { PollCard } from '../widgets/PollCard';
import { GoogleAd } from '../widgets/GoogleAd';

interface HomeViewProps {
  activeCategory: string;
  activeSubCategory: string | null;
  onCategoryClick: (cat: string) => void;
  onSubCategoryClick: (sub: string) => void;
  visibleArticles: any[];
  displayedArticles: any[];
  onArticleClick: (article: any) => void;
  adminCulturePosts: any[];
  onPostClick: (post: any) => void;
  onNavigate: (view: string) => void;
  visibleEvents: any[];
  onEventClick: (event: any) => void;
  onBookmark: (e: React.MouseEvent, id: string) => void;
  bookmarkedIds: Set<string>;
  onAuthorClick: (name: string) => void;
  siteSettings: any;
  currentUser: any;
  onShowPreferenceModal: () => void;
  trendingArticles: any[];
  personalizedArticles: any[];
  adminPolls: any[];
  handleVote: (pollId: string, optionId: string) => void;
  onFollowCategory: (cat: string) => void;
  userFollowedCategories: Set<string>;
  loadingRef: React.RefObject<HTMLDivElement>;
}

export const HomeView = ({
  activeCategory,
  activeSubCategory,
  onCategoryClick,
  onSubCategoryClick,
  visibleArticles,
  displayedArticles,
  onArticleClick,
  adminCulturePosts,
  onPostClick,
  onNavigate,
  visibleEvents,
  onEventClick,
  onBookmark,
  bookmarkedIds,
  onAuthorClick,
  siteSettings,
  currentUser,
  onShowPreferenceModal,
  trendingArticles,
  personalizedArticles,
  adminPolls,
  handleVote,
  onFollowCategory,
  userFollowedCategories,
  loadingRef
}: HomeViewProps) => {
  return (
    <motion.div 
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      {/* Hierarchy-Specific Sections */}
      {activeCategory === 'SONDAGE' && (
        <section className="space-y-12 py-10">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse" /> Direct Opinion
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Sondages & Opinions</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Exprimez votre avis sur les sujets qui comptent. Votre voix participe au débat public et forge la réflexion commune.</p>
          </div>
          {(Array.isArray(adminPolls) ? adminPolls : []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(Array.isArray(adminPolls) ? adminPolls : []).filter(p => !p.isarchived).map(poll => (
                <div key={poll.id} className="bg-white p-2 rounded-[32px] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-500">
                  <PollCard poll={poll} onVote={handleVote} hasVoted={(currentUser?.votedpolls || []).includes(poll.id)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 italic bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              Aucun sondage actif pour le moment. Revenez bientôt !
            </div>
          )}
        </section>
      )}

      {/* Grid Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter italic">
              {activeCategory === 'À LA UNE' ? <span className="text-red-600">Dernières Nouvelles</span> : activeCategory}
            </h2>
          </div>
          {activeCategory !== 'À LA UNE' && (
            <button 
              onClick={() => onFollowCategory(activeCategory)}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all",
                userFollowedCategories.has(activeCategory)
                  ? "bg-slate-200 text-slate-500"
                  : "bg-primary text-white shadow-lg shadow-primary/20"
              )}
            >
              {userFollowedCategories.has(activeCategory) ? <Check size={14} /> : <Plus size={14} />}
              {userFollowedCategories.has(activeCategory) ? 'Suivi' : 'Suivre'}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedArticles.length > 0 ? displayedArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              variant="vertical"
              onClick={() => onArticleClick(article)} 
              onBookmark={onBookmark} 
              isBookmarked={bookmarkedIds.has(article.id)}
              onAuthorClick={onAuthorClick}
            />
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400 italic">
              Aucun article trouvé dans cette catégorie.
            </div>
          )}
        </div>
        
        {displayedArticles.length < visibleArticles.length && (
          <div ref={loadingRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
            <ArticleSkeleton />
            <ArticleSkeleton className="hidden md:block" />
            <ArticleSkeleton className="hidden lg:block" />
            <ArticleSkeleton className="hidden xl:block" />
          </div>
        )}

        {displayedArticles.length >= visibleArticles.length && visibleArticles.length > 0 && (
          <div className="flex justify-center pt-8">
            <button 
              onClick={() => onNavigate('search')}
              className="group flex items-center gap-3 bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl font-black text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
            >
              RECHERCHER D'AUTRES SUJETS
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </section>

    </motion.div>
  );
};
