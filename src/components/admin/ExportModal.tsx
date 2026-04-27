import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Copy } from 'lucide-react';
import { Article, Event } from '../../types';
import { cn } from '../../lib/utils';

export const ExportModal = ({ articles, events, onClose }: { articles: Article[], events: Event[], onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [activeExport, setActiveExport] = useState<'articles' | 'events'>('articles');
  
  const articleCode = `export const MOCK_ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};`;
  const eventCode = `export const MOCK_EVENTS: Event[] = ${JSON.stringify(events, null, 2)};`;

  const code = activeExport === 'articles' ? articleCode : eventCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black italic">Code d'Exportation</h3>
            <p className="text-xs text-slate-400 font-medium">Copiez ce code et collez-le dans constants.ts</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex bg-slate-100 p-1 m-4 rounded-xl w-fit">
          <button 
            onClick={() => setActiveExport('articles')}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black transition-all",
              activeExport === 'articles' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Articles
          </button>
          <button 
            onClick={() => setActiveExport('events')}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black transition-all",
              activeExport === 'events' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Événements
          </button>
        </div>

        <div className="p-8 pt-2">
          <div className="relative">
            <textarea 
              readOnly
              className="w-full h-[350px] bg-slate-900 text-emerald-400 font-mono text-[10px] p-6 rounded-2xl outline-none"
              value={code}
            />
            <button 
              onClick={handleCopy}
              className={cn(
                "absolute top-4 right-4 px-4 py-2 rounded-xl flex items-center gap-2 font-black text-xs transition-all shadow-xl",
                copied ? "bg-emerald-500 text-white" : "bg-white text-slate-900 border border-slate-200"
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copié !" : "Copier le code"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
