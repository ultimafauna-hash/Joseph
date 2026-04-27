import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Rubric {
  label: string;
  id: string;
  icon: string;
  sub?: string[];
}

interface RubricNavProps {
  rubrics: Rubric[];
  activeCategory: string;
  activeSubCategory: string | null;
  onCategoryClick: (cat: string) => void;
  onSubCategoryClick: (sub: string | null) => void;
  siteSettings: any;
}

export const RubricNav = ({
  rubrics,
  activeCategory,
  activeSubCategory,
  onCategoryClick,
  onSubCategoryClick,
  siteSettings
}: RubricNavProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const subScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showSubLeftArrow, setShowSubLeftArrow] = useState(false);
  const [showSubRightArrow, setShowSubRightArrow] = useState(true);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, setLeft: (v: boolean) => void, setRight: (v: boolean) => void) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setLeft(scrollLeft > 20);
      setRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const mainRef = scrollRef.current;
    const subRef = subScrollRef.current;

    const mainHandler = () => handleScroll(scrollRef, setShowLeftArrow, setShowRightArrow);
    const subHandler = () => handleScroll(subScrollRef, setShowSubLeftArrow, setShowSubRightArrow);

    mainRef?.addEventListener('scroll', mainHandler);
    subRef?.addEventListener('scroll', subHandler);
    
    const resizeObserver = new ResizeObserver(() => {
      mainHandler();
      subHandler();
    });

    if (mainRef) resizeObserver.observe(mainRef);
    if (subRef) resizeObserver.observe(subRef);

    // Initial check
    mainHandler();
    subHandler();

    return () => {
      mainRef?.removeEventListener('scroll', mainHandler);
      subRef?.removeEventListener('scroll', subHandler);
      resizeObserver.disconnect();
    };
  }, [rubrics, activeCategory, activeSubCategory]);

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.7;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const activeRubric = rubrics.find(r => r.label === activeCategory);
  const showSubCategories = activeRubric?.sub && activeRubric.sub.length > 0;

  return (
    <div className="bg-white pt-2 pb-4 border-b border-slate-100/50 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Main Categories Bar */}
        <div className="relative group flex items-center">
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => scroll('left', scrollRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/95 backdrop-blur-sm shadow-xl rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>
          
          <div 
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 w-full"
          >
            <div className="flex items-center gap-2 lg:mx-auto">
              {rubrics.map((rubric) => (
                <motion.button
                  key={rubric.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategoryClick(rubric.label)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all flex items-center gap-2 border-2 shrink-0",
                    activeCategory === rubric.label 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-slate-50 text-slate-500 border-transparent hover:border-slate-200"
                  )}
                >
                  <span className="text-sm">{rubric.icon}</span>
                  <span className="font-display">{rubric.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showRightArrow && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => scroll('right', scrollRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/95 backdrop-blur-sm shadow-xl rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"
              >
                <ChevronRight size={18} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Sub-Categories Bar */}
        <AnimatePresence mode="wait">
          {showSubCategories && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="relative group/sub flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 rounded-lg text-slate-400 shrink-0">
                  <LayoutGrid size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">Sections</span>
                </div>

                <div className="relative flex-1">
                  <AnimatePresence>
                    {showSubLeftArrow && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => scroll('left', subScrollRef)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white shadow-xl rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                      >
                        <ChevronLeft size={14} strokeWidth={3} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <div 
                    ref={subScrollRef}
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSubCategoryClick(null)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2",
                          !activeSubCategory 
                            ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10" 
                            : "bg-white text-slate-400 border-white hover:border-slate-100 hover:bg-slate-50 shadow-sm"
                        )}
                      >
                        Tout voir
                      </button>
                      {activeRubric.sub?.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => onSubCategoryClick(sub)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2 flex items-center gap-2.5",
                            activeSubCategory === sub 
                              ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10" 
                              : "bg-white text-slate-400 border-white hover:border-slate-100 hover:bg-slate-50 shadow-sm"
                          )}
                        >
                          <span className="text-sm">
                            {activeCategory === 'INFO PAR PAYS' ? (siteSettings.countries_flags?.[sub] || '🌍') : (activeCategory === 'NOS THEMES' ? (siteSettings.categories_icons?.[sub] || '📚') : '')}
                          </span>
                          <span>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showSubRightArrow && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => scroll('right', subScrollRef)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white shadow-xl rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                      >
                        <ChevronRight size={14} strokeWidth={3} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
