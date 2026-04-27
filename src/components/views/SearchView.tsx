import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, X, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ArticleCard } from '../home/ArticleCard';
import { Skeleton } from '../widgets/Skeleton';

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  goHome: () => void;
  isSearching: boolean;
  setIsSearching: (b: boolean) => void;
  showFilters: boolean;
  setShowFilters: (b: boolean) => void;
  filterCategory: string;
  setFilterCategory: (c: string) => void;
  filterAuthor: string;
  setFilterAuthor: (a: string) => void;
  filterDate: string;
  setFilterDate: (d: string) => void;
  siteSettings: any;
  searchResults: any[];
  displayedSearchResults: any[];
  searchViewMode: 'grid' | 'list';
  setSearchViewMode: (m: 'grid' | 'list') => void;
  onArticleClick: (a: any) => void;
  onBookmark: (e: React.MouseEvent, id: string) => void;
  bookmarkedIds: Set<string>;
  onAuthorClick: (name: string) => void;
  searchLoadingRef: React.RefObject<HTMLDivElement>;
}

export const SearchView = ({
  searchQuery,
  setSearchQuery,
  goHome,
  isSearching,
  setIsSearching,
  showFilters,
  setShowFilters,
  filterCategory,
  setFilterCategory,
  filterAuthor,
  setFilterAuthor,
  filterDate,
  setFilterDate,
  siteSettings,
  searchResults,
  displayedSearchResults,
  searchViewMode,
  setSearchViewMode,
  onArticleClick,
  onBookmark,
  bookmarkedIds,
  onAuthorClick,
  searchLoadingRef
}: SearchViewProps) => {
  return (
    <motion.div 
      key="search"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-12 py-6"
    >
      <div className="space-y-6">
        <button 
          onClick={goHome} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest pl-4"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Accueil
        </button>
        
        {/* Minimal Glass Bar */}
        <div className="relative z-50 px-4">
          <div className="bg-white/80 backdrop-blur-2xl rounded-full p-2 shadow-2xl shadow-slate-200 border border-white flex items-center gap-2 pr-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
              <Search size={22} strokeWidth={3} />
            </div>
            <input 
              autoFocus
              type="text" 
              placeholder="Rechercher un scoop, un pays, un auteur..." 
              className="flex-1 bg-transparent text-xl font-bold outline-none text-slate-900 px-2 placeholder:text-slate-300"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
                setTimeout(() => setIsSearching(false), 300);
              }}
            />
            <div className="flex items-center gap-2">
               {searchQuery && (
                 <button 
                  onClick={() => setSearchQuery('')} 
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                 >
                   <X size={16} strokeWidth={3} />
                 </button>
               )}
               <div className="w-px h-8 bg-slate-100 mx-2" />
               <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full transition-all text-[10px] font-black uppercase tracking-widest",
                  showFilters ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                )}
              >
                <Filter size={14} />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Pill-shaped Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="px-4 overflow-hidden"
            >
              <div className="bg-slate-50 rounded-[2.5rem] p-8 mt-4 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Catégories</h4>
                       <div className="flex flex-wrap gap-2">
                          {['Tout', ...(siteSettings?.categories || [])].slice(0, 8).map(c => (
                            <button
                              key={c}
                              onClick={() => setFilterCategory(c === 'Tout' ? '' : c)}
                              className={cn(
                                "px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap",
                                (filterCategory === c || (c === 'Tout' && !filterCategory)) 
                                  ? "bg-slate-900 text-white shadow-lg" 
                                  : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-100"
                              )}
                            >
                              {c}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Auteurs Populaires</h4>
                       <div className="flex flex-wrap gap-2">
                          {['Tout', 'Koffi', 'Diallo', 'Ouattara', 'Yeboah'].map(a => (
                            <button
                              key={a}
                              onClick={() => setFilterAuthor(a === 'Tout' ? '' : a)}
                              className={cn(
                                "px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap",
                                (filterAuthor === a || (a === 'Tout' && !filterAuthor)) 
                                  ? "bg-primary text-white shadow-lg" 
                                  : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-100"
                              )}
                            >
                              {a}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Date de publication</h4>
                       <div className="flex flex-col gap-2">
                          {[
                            { id: '', label: 'Toutes les dates' },
                            { id: 'today', label: 'Aujourd\'hui' },
                            { id: 'week', label: 'Cette semaine' },
                            { id: 'month', label: 'Ce mois' }
                          ].map(d => (
                            <button
                              key={d.id}
                              onClick={() => setFilterDate(d.id)}
                              className={cn(
                                "w-full px-6 py-3 rounded-2xl text-left text-[10px] font-black uppercase transition-all flex items-center justify-between",
                                filterDate === d.id ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                              {d.label}
                              {filterDate === d.id && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                    <p className="text-[9px] font-bold text-slate-400 italic">Combinez les filtres pour affiner vos résultats.</p>
                    <button 
                      onClick={() => {
                        setFilterCategory('');
                        setFilterAuthor('');
                        setFilterDate('');
                        setShowFilters(false);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      Réinitialiser tout
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {searchQuery ? (
        <div className="space-y-8 px-4">
          <div className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-3">
                   <h2 className="text-3xl font-black italic tracking-tighter">Résultats</h2>
                   {isSearching ? (
                     <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                     </div>
                   ) : (
                     <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black">
                       {searchResults.length}
                     </span>
                   )}
                </div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Pour "{searchQuery}"</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-full">
               <button 
                onClick={() => setSearchViewMode('grid')}
                className={cn("p-2.5 rounded-full transition-all", searchViewMode === 'grid' ? "bg-white text-slate-900 shadow-md" : "text-slate-400")}
               >
                  <LayoutGrid size={18} />
               </button>
               <button 
                onClick={() => setSearchViewMode('list')}
                className={cn("p-2.5 rounded-full transition-all", searchViewMode === 'list' ? "bg-white text-slate-900 shadow-md" : "text-slate-400")}
               >
                  <LayoutList size={18} />
               </button>
            </div>
          </div>

          <div className={cn(
            "grid gap-8",
            searchViewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}>
            {displayedSearchResults.length > 0 ? displayedSearchResults.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                variant={searchViewMode === 'grid' ? 'vertical' : 'horizontal'} 
                onClick={() => onArticleClick(article)}
                onBookmark={onBookmark}
                isBookmarked={bookmarkedIds.has(article.id)}
                onAuthorClick={onAuthorClick}
              />
            )) : !isSearching && (
              <div className="col-span-full py-20 text-center space-y-4">
                 <div className="text-6xl">🔍</div>
                 <h3 className="text-xl font-bold">Aucun résultat trouvé</h3>
                 <p className="text-slate-400">Essayez avec d'autres mots-clés ou ajustez vos filtres.</p>
              </div>
            )}
          </div>

          {displayedSearchResults.length < searchResults.length && (
            <div ref={searchLoadingRef} className="py-10 flex justify-center">
              <Skeleton className="w-1/3 h-8 rounded-lg" />
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
           <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-200 border-2 border-dashed border-slate-200">
              <Search size={48} />
           </div>
           <div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">Lancez votre recherche</h3>
              <p className="text-slate-500 font-medium">Découvrez nos articles, enquêtes et dossiers exclusifs.</p>
           </div>
           
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recherches populaires</p>
              <div className="flex flex-wrap justify-center gap-2">
                 {['Politique CI', 'Économie Afrique', 'Sport Gagnoa', 'Culture Abidjan', 'Innovation'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-6 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold hover:border-primary hover:text-primary transition-all shadow-sm"
                   >
                     {tag}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </motion.div>
  );
};
