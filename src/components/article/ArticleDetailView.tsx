import React from 'react';
import { motion } from 'motion/react';
import { Clock, TrendingUp, Camera, Award, Star, Search, Globe, Send, User, Check, Flag, Heart, MessageSquare, Twitter, Facebook, Share2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn, safeFormatDate, optimizeImage, getYoutubeId } from '../../lib/utils';
import { Breadcrumb } from '../layout/Breadcrumb';
import { GoogleAd } from '../widgets/GoogleAd';
import { AudioPlayer } from '../widgets/AudioPlayer';
import { ReadAlso } from './ReadAlso';
import { RecommendedForYou } from './RecommendedForYou';
import { RelatedArticles } from './RelatedArticles';
import { PollCard } from '../widgets/PollCard';

interface ArticleDetailViewProps {
  article: any;
  onHomeClick: () => void;
  onCategoryClick: (cat: string) => void;
  onAuthorClick: (name: string) => void;
  setSearchQuery: (q: string) => void;
  onNavigateTo: (view: any) => void;
  currentUser: any;
  siteSettings: any;
  adminArticles: any[];
  onArticleClick: (article: any) => void;
  articleLikes: Record<string, number>;
  articleComments: Record<string, any[]>;
  userLikedArticles: Set<string>;
  handleLikeArticle: (id: string) => void;
  handleShareArticle: (article: any, platform?: string) => void;
  handleSaveArticle: (article: any) => void;
  handleLikeComment: (articleId: string, commentId: string) => void;
  handleReportComment: (id: string) => void;
  handleAddComment: (articleId: string, parentId?: string) => void;
  commentAuthorName: string;
  setCommentAuthorName: (name: string) => void;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  replyingTo: any;
  setReplyingTo: (rep: any) => void;
  activePoll: any;
  handleVote: (id: string, option: string) => void;
  userFollowedAuthors: Set<string>;
  handleFollowAuthor: (name: string) => void;
  userBookmarkedArticles: Set<string>;
  handleBookmarkArticle: (id: string) => void;
  setShowLoginModal: (show: boolean) => void;
  setShowPremiumModal: (show: boolean) => void;
  setActiveNotification: (notif: any) => void;
  ArticleCarousel: React.ComponentType<any>;
  ShareFloatingButtons: React.ComponentType<any>;
}

