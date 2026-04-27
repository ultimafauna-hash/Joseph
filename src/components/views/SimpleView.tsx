import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SimpleViewProps {
  title: string;
  content: string;
  goHome: () => void;
}

export const SimpleView = ({ title, content, goHome }: SimpleViewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto py-10 space-y-8"
    >
      <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Retour à l'accueil
      </button>
      <h2 className="text-4xl font-black">{title}</h2>
      <div className="markdown-body space-y-6">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </motion.div>
  );
};
