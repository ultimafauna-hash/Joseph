import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Bell, TrendingUp } from 'lucide-react';
import { Article } from '../../types';

export const AudioPlayer = ({ article }: { article: Article }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const title = article?.title || "Article";
      const author = article?.author || "Auteur inconnu";
      const excerpt = article?.excerpt || "";
      const content = article?.content || "";
      const textToSpeak = `${title}. Par ${author}. ${excerpt}. ${content.substring(0, 1000)}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fr-FR';
      utterance.onend = () => setIsPlaying(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 group">
      <button 
        onClick={togglePlay}
        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform"
      >
        {isPlaying ? <Bell size={24} className="animate-pulse" /> : <TrendingUp size={24} className="rotate-90" />}
      </button>
      <div className="flex-1 space-y-1">
         <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Écouter l'article</div>
         <div className="text-sm font-bold text-slate-700">{isPlaying ? 'Lecture en cours...' : 'Version audio disponible'}</div>
      </div>
      {isPlaying && (
        <div className="flex items-center gap-half h-4">
           {[...Array(4)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ height: [8, 16, 8] }}
               transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
               className="w-1 bg-primary rounded-full"
             />
           ))}
        </div>
      )}
    </div>
  );
};
