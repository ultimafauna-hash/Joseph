import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Twitter, Facebook, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShareFloatingButtonsProps {
  title: string;
  url: string;
}

export const ShareFloatingButtons = ({ title, url }: ShareFloatingButtonsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const shareData = [
    { 
      icon: Twitter, 
      color: 'hover:bg-[#1DA1F2]', 
      label: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    { 
      icon: Facebook, 
      color: 'hover:bg-[#4267B2]', 
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    { 
      icon: MessageSquare, 
      color: 'hover:bg-[#25D366]', 
      label: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    },
    { 
      icon: LinkIcon, 
      color: 'hover:bg-primary', 
      label: 'Copier',
      action: () => {
        navigator.clipboard.writeText(url);
        alert('Lien copié !');
      }
    }
  ];

  return (
    <div className="fixed left-6 bottom-32 z-40 hidden xl:flex flex-col gap-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl",
          isOpen ? "bg-slate-900 text-white rotate-45" : "bg-white text-slate-400 hover:text-primary border border-slate-100"
        )}
      >
        <Share2 size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-4">
            {shareData.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.url}
                target={social.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={social.action}
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 transition-all hover:text-white shadow-lg",
                  social.color
                )}
                title={social.label}
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
