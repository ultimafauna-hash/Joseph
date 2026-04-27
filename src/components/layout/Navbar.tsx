import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, X, LayoutDashboard, Bell, LogOut, User, Check, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WeatherWidget } from '../widgets/WeatherWidget';
import { NotificationCenter } from '../notifications/NotificationCenter';

interface NavbarProps {
  currentView: string;
  currentUser: any;
  isAdminAuthenticated: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigateTo: (view: any) => void;
  handleLogoClick: () => void;
  handleUserLogin: () => void;
  handleUserLogout: () => void;
  unreadNotifsCount: number;
  showNotificationCenter: boolean;
  setShowNotificationCenter: (show: boolean) => void;
  notifications: any[];
  handleMarkNotificationAsRead: (id: string) => void;
  handleArticleClick: (article: any) => void;
  setAdminActiveTab: (tab: string) => void;
  adminArticles: any[];
  setIsMenuOpen: (open: boolean) => void;
}

export const Navbar = ({
  currentView,
  currentUser,
  isAdminAuthenticated,
  searchQuery,
  setSearchQuery,
  navigateTo,
  handleLogoClick,
  handleUserLogin,
  handleUserLogout,
  unreadNotifsCount,
  showNotificationCenter,
  setShowNotificationCenter,
  notifications,
  handleMarkNotificationAsRead,
  handleArticleClick,
  setAdminActiveTab,
  adminArticles,
  setIsMenuOpen
}: NavbarProps) => {
  if (['admin', 'admin-login'].includes(currentView)) return null;

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      "bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all"
          >
            <Menu size={24} />
          </button>
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
              className="w-10 h-10 md:w-14 md:h-14 rounded-xl border border-slate-100 p-1 object-contain transition-transform group-hover:scale-110" 
              alt="Logo" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black italic tracking-tighter leading-none uppercase">
                <span className="text-[#000000]">AKWABA</span> <span className="text-[#1FA463]">INFO</span>
              </h1>
              <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">L’info du monde en un clic</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-2 py-1 mx-8 max-w-xl flex-1 focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
          <Search size={18} className="text-slate-500 ml-2 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher un article, un auteur..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo('search')}
            className="bg-transparent border-none outline-none px-3 py-2 text-sm w-full font-bold placeholder:text-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400">
              <X size={14} />
            </button>
          )}
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-lg text-slate-500 font-bold ml-2 shadow-sm">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <WeatherWidget />
          
          <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />
          
          {currentUser && (
             <div className="flex items-center gap-1 md:gap-2">
               {isAdminAuthenticated && (
                 <button 
                   id="desktop-admin-dash-btn"
                   onClick={() => navigateTo('admin')}
                   className={cn(
                     "p-2 md:p-3 rounded-full transition-all group",
                     currentView === 'admin' ? "bg-primary text-white" : "hover:bg-primary/10 text-primary"
                   )}
                   title="Tableau de bord Admin"
                 >
                   <LayoutDashboard size={20} className="md:w-[22px] md:h-[22px]" />
                 </button>
               )}
               <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                    className={cn(
                      "p-2 md:p-3 rounded-full transition-all relative group",
                      showNotificationCenter ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-100 text-slate-500"
                    )}
                  >
                    <Bell size={20} className="md:w-[22px] md:h-[22px]" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute top-1 md:top-2 right-1 md:right-2 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 text-white text-[7px] md:text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {showNotificationCenter && (
                      <NotificationCenter 
                        notifications={notifications}
                        onClose={() => setShowNotificationCenter(false)}
                        onMarkRead={handleMarkNotificationAsRead}
                        onNavigate={(link) => {
                          if (link.startsWith('/admin')) {
                            const url = new URL(link, window.location.origin);
                            const tab = url.searchParams.get('tab');
                            if (tab) setAdminActiveTab(tab);
                            navigateTo('admin');
                          } else {
                            const article = adminArticles.find(a => a.id === link || a.slug === link);
                            if (article) handleArticleClick(article);
                          }
                          setShowNotificationCenter(false);
                        }}
                      />
                    )}
                  </AnimatePresence>
               </div>
             </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-1 md:gap-2">
              <div onClick={() => navigateTo('profile')} className="relative group cursor-pointer" title="Mon Profil">
                <img 
                  src={currentUser.photourl || `https://ui-avatars.com/api/?name=${currentUser.displayname || 'User'}`} 
                  alt="User Profile" 
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors object-cover aspect-square",
                    currentView === 'profile' ? "border-primary" : "border-primary/20 hover:border-primary"
                  )}
                  referrerPolicy="no-referrer"
                />
                {isAdminAuthenticated ? (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                    <Shield size={10} className="w-3 h-3" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-white" />
                )}
              </div>
              <button 
                onClick={handleUserLogout}
                className="hidden sm:flex p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                title="Déconnexion"
              >
                <LogOut size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          ) : (
            <button 
              data-login-btn
              onClick={handleUserLogin}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 font-bold text-sm"
            >
              <User size={20} />
              <span className="hidden md:inline">Connexion</span>
            </button>
          )}

          <button 
            id="header-donate-btn"
            onClick={() => navigateTo('donate')}
            className="hidden md:flex bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Soutenir
          </button>
        </div>
      </div>
    </header>
  );
};
