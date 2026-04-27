import React, { useState, useEffect, useRef } from 'react';
import { Send, Check } from 'lucide-react';
import { ChatMessage, UserProfile } from '../../types';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

export const LiveChat = ({ articleId, user, isAdmin }: { articleId: string, user: UserProfile | null, isAdmin: boolean }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = api.subscribeToChat(articleId, (msgs: ChatMessage[]) => {
      setMessages(msgs);
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    });
    return unsub;
  }, [articleId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    const msg: Partial<ChatMessage> = {
      articleid: articleId,
      userid: user.uid,
      username: user.displayname || "Anonyme",
      userphoto: user.photourl || undefined,
      content: newMessage,
      date: new Date().toISOString(),
      isadmin: isAdmin
    };
    await api.sendChatMessage(msg);
    setNewMessage("");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[500px]">
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <h4 className="font-black text-xs uppercase tracking-widest">Chat en Direct</h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400">{messages.length} messages</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex items-start gap-3", msg.userid === user?.uid ? "flex-row-reverse" : "")}>
            <img src={msg.userphoto || "https://ui-avatars.com/api/?name="+msg.username} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
            <div className={cn("max-w-[80%] p-3 rounded-2xl text-sm", msg.userid === user?.uid ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-700 shadow-sm rounded-tl-none")}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="text-[10px] font-black opacity-50">{msg.username}</div>
                {msg.isadmin && (
                  <div className="bg-blue-500 text-white rounded-full p-px shadow-sm">
                    <Check size={8} strokeWidth={4} />
                  </div>
                )}
              </div>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={user ? "Écrire un message..." : "Connectez-vous pour chatter"}
          disabled={!user}
          className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={!user} className="p-2 bg-primary text-white rounded-xl shadow-lg disabled:opacity-50">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