export const ArticleDetailView = ({
  article,
  onHomeClick,
  onCategoryClick,
  onAuthorClick,
  setSearchQuery,
  onNavigateTo,
  currentUser,
  siteSettings,
  adminArticles,
  onArticleClick,
  articleLikes,
  articleComments,
  userLikedArticles,
  handleLikeArticle,
  handleShareArticle,
  handleSaveArticle,
  handleLikeComment,
  handleReportComment,
  handleAddComment,
  commentAuthorName,
  setCommentAuthorName,
  newCommentText,
  setNewCommentText,
  replyingTo,
  setReplyingTo,
  activePoll,
  handleVote,
  userFollowedAuthors,
  handleFollowAuthor,
  userBookmarkedArticles,
  handleBookmarkArticle,
  setShowLoginModal,
  setShowPremiumModal,
  setActiveNotification,
  ArticleCarousel,
  ShareFloatingButtons
}: ArticleDetailViewProps) => {
  if (!article) return null;

  const isPremiumArticle = article.ispremium;
  const hasAccess = !isPremiumArticle || (currentUser && (currentUser.ispremium || currentUser.role === 'admin' || currentUser.role === 'editor'));

  return (
    <motion.div 
      key="article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <ShareFloatingButtons title={article.title} url={window.location.href} />
      
      <div className="space-y-4 text-center">
        <Breadcrumb items={[
          { label: "Accueil", onClick: onHomeClick },
          { label: article?.category || 'Actualité', onClick: () => onCategoryClick(article?.category) },
          { label: "Lecture", active: true }
        ]} />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-6xl font-display font-black leading-[1.1] tracking-tight text-slate-900 drop-shadow-sm"
        >
          {article?.title || 'Sans titre'}
        </motion.h1>
        <div className="w-24 h-2 bg-primary mx-auto rounded-full mt-6 mb-8" />
      {article?.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {article.tags.map((tag: any) => (
            <button 
              key={String(tag)}
              onClick={() => {
                setSearchQuery(String(tag));
                onNavigateTo('search');
              }}
              className="text-[10px] font-black bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary px-3 py-1 rounded-full uppercase tracking-widest transition-colors border border-slate-200"
            >
              #{String(tag)}
            </button>
          ))}
        </div>
      )}
        <div className="flex items-center justify-center gap-4 text-sm text-slate-700 font-sans">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onAuthorClick(article?.author || 'Rédaction')}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs group-hover:bg-primary group-hover:text-white transition-colors">
              {(article?.author || 'R')[0]}
            </div>
            <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{article?.author || 'Rédaction'}</span>
            {article?.authorrole && (
              <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold uppercase ml-1">
                {article.authorrole}
              </span>
            )}
          </div>
          <span>•</span>
        <span>{safeFormatDate(article?.date, 'dd MMMM yyyy')}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Clock size={14} /> {article?.readingtime || '5 min'}</span>
      </div>
    </div>

    {article.audiourl && (
      <div className="bg-slate-900 rounded-[30px] p-6 text-white shadow-2xl border border-white/10 mt-8 mb-4">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary/20 rounded-2xl text-primary animate-pulse">
            <TrendingUp size={24} />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Audio / Podcast</p>
            <h4 className="font-bold text-sm italic">Écouter la version audio</h4>
            <audio controls className="w-full h-8 mt-2 accent-primary" key={article.audiourl}>
              <source src={article.audiourl} type="audio/mpeg" />
              Navigateur non supporté
            </audio>
          </div>
        </div>
      </div>
    )}

    {(article?.image || article?.video) && (
      <div className="space-y-6">
        {article?.video && getYoutubeId(article.video) && (
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5 aspect-video">
            <iframe 
              src={`https://www.youtube.com/embed/${getYoutubeId(article?.video)}`}
              title={article?.title || 'Video'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        )}
        {article?.image && (
          <div className="w-full rounded-[40px] overflow-hidden shadow-2xl bg-white border-8 border-white">
            <div className="relative">
              <img 
                id={`article-detail-img-${article?.id}`}
                src={optimizeImage(article.image, 1200)} 
                alt={article?.title || ''}
                className="w-full h-auto max-h-[85vh] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {article?.imagecredit && (
              <div className="px-8 py-4 bg-slate-900 text-[10px] font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-3 relative z-10">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <Camera size={14} />
                </div>
                <span>Crédit image : {article.imagecredit}</span>
              </div>
            )}
          </div>
        )}
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
      <div className="space-y-8">
          <div className="flex flex-col gap-6">
            <AudioPlayer article={article} />
            {article.gallery && article.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {article.gallery.map((img: string, i: number) => (
                   <div 
                     key={i} 
                     className="aspect-square rounded-2xl overflow-hidden cursor-zoom-in group relative" 
                     onClick={() => window.open(img, '_blank')}
                   >
                     <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Search size={24} className="text-white" />
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        <GoogleAd className="mb-8" />
        
        <div className="markdown-body text-base md:text-lg leading-relaxed relative text-slate-900">
          {(() => {
            const currentContent = typeof article.content === 'string' ? article.content : '';
            if (!currentContent) return <p className="text-slate-400 italic">Cet article n'a pas de contenu.</p>;
            
            const paragraphs = currentContent.split('\n\n').filter(p => p.trim().length > 0);

            if (!hasAccess && paragraphs.length > 2) {
              return (
                <div className="space-y-6">
                  <ReactMarkdown>{paragraphs.slice(0, 2).join('\n\n')}</ReactMarkdown>
                  <div className="relative z-10 py-20 px-8 rounded-[40px] bg-slate-900 text-white overflow-hidden text-center space-y-6 shadow-2xl">
                     <div className="absolute inset-0 opacity-10 safari-blur pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/20 to-transparent" />
                     </div>
                     <Award size={48} className="mx-auto text-amber-500" />
                     <h4 className="text-2xl font-black italic tracking-tighter">CONTENU RÉSERVÉ AUX MEMBRES</h4>
                     <p className="text-slate-400 text-sm max-w-xs mx-auto">Devenez membre Premium pour lire la suite de cet article exclusif et nos analyses approfondies.</p>
                     <button 
                       onClick={() => {
                         if (!currentUser) {
                           setShowLoginModal(true);
                           setActiveNotification({ message: "Veuillez vous connecter pour vous abonner.", type: 'info' });
                         } else {
                           setShowPremiumModal(true);
                         }
                       }}
                       className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                     >
                       S'ABONNER POUR LIRE LA SUITE
                     </button>
                     <div className="pt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Akwaba Premium • {siteSettings?.premiumprice || 5000} XOF / mois</div>
                  </div>
                </div>
              );
            }

            if (paragraphs.length > 3) {
              return (
                <>
                  <ReactMarkdown>{paragraphs.slice(0, 2).join('\n\n')}</ReactMarkdown>
                  <GoogleAd className="my-10" label="Publicité contextuelle" />
                  <ReactMarkdown>{paragraphs.slice(2, 4).join('\n\n')}</ReactMarkdown>
                  {adminArticles && adminArticles.length > 0 && (
                    <ReadAlso 
                      currentArticle={article} 
                      articles={adminArticles} 
                      onArticleClick={onArticleClick} 
                      onAuthorClick={onAuthorClick}
                    />
                  )}
                  <ReactMarkdown>{paragraphs.slice(4).join('\n\n')}</ReactMarkdown>
                </>
              );
            }
            
            return (
              <>
                <ReactMarkdown>{currentContent}</ReactMarkdown>
                {adminArticles && adminArticles.length > 0 && (
                  <ReadAlso 
                    currentArticle={article} 
                    articles={adminArticles} 
                    onArticleClick={onArticleClick} 
                    onAuthorClick={onAuthorClick}
                  />
                )}
              </>
            );
          })()}

          <RecommendedForYou 
            articles={adminArticles} 
            history={[]} 
            onArticleClick={onArticleClick} 
            onAuthorClick={onAuthorClick}
          />
        </div>

        <GoogleAd className="my-8" label="Publicité ciblée" />

        {article.source && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dotted border-slate-200">
            <Globe size={14} /> Source : {article.source}
          </div>
        )}

        {/* Engagement / Réactions */}
        <div className="mt-12 pt-8 border-t border-slate-100 space-y-8">
          <div className="flex flex-col items-center gap-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Quelle est votre réaction ?</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: '🔥', label: 'Feu', key: 'fire' },
                { icon: '👏', label: 'Bravo', key: 'bravo' },
                { icon: '😮', label: 'Surpris', key: 'wow' },
                { icon: '😢', label: 'Triste', key: 'sad' },
                { icon: '🤨', label: 'Doute', key: 'think' }
              ].map((react) => (
                <button 
                  key={react.key}
                  onClick={() => {
                    const currentReactions = article.reactions || {};
                    const newValue = (currentReactions[react.key] || 0) + 1;
                    handleSaveArticle({
                      ...article,
                      reactions: { ...currentReactions, [react.key]: newValue }
                    });
                    setActiveNotification({ message: `Vous avez réagi avec ${react.icon} !`, type: 'info' });
                  }}
                  className="bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all flex flex-col items-center gap-1 group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform">{react.icon}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{article.reactions?.[react.key] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => handleLikeArticle(article.id)}
                className={cn(
                  "flex items-center gap-2 transition-colors group",
                  userLikedArticles.has(article.id) ? "text-red-500" : "text-slate-500 hover:text-primary"
                )}
              >
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  userLikedArticles.has(article.id) ? "bg-red-50" : "bg-slate-100 group-hover:bg-primary/10"
                )}>
                  <Heart size={24} fill={userLikedArticles.has(article.id) ? "currentColor" : "none"} />
                </div>
                <span className="font-bold">{(article.likes || 0) + (articleLikes[article.id] || 0)}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group">
                <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
                  <MessageSquare size={24} />
                </div>
                <span className="font-bold">{(article.commentscount || 0) + (articleComments[article.id]?.length || 0)}</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Partager l'article</span>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, color: 'bg-[#1DA1F2]', action: () => handleShareArticle(article, 'twitter'), label: 'Twitter' },
                  { icon: Facebook, color: 'bg-[#4267B2]', action: () => handleShareArticle(article, 'facebook'), label: 'Facebook' },
                  { icon: Share2, color: 'bg-primary', action: () => handleShareArticle(article), label: 'Partage' }
                ].map((social, i) => (
                  <motion.button 
                    key={i}
                    whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 5 : -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={social.action}
                    className={cn(
                      "w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transition-all",
                      social.color
                    )}
                    title={social.label}
                  >
                    <social.icon size={20} />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <GoogleAd className="mt-12" label="Annonce sponsorisée" />

        {/* Comments Section */}
        <div className="mt-12 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black">Commentaires</h3>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold uppercase">
              Modération active
            </span>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            {articleComments[article.id]?.length > 0 ? (
               <div className="space-y-6">
                  {articleComments[article.id].filter(c => !c.parentid).map(comment => (
                    <div key={comment.id} className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-black shrink-0">
                          {(comment.username || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex justify-between items-center">
                              <span className="font-bold text-sm">{comment.username}</span>
                              <span className="text-[10px] text-slate-400">{safeFormatDate(comment.date, 'dd MMM yyyy')}</span>
                           </div>
                           <p className="text-sm text-slate-600">{comment.content}</p>
                           <div className="flex items-center gap-4">
                             <button onClick={() => setReplyingTo({ commentId: comment.id, username: comment.username })} className="text-xs font-bold text-primary">Répondre</button>
                             <button onClick={() => handleLikeComment(article.id, comment.id)} className="text-xs font-bold text-slate-400">J'aime ({comment.likes || 0})</button>
                             <button onClick={() => handleReportComment(comment.id)} className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Signaler</button>
                           </div>
                        </div>
                      </div>
                      {/* Sub-replies could go here */}
                    </div>
                  ))}
               </div>
            ) : (
              <p className="text-slate-400 text-center py-6 italic">Soyez le premier à commenter cet article.</p>
            )}

            {/* Comment Form */}
            <div id="comment-form" className="pt-6 border-t border-slate-100 space-y-4">
              {replyingTo && (
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500">En réponse à <span className="font-bold text-primary">@{replyingTo.username}</span></span>
                  <button onClick={() => setReplyingTo(null)} className="text-slate-400"><X size={14} /></button>
                </div>
              )}
              <input 
                type="text" 
                placeholder="Votre nom..." 
                value={commentAuthorName}
                onChange={(e) => setCommentAuthorName(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex gap-3 items-end">
                <textarea 
                  placeholder="Ajouter un commentaire..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={2}
                  className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <button 
                  onClick={() => handleAddComment(article.id, replyingTo?.commentId)}
                  disabled={!newCommentText.trim() || !commentAuthorName.trim()}
                  className="bg-primary text-white p-4 rounded-xl disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden lg:block space-y-8">
        <div className="sticky top-24 space-y-8">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-primary">
               <Award size={20} />
               <span className="font-black text-xs uppercase tracking-widest">Auteur</span>
            </div>
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onAuthorClick(article.author)}
            >
               <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                 {(article.author || 'R')[0]}
               </div>
               <div className="flex-1">
                  <div className="font-bold text-sm group-hover:text-primary transition-colors">{article.author}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{article.authorrole || 'Journaliste'}</div>
               </div>
            </div>
            <button 
              onClick={() => handleFollowAuthor(article.author)}
              className={cn(
                "w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                userFollowedAuthors.has(article.author) ? "bg-slate-200 text-slate-500" : "bg-primary text-white shadow-lg shadow-primary/20"
              )}
            >
              {userFollowedAuthors.has(article.author) ? 'Suivi' : 'S\'abonner'}
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Articles Similaires</h4>
            {adminArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3).map(sim => (
              <div key={sim.id} onClick={() => onArticleClick(sim)} className="cursor-pointer group flex gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={optimizeImage(sim.image || '', 300)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h5 className="font-bold text-xs leading-tight group-hover:text-primary transition-colors line-clamp-2">{sim.title}</h5>
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">{safeFormatDate(sim.date, 'dd MMM yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
          
          {activePoll && (
            <PollCard 
              poll={activePoll} 
              onVote={handleVote} 
              hasVoted={(currentUser?.votedpolls || []).includes(activePoll.id)} 
            />
          )}
          <GoogleAd className="h-[250px]" label="Annonce" />
        </div>
      </aside>
    </div>

    <RelatedArticles 
      currentArticle={article}
      articles={adminArticles}
      onArticleClick={onArticleClick}
      onBookmark={(e, id) => handleBookmarkArticle(id)}
      bookmarkedIds={userBookmarkedArticles}
      onAuthorClick={onAuthorClick}
    />

    <ArticleCarousel 
      articles={adminArticles.filter(a => a.id !== article.id)}
      onArticleClick={onArticleClick}
      onBookmark={(e, id) => handleBookmarkArticle(id)}
      bookmarkedIds={userBookmarkedArticles}
      onAuthorClick={onAuthorClick}
    />
  </motion.div>
  );
};
