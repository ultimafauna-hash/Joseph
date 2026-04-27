import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headset, X, ChevronDown, Check, User, MessageSquare, Send } from 'lucide-react';
import { UserProfile, SupportMessage } from '../../types';
import { cn, safeFormatDate, playNotificationSound } from '../../lib/utils';
import api from '../../lib/api';

export const SupportChatWidget = ({ user, isDarkMode }: { user: UserProfile | null, isDarkMode: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && isOpen) {
      const unsub = api.subscribeToSupportMessages(user.uid, (msgs) => {
        setMessages(msgs);
      });
      return () => unsub();
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      const isRecent = new Date(last.date).getTime() > Date.now() - 5000;
      if (last.isadmin && isRecent) {
        playNotificationSound('message');
      }
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    const msg: SupportMessage = {
      id: Date.now().toString(),
      userid: user.uid,
      username: user.displayname || 'Utilisateur',
      userphoto: user.photourl || undefined,
      content: text,
      date: new Date().toISOString(),
      isadmin: false
    };
    setText('');
    try {
      await api.sendSupportMessage(msg);
    } catch (e) {
      console.error("Support chat error:", e);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-[200] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
              "w-[calc(100vw-48px)] max-w-[400px] h-[500px] md:h-[550px] max-h-[80vh] rounded-[40px] shadow-2xl border flex flex-col overflow-hidden",
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
            )}
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-primary text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl">
                  <Headset size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-black leading-tight text-lg">Support Akwaba</h4>
                    <div className="bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-70">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-[10px] uppercase font-black tracking-widest">En ligne</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <ChevronDown size={24} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 african-pattern no-scrollbar">
              {!user ? (
                <div className="text-center py-10 space-y-6">
                   <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary/20">
                     <User size={40} />
                   </div>
                   <div className="space-y-4">
                     <p className="text-base font-black text-slate-800">Connectez-vous pour parler au support</p>
                     <p className="text-xs text-slate-400 font-bold max-w-[200px] mx-auto">Vous devez être identifié pour envoyer des messages en direct.</p>
                     <button 
                       onClick={() => {
                         setIsOpen(false);
                         document.querySelector<HTMLButtonElement>('[data-login-btn]')?.click();
                       }}
                       className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-xs"
                     >
                       Se connecter
                     </button>
                   </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 space-y-6">
                   <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary/20">
                     <MessageSquare size={40} />
                   </div>
                   <div className="space-y-2">
                     <p className="text-base font-black text-slate-800">Besoin d'aide ?</p>
                     <p className="text-xs text-slate-400 font-bold max-w-[200px] mx-auto">Posez votre question, notre équipe vous répondra dès que possible.</p>
                   </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={cn("flex flex-col animate-in fade-in slide-in-from-bottom-2", msg.isadmin ? "items-start" : "items-end")}>
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed",
                      msg.isadmin 
                        ? "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm" 
                        : "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10"
                    )}>
                      {msg.content}
                    </div>
                    <div className={cn("flex items-center gap-1.5 mt-2 opacity-60", msg.isadmin ? "flex-row" : "flex-row-reverse")}>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight">
                        {msg.isadmin ? "Support Akwaba" : "Moi"} • {safeFormatDate(msg.date, 'HH:mm')}
                      </span>
                      {msg.isadmin && (
                        <div className="bg-blue-500 text-white rounded-full p-px shadow-sm">
                          <Check size={8} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className={cn(
              "p-5 border-t flex gap-3",
              isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"
            )}>
              <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Écrivez ici..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3.5 text-base font-medium focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!text.trim() || !user}
                className="p-3.5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(255,103,33,0.3)] transition-all hover:scale-110 active:scale-90 relative",
          isOpen ? "bg-slate-900 text-white" : "bg-primary text-white"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <Headset size={24} />}
          </motion.div>
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
};
