import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutDashboard, Check, User, LogOut, Youtube, Copy, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RUBRICS } from '../../constants';
import api from '../../lib/api';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminAuthenticated: boolean;
  currentUser: any;
  currentView: string;
  activeCategory: string;
  activeSubCategory: string | null;
  siteSettings: any;
  onNavigateTo: (view: any) => void;
  onUserLogin: () => void;
  onCategoryClick: (cat: string) => void;
  onSubCategoryClick: (sub: string) => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  isAdminAuthenticated,
  currentUser,
  currentView,
  activeCategory,
  activeSubCategory,
  siteSettings,
  onNavigateTo,
  onUserLogin,
  onCategoryClick,
  onSubCategoryClick
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className={cn(
            "fixed inset-0 z-[100] p-6 lg:hidden flex flex-col overflow-y-auto scroll-smooth bg-white"
          )}
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col items-center gap-4 w-full">
              <img 
                src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
                alt="Akwaba Info Logo" 
                className="w-32 h-32 object-contain rounded-3xl shadow-lg border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-black">MENU</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-900">
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-6">
            {isAdminAuthenticated && (
              <button 
                id="mobile-admin-dash-btn"
                onClick={() => { onNavigateTo('admin'); onClose(); }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-3xl mb-2 bg-primary/5 text-primary",
                  currentView === 'admin' && "ring-2 ring-primary"
                )}
              >
                <LayoutDashboard size={24} />
                <span className="font-bold">Dashboard Admin</span>
              </button>
            )}

            {currentUser ? (
              <>
                <div 
                  onClick={() => { onNavigateTo('profile'); onClose(); }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-3xl mb-2 cursor-pointer bg-slate-50",
                    currentView === 'profile' && "ring-2 ring-primary"
                  )}
                >
                  <div className="relative">
                    <img 
                      src={currentUser.photourl || `https://ui-avatars.com/api/?name=${currentUser.displayname || 'User'}`} 
                      className="w-12 h-12 rounded-full border-2 border-primary object-cover aspect-square"
                      referrerPolicy="no-referrer"
                    />
                    {isAdminAuthenticated && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                        <Check size={10} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800 truncate max-w-[150px]">
                      {currentUser.displayname || 'Utilisateur'}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-primary">Voir mon profil</div>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    await api.logout();
                    onNavigateTo('home');
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors text-[10px] font-black uppercase tracking-widest mb-4 border border-red-100"
                >
                  <LogOut size={16} /> Se déconnecter
                </button>
              </>
            ) : (
              <button 
                data-login-btn
                onClick={onUserLogin} 
                className="flex items-center justify-center gap-2 p-4 bg-primary text-white rounded-3xl font-bold shadow-lg shadow-primary/20"
              >
                <User size={24} /> Se connecter / S'ouvrir
              </button>
            )}

            {siteSettings.categories?.map((cat: string) => {
               const rubric = RUBRICS.find(r => r.label === cat) || { id: 'other', label: cat, icon: '📰', sub: undefined };
               return (
                <div key={cat} className="flex flex-col gap-2">
                  <button 
                    onClick={() => { onCategoryClick(cat); onClose(); }}
                    className={cn(
                      "text-2xl font-black text-left transition-colors whitespace-nowrap",
                      activeCategory === cat && currentView === 'home' ? "text-primary" : "text-slate-400"
                    )}
                  >
                    {rubric.icon} {cat}
                  </button>
                  {activeCategory === cat && rubric.sub && (
                    <div className="flex flex-col gap-2 pl-6 animate-in slide-in-from-left-2 duration-300">
                      {rubric.sub.map((sub: string) => (
                        <button
                          key={sub}
                          onClick={() => { onSubCategoryClick(sub); onClose(); }}
                          className={cn(
                            "text-sm font-bold text-left py-1 transition-colors flex items-center gap-2",
                            activeSubCategory === sub ? "text-primary" : "text-slate-400"
                          )}
                        >
                          <span className="text-base">{(rubric as any).id === 'pays' ? (siteSettings.countries_flags?.[sub] || '🌍') : ((rubric as any).id === 'themes' ? (siteSettings.categories_icons?.[sub] || '📚') : '')}</span>
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
               );
            })}
            <hr className="border-slate-100 my-2" />
            <button onClick={() => { onNavigateTo('live-blog'); onClose(); }} className="text-lg font-bold text-left text-red-600 flex items-center gap-2 group">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> Direct (Live)
            </button>
            <button onClick={() => { onNavigateTo('classifieds'); onClose(); }} className="text-lg font-bold text-left text-slate-800 flex items-center gap-2 group">
              <Copy size={24} className="text-slate-400 group-hover:text-primary transition-colors" /> Petites Annonces
            </button>
            <button onClick={() => { onNavigateTo('webtv'); onClose(); }} className="text-lg font-bold text-left text-primary flex items-center gap-2 group">
              <Youtube size={24} className="group-hover:scale-110 transition-transform" /> Web TV
            </button>
            <button onClick={() => { onNavigateTo('all-events'); onClose(); }} className="text-lg font-bold text-left text-slate-800 flex items-center gap-2 group">
              <Calendar size={24} className="text-slate-400 group-hover:text-amber-500 transition-colors" /> Agenda Culturel
            </button>
            <hr className="border-slate-100 my-2" />
            <button onClick={() => { onNavigateTo('about'); onClose(); }} className="text-lg font-bold text-left text-slate-500">À propos</button>
            <button onClick={() => { onNavigateTo('contact'); onClose(); }} className="text-lg font-bold text-left text-slate-500">Contact</button>
            <button onClick={() => { onNavigateTo('donate'); onClose(); }} className="text-lg font-bold text-left text-primary">Soutenir le journal</button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
