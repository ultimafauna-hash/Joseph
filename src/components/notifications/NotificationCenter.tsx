import React from 'react';
import { motion } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { AppNotification } from '../../types';
import { cn, safeFormatDate } from '../../lib/utils';

export const NotificationCenter = ({ 
  notifications, 
  onClose, 
  onMarkRead,
  onNavigate 
}: { 
  notifications: AppNotification[], 
  onClose: () => void,
  onMarkRead: (id: string) => void,
  onNavigate: (link: string) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-20 right-4 md:right-6 z-[200] w-[calc(100vw-32px)] md:w-full max-w-sm bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[70vh]"
    >
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Bell className="text-primary" size={20} /> Centre d'Alertes
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-50">
        {(notifications || []).length > 0 ? (notifications || []).map((notif) => (
          <div 
            key={notif.id}
            onClick={() => {
              if (notif.link) onNavigate(notif.link);
              onMarkRead(notif.id);
            }}
            className={cn(
              "p-5 cursor-pointer hover:bg-slate-50 transition-colors group relative",
              !notif.read && "bg-primary/[0.03]"
            )}
          >
            {!notif.read && (
              <div className="absolute top-6 left-2 w-2 h-2 bg-primary rounded-full" />
            )}
            <div className="space-y-1 ml-4">
              <div className="flex justify-between items-start gap-4">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  notif.type === 'urgent' ? "bg-red-50 text-red-500 border-red-100" : "bg-slate-100 text-slate-400 border-slate-200"
                )}>
                  {notif.topic || notif.type}
                </span>
                <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
                  {safeFormatDate(notif.date, 'HH:mm')}
                </span>
              </div>
              <h4 className={cn("text-sm font-bold leading-tight group-hover:text-primary transition-colors", !notif.read ? "text-slate-900" : "text-slate-500")}>
                {notif.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {notif.message}
              </p>
            </div>
          </div>
        )) : (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <Bell size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400">Aucune notification pour le moment.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70">
          Effacer tout l'historique
        </button>
      </div>
    </motion.div>
  );
};
