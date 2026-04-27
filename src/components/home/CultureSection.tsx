import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Heart, Share2 } from 'lucide-react';
import { optimizeImage } from '../../lib/utils';
import { CulturePost } from '../../types';

interface CultureSectionProps {
  posts: CulturePost[];
  onPostClick: (post: CulturePost) => void;
  onSeeAll: () => void;
}

export const CultureSection = ({
  posts,
  onPostClick,
  onSeeAll
}: CultureSectionProps) => {
  return (
    <section className="space-y-10 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <span className="text-2xl">🏺</span>
          </div>
          <div>
            <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter italic leading-none">Histoire & <span className="text-amber-500">Culture</span></h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">L'âme des peuples, le coeur du continent</p>
          </div>
        </div>
        <button 
          onClick={onSeeAll}
          className="group flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-all"
        >
          Exploration <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post) => (
          <motion.div 
            key={post.id}
            whileHover={{ y: -10 }}
            onClick={() => onPostClick(post)}
            className="group cursor-pointer space-y-4"
          >
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl">
               <img 
                 src={optimizeImage(post.image || '', 800)} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                 alt={post.title}
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
               <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {post.category || 'Culture'}
                  </div>
                  <div className="flex gap-2">
                     <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-amber-500 transition-all">
                       <Heart size={14} />
                     </button>
                     <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-amber-500 transition-all">
                       <Share2 size={14} />
                     </button>
                  </div>
               </div>
            </div>
            <div className="px-2 space-y-2">
              <h3 className="font-black text-xl italic leading-tight group-hover:text-amber-600 transition-colors">{post.title}</h3>
              <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">{post.excerpt}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
