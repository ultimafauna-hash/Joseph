import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronRight } from 'lucide-react';
import { NewsletterSignup } from '../NewsletterSignup';

export const Footer = ({ onNavigate, onCategoryClick, categories }: { onNavigate: (v: any) => void, onCategoryClick: (cat: string) => void, categories: string[] }) => (
  <footer className="bg-slate-900 text-white pt-20 pb-10 mt-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
       <img src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" className="w-96 h-96 grayscale invert" alt="" />
    </div>
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <img 
               src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
               className="w-16 h-16 rounded-2xl border border-white/10 p-2 object-contain" 
               alt="Logo" 
             />
             <h2 className="text-2xl font-black tracking-tighter text-white">AKWABA <span className="text-primary">INFO</span></h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Le portail d'information de référence sur l'Afrique et le monde. Indépendance, véracité et proximité au cœur de notre rédaction.
          </p>
          <div className="flex gap-4">
             {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
               <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-slate-300 hover:text-white">
                 <Icon size={18} />
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-primary italic">Navigation</h3>
          <ul className="space-y-3">
            {['À LA UNE', 'INFO PAR PAYS', 'AFRIQUE', 'COMMUNIQUÉS', 'NOS THEMES'].map(item => (
              <li key={item}>
                <button 
                  onClick={() => onCategoryClick(item)} 
                  className="text-slate-300 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group"
                >
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-primary italic">Services</h3>
          <ul className="space-y-3">
            {[
              { label: 'Annonces', view: 'classifieds' },
              { label: 'Web TV', view: 'webtv' },
              { label: 'Agenda Culturel', view: 'all-events' },
              { label: 'Direct (Live)', view: 'live-blog' },
              { label: 'Faire un don', view: 'donate' },
              { label: 'Auteurs', view: 'authors' }
            ].map(item => (
              <li key={item.label}>
                <button 
                  onClick={() => onNavigate(item.view as any)} 
                  className="text-slate-300 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group"
                >
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-primary italic">Newsletter</h3>
          <p className="text-slate-300 text-sm font-medium">Restez informé des dernières actualités africaines chaque matin.</p>
          <NewsletterSignup 
            variant="minimal" 
            className="mt-4" 
            onPrivacyClick={() => onNavigate('privacy')}
          />
        </div>
      </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
         <p>© 2024 <span className="text-white">AKWABA</span> <span className="text-primary">INFO</span>. TOUS DROITS RÉSERVÉS.</p>
         <div className="flex gap-8">
            <button onClick={() => onNavigate('terms')} className="hover:text-primary transition-colors">Mentions Légales</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-primary transition-colors">Confidentialité</button>
            <button onClick={() => onNavigate('cookies')} className="hover:text-primary transition-colors">Cookies</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-primary transition-colors">Contact</button>
         </div>
      </div>
    </div>
  </footer>
);
