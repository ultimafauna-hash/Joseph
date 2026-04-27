import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Heart, 
  Share2, 
  Clock, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft,
  ArrowUp,
  Home,
  Globe,
  Map,
  MapPin,
  User,
  Mail,
  Camera,
  MessageSquare,
  X,
  Send,
  CreditCard,
  Smartphone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  TrendingUp,
  Filter,
  Bell,
  BellRing,
  Languages,
  Calendar,
  Lock,
  Plus,
  Trash,
  Edit3,
  Save,
  FileText,
  LogOut,
  LayoutDashboard,
  Settings,
  Copy,
  Check,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  MonitorOff,
  Youtube,
  Music,
  Bookmark,
  Activity,
  Award,
  Flag,
  Sun,
  Moon,
  Headset,
  History as HistoryIcon,
  ChevronDown,
  Map as MapIcon,
  Monitor,
  Video,
  Play,
  Hash,
  Download,
  Printer,
  Smartphone as Phone,
  ChevronUp,
  Star,
  Radio,
  Shield,
  ShoppingBag,
  Info,
  ExternalLink,
  List as ListIcon,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import confetti from 'canvas-confetti';
import { MOCK_ARTICLES, MOCK_EVENTS, MOCK_AUTHORS, MOCK_CULTURE } from './constants';
import { Article, Comment, Event, UserProfile, SiteSettings, Subscriber, MediaAsset, Poll, Classified, LiveBlog, AppNotification, SupportMessage, ChatMessage, Transaction, Author, WebTV, CulturePost, AdminActivityLog } from './types';
import { cn, optimizeImage, getYoutubeId, safeFormatDate, safeStorage, safeSession, playNotificationSound } from './lib/utils';
import { AdminLogin, AdminDashboard, AdminEditor, ExportModal, PollEditor, LiveBlogEditor, WebTVEditor, ClassifiedEditor, CulturePostEditor, AuthorEditor } from './components/Admin';
import { Skeleton, ArticleSkeleton } from './components/Skeleton';
import { HeroSlideshow } from './components/home/HeroSlideshow';
import { FeaturedSection } from './components/home/FeaturedSection';
import { TrendingSection } from './components/home/TrendingSection';
import { ExchangeRatesWidget } from './components/widgets/ExchangeRatesWidget';
import { WebTVView } from './components/widgets/WebTVView';
import { PulseSidebar } from './components/PulseSidebar';
import { QuizMini } from './components/QuizMini';
import { MapMini } from './components/MapMini';
import { AuthModal } from './components/AuthModal';
import { AuthorProfile } from './components/AuthorProfile';
import { AuthorsList } from './components/AuthorsList';
import { CultureSection, CultureDetailView, CultureCard } from './components/Culture';
import { PreferenceSelector } from './components/PreferenceSelector';
import { UserProfileTabs } from './components/Profile/UserProfileTabs';
import { NewsletterSignup } from './components/NewsletterSignup';
import { NewsletterModal } from './components/NewsletterModal';
import { SplashScreen } from './components/layout/SplashScreen';
import { Footer } from './components/layout/Footer';
import { TopNotice } from './components/layout/TopNotice';
import { CookieBanner } from './components/layout/CookieBanner';
import { MobileMenu } from './components/layout/MobileMenu';
import { RubricNav } from './components/layout/RubricNav';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { SupportChatWidget } from './components/support/SupportChatWidget';
import { PostClassifiedModal } from './components/classifieds/PostClassifiedModal';
import { AudioPlayer } from './components/widgets/AudioPlayer';
import { GoogleAd } from './components/widgets/GoogleAd';
import { PollCard } from './components/widgets/PollCard';
import { ReadAlso } from './components/article/ReadAlso';
import { RelatedArticles } from './components/article/RelatedArticles';
import { RecommendedForYou } from './components/article/RecommendedForYou';
import { LiveChat } from './components/article/LiveChat';
import { FlashInfo } from './components/layout/FlashInfo';
import { HomeView } from './components/home/HomeView';
import { ArticleDetailView } from './components/article/ArticleDetailView';
import { SearchView } from './components/views/SearchView';
import { DonateView } from './components/views/DonateView';
import { ContactView } from './components/views/ContactView';
import { SimpleView } from './components/views/SimpleView';
import { ArticleCarousel } from './components/article/ArticleCarousel';
import { ShareFloatingButtons } from './components/article/ShareFloatingButtons';
import { Breadcrumb } from './components/layout/Breadcrumb';
import { WeatherWidget } from './components/widgets/WeatherWidget';
import { ArticleCard } from './components/article/ArticleCard';
import { EventSection } from './components/home/EventSection';
import { EventDetailView } from './components/views/EventDetailView';
import { LiveBlogView } from './components/views/LiveBlogView';
import { ClassifiedsView } from './components/views/ClassifiedsView';
import { UnsubscribeView } from './components/views/UnsubscribeView';
import { PremiumModal } from './components/layout/PremiumModal';
import { AllEventsView } from './components/views/AllEventsView';
import api, { onAuthStateChanged } from './lib/api';
import { AdminLoginModal } from './components/AdminLoginModal';
// type FirebaseUser = any; 

// --- Components ---



// --- Helper Functions ---

// playNotificationSound removed (using imports)









// --- Main App ---


// State persistence helpers removed (using imports)

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'search' | 'donate' | 'about' | 'privacy' | 'terms' | 'contact' | 'cookies' | 'event' | 'all-events' | 'admin' | 'admin-login' | 'webtv' | 'profile' | 'classifieds' | 'live-blog' | 'author-profile' | 'authors' | 'unsubscribe' | 'culture-detail' | 'all-culture' | 'quiz' | 'map' | 'culture-posts'>(() => {
    const saved = safeStorage.get('akwaba_current_view');
    if (saved === 'article') {
      // Only allow article view if we have an article ID saved
      return safeStorage.get('akwaba_selected_article_id') ? 'article' : 'home';
    }
    return (saved as any) || 'home';
  });

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    const savedId = safeStorage.get('akwaba_selected_article_id');
    if (savedId) {
      try {
        const savedArticlesStr = safeStorage.get('akwaba_admin_articles');
        const articles = savedArticlesStr ? JSON.parse(savedArticlesStr) : MOCK_ARTICLES;
        // Search by ID first, then by slug
        return articles.find((a: Article) => a.id === savedId || a.slug === savedId) || 
               MOCK_ARTICLES.find(a => a.id === savedId || a.slug === savedId) || 
               null;
      } catch (e) {
        console.error("Error loading selected article:", e);
        return MOCK_ARTICLES.find(a => a.id === savedId || a.slug === savedId) || null;
      }
    }
    return null;
  });
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [adminArticles, setAdminArticles] = useState<Article[]>(() => {
    try {
      const saved = safeStorage.get('akwaba_admin_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_ARTICLES;
      }
      return MOCK_ARTICLES;
    } catch {
      return MOCK_ARTICLES;
    }
  });
  const [adminEvents, setAdminEvents] = useState<Event[]>(() => {
    try {
      const saved = safeStorage.get('akwaba_admin_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_EVENTS;
      }
      return MOCK_EVENTS;
    } catch {
      return MOCK_EVENTS;
    }
  });

  const [adminCulturePosts, setAdminCulturePosts] = useState<CulturePost[]>(() => {
    try {
      const saved = safeStorage.get('akwaba_admin_culture');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_CULTURE;
      }
      return MOCK_CULTURE;
    } catch {
      return MOCK_CULTURE;
    }
  });

  const [selectedCulturePost, setSelectedCulturePost] = useState<CulturePost | null>(null);
  const [editingCulturePost, setEditingCulturePost] = useState<CulturePost | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [adminPolls, setAdminPolls] = useState<Poll[]>([]);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [adminLiveBlogs, setAdminLiveBlogs] = useState<LiveBlog[]>([]);
  const [editingLiveBlog, setEditingLiveBlog] = useState<LiveBlog | null>(null);
  const [editingClassified, setEditingClassified] = useState<Classified | null>(null);
  const [adminWebTV, setAdminWebTV] = useState<WebTV[]>([]);
  const [adminAuthors, setAdminAuthors] = useState<Author[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserProfile[]>([]);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editingWebTV, setEditingWebTV] = useState<WebTV | null>(null);
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState('À LA UNE');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(() => {
    return !safeSession.get('akwaba_splash_shown');
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>('5000');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [showClassifiedsModal, setShowClassifiedsModal] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('articles');
  const [isRubricsOpen, setIsRubricsOpen] = useState(false);
  
  const [activeNotification, setActiveNotification] = useState<string | {message: string, type: 'success' | 'urgent' | 'info'} | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    abouttext: "Akwaba Info est votre source de référence pour l'actualité en Afrique et dans le monde.",
    email: "contact@akwabainfo.com",
    phone: "+225 00 00 00 00",
    address: "Abidjan, Côte d'Ivoire",
    facebookurl: "https://facebook.com",
    twitterurl: "https://twitter.com",
    instagramurl: "https://instagram.com",
    tiktokurl: "https://tiktok.com",
    linkedinurl: "https://linkedin.com",
    youtubeurl: "https://youtube.com",
    categories: ['À LA UNE', 'INFO PAR PAYS', 'AFRIQUE', 'MONDE', 'COMMUNIQUÉS', 'SONDAGE', 'NOS THEMES'],
    categories_icons: {
      'À LA UNE': '🔥',
      'INFO PAR PAYS': '🌍',
      'AFRIQUE': '🌍',
      'MONDE': '🌐',
      'COMMUNIQUÉS': '📣',
      'SONDAGE': '📊',
      'NOS THEMES': '📚'
    },
    maintenancemode: false,
    urgentbanneractive: false,
    urgentbannertext: "",
    flashnews: "Côte d'Ivoire : Lancement d'un nouveau programme de soutien aux startups technologiques à Abidjan.;Économie : La ZLECAf annonce une progression record des échanges intra-africains pour le premier trimestre.;Sport : Les préparatifs de la prochaine CAN avancent à grands pas, inspection des stades terminée.;Culture : Le festival des musiques urbaines d'Anoumabo (FEMUA) dévoile sa programmation internationale.;Monde : Sommet extraordinaire de l'Union Africaine sur la sécurité alimentaire prévu le mois prochain.",
    // Donations & Premium
    donationamounts: [5000, 10000, 25000],
    donationpaymentmethods: ['PayPal', 'Orange Money', 'Wave', 'MTN', 'Moov', 'Stripe', 'Flutterwave'],
    premiumprice: 5000,
    isdonationactive: true,
    ispremiumactive: true,
    activepaymentmethods: {
      paypal: true,
      stripe: true,
      flutterwave: true,
      orangeMoney: true,
      mtn: true,
      moov: true,
      wave: true
    },
    paymentlinks: {
      paypal: "",
      stripe: "",
      flutterwave: "",
      orangeMoney: "",
      mtn: "",
      moov: "",
      wave: ""
    },
    orangemoneynumber: "0707070707",
    mtnmoneynumber: "0505050505",
    moovmoneynumber: "0101010101",
    wavenumber: "0708091011",
    premiumdurationmonths: 1
  });

  const RUBRICS = useMemo(() => [
    { label: 'À LA UNE', id: 'trending', icon: '🔥' },
    { label: 'INFO PAR PAYS', id: 'countries', icon: '🌍', sub: siteSettings.countries && siteSettings.countries.length > 0 ? siteSettings.countries : ["Côte d'Ivoire", "Burkina Faso", "Mali", "Sénégal", "Guinée", "Niger", "Togo", "Gabon", "Cameroun", "Bénin"] },
    { label: 'AFRIQUE', id: 'africa', icon: '🌍' },
    { label: 'MONDE', id: 'world', icon: '🌐' },
    { label: 'COMMUNIQUÉS', id: 'communiques', icon: '📣' },
    { label: 'SONDAGE', id: 'polls', icon: '📊' },
    { label: 'NOS THEMES', id: 'themes', icon: '📚', sub: siteSettings.categories && siteSettings.categories.length > 0 ? siteSettings.categories : ['Politique', 'Société', 'Sport', 'Économie', 'Culture', 'Histoire', 'Santé', 'Science', 'Tech', 'Éducation', 'Environnement'] }
  ], [siteSettings.countries, siteSettings.categories]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminActivityLog[]>([]);

  useEffect(() => {
    // Pick first active payment method as default for donation view
    if (siteSettings.activepaymentmethods) {
      const firstActive = Object.entries(siteSettings.activepaymentmethods).find(([_, active]) => active)?.[0];
      if (firstActive && !selectedPayment) setSelectedPayment(firstActive);
    }
  }, [siteSettings.activepaymentmethods, selectedPayment]);

  const getPaymentIcon = (method: string, isSelected: boolean) => {
    const className = isSelected ? "text-primary" : "text-slate-400";
    switch(method) {
      case 'paypal': return <Globe size={24} className={className} />;
      case 'stripe': return <CreditCard size={24} className={className} />;
      case 'flutterwave': return <CreditCard size={24} className={className} />;
      case 'visa': return <CreditCard size={24} className={className} />;
      case 'mastercard': return <CreditCard size={24} className={className} />;
      case 'orangeMoney': return <Smartphone size={24} className={className} />;
      case 'wave': return <Smartphone size={24} className={className} />;
      case 'mtn': return <Smartphone size={24} className={className} />;
      case 'moov': return <Smartphone size={24} className={className} />;
      default: return <CreditCard size={24} className={className} />;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch(method) {
      case 'paypal': return 'PayPal';
      case 'stripe': return 'Stripe';
      case 'visa': return 'Visa';
      case 'mastercard': return 'MasterCard';
      case 'flutterwave': return 'Flutterwave';
      case 'orangeMoney': return 'Orange Money';
      case 'wave': return 'Wave';
      case 'mtn': return 'MTN Money';
      case 'moov': return 'Moov Money';
      default: return method;
    }
  };
  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>([]);
  const [classifieds, setClassifieds] = useState<Classified[]>([]);
  const [liveBlogs, setLiveBlogs] = useState<LiveBlog[]>([]);
  const [activeLiveBlog, setActiveLiveBlog] = useState<LiveBlog | null>(null);
  const [exchangeRates, setExchangeRates] = useState<any>({
    "EUR/XOF": 655.95,
    "USD/XOF": 612.45,
    "GBP/XOF": 774.20,
    "NGN/XOF": 0.42
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/EUR');
        const data = await res.json();
        if (data && data.rates && data.rates.XOF) {
          setExchangeRates({
            'EUR/XOF': data.rates.XOF,
            'USD/XOF': data.rates.XOF / data.rates.USD,
            'GBP/XOF': data.rates.XOF / data.rates.GBP,
            'NGN/XOF': data.rates.XOF / data.rates.NGN
          });
        }
      } catch (e) {
        console.error("Exchange rate fetch error:", e);
      }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);
  const [activePoll, setActivePoll] = useState<Poll | null>({
    id: 'poll-1',
    question: "Pensez-vous que la technologie peut transformer l'éducation en Afrique ?",
    options: [
      { id: '1', text: "Oui, absolument", votes: 450 },
      { id: '2', text: "Peut-être, avec des moyens", votes: 230 },
      { id: '3', text: "Non, pas encore", votes: 120 }
    ],
    startdate: new Date().toISOString(),
    active: true
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const unreadNotifsCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  // Persist important state
  useEffect(() => {
    safeStorage.set('akwaba_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    safeStorage.set('akwaba_is_admin', isAdminAuthenticated.toString());
  }, [isAdminAuthenticated]);

  useEffect(() => {
    safeStorage.set('akwaba_admin_articles', JSON.stringify(adminArticles));
  }, [adminArticles]);

  useEffect(() => {
    safeStorage.set('akwaba_admin_events', JSON.stringify(adminEvents));
  }, [adminEvents]);

  useEffect(() => {
    if (selectedArticle) {
      safeStorage.set('akwaba_selected_article_id', selectedArticle.id);
    } else {
      safeStorage.remove('akwaba_selected_article_id');
    }
  }, [selectedArticle]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      api.getPolls().then(data => setAdminPolls(Array.isArray(data) ? data : [])).catch(console.error);
      api.getLiveBlogs().then(data => setAdminLiveBlogs(Array.isArray(data) ? data : [])).catch(console.error);
      api.getWebTV().then(data => setAdminWebTV(Array.isArray(data) ? data : [])).catch(console.error);
      api.getAdminStats()
        .then(data => setAdminStats(data && !Array.isArray(data) ? data : { error: true }))
        .catch(err => {
          console.error("Erreur stats:", err);
          setAdminStats({ error: true });
        });
      api.getAdminActivityLog().then(data => setAdminLogs(Array.isArray(data) ? data : [])).catch(console.error);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    // Sync active poll for public view
    if (adminPolls.length > 0) {
      const latestActive = adminPolls.find(p => p.active);
      if (latestActive) setActivePoll(latestActive);
    }
  }, [adminPolls]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = api.subscribeToNotifications(currentUser.uid, (notifs: any) => {
        if (!Array.isArray(notifs)) {
          setNotifications([]);
          return;
        }
        setNotifications(notifs);
        // Show the latest unread notification as a toast if it's new
        const latest = notifs.find(n => !n.read);
        if (latest && latest.date > new Date(Date.now() - 1000 * 60).toISOString()) {
            setActiveNotification({ message: latest.title, type: latest.type === 'urgent' ? 'urgent' : 'info' });
            playNotificationSound(latest.type === 'urgent' ? 'urgent' : 'info');
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = api.subscribeToArticles((article) => {
      if (article.category === 'Urgent') {
        playNotificationSound('urgent');
        setActiveNotification({ message: `URGENT : ${article.title}`, type: 'urgent' });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      setActiveNotification({ 
        message: "Paiement réussi ! Un administrateur va valider votre transaction sous peu.", 
        type: 'success' 
      });
      setTimeout(() => setActiveNotification(null), 5000);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleMarkNotificationAsRead = async (id: string) => {
    await api.markNotificationAsRead(id);
  };

  const handlePostClassified = async (data: any) => {
    if (!currentUser) return;
    const newAd: Classified = {
      id: Date.now().toString(),
      userid: currentUser.uid,
      username: currentUser.displayname || 'Anonyme',
      title: data.title || '',
      description: data.description || '',
      price: data.price,
      category: data.category as any || 'divers',
      location: data.location || '',
      contact: data.contact || currentUser.email || 'N/A',
      imageurl: data.imageurl,
      date: new Date().toISOString(),
      status: 'active'
    };
    
    try {
      await api.saveClassified(newAd);
      setClassifieds(prev => [newAd, ...prev]);
      setShowClassifiedsModal(false);
      setActiveNotification("Annonce publiée avec succès !");
      setTimeout(() => setActiveNotification(null), 3000);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la publication de l'annonce.");
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }

    // Check if user has already voted
    const profile = await api.getUserProfile(currentUser.uid);
    if (profile && profile.votedpolls?.includes(pollId)) {
      alert("Vous avez déjà voté pour ce sondage.");
      return;
    }
    
    try {
      await api.submitVote(pollId, optionId);
      
      // Update local state if it's the active poll
      if (activePoll && activePoll.id === pollId) {
        const updatedOptions = activePoll.options.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        setActivePoll({ ...activePoll, options: updatedOptions });
      }
      
      // Update the adminPolls list to reflect the new vote count
      setAdminPolls(prev => prev.map(p => {
        if (p.id === pollId) {
          return {
            ...p,
            options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
          };
        }
        return p;
      }));
      
      // Update currentUser locally to prevent double voting UI-side immediately
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          votedpolls: [...(currentUser.votedpolls || []), pollId]
        });
      }

      setActiveNotification("Vote enregistré ! Merci.");
    } catch (error) {
      console.error("Poll vote error:", error);
    }
  };
  
  // Persistence Logic
  const [articleComments, setArticleComments] = useState<Record<string, Comment[]>>(() => {
    const saved = safeStorage.get('akwaba_comments');
    try {
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>(() => {
    const saved = safeStorage.get('akwaba_likes');
    try {
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [userLikedArticles, setUserLikedArticles] = useState<Set<string>>(() => {
    const saved = safeStorage.get('akwaba_user_likes');
    try {
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [userBookmarkedArticles, setUserBookmarkedArticles] = useState<Set<string>>(() => {
    const saved = safeStorage.get('akwaba_user_bookmarks');
    try {
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [userFollowedAuthors, setUserFollowedAuthors] = useState<Set<string>>(() => {
    const saved = safeStorage.get('akwaba_user_followed_authors');
    try {
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [userFollowedCategories, setUserFollowedCategories] = useState<Set<string>>(() => {
    const saved = safeStorage.get('akwaba_user_followed_categories');
    try {
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const [userInterests, setUserInterests] = useState<string[]>(() => {
    const saved = safeStorage.get('akwaba_user_interests');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [userPoints, setUserPoints] = useState(0);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchViewMode, setSearchViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearching, setIsSearching] = useState(false);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string, username: string } | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthorName, setCommentAuthorName] = useState('');

  useEffect(() => {
    safeStorage.set('akwaba_comments', JSON.stringify(articleComments));
  }, [articleComments]);

  useEffect(() => {
    safeStorage.set('akwaba_likes', JSON.stringify(articleLikes));
  }, [articleLikes]);

  useEffect(() => {
    safeStorage.set('akwaba_user_likes', JSON.stringify(Array.from(userLikedArticles)));
  }, [userLikedArticles]);

  useEffect(() => {
    safeStorage.set('akwaba_user_followed_categories', JSON.stringify(Array.from(userFollowedCategories)));
  }, [userFollowedCategories]);

  useEffect(() => {
    safeStorage.set('akwaba_user_interests', JSON.stringify(userInterests));
  }, [userInterests]);

  useEffect(() => {
    safeStorage.set('akwaba_admin_articles', JSON.stringify(adminArticles));
  }, [adminArticles]);

  useEffect(() => {
    safeStorage.set('akwaba_admin_events', JSON.stringify(adminEvents));
  }, [adminEvents]);

  const currentViewRef = useRef(currentView);
  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  // Sync state with URL for deep linking and back button support
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    
    if (path === '/') {
      setCurrentView('home');
    } else if (path.startsWith('/article/')) {
      const slug = parts[1];
      if (slug) {
        // Always switch to article view when path matches
        setCurrentView('article');
        const article = adminArticles.find(a => (a.slug || a.id) === slug);
        if (article) {
          setSelectedArticle(article);
        }
      }
    } else if (path.startsWith('/evenement/')) {
      const slug = parts[1];
      if (slug) {
        setCurrentView('event');
        const event = adminEvents.find(e => (e.slug || e.id) === slug);
        if (event) {
          setSelectedEvent(event);
        }
      }
    } else if (path.startsWith('/culture/')) {
      const slug = parts[1];
      if (slug) {
        setCurrentView('culture-detail');
        const culture = adminCulturePosts.find(c => (c.slug || c.id) === slug);
        if (culture) {
          setSelectedCulturePost(culture);
        } else {
          setCurrentView('all-culture');
        }
      } else {
        setCurrentView('all-culture');
      }
    } else if (path === '/profil') {
      setCurrentView('profile');
    } else if (path === '/admin') {
      setCurrentView('admin');
    } else if (path === '/recherche') {
      setCurrentView('search');
    } else if (path === '/agenda') {
      setCurrentView('all-events');
    } else if (path === '/a-propos') {
      setCurrentView('about');
    } else if (path === '/contact') {
      setCurrentView('contact');
    } else if (path === '/donate') {
      setCurrentView('donate');
    } else if (path === '/webtv') {
      setCurrentView('webtv');
    } else if (path === '/annonces') {
      setCurrentView('classifieds');
    } else if (path === '/live') {
      setCurrentView('live-blog');
    } else if (path === '/auteurs') {
      setCurrentView('authors');
    } else if (path === '/politique-confidentialite') {
      setCurrentView('privacy');
    } else if (path === '/conditions-utilisation') {
      setCurrentView('terms');
    } else if (path === '/cookies') {
      setCurrentView('cookies');
    } else if (path === '/unsubscribe') {
      setCurrentView('unsubscribe');
    }
  }, [location.pathname, adminArticles, adminEvents, adminCulturePosts]);

  // Auth Listener & Data Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      // Use Ref to get current state without re-running effect
      const currentV = currentViewRef.current;

      if (user) {
        setCurrentUser(user);
        
        // Profile load & Premium check
        try {
          const profile = await api.getUserProfile(user.uid);
          if (profile) {
            const isActuallyPremium = await api.checkPremiumStatus(user.uid);
            
            setCurrentUser(prev => ({ 
              ...prev, 
              ispremium: isActuallyPremium,
              premiumuntil: profile.premiumuntil,
              paymentmethod: profile.paymentmethod,
              points: profile.points || 0,
              badges: profile.badges || [],
              history: profile.history || [],
              likedarticles: profile.likedarticles || [],
              bookmarkedarticles: profile.bookmarkedarticles || [],
              followedauthors: profile.followedauthors || [],
              followedcategories: profile.followedcategories || [],
              interests: profile.interests || []
            }));

            setUserPoints(profile.points || 0);
            setUserBadges(profile.badges || []);
            setUserBookmarkedArticles(new Set(profile.bookmarkedarticles || []));
            setUserFollowedAuthors(new Set(profile.followedauthors || []));
            setUserFollowedCategories(new Set(profile.followedcategories || []));
            setUserInterests(profile.interests || []);

            // Admin Detection via role
            if (profile.role === 'admin') {
              setIsAdminAuthenticated(true);
              safeStorage.set('akwaba_is_admin', 'true');
            } else {
              setIsAdminAuthenticated(false);
              safeStorage.set('akwaba_is_admin', 'false');
            }
          }
        } catch (e) {
          console.error("Profile sync error:", e);
        }
      } else {
        setCurrentUser(null);
        setIsAdminAuthenticated(false);
        safeStorage.set('akwaba_is_admin', 'false');
      }
      setIsAuthChecked(true);
    });

    // Initial Data Fetch
    const fetchData = async () => {
      try {
        const [cloudArticles, cloudEvents, cloudSettings, cloudComments, cloudSubs, cloudMedia, cloudClassifieds, cloudLiveBlogs, cloudCulture, cloudAuthors, cloudUsers] = await Promise.all([
          api.getArticles().catch(() => []),
          api.getEvents().catch(() => []),
          api.getSettings().catch(() => null),
          api.getAllComments().catch(() => []),
          api.getSubscribers().catch(() => []),
          api.getMediaLibrary().catch(() => []),
          api.getClassifieds().catch(() => []),
          api.getLiveBlogs().catch(() => []),
          api.getCulturePosts().catch(() => []),
          api.getAuthors().catch(() => []),
          api.getAllUsers().catch(() => [])
        ]);
        
        if (Array.isArray(cloudArticles)) setAdminArticles(cloudArticles);
        if (Array.isArray(cloudEvents)) setAdminEvents(cloudEvents);
        if (cloudSettings && !Array.isArray(cloudSettings)) setSiteSettings(cloudSettings);
        if (Array.isArray(cloudComments)) setAllComments(cloudComments);
        if (Array.isArray(cloudSubs)) setSubscribers(cloudSubs);
        if (Array.isArray(cloudMedia)) setMediaLibrary(cloudMedia);
        if (Array.isArray(cloudClassifieds)) setClassifieds(cloudClassifieds);
        if (Array.isArray(cloudLiveBlogs)) setLiveBlogs(cloudLiveBlogs);
        if (Array.isArray(cloudCulture)) setAdminCulturePosts(cloudCulture);
        if (Array.isArray(cloudAuthors)) setAdminAuthors(cloudAuthors.length > 0 ? cloudAuthors : MOCK_AUTHORS);
        if (Array.isArray(cloudUsers)) setAdminUsers(cloudUsers);
      } catch (error: any) {
        console.warn("Silent failure in data fetching, using cache/mocks:", error);
      } finally {
        setIsCloudLoaded(true);
      }
    };
    fetchData();

    // Safety fallback for auth and cloud loading
    const safetyTimer = setTimeout(() => {
      setIsAuthChecked(true);
      setIsCloudLoaded(true);
    }, 5000);

    return () => {
      if (typeof unsubscribe === 'function') (unsubscribe as any)();
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    // Check for payment success redirection (e.g. ?payment_success=true&method=PayPal)
    if (!isAuthChecked || !currentUser) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      const method = params.get('payment_method') || 'PayPal';
      const amount = parseInt(params.get('amount') || '0') || siteSettings.premiumprice;

      api.upgradeToPremium(currentUser.uid, method, siteSettings.premiumdurationmonths || 1)
        .then(() => {
          // Record the transaction for history
          api.recordTransaction({
            userid: currentUser.uid, 
            email: currentUser.email, 
            amount: amount, 
            method: method, 
            type: 'subscription', 
            status: 'success'
          });
          
          api.getUserProfile(currentUser.uid).then(profile => {
            setCurrentUser(prev => prev ? { 
              ...prev, 
              ispremium: true,
              premiumuntil: profile?.premiumuntil 
            } : null);
            setActiveNotification({ message: "Paiement confirmé ! Bienvenue dans le Club Premium.", type: 'success' });
            playNotificationSound('payment');
            // Cleanup URL
            window.history.replaceState({}, '', window.location.pathname);
          });
        }).catch(err => {
          console.error("Payment confirmation error:", err);
          setActiveNotification({ message: "Erreur lors de la confirmation du paiement.", type: 'urgent' });
        });
    }
  }, [isAuthChecked, currentUser, siteSettings]);

  const handleAdminLogin = async (login?: string, pass?: string) => {
    try {
      if (login && pass) {
        // Local fallback for emergency access
        if (login === 'Admin' && pass === 'Akwaba2024') {
          setIsAdminAuthenticated(true);
          sessionStorage.setItem('akwaba_admin_token', 'local_emergency_token');
          setActiveNotification({ 
            message: "Bienvenue en mode Administration (Accès de Secours) !", 
            type: 'success' 
          });
          setCurrentView('admin');
          return;
        }

        // Credential-based login
        const result = await api.adminLogin({ login, password: pass });
        if (result.token) {
          setIsAdminAuthenticated(true);
          sessionStorage.setItem('akwaba_admin_token', result.token);
          setActiveNotification({ 
            message: `Bienvenue, ${result.user?.displayname || 'Administrateur'} !`, 
            type: 'success' 
          });
          setCurrentView('admin');
        }
      } else {
        // Fallback or old method (magic link) - kept if no login/pass provided
        const adminEmail = currentUser?.email || 'akwabanewsinfo@gmail.com';
        setActiveNotification({ 
          message: `Envoi du lien d'accès sécurisé à ${adminEmail}...`, 
          type: 'info' 
        });
        await api.sendMagicLink(adminEmail);
        setActiveNotification({ 
          message: "Lien envoyé ! Veuillez vérifier votre boîte de réception pour accéder au Tableau de Bord.", 
          type: 'success' 
        });
      }
    } catch (error: any) {
      console.error("Admin Login Error:", error);
      alert("Erreur d'authentification admin : " + (error.message || "Erreur inconnue"));
    }
  };

  const handleSaveArticle = async (article: Partial<Article>) => {
    try {
      const art = article as Article;
      const result = await api.saveArticle(art);
      
      const savedArticle = { ...art, id: result.id || art.id };

      if (savedArticle.image) api.trackMedia(savedArticle.image, 'image');
      if (savedArticle.video) api.trackMedia(savedArticle.video, 'video');
      
      setAdminArticles(prev => {
        const isNew = !prev.find(a => a.id === savedArticle.id);
        if (isNew) return [savedArticle, ...prev];
        return prev.map(a => a.id === savedArticle.id ? savedArticle : a);
      });
      setEditingArticle(null);
      setActiveNotification({ message: "Article enregistré avec succès !", type: 'success' });
      setTimeout(() => setActiveNotification(null), 5000);
    } catch (error: any) {
      console.error("Error saving article:", error);
      const details = error.message || "Erreur inconnue";
      if (details.includes("Could not find the table")) {
        alert(`ERREUR CRITIQUE : La table 'articles' n'existe pas dans votre base de données.\n\nACTION REQUISE : Vérifiez que vous avez bien importé le fichier 'database.sql' dans votre base de données MySQL.`);
      } else {
        alert(`Erreur lors de la sauvegarde de l'article.\n\nDétails : ${details}\n\nNote : Vérifiez que vous êtes bien connecté et que la table 'articles' existe.`);
      }
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article du Cloud ?')) {
      try {
        await api.deleteArticle(id);
        setAdminArticles(prev => (Array.isArray(prev) ? prev : []).filter(a => a.id !== id));
        setActiveNotification({ message: "Article supprimé du Cloud.", type: 'info' });
        setTimeout(() => setActiveNotification(null), 3000);
      } catch (error: any) {
        console.error("Error deleting article:", error);
        alert(`Impossible de supprimer l'article.\n\nDétails : ${error.message || "Erreur inconnue"}`);
      }
    }
  };

  const handleSaveCulturePost = async (post: CulturePost) => {
    try {
      await api.saveCulturePost(post);
      setAdminCulturePosts(prev => {
        const index = prev.findIndex(p => p.id === post.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = post;
          return next;
        }
        return [post, ...prev];
      });
      setEditingCulturePost(null);
      setActiveNotification({ message: "Post culture enregistré avec succès !", type: 'success' });
      playNotificationSound('info');
    } catch (error) {
      console.error(error);
      setActiveNotification({ message: "Erreur lors de l'enregistrement.", type: 'urgent' });
    }
  };

  const handleDeleteCulturePost = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce post ?")) return;
    try {
      await api.deleteCulturePost(id);
      setAdminCulturePosts(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== id));
      setActiveNotification({ message: "Post culture supprimé.", type: 'success' });
    } catch (error) {
       console.error(error);
       setActiveNotification({ message: "Erreur lors de la suppression.", type: 'urgent' });
    }
  };

  const handleSaveAuthor = async (author: Author) => {
    try {
      await api.saveAuthor(author);
      setAdminAuthors(prev => {
        const isNew = !prev.find(a => a.id === author.id);
        if (isNew) return [...prev, author];
        return prev.map(a => a.id === author.id ? author : a);
      });
      setEditingAuthor(null);
      setActiveNotification({ message: "Auteur enregistré avec succès !", type: 'success' });
    } catch (error) {
      console.error(error);
      setActiveNotification({ message: "Erreur lors de l'enregistrement.", type: 'urgent' });
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet auteur ?")) return;
    try {
      await api.deleteAuthor(id);
      setAdminAuthors(prev => (Array.isArray(prev) ? prev : []).filter(a => a.id !== id));
      setActiveNotification({ message: "Auteur supprimé.", type: 'success' });
    } catch (error) {
      console.error(error);
      setActiveNotification({ message: "Erreur lors de la suppression.", type: 'urgent' });
    }
  };

  const handleSaveEvent = async (event: Partial<Event>) => {
    try {
      const ev = event as Event;
      const result = await api.saveEvent(ev);
      
      const savedEvent = { ...ev, id: result.id || ev.id };

      if (savedEvent.image) api.trackMedia(savedEvent.image, 'image');
      if (savedEvent.video) api.trackMedia(savedEvent.video, 'video');
      
      setAdminEvents(prev => {
        const isNew = !prev.find(e => e.id === savedEvent.id);
        if (isNew) return [savedEvent, ...prev];
        return prev.map(e => e.id === savedEvent.id ? savedEvent : e);
      });
      setEditingEvent(null);
      setActiveNotification({ message: "Événement enregistré avec succès !", type: 'success' });
      setTimeout(() => setActiveNotification(null), 5000);
    } catch (error: any) {
      console.error("Error saving event:", error);
      alert(`Erreur lors de la sauvegarde de l'événement.\n\nDétails : ${error.message || "Erreur inconnue"}`);
    }
  };

  const handleSaveSettings = async (settings: SiteSettings) => {
    try {
      await api.saveSettings(settings);
      setSiteSettings(settings);
      setActiveNotification({ message: "Configuration mise à jour avec succès !", type: 'success' });
      setTimeout(() => setActiveNotification(null), 5000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert(`Erreur lors de la sauvegarde des paramètres.\n\nDétails : ${error.message || "Erreur inconnue"}`);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (confirm('Supprimer ce commentaire de façon permanente ?')) {
      try {
        await api.deleteComment(id);
        setAllComments(prev => (Array.isArray(prev) ? prev : []).filter(c => c.id !== id));
        setActiveNotification({ message: "Commentaire supprimé.", type: 'info' });
        setTimeout(() => setActiveNotification(null), 3000);
      } catch (error: any) {
        console.error("Error deleting comment:", error);
        alert(`Erreur lors de la suppression.\nDétails : ${error.message || "Erreur inconnue"}`);
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement du Cloud ?')) {
      try {
        await api.deleteEvent(id);
        setAdminEvents(prev => (Array.isArray(prev) ? prev : []).filter(e => e.id !== id));
        setActiveNotification({ message: "Événement supprimé.", type: 'info' });
        setTimeout(() => setActiveNotification(null), 3000);
      } catch (error: any) {
        console.error("Error deleting event:", error);
        alert(`Action impossible pour le moment.\nDétails : ${error.message || "Erreur inconnue"}`);
      }
    }
  };

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    
    try {
      // Use Support logic to send a message
      const msgId = Date.now().toString();
      const message: SupportMessage = {
        id: msgId,
        userid: currentUser?.uid || `visitor-${Date.now()}`,
        username: contactForm.name,
        content: `MESSAGE CONTACT: ${contactForm.message}`,
        date: new Date().toISOString(),
        isadmin: false
      };
      await api.sendSupportMessage(message);
      setContactForm({ name: '', email: '', message: '' });
      setActiveNotification("Message envoyé ! Nous vous répondrons par email.");
    } catch (error) {
       console.error(error);
       alert("Erreur lors de l'envoi.");
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (confirm('Supprimer cet abonné ?')) {
      try {
        await api.deleteSubscriber(id);
        setSubscribers((Array.isArray(subscribers) ? subscribers : []).filter(s => s.id !== id));
        setActiveNotification("Abonné supprimé.");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteMediaAsset = async (id: string) => {
    if (confirm('Supprimer ce média ?')) {
      try {
        await api.deleteMediaAsset(id);
        setMediaLibrary((Array.isArray(mediaLibrary) ? mediaLibrary : []).filter(m => m.id !== id));
        setActiveNotification("Média supprimé.");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (confirm('Voulez-vous vraiment bloquer cet utilisateur ?')) {
      try {
        await api.blockUser(userId);
        setAdminUsers(prev => prev.map(u => u.uid === userId ? { ...u, is_blocked: true } : u));
        setActiveNotification({ message: "Utilisateur bloqué.", type: 'success' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Supprimer définitivement ce compte utilisateur ? Cette action est irréversible.')) {
      try {
        await api.deleteUser(userId);
        setAdminUsers(prev => prev.filter(u => u.uid !== userId));
        setActiveNotification({ message: "Utilisateur supprimé.", type: 'success' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSavePoll = async (poll: Poll) => {
    try {
      await api.savePoll(poll);
      setAdminPolls(prev => {
        const index = prev.findIndex(p => p.id === poll.id);
        if (index >= 0) {
          const newPolls = [...prev];
          newPolls[index] = poll;
          return newPolls;
        }
        return [poll, ...prev];
      });
      setEditingPoll(null);
      setActiveNotification({ message: "Sondage enregistré !", type: 'success' });
    } catch (error: any) {
      console.error(error);
      setActiveNotification({ message: `Erreur : ${error.message || "Impossible d'enregistrer le sondage"}`, type: 'urgent' });
    }
  };

  const handleDeletePoll = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce sondage ?")) {
      try {
        await api.deletePoll(id);
        setAdminPolls(prev => (Array.isArray(prev) ? prev : []).filter(p => p.id !== id));
        setActiveNotification("Sondage supprimé.");
      } catch (error) {
        console.error(error);
        setActiveNotification("Erreur lors de la suppression.");
      }
    }
  };

  const handleSaveClassified = async (classified: Classified) => {
    try {
      await api.saveClassified(classified);
      setClassifieds(prev => {
        const index = prev.findIndex(c => c.id === classified.id);
        if (index >= 0) {
          const newList = [...prev];
          newList[index] = classified;
          return newList;
        }
        return [classified, ...prev];
      });
      setEditingClassified(null);
      setActiveNotification({ message: "Annonce enregistrée !", type: 'success' });
    } catch (error: any) {
      console.error(error);
      setActiveNotification({ message: `Erreur : ${error.message || "Impossible d'enregistrer l'annonce"}`, type: 'urgent' });
    }
  };

  const handleDeleteClassified = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      try {
        await api.deleteClassified(id);
        setClassifieds(prev => (Array.isArray(prev) ? prev : []).filter(c => c.id !== id));
        setActiveNotification("Annonce supprimée.");
      } catch (error) {
        console.error(error);
        setActiveNotification("Erreur lors de la suppression.");
      }
    }
  };

  const handleSaveLiveBlog = async (blog: LiveBlog) => {
    try {
      await api.saveLiveBlog(blog);
      setAdminLiveBlogs(prev => {
        const index = prev.findIndex(l => l.id === blog.id);
        if (index >= 0) {
          const newList = [...prev];
          newList[index] = blog;
          return newList;
        }
        return [blog, ...prev];
      });
      setEditingLiveBlog(null);
      setActiveNotification({ message: "Direct enregistré !", type: 'success' });
    } catch (error: any) {
      console.error(error);
      setActiveNotification({ message: `Erreur : ${error.message || "Impossible d'enregistrer le direct"}`, type: 'urgent' });
    }
  };

  const handleDeleteLiveBlog = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce direct ?")) {
      try {
        await api.deleteLiveBlog(id);
        setAdminLiveBlogs(prev => (Array.isArray(prev) ? prev : []).filter(l => l.id !== id));
        setActiveNotification("Direct supprimé.");
      } catch (error) {
        console.error(error);
        setActiveNotification("Erreur lors de la suppression.");
      }
    }
  };

  const handleSaveWebTV = async (video: WebTV) => {
    try {
      await api.saveWebTV(video);
      setAdminWebTV(prev => {
        const index = prev.findIndex(v => v.id === video.id);
        if (index >= 0) {
          const newList = [...prev];
          newList[index] = video;
          return newList;
        }
        return [video, ...prev];
      });
      setEditingWebTV(null);
      setActiveNotification({ message: "Vidéo enregistrée !", type: 'success' });
    } catch (error: any) {
      console.error(error);
      setActiveNotification({ message: `Erreur : ${error.message || "Impossible d'enregistrer la vidéo"}`, type: 'urgent' });
    }
  };

  const handleDeleteWebTV = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette vidéo ?")) {
      try {
        await api.deleteWebTV(id);
        setAdminWebTV(prev => (Array.isArray(prev) ? prev : []).filter(v => v.id !== id));
        setActiveNotification("Vidéo supprimée.");
      } catch (error) {
        console.error(error);
        setActiveNotification("Erreur lors de la suppression.");
      }
    }
  };

  const handleValidateTransaction = async (tid: string, uid: string) => {
    try {
      await api.validatePremiumTransaction(tid, uid, siteSettings.premiumdurationmonths || 1);
      setActiveNotification({ 
        message: "Transaction validée ! L'utilisateur a maintenant accès au contenu Premium.", 
        type: 'success' 
      });
      // Refresh stats if needed
    } catch (error) {
      console.error("Validation error:", error);
      setActiveNotification({ message: "Erreur lors de la validation.", type: 'urgent' });
    }
  };

  const handleAdminLogout = async () => {
    try {
      await api.logout();
      setCurrentView('home');
      window.location.href = '/';
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleConfirmPayment = async (amount: number, method: string, type: 'subscription' | 'donation', transId?: string) => {
    if (!currentUser) return;

    try {
      // 1. Record Transaction as PENDING
      await api.recordTransaction({
        userId: currentUser.uid,
        email: currentUser.email || 'Anonyme',
        amount,
        method,
        type,
        status: 'pending',
        reference: transId
      });

      // 2. Notification for Admin
      await api.sendNotification({
        id: crypto.randomUUID(),
        userId: 'admin',
        title: "💰 Nouveau paiement en attente",
        message: `${currentUser.email} a déclaré avoir payé ${amount} F via ${method}. ID: ${transId || 'N/A'}. Type: ${type === 'subscription' ? 'Abonnement' : 'Don'}.`,
        type: 'urgent',
        link: "/admin?tab=premium",
        date: new Date().toISOString(),
        read: false
      } as any);

      // 3. Email Notification to Admin
      await api.notifyAdminPayment({
        email: currentUser.email || 'Anonyme',
        amount,
        method,
        type: type === 'subscription' ? 'Abonnement' : 'Don',
        date: new Date().toLocaleString('fr-FR'),
        adminUrl: `${window.location.origin}/admin?tab=premium`,
        transactionId: transId
      });

      // 4. Success Message to User
      setActiveNotification({ 
        message: "Merci ! Votre paiement est en cours de vérification. Il sera validé manuellement par un administrateur sous peu.", 
        type: 'success' 
      });
      setTimeout(() => setActiveNotification(null), 5000);

      if (type === 'subscription') {
        setShowPremiumModal(false);
      } else {
        setDonationSuccess(true);
      }
    } catch (error) {
      console.error("[App] Confirmation payment error:", error);
      setActiveNotification({ message: "Erreur lors de la confirmation. Veuillez réessayer.", type: 'urgent' });
    }
  };

  const handleUpgradePremium = async (method: string, transId?: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }
    
    await handleConfirmPayment(siteSettings.premiumprice, method, 'subscription', transId);
    setShowPremiumModal(false);
  };

  const handleBookmarkArticle = async (articleId: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }

    const isBookmarked = !userBookmarkedArticles.has(articleId);
    
    try {
      await api.bookmarkArticle(articleId);
      
      setUserBookmarkedArticles(prev => {
        const next = new Set(prev);
        if (isBookmarked) next.add(articleId);
        else next.delete(articleId);
        return next;
      });

    if (isBookmarked) {
      setActiveNotification("Article enregistré dans vos favoris !");
      awardPoints(10);
    }
    } catch (error) {
      console.error("Bookmark article error:", error);
    }
  };

  const handleFollowAuthor = async (authorName: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }

    const isFollowing = !userFollowedAuthors.has(authorName);
    try {
      await api.followAuthor(authorName, currentUser.uid, isFollowing);
      setUserFollowedAuthors(prev => {
        const next = new Set(prev);
        if (isFollowing) next.add(authorName);
        else next.delete(authorName);
        return next;
      });
      if (isFollowing) awardPoints(15);
    } catch (error) {
      console.error("Follow author error:", error);
    }
  };

  const handleFollowCategory = async (category: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }

    const isFollowing = !userFollowedCategories.has(category);
    try {
      await api.followCategory(category, currentUser.uid, isFollowing);
      setUserFollowedCategories(prev => {
        const next = new Set(prev);
        if (isFollowing) next.add(category);
        else next.delete(category);
        return next;
      });
      if (isFollowing) awardPoints(10);
    } catch (error) {
      console.error("Follow category error:", error);
    }
  };

  const handleSavePreferences = async (interests: string[]) => {
    setUserInterests(interests);
    if (!currentUser) {
      setShowPreferenceModal(false);
      setActiveNotification({ message: "Préférences enregistrées localement. Connectez-vous pour les synchroniser.", type: 'info' });
      return;
    }
    try {
      await api.updateUserProfile(currentUser.uid, {
        followedcategories: Array.from(userFollowedCategories),
        interests: interests
      });
      setShowPreferenceModal(false);
      setActiveNotification({ message: "Préférences mises à jour !", type: 'success' });
    } catch (error) {
      console.error(error);
      setShowPreferenceModal(false);
      setActiveNotification({ message: "Erreur lors de la mise à jour", type: 'urgent' });
    }
  };

  const awardPoints = async (amount: number) => {
    if (!currentUser) return;
    try {
      const newPoints = userPoints + amount;
      await api.updateUserPoints(currentUser.uid, newPoints);
      setUserPoints(newPoints);
      
      // Check for badges
      const newBadges = [...userBadges];
      if (newPoints >= 100 && !newBadges.includes('Explorateur')) newBadges.push('Explorateur');
      if (newPoints >= 500 && !newBadges.includes('Passionné')) newBadges.push('Passionné');
      if (newPoints >= 1000 && !newBadges.includes('Ambassadeur')) newBadges.push('Ambassadeur');
      
      if (newBadges.length > userBadges.length) {
        await api.updateUserBadges(currentUser.uid, newBadges);
        setUserBadges(newBadges);
        setActiveNotification({ message: "Nouveau badge débloqué !", type: 'success' });
      }
    } catch (error) {
      console.error("Award points error:", error);
    }
  };

  const handleShareArticle = (article: Article, platform?: 'twitter' | 'facebook' | 'whatsapp') => {
    const url = window.location.href; // In real app, this would be the specific article URL
    const text = `Découvrez cet article sur Akwaba Info : ${article.title}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else {
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: article.excerpt,
          url: url,
        }).catch(err => console.error("Error sharing:", err));
      } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(url);
        setActiveNotification("Lien copié dans le presse-papier !");
      }
    }
  };

  const handleAddComment = async (articleId: string, parentCommentId?: string) => {
    if (!newCommentText.trim() || (!commentAuthorName.trim() && !currentUser)) {
      if (!currentUser) handleUserLogin();
      return;
    }
    
    const author = currentUser?.displayname || commentAuthorName;
    const newComment: Comment = {
      id: Date.now().toString(),
      userid: currentUser?.uid,
      userphoto: currentUser?.photourl,
      username: author,
      date: new Date().toISOString(),
      content: newCommentText,
      likes: 0,
      likedby: [],
      articleid: articleId,
      parentid: parentCommentId,
      isadmin: isAdminAuthenticated
    };

    try {
      await api.saveComment(newComment);
      
      setArticleComments(prev => {
        const currentComments = [...(prev[articleId] || [])];
        
        if (parentCommentId && parentCommentId !== 'mock') {
          // Parent comment replies are not used as per the requirement of FLAT comments
          return { ...prev, [articleId]: [newComment, ...currentComments] };
        }

        return { ...prev, [articleId]: [newComment, ...currentComments] };
      });

      setNewCommentText('');
      setReplyingTo(null);
      setActiveNotification("Votre message a été publié !");
    } catch (error) {
      console.error("Error adding comment:", error);
      setActiveNotification("Erreur lors de la publication.");
    }
  };

  const handleLikeArticle = async (articleId: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }

    const isLiked = !userLikedArticles.has(articleId);
    
    try {
      await api.likeArticle(articleId);
      
      setUserLikedArticles(prev => {
        const next = new Set(prev);
        if (isLiked) next.add(articleId);
        else next.delete(articleId);
        return next;
      });

      // Update local article likes count
      setAdminArticles(prev => prev.map(a => 
        a.id === articleId ? { ...a, likes: (a.likes || 0) + (isLiked ? 1 : -1) } : a
      ));

      if (isLiked) {
        setActiveNotification("Vous avez aimé cet article !");
      }
    } catch (error) {
      console.error("Like article error:", error);
    }
  };

  const handleLikeComment = async (articleId: string, commentId: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }

    const commentPath = articleComments[articleId] || [];
    const target = commentPath.find(c => c.id === commentId);
    if (!target) return;

    const isLiked = !target.likedby?.includes(currentUser.uid);
    
    try {
      await api.likeComment(commentId);
      
      setArticleComments(prev => {
        const updateLikes = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === commentId) {
              const likedby = isLiked 
                ? [...(c.likedby || []), currentUser.uid] 
                : (c.likedby || []).filter(id => id !== currentUser.uid);
              return { ...c, likes: (c.likes || 0) + (isLiked ? 1 : -1), likedby };
            }
            return c;
          });
        };
        return { ...prev, [articleId]: updateLikes(prev[articleId] || []) };
      });
    } catch (error) {
      console.error("Like comment error:", error);
    }
  };

  const handleReportComment = async (commentId: string) => {
    if (!currentUser) {
      handleUserLogin();
      return;
    }
    try {
      await api.reportComment(commentId);
      setActiveNotification("Le commentaire a été signalé à l'administration.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    try {
      await api.subscribeToNewsletter(newsletterEmail);
      setActiveNotification({ 
        message: "Merci ! Vous êtes maintenant inscrit. Veuillez vérifier votre boîte mail (pensez aux spams).", 
        type: 'success' 
      });
      setNewsletterEmail('');
    } catch (error: any) {
      console.error("Newsletter error detail:", error);
      const msg = error.message || "Une erreur est survenue lors de l'inscription.";
      alert(msg);
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShowCookieBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const notifConsent = localStorage.getItem('notification-consent');
    if (!notifConsent) {
      const timer = setTimeout(() => {}, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNotificationConsent = (accepted: boolean) => {
    localStorage.setItem('notification-consent', accepted ? 'accepted' : 'declined');
  };

  const handleCookieConsent = (accepted: boolean) => {
    localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined');
    setShowCookieBanner(false);
  };

  useEffect(() => {
    if (isCloudLoaded) {
      // Group comments by articleId
      const mapping: Record<string, Comment[]> = {};
      if (Array.isArray(allComments)) {
        allComments.forEach(c => {
          if (!mapping[c.articleid]) mapping[c.articleid] = [];
          mapping[c.articleid].push(c);
        });
      }
      setArticleComments(mapping);
    }
  }, [allComments, isCloudLoaded]);

  useEffect(() => {
    if (isCloudLoaded && Array.isArray(adminArticles) && adminArticles.length > 0) {
      const likesMap: Record<string, number> = {};
      adminArticles.forEach(a => {
        likesMap[a.id] = a.likes || 0;
      });
      setArticleLikes(likesMap);
    }
  }, [adminArticles, isCloudLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Keep splash a bit longer for the "welcome" effect
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('akwaba_splash_shown', 'true');
      }, 1000);
    }, 2000);
    
    // Extreme safety
    const forceExit = setTimeout(() => {
      setShowSplash(false);
      setIsLoading(false);
      setIsAuthChecked(true);
      setIsCloudLoaded(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(forceExit);
    };
  }, []);

  const categories = siteSettings.categories || ['À LA UNE', 'INFO PAR PAYS', 'AFRIQUE', 'MONDE', 'COMMUNIQUÉS', 'SONDAGE', 'NOS THEMES'];

  const allRubrics = useMemo(() => {
    const baseRubrics = [...RUBRICS].map(r => {
      if (r.label === 'INFO PAR PAYS' && siteSettings.countries && siteSettings.countries.length > 0) {
        return { ...r, sub: siteSettings.countries };
      }
      return r;
    });
    const existingLabels = new Set(baseRubrics.map(r => r.label.toUpperCase()));
    
    (siteSettings.categories || []).forEach(cat => {
       const upperCat = cat.toUpperCase();
       if (!existingLabels.has(upperCat) && upperCat !== 'À LA UNE') {
         baseRubrics.push({
           id: cat.toLowerCase().replace(/\s+/g, '-'),
           label: cat,
           icon: siteSettings.categories_icons?.[cat] || '📰'
         });
         existingLabels.add(upperCat);
       }
    });
    return baseRubrics;
  }, [siteSettings.categories, siteSettings.categories_icons, siteSettings.countries]);

  const visibleArticles = isAdminAuthenticated 
    ? (Array.isArray(adminArticles) ? adminArticles : [])
    : (Array.isArray(adminArticles) ? adminArticles : []).filter(a => {
        const isPublished = a.status === 'published';
        const isNotScheduled = !a.scheduledat || new Date(a.scheduledat) <= new Date();
        return isPublished && isNotScheduled;
      });

  const visibleEvents = isAdminAuthenticated 
    ? (Array.isArray(adminEvents) ? adminEvents : []) 
    : (Array.isArray(adminEvents) ? adminEvents : []).filter(e => {
        const isPublished = e.status === 'published';
        const isNotScheduled = !e.scheduledat || new Date(e.scheduledat) <= new Date();
        return isPublished && isNotScheduled;
      });

  const filteredArticles = useMemo(() => {
    // Trier par date décroissante par défaut pour toutes les rubriques
    let base = [...visibleArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (activeCategory === 'À LA UNE') {
      // 1. À LA UNE : affiche les articles avec is_featured = true
      return base.filter(a => a.is_featured === true);
    }

    if (activeCategory === 'INFO PAR PAYS') {
      // 2. INFO PAR PAYS : affiche les articles filtrés par pays (country = activeSubCategory)
      if (activeSubCategory) {
        return base.filter(a => a.country === activeSubCategory);
      }
      return base.filter(a => !!a.country);
    }

    if (activeCategory === 'AFRIQUE') {
      // 3. AFRIQUE : affiche les articles avec rubric = 'AFRIQUE' ou category = 'Afrique'
      return base.filter(a => a.rubric === 'AFRIQUE' || a.category === 'Afrique');
    }

    if (activeCategory === 'MONDE') {
      // 4. MONDE : affiche les articles avec rubric = 'MONDE' ou category = 'Monde'
      return base.filter(a => a.rubric === 'MONDE' || a.category === 'Monde');
    }

    if (activeCategory === 'COMMUNIQUÉS') {
      // 5. COMMUNIQUÉS : affiche les articles avec rubric = 'COMMUNIQUÉS' ou category = 'Communiqués'
      return base.filter(a => a.rubric === 'COMMUNIQUÉS' || a.category === 'Communiqués');
    }

    if (activeCategory === 'SONDAGE') {
      // 6. SONDAGE : les sondages sont gérés à part dans le JSX via adminPolls
      return []; 
    }

    if (activeCategory === 'NOS THEMES') {
      // 7. NOS THEMES : affiche les articles filtrés par thématique (category = activeSubCategory)
      if (activeSubCategory) {
        return base.filter(a => a.category === activeSubCategory);
      }
      // Par défaut, afficher tous les articles thématiques
      const themeSubCats = ['Politique', 'Société', 'Sport', 'Économie', 'Culture', 'Histoire', 'Santé', 'Science', 'Tech', 'Éducation', 'Environnement'];
      return base.filter(a => a.rubric === 'NOS THEMES' || themeSubCats.includes(a.category));
    }

    // Cas générique pour les catégories dynamiques
    return base.filter(a => 
      a.rubric === activeCategory || 
      a.category === activeCategory || 
      a.country === activeCategory
    );
  }, [activeCategory, activeSubCategory, visibleArticles]);

  const handleUserLogout = async () => {
    try {
      await api.logout();
      setCurrentView('home');
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUserLogin = () => {
    setShowLoginModal(true);
  };

  const handleAuthSuccess = async (user: UserProfile) => {
    try {
      const isBlocked = await api.isBlocked(user.uid);
      if (isBlocked) {
        alert("Votre compte a été suspendu par un administrateur.");
        await api.logout();
        return;
      }
    } catch (error) {
       console.error("Auth check error:", error);
    }

    setCurrentUser(user);
    setShowLoginModal(false);
    setActiveNotification(`Bienvenue, ${user.displayname || 'Utilisateur'}`);
    
    // Auto redirect based on role
    if (user.role === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('profile');
    }
  };

  const [visibleArticlesCount, setVisibleArticlesCount] = useState(15);
  const mainRubricsScrollRef = useRef<HTMLDivElement>(null);
  const [showMainLeftArrow, setShowMainLeftArrow] = useState(false);
  const [showMainRightArrow, setShowMainRightArrow] = useState(false);

  const updateMainScrollArrows = () => {
    if (mainRubricsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = mainRubricsScrollRef.current;
      setShowMainLeftArrow(scrollLeft > 10);
      setShowMainRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = mainRubricsScrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateMainScrollArrows);
      const ro = new ResizeObserver(updateMainScrollArrows);
      ro.observe(el);
      updateMainScrollArrows();
      return () => {
        el.removeEventListener('scroll', updateMainScrollArrows);
        ro.disconnect();
      };
    }
  }, [allRubrics]);

  const scrollMainRubrics = (dir: 'left' | 'right') => {
    if (mainRubricsScrollRef.current) {
      const amount = mainRubricsScrollRef.current.clientWidth * 0.7;
      mainRubricsScrollRef.current.scrollBy({
        left: dir === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleArticlesCount(15);
  }, [activeCategory, activeSubCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleArticlesCount < filteredArticles.length) {
          setVisibleArticlesCount(prev => prev + 4);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [visibleArticlesCount, filteredArticles.length]);

  const displayedArticles = filteredArticles.slice(0, visibleArticlesCount);

  const [visibleSearchCount, setVisibleSearchCount] = useState(4);
  const searchLoadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleSearchCount(4);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleSearchCount(prev => prev + 4);
        }
      },
      { threshold: 0.1 }
    );

    if (searchLoadingRef.current) {
      observer.observe(searchLoadingRef.current);
    }

    return () => observer.disconnect();
  }, [visibleSearchCount]);

  const searchResults = (Array.isArray(visibleArticles) ? visibleArticles : []).filter(a => {
    const query = searchQuery.toLowerCase();
    const titleMatch = (a.title || '').toLowerCase().includes(query);
    const excerptMatch = (a.excerpt || '').toLowerCase().includes(query);
    const contentMatch = (a.content || '').toLowerCase().includes(query);
    const tagsMatch = a.tags?.some(t => t.toLowerCase().includes(query));
    
    return titleMatch || excerptMatch || contentMatch || tagsMatch;
  });

  const displayedSearchResults = searchResults.slice(0, visibleSearchCount);

  const handleArticleClick = async (article: Article) => {
    if (!article) return;
    setSelectedArticle(article);
    navigate(`/article/${article.slug || article.id}`);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
    
    // Increment views
    if (article.id) {
      try {
        await api.incrementArticleViews(article.id);
        if (currentUser) {
          await api.addToReadingHistory(currentUser.uid, article.id);
        }
      } catch (e) {
        console.warn("View counter error", e);
      }
    }
  };

  const handleAuthorClick = (authorName: string) => {
    const author = MOCK_AUTHORS.find(a => a.name === authorName);
    if (author) {
      setSelectedAuthor(author);
      navigate('/auteurs');
      setIsMenuOpen(false);
      window.scrollTo(0, 0);
    } else {
       // Fallback author if not found in mock
       const fallbackAuthor: Author = {
         id: `author-${Date.now()}`,
         name: authorName,
         role: authorName.includes('Rédaction') ? 'Rédaction' : 'Journaliste',
         bio: `${authorName} est un contributeur passionné par l'actualité africaine chez Akwaba Info.`,
         image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
         socials: {},
         specialties: ['Actualité']
       };
       setSelectedAuthor(fallbackAuthor);
       navigate('/auteurs');
       setIsMenuOpen(false);
       window.scrollTo(0, 0);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    navigate(`/evenement/${event.slug || event.id}`);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCultureClick = (post: CulturePost) => {
    setSelectedCulturePost(post);
    navigate(`/culture/${post.slug || post.id}`);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
    // Silent update for views
    api.saveCulturePost({ ...post, views: (post.views || 0) + 1 }).catch(() => {});
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory(null);
    setCurrentView('home');
    navigate('/');
    setSelectedArticle(null);
    setSelectedAuthor(null);
    setIsMenuOpen(false);
    setIsRubricsOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSubCategoryClick = (sub: string | null, parentCategory?: string) => {
    if (parentCategory) setActiveCategory(parentCategory);
    setActiveSubCategory(sub);
    setCurrentView('home');
    navigate('/');
    setSelectedArticle(null);
    setIsMenuOpen(false);
    setIsRubricsOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateTo = (view: typeof currentView) => {
    setCurrentView(view);
    switch(view) {
      case 'home': navigate('/'); break;
      case 'article': if (selectedArticle) navigate(`/article/${selectedArticle.slug || selectedArticle.id}`); break;
      case 'search': navigate('/recherche'); break;
      case 'donate': navigate('/donate'); break;
      case 'about': navigate('/a-propos'); break;
      case 'contact': navigate('/contact'); break;
      case 'webtv': navigate('/webtv'); break;
      case 'profile': navigate('/profil'); break;
      case 'classifieds': navigate('/annonces'); break;
      case 'all-events': navigate('/agenda'); break;
      case 'admin': navigate('/admin'); break;
      case 'authors': navigate('/auteurs'); break;
      case 'all-culture': navigate('/culture'); break;
      case 'live-blog': navigate('/live'); break;
      case 'privacy': navigate('/privacy'); break;
      case 'terms': navigate('/terms'); break;
      case 'cookies': navigate('/cookies'); break;
      case 'culture-posts': navigate('/culture'); break;
      case 'quiz': navigate('/quiz'); break;
      case 'map': navigate('/map'); break;
      default: navigate('/');
    }
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('email') && window.location.pathname.includes('/unsubscribe')) {
       navigate('/unsubscribe' + window.location.search);
    }
    // Handle home redirect if needed
  }, []);

  const handleLogoClick = () => {
    const newCount = adminClickCount + 1;
    if (newCount >= 5) {
      setShowAdminLoginModal(true);
      setAdminClickCount(0);
    } else {
      setAdminClickCount(newCount);
      goHome();
    }
  };

  const goHome = () => {
    setActiveCategory('À LA UNE');
    navigate('/');
    setSelectedArticle(null);
    setSelectedEvent(null);
    setSelectedAuthor(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const FLASH_NEWS = siteSettings.flashnews 
    ? siteSettings.flashnews.split(';').filter(n => n.trim().length > 0)
    : [
        "Côte d'Ivoire : Lancement d'un nouveau programme de soutien aux startups technologiques à Abidjan.",
        "Économie : La ZLECAf annonce une progression record des échanges intra-africains pour le premier trimestre.",
        "Sport : Les préparatifs de la prochaine CAN avancent à grands pas, inspection des stades terminée.",
        "Culture : Le festival des musiques urbaines d'Anoumabo (FEMUA) dévoile sa programmation internationale.",
        "Monde : Sommet extraordinaire de l'Union Africaine sur la sécurité alimentaire prévu le mois prochain."
      ];

  const trendingArticles = (Array.isArray(adminArticles) ? adminArticles : [])
    .filter(article => {
      const articleDate = new Date(article.date);
      const now = new Date();
      const diffInHours = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
      return diffInHours <= 48; // Last 48 hours
    })
    .sort((a, b) => {
      const likesA = (a.likes || 0) + (articleLikes[a.id] || 0);
      const likesB = (b.likes || 0) + (articleLikes[b.id] || 0);
      const commentsA = (a.commentscount || 0) + (articleComments[a.id]?.length || 0);
      const commentsB = (b.commentscount || 0) + (articleComments[b.id]?.length || 0);
      
      const scoreA = (a.views || 0) + likesA * 2 + commentsA * 5;
      const scoreB = (b.views || 0) + likesB * 2 + commentsB * 5;
      return scoreB - scoreA;
    })
    .slice(0, 3);

  const personalizedArticles = useMemo(() => {
    if (!currentUser || userFollowedCategories.size === 0) return [];
    return (Array.isArray(visibleArticles) ? visibleArticles : [])
      .filter(a => userFollowedCategories.has(a.category))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [currentUser, userFollowedCategories, visibleArticles]);

  const [showTopNotice, setShowTopNotice] = useState(true);

  if (siteSettings.maintenancemode && !isAdminAuthenticated && currentView !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <MonitorOff size={64} className="text-slate-300 animate-pulse" />
        <h1 className="text-4xl font-black italic">Site en Maintenance</h1>
        <p className="max-w-md text-slate-500 font-medium leading-relaxed">Nous effectuons actuellement des mises à jour techniques pour améliorer votre expérience. Akwaba Info sera bientôt de retour.</p>
        <button onClick={() => navigate('/admin')} className="text-xs font-bold text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">Administration</button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showTopNotice && (
          <TopNotice 
            message="Suivez l'actualité en temps réel sur Akwaba Info - Le direct est disponible !" 
            onClose={() => setShowTopNotice(false)} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <AdminLoginModal 
        isOpen={showAdminLoginModal} 
        onClose={() => setShowAdminLoginModal(false)} 
        onSuccess={(user) => {
          setShowAdminLoginModal(false);
          setIsAdminAuthenticated(true);
          safeStorage.set('akwaba_is_admin', 'true');
          setCurrentUser(user);
          navigate('/admin');
        }}
      />

      <AnimatePresence>
        {showPreferenceModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreferenceModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <PreferenceSelector
                availableCategories={categories}
                selectedCategories={Array.from(userFollowedCategories)}
                categoryIcons={siteSettings?.categories_icons}
                initialInterests={userInterests}
                onToggle={(cat) => handleFollowCategory(cat)}
                onSave={handleSavePreferences}
                onClose={() => setShowPreferenceModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClassifiedsModal && (
          <PostClassifiedModal 
            onClose={() => setShowClassifiedsModal(false)}
            onPost={handlePostClassified}
          />
        )}
      </AnimatePresence>

      {/* Urgent Banner */}
      {siteSettings.urgentbanneractive && siteSettings.urgentbannertext && (
        <div className="bg-red-600 text-white overflow-hidden py-3 text-xs font-black uppercase tracking-widest sticky top-0 z-[100] shadow-xl">
           <motion.div 
             animate={{ x: [0, -1000] }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="whitespace-nowrap flex gap-20 items-center justify-center"
           >
             <div className="flex items-center gap-4"><AlertTriangle size={16}/> URGENT : {siteSettings.urgentbannertext}</div>
             <div className="flex items-center gap-4"><AlertTriangle size={16}/> URGENT : {siteSettings.urgentbannertext}</div>
             <div className="flex items-center gap-4"><AlertTriangle size={16}/> URGENT : {siteSettings.urgentbannertext}</div>
             <div className="flex items-center gap-4"><AlertTriangle size={16}/> URGENT : {siteSettings.urgentbannertext}</div>
             <div className="flex items-center gap-4"><AlertTriangle size={16}/> URGENT : {siteSettings.urgentbannertext}</div>
             <div className="flex items-center gap-4"><AlertTriangle size={16}/> URGENT : {siteSettings.urgentbannertext}</div>
           </motion.div>
        </div>
      )}

      <div className={cn(
        "min-h-screen transition-colors duration-300 african-pattern relative bg-[#F5F1EB] text-slate-900",
        (currentView === 'admin' || currentView === 'admin-login') ? "pb-0" : "pb-16 lg:pb-0"
      )}>
        {!['admin', 'admin-login'].includes(currentView) && <PulseSidebar />}
      {!['admin', 'admin-login'].includes(currentView) && <FlashInfo articles={FLASH_NEWS} />}
      
      {/* Active Notification Toast */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-24 right-6 z-[1000] max-w-sm w-full"
          >
            <div className={cn(
              "text-white p-6 rounded-3xl shadow-2xl flex gap-4 items-start border-4 border-white/20",
              (typeof activeNotification === 'object' && activeNotification.type === 'urgent') ? "bg-red-600" : 
              (typeof activeNotification === 'object' && activeNotification.type === 'info') ? "bg-primary" : "bg-emerald-600"
            )}>
              <div className="p-2 bg-white/20 rounded-xl shrink-0">
                {(typeof activeNotification === 'object' && activeNotification.type === 'urgent') ? <AlertTriangle size={24} /> :
                 (typeof activeNotification === 'object' && activeNotification.type === 'info') ? <Bell size={24} /> : <CheckCircle size={24} />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                  {typeof activeNotification === 'object' ? (
                    activeNotification.type === 'success' ? 'Confirmation' : 
                    activeNotification.type === 'urgent' ? 'Alerte Urgente' : 
                    activeNotification.type === 'info' ? 'Information' : 'Confirmation'
                  ) : 'Confirmation'}
                </div>
                <p className="text-sm font-bold leading-tight">
                  {typeof activeNotification === 'string' ? activeNotification : activeNotification.message}
                </p>
              </div>
              <button onClick={() => setActiveNotification(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Chat Widget */}
      <SupportChatWidget user={currentUser} isDarkMode={false} />

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-[400px] z-[120]"
          >
            <div className={cn(
              "p-6 rounded-3xl shadow-2xl border flex flex-col gap-4 bg-white border-slate-200"
            )}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Eye size={20} />
                </div>
                <h3 className="font-display font-bold text-lg">Respect de votre vie privée</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et vous proposer des contenus adaptés.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCookieConsent(true)}
                  className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Accepter tout
                </button>
                <button
                  onClick={() => handleCookieConsent(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Refuser
                </button>
              </div>
              <button 
                onClick={() => navigateTo('cookies')}
                className="text-[10px] text-slate-400 hover:text-primary transition-colors text-center uppercase font-bold tracking-widest"
              >
                En savoir plus sur notre politique
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Progress Bar */}
      {currentView === 'article' && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-emerald-400 to-primary origin-left z-[110] shadow-[0_2px_15px_rgba(31,164,99,0.6)]"
          style={{ scaleX }}
        />
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={cn(
              "fixed inset-0 z-[100] p-6 lg:hidden flex flex-col overflow-y-auto scroll-smooth bg-white"
            )}
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex flex-col items-center gap-4 w-full">
                <img 
                  src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
                  alt="Akwaba Info Logo" 
                  className="w-32 h-32 object-contain rounded-3xl shadow-lg border border-slate-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-2xl font-black">MENU</h2>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-900">
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>
            <nav className="flex flex-col gap-6">
              {isAdminAuthenticated && (
                <button 
                  id="mobile-admin-dash-btn"
                  onClick={() => { navigateTo('admin'); setIsMenuOpen(false); }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-3xl mb-2 bg-primary/5 text-primary",
                    currentView === 'admin' && "ring-2 ring-primary"
                  )}
                >
                  <LayoutDashboard size={24} />
                  <span className="font-bold">Dashboard Admin</span>
                </button>
              )}

              {currentUser ? (
                <>
                  <div 
                    onClick={() => { navigateTo('profile'); setIsMenuOpen(false); }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-3xl mb-2 cursor-pointer bg-slate-50",
                      currentView === 'profile' && "ring-2 ring-primary"
                    )}
                  >
                    <div className="relative">
                      <img 
                        src={currentUser.photourl || `https://ui-avatars.com/api/?name=${currentUser.displayname || 'User'}`} 
                        className="w-12 h-12 rounded-full border-2 border-primary object-cover aspect-square"
                        referrerPolicy="no-referrer"
                      />
                      {isAdminAuthenticated ? (
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                          <Shield size={10} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 truncate max-w-[150px]">
                        {currentUser.displayname || 'Utilisateur'}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-primary">Voir mon profil</div>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      await api.logout();
                      navigateTo('home');
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors text-[10px] font-black uppercase tracking-widest mb-4 border border-red-100"
                  >
                    <LogOut size={16} /> Se déconnecter
                  </button>
                </>
              ) : (
                <button 
                  data-login-btn
                  onClick={handleUserLogin} 
                  className="flex items-center justify-center gap-2 p-4 bg-primary text-white rounded-3xl font-bold shadow-lg shadow-primary/20"
                >
                  <User size={24} /> Se connecter / S'ouvrir
                </button>
              )}

              {allRubrics.map(rubric => (
                <div key={rubric.id} className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      handleCategoryClick(rubric.label);
                      // Only close menu if there are no sub-categories to explore
                      if (!rubric.sub || rubric.sub.length === 0) {
                        setIsMenuOpen(false);
                      }
                    }}
                    className={cn(
                      "text-2xl font-black text-left transition-colors whitespace-nowrap flex items-center gap-3",
                      activeCategory === rubric.label && currentView === 'home' ? "text-primary" : "text-slate-400"
                    )}
                  >
                    <span className="text-2xl">{rubric.icon}</span>
                    {rubric.label}
                  </button>
                  {activeCategory === rubric.label && rubric.sub && (
                    <div className="flex flex-col gap-3 pl-10 animate-in slide-in-from-left-2 duration-300 py-2">
                      {rubric.sub.map(sub => (
                        <button
                          key={sub}
                          onClick={() => {
                            handleSubCategoryClick(sub, rubric.label);
                            setIsMenuOpen(false);
                          }}
                          className={cn(
                            "text-sm font-bold text-left py-1.5 transition-colors flex items-center gap-3",
                            activeSubCategory === sub ? "text-primary" : "text-slate-500"
                          )}
                        >
                          <span className="text-lg opacity-70">
                            {rubric.id === 'pays' 
                              ? (siteSettings.countries_flags?.[sub] || '🌍') 
                              : (rubric.id === 'themes' ? (siteSettings.categories_icons?.[sub] || '📚') : '•')}
                          </span>
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <hr className="border-slate-100 my-2" />
              <button onClick={() => navigateTo('live-blog')} className="text-lg font-bold text-left text-red-600 flex items-center gap-2 group">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> Direct (Live)
              </button>
              <button onClick={() => navigateTo('classifieds')} className="text-lg font-bold text-left text-slate-800 flex items-center gap-2 group">
                <Copy size={24} className="text-slate-400 group-hover:text-primary transition-colors" /> Petites Annonces
              </button>
              <button onClick={() => navigateTo('webtv')} className="text-lg font-bold text-left text-primary flex items-center gap-2 group">
                <Youtube size={24} className="group-hover:scale-110 transition-transform" /> Web TV
              </button>
              <button onClick={() => navigateTo('all-events')} className="text-lg font-bold text-left text-slate-800 flex items-center gap-2 group">
                <Calendar size={24} className="text-slate-400 group-hover:text-amber-500 transition-colors" /> Agenda Culturel
              </button>
              <hr className="border-slate-100 my-2" />
              <button onClick={() => navigateTo('about')} className="text-lg font-bold text-left text-slate-500">À propos</button>
              <button onClick={() => navigateTo('contact')} className="text-lg font-bold text-left text-slate-500">Contact</button>
              <button onClick={() => navigateTo('donate')} className="text-lg font-bold text-left text-primary">Soutenir le journal</button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navbar */}
      {!['admin', 'admin-login'].includes(currentView) && (
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        "bg-white border-b border-slate-100 shadow-sm"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-all"
            >
              <Menu size={24} />
            </button>
            <div 
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
                className="w-10 h-10 md:w-14 md:h-14 rounded-xl border border-slate-100 p-1 object-contain transition-transform group-hover:scale-105" 
                alt="Logo" 
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-display font-black italic tracking-tighter leading-none uppercase">
                  <span className="text-slate-900">AKWABA</span> <span className="text-primary">INFO</span>
                </h1>
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">L’info du monde en un clic</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-2 py-1 mx-8 max-w-xl flex-1 focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
            <Search size={18} className="text-slate-500 ml-2 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher un article, un auteur..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigateTo('search')}
              className="bg-transparent border-none outline-none px-3 py-2 text-sm w-full font-bold placeholder:text-slate-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400">
                <X size={14} />
              </button>
            )}
            <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-lg text-slate-500 font-bold ml-2 shadow-sm">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <WeatherWidget />
            
            <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />
            
            {currentUser && (
               <div className="flex items-center gap-1 md:gap-2">
                 {isAdminAuthenticated && (
                   <button 
                     id="desktop-admin-dash-btn"
                     onClick={() => navigateTo('admin')}
                     className={cn(
                       "p-2 md:p-3 rounded-full transition-all group",
                       currentView === 'admin' ? "bg-primary text-white" : "hover:bg-primary/10 text-primary"
                     )}
                     title="Tableau de bord Admin"
                   >
                     <LayoutDashboard size={20} className="md:w-[22px] md:h-[22px]" />
                   </button>
                 )}
                 <div className="relative">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                      className={cn(
                        "p-2 md:p-3 rounded-full transition-all relative group",
                        showNotificationCenter ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-100 text-slate-500"
                      )}
                    >
                      <Bell size={20} className="md:w-[22px] md:h-[22px]" />
                      {unreadNotifsCount > 0 && (
                        <span className="absolute top-1 md:top-2 right-1 md:right-2 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 text-white text-[7px] md:text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                          {unreadNotifsCount}
                        </span>
                      )}
                    </motion.button>
                    <AnimatePresence>
                      {showNotificationCenter && (
                        <NotificationCenter 
                          notifications={notifications}
                          onClose={() => setShowNotificationCenter(false)}
                          onMarkRead={handleMarkNotificationAsRead}
                          onNavigate={(link) => {
                            if (link.startsWith('/admin')) {
                              const url = new URL(link, window.location.origin);
                              const tab = url.searchParams.get('tab');
                              if (tab) setAdminActiveTab(tab);
                              navigateTo('admin');
                            } else {
                              const article = adminArticles.find(a => a.id === link || a.slug === link);
                              if (article) handleArticleClick(article);
                            }
                            setShowNotificationCenter(false);
                          }}
                        />
                      )}
                    </AnimatePresence>
                 </div>
               </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-1 md:gap-2">
                <div onClick={() => navigateTo('profile')} className="relative group cursor-pointer" title="Mon Profil">
                  <img 
                    src={currentUser.photourl || `https://ui-avatars.com/api/?name=${currentUser.displayname || 'User'}`} 
                    alt="User Profile" 
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors object-cover aspect-square",
                      currentView === 'profile' ? "border-primary" : "border-primary/20 hover:border-primary"
                    )}
                    referrerPolicy="no-referrer"
                  />
                  {isAdminAuthenticated ? (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      <Shield size={10} className="md:w-3 md:h-3" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-white" />
                  )}
                </div>
                <button 
                  onClick={handleUserLogout}
                  className="hidden sm:flex p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={18} className="md:w-5 md:h-5" />
                </button>
              </div>
            ) : (
              <button 
                data-login-btn
                onClick={handleUserLogin}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 font-bold text-sm"
              >
                <User size={20} />
                <span className="hidden md:inline">Connexion</span>
              </button>
            )}

            <button 
              id="header-donate-btn"
              onClick={() => navigateTo('donate')}
              className="hidden md:flex bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Soutenir
            </button>
         </div>
        </div>

        {/* Categories Bar (Desktop only, prominent list) */}
        <div className="hidden lg:block border-t border-slate-100 bg-white relative group">
          <div className="max-w-7xl mx-auto px-4 relative flex items-center">
            {/* Arrows for Desktop Rubrics if they overflow */}
            <AnimatePresence>
              {showMainLeftArrow && (
                <button 
                  onClick={() => scrollMainRubrics('left')}
                  className="absolute left-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm shadow-md rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
              )}
            </AnimatePresence>

            <div 
              ref={mainRubricsScrollRef}
              className="flex-1 flex items-center gap-1 py-2 overflow-x-auto no-scrollbar scroll-smooth"
            >
              <div className="flex items-center gap-1 mx-auto">
                {allRubrics.map((rubric) => (
                  <button
                    key={rubric.id}
                    onClick={() => handleCategoryClick(rubric.label)}
                    className={cn(
                      "px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 relative group shrink-0",
                      activeCategory === rubric.label 
                        ? "text-primary" 
                        : "text-slate-500 hover:text-primary"
                    )}
                  >
                    <span className="text-sm">{rubric.icon}</span>
                    {rubric.label}
                    {activeCategory === rubric.label && (
                      <motion.div 
                        layoutId="activeCategory"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {showMainRightArrow && (
                <button 
                  onClick={() => scrollMainRubrics('right')}
                  className="absolute right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm shadow-md rounded-full border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <ChevronRight size={16} strokeWidth={3} />
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sub-categories Scrolling Nav (Visible when a category with sub-sections is active) */}
        {activeCategory !== 'À LA UNE' && allRubrics.find(r => r.label === activeCategory)?.sub && (
          <div className="bg-slate-50/50 border-t border-slate-100 py-2">
             <RubricNav 
               rubrics={allRubrics}
               activeCategory={activeCategory}
               activeSubCategory={activeSubCategory}
               onCategoryClick={handleCategoryClick}
               onSubCategoryClick={handleSubCategoryClick}
               siteSettings={siteSettings}
             />
          </div>
        )}
      </header>
      )}

      <main className={cn(
        (currentView === 'admin' || currentView === 'admin-login') 
          ? "w-full" 
          : "max-w-7xl mx-auto px-4 py-6 md:py-10 pb-28 lg:pb-10"
      )}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 py-10"
            >
              <ArticleSkeleton variant="hero" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ArticleSkeleton />
                <ArticleSkeleton />
                <ArticleSkeleton />
                <ArticleSkeleton />
              </div>
            </motion.div>
          ) : currentView === 'home' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Hierarchy-Specific Sections */}
              {activeCategory === 'SONDAGE' && (
                <section className="space-y-12 py-10">
                  <div className="text-center max-w-2xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse" /> Direct Opinion
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">Sondages & Opinions</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Exprimez votre avis sur les sujets qui comptent. Votre voix participe au débat public et forge la réflexion commune.</p>
                  </div>
                  {(Array.isArray(adminPolls) ? adminPolls : []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(Array.isArray(adminPolls) ? adminPolls : []).filter(p => !p.isarchived).map(poll => (
                        <div key={poll.id} className="bg-white p-2 rounded-[32px] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-500">
                          <PollCard poll={poll} onVote={handleVote} hasVoted={(currentUser?.votedpolls || []).includes(poll.id)} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-400 italic bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                      Aucun sondage actif pour le moment. Revenez bientôt !
                    </div>
                  )}
                </section>
              )}

              {/* Hero Section */}
              {activeCategory === 'À LA UNE' && visibleArticles.length > 0 && (
                <section className="space-y-10">
                  <HeroSlideshow 
                    articles={visibleArticles.slice(0, 3)} 
                    onArticleClick={handleArticleClick} 
                    onBookmark={(e, id) => { handleBookmarkArticle(id); }}
                    bookmarkedIds={userBookmarkedArticles}
                    onAuthorClick={handleAuthorClick}
                    categoryIcons={siteSettings?.categories_icons}
                  />

                  <FeaturedSection 
                    articles={visibleArticles} 
                    onArticleClick={handleArticleClick}
                    categoryIcons={siteSettings?.categories_icons}
                  />

                  {currentUser && userFollowedCategories.size === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6"
                    >
                      <div className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                        <Star size={32} fill="currentColor" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-black italic tracking-tight uppercase">Personnalisez votre Journal</h3>
                        <p className="text-slate-500 font-medium">Choisissez vos thématiques favorites pour un flux qui vous ressemble.</p>
                      </div>
                      <button 
                        onClick={() => setShowPreferenceModal(true)}
                        className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                      >
                        Configurer
                      </button>
                    </motion.div>
                  )}

                  {personalizedArticles.length > 0 && (
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                            <Star size={20} fill="currentColor" />
                          </div>
                          <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter italic">Pour Vous</h2>
                        </div>
                        <button 
                          onClick={() => setShowPreferenceModal(true)}
                          className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                        >
                          Modifier mes préférences
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {personalizedArticles?.map(article => (
                          <ArticleCard 
                            key={article.id}
                            article={article}
                            variant="vertical"
                            onClick={() => handleArticleClick(article)}
                            onBookmark={(e, id) => { handleBookmarkArticle(id); }}
                            isBookmarked={userBookmarkedArticles.has(article.id)}
                            onAuthorClick={handleAuthorClick}
                          />
                        ))}
                      </div>
                      <hr className="border-slate-100 mt-10" />
                    </section>
                  )}

                  <hr className="border-slate-100 my-10" />
                  
                  <TrendingSection 
                    articles={trendingArticles}
                    onArticleClick={handleArticleClick}
                    onBookmark={(e, id) => { handleBookmarkArticle(id); }}
                    bookmarkedIds={userBookmarkedArticles}
                    onAuthorClick={handleAuthorClick}
                    categoryIcons={siteSettings?.categories_icons}
                    onSeeMore={() => handleCategoryClick('Articles')}
                  />

                  <hr className="border-slate-100 my-10" />
                  <GoogleAd className="my-10" label="Annonce à la une" />
                </section>
              )}

              {/* Grid Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter italic">
                      {activeCategory === 'À LA UNE' ? <span className="text-red-600">Dernières Nouvelles</span> : activeCategory}
                    </h2>
                  </div>
                  {activeCategory !== 'À LA UNE' && (
                    <button 
                      onClick={() => handleFollowCategory(activeCategory)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all",
                        userFollowedCategories.has(activeCategory)
                          ? "bg-slate-200 text-slate-500"
                          : "bg-primary text-white shadow-lg shadow-primary/20"
                      )}
                    >
                      {userFollowedCategories.has(activeCategory) ? <Check size={14} /> : <Plus size={14} />}
                      {userFollowedCategories.has(activeCategory) ? 'Suivi' : 'Suivre'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedArticles.length > 0 ? displayedArticles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      variant="vertical"
                      onClick={() => handleArticleClick(article)} 
                      onBookmark={(e, id) => { handleBookmarkArticle(id); }}
                      isBookmarked={userBookmarkedArticles.has(article.id)}
                      onAuthorClick={handleAuthorClick}
                    />
                  )) : (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">
                      Aucun article disponible dans cette catégorie pour le moment.
                    </div>
                  )}
                </div>
                
                {/* Infinite Scroll Sentinel */}
                {displayedArticles.length < filteredArticles.length && (
                  <div ref={loadingRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
                    <ArticleSkeleton />
                    <ArticleSkeleton className="hidden md:block" />
                    <ArticleSkeleton className="hidden lg:block" />
                    <ArticleSkeleton className="hidden xl:block" />
                  </div>
                )}
                
                {activePoll && (
                  <div className="max-w-2xl mx-auto pt-10">
                    <PollCard 
                      poll={activePoll} 
                      onVote={handleVote} 
                      hasVoted={(currentUser?.votedpolls || []).includes(activePoll.id)} 
                    />
                  </div>
                )}
                
                {displayedArticles.length >= filteredArticles.length && filteredArticles.length > 0 && (
                  <div className="flex justify-center pt-8">
                    <button 
                      id="home-search-more-btn"
                      onClick={() => navigateTo('search')}
                      className="group flex items-center gap-3 bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl font-black text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
                    >
                      RECHERCHER D'AUTRES SUJETS
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </section>

              {activeCategory === 'À LA UNE' && (
                <>
                  <CultureSection 
                    posts={(Array.isArray(adminCulturePosts) ? adminCulturePosts : []).filter(p => p.status === 'published')} 
                    onPostClick={handleCultureClick}
                    onSeeAll={() => navigateTo('all-culture')}
                  />
                  
                  <div className="my-16 py-12 border-y border-slate-100 African-pattern rounded-[40px] px-6 md:px-10">
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10">
                      <div className="flex-1 space-y-6">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-none text-slate-900">
                          Rejoignez notre <span className="text-primary italic">Newsletter</span> quotidienne
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed text-lg max-w-xl">
                          Chaque matin, recevez une sélection rigoureuse de l'actualité qui façonne l'Afrique et le monde. L'info essentielle, sans le bruit.
                        </p>
                      </div>
                      <div className="w-full lg:w-[450px] shrink-0">
                        <NewsletterSignup 
                          variant="sidebar" 
                          className="bg-white/80 backdrop-blur-md shadow-2xl border-primary/20" 
                          onPrivacyClick={() => navigateTo('privacy')}
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 my-10" />

                  <EventSection 
                    events={visibleEvents} 
                    onEventClick={handleEventClick} 
                    onSeeAll={() => navigateTo('all-events')}
                  />
                </>
              )}
            </motion.div>
          ) : currentView === 'culture-detail' && selectedCulturePost ? (
            <CultureDetailView 
              post={selectedCulturePost} 
              onBack={goHome} 
            />
          ) : currentView === 'all-culture' ? (
            <div className="space-y-12">
               <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-2">
                      <ArrowLeft size={14} /> Retour à l'accueil
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">Histoire & <span className="text-primary">Culture</span></h1>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(Array.isArray(adminCulturePosts) ? adminCulturePosts : []).filter(p => p.status === 'published').map(post => (
                    <CultureCard key={post.id} post={post} onClick={handleCultureClick} />
                  ))}
               </div>
            </div>
          ) : currentView === 'event' && selectedEvent ? (
            <EventDetailView 
              event={selectedEvent} 
              onBack={goHome} 
            />
          ) : currentView === 'live-blog' ? (
            <LiveBlogView 
              blog={activeLiveBlog || (Array.isArray(liveBlogs) && liveBlogs.length > 0 ? liveBlogs[0] : {
                id: 'mock-live',
                title: "Dernière Actualité",
                updates: [],
                status: 'live',
              } as LiveBlog)}
              onBack={goHome} 
            />
          ) : currentView === 'classifieds' ? (
            <ClassifiedsView 
              classifieds={classifieds || []}
              onBack={goHome} 
              onAddClick={() => {
                if(!currentUser) handleUserLogin();
                else setShowClassifiedsModal(true);
              }}
            />
          ) : currentView === 'authors' ? (
            <AuthorsList 
              authors={MOCK_AUTHORS} 
              onAuthorClick={handleAuthorClick} 
              onBack={goHome} 
            />
          ) : currentView === 'unsubscribe' ? (
            <UnsubscribeView onHome={goHome} />
          ) : currentView === 'author-profile' && selectedAuthor ? (
            <AuthorProfile 
              author={selectedAuthor} 
              articles={(Array.isArray(adminArticles) ? adminArticles : []).filter(a => a.author === selectedAuthor.name)} 
              onBack={goHome} 
              onArticleClick={handleArticleClick}
              isFollowing={false}
              onFollow={() => {}}
            />
          ) : currentView === 'quiz' ? (
            <div className="max-w-xl mx-auto py-10">
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-8">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <QuizMini onClose={goHome} />
            </div>
          ) : currentView === 'map' ? (
            <div className="max-w-4xl mx-auto py-10">
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-8">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <MapMini onClose={goHome} />
            </div>
          ) : currentView === 'article' ? (
            selectedArticle ? (
              <motion.div 
                key="article"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <ShareFloatingButtons title={selectedArticle.title} url={window.location.href} />
                
                <div className="space-y-4 text-center">
                  <Breadcrumb items={[
                    { label: "Accueil", onClick: goHome },
                    { label: selectedArticle?.category || 'Actualité', onClick: () => handleCategoryClick(selectedArticle?.category) },
                    { label: "Lecture", active: true }
                  ]} />
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-6xl font-display font-black leading-[1.1] tracking-tight text-slate-900 drop-shadow-sm"
                  >
                    {selectedArticle?.title || 'Sans titre'}
                  </motion.h1>
                  <div className="w-24 h-2 bg-primary mx-auto rounded-full mt-6 mb-8" />
                {selectedArticle?.tags && Array.isArray(selectedArticle.tags) && selectedArticle.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {selectedArticle.tags.map((tag: any) => (
                      <button 
                        key={String(tag)}
                        onClick={() => {
                          setSearchQuery(String(tag));
                          navigateTo('search');
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
                      onClick={() => handleAuthorClick(selectedArticle?.author || 'Rédaction')}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                        {(selectedArticle?.author || 'R')[0]}
                      </div>
                      <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{selectedArticle?.author || 'Rédaction'}</span>
                      {selectedArticle?.authorrole && (
                        <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold uppercase ml-1">
                          {selectedArticle.authorrole}
                        </span>
                      )}
                    </div>
                    <span>•</span>
                  <span>{safeFormatDate(selectedArticle?.date, 'dd MMMM yyyy')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {selectedArticle?.readingtime || '5 min'}</span>
                </div>
              </div>

              {selectedArticle.audiourl && (
                <div className="bg-slate-900 rounded-[30px] p-6 text-white shadow-2xl border border-white/10 mt-8 mb-4">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-primary/20 rounded-2xl text-primary animate-pulse">
                      <TrendingUp size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Audio / Podcast</p>
                      <h4 className="font-bold text-sm italic">Écouter la version audio</h4>
                      <audio controls className="w-full h-8 mt-2 accent-primary">
                        <source src={selectedArticle.audiourl} type="audio/mpeg" />
                        Navigateur non supporté
                      </audio>
                    </div>
                  </div>
                </div>
              )}

              {(selectedArticle?.image || selectedArticle?.video) && (
                <div className="space-y-6">
                  {selectedArticle?.video && getYoutubeId(selectedArticle.video) && (
                    <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5 aspect-video">
                      <iframe 
                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedArticle?.video)}`}
                        title={selectedArticle?.title || 'Video'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  )}
                  {selectedArticle?.image && (
                    <div className="w-full rounded-[40px] overflow-hidden shadow-2xl bg-white border-8 border-white">
                      <div className="relative">
                        <img 
                          id={`article-detail-img-${selectedArticle?.id}`}
                          src={optimizeImage(selectedArticle.image, 1200)} 
                          alt={selectedArticle?.title || ''}
                          className="w-full h-auto max-h-[85vh] object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      {selectedArticle?.imagecredit && (
                        <div className="px-8 py-4 bg-slate-900 text-[10px] font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-3 relative z-10">
                          <div className="p-1.5 bg-white/10 rounded-lg">
                            <Camera size={14} />
                          </div>
                          <span>Crédit image : {selectedArticle.imagecredit}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
                <div className="space-y-8">
                    <div className="flex flex-col gap-6">
                      <AudioPlayer article={selectedArticle} />
                      {selectedArticle.gallery && selectedArticle.gallery.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                           {selectedArticle.gallery.map((img, i) => (
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
                      if (!selectedArticle) return null;
                      
                      const isPremiumArticle = selectedArticle.ispremium;
                      const hasAccess = !isPremiumArticle || (currentUser && (currentUser.ispremium || currentUser.role === 'admin' || currentUser.role === 'editor'));
                      
                      const currentContent = typeof selectedArticle.content === 'string' ? selectedArticle.content : '';
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
                                currentArticle={selectedArticle} 
                                articles={adminArticles} 
                                onArticleClick={handleArticleClick} 
                                onAuthorClick={handleAuthorClick}
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
                              currentArticle={selectedArticle} 
                              articles={adminArticles} 
                              onArticleClick={handleArticleClick} 
                              onAuthorClick={handleAuthorClick}
                            />
                          )}
                        </>
                      );
                    })()}

                    <RecommendedForYou 
                      articles={adminArticles} 
                      history={[]} 
                      onArticleClick={handleArticleClick} 
                      onAuthorClick={handleAuthorClick}
                    />
                  </div>

                  <GoogleAd className="my-8" label="Publicité ciblée" />

                  {selectedArticle.source && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-dotted border-slate-200">
                      <Globe size={14} /> Source : {selectedArticle.source}
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
                              const currentReactions = selectedArticle.reactions || {};
                              const newValue = (currentReactions[react.key] || 0) + 1;
                              handleSaveArticle({
                                ...selectedArticle,
                                reactions: { ...currentReactions, [react.key]: newValue }
                              });
                              setActiveNotification(`Vous avez réagi avec ${react.icon} !`);
                            }}
                            className="bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all flex flex-col items-center gap-1 group"
                          >
                            <span className="text-2xl group-hover:scale-125 transition-transform">{react.icon}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase">{selectedArticle.reactions?.[react.key] || 0}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-8">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => handleLikeArticle(selectedArticle.id)}
                          className={cn(
                            "flex items-center gap-2 transition-colors group",
                            userLikedArticles.has(selectedArticle.id) ? "text-red-500" : "text-slate-500 hover:text-primary"
                          )}
                        >
                          <div className={cn(
                            "p-3 rounded-full transition-colors",
                            userLikedArticles.has(selectedArticle.id) ? "bg-red-50" : "bg-slate-100 group-hover:bg-primary/10"
                          )}>
                            <Heart size={24} fill={userLikedArticles.has(selectedArticle.id) ? "currentColor" : "none"} />
                          </div>
                          <span className="font-bold">{(selectedArticle.likes || 0) + (articleLikes[selectedArticle.id] || 0)}</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group">
                          <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
                            <MessageSquare size={24} />
                          </div>
                          <span className="font-bold">{(selectedArticle.commentscount || 0) + (articleComments[selectedArticle.id]?.length || 0)}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Partager l'article</span>
                        <div className="flex gap-3">
                          {[
                            { icon: Twitter, color: 'bg-[#1DA1F2]', action: () => handleShareArticle(selectedArticle, 'twitter'), label: 'Twitter' },
                            { icon: Facebook, color: 'bg-[#4267B2]', action: () => handleShareArticle(selectedArticle, 'facebook'), label: 'Facebook' },
                            { icon: Share2, color: 'bg-primary', action: () => handleShareArticle(selectedArticle), label: 'Partage' }
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

                  {/* Comments */}
                  <div className="mt-12 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black">Commentaires</h3>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold uppercase">
                        Modération active
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      Les commentaires sont modérés avant publication.
                    </p>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                      {/* Recursive Comment Component */}
                      {(() => {
                        const renderComments = (comments: Comment[], isReply = false) => {
                          const topLevelComments = (Array.isArray(comments) ? comments : []).filter(c => !c.parentid);
                          const replies = (Array.isArray(comments) ? comments : []).filter(c => c.parentid);

                          const processComment = (comment: Comment, depth = 0) => {
                            const commentReplies = (Array.isArray(replies) ? replies : []).filter(r => r.parentid === comment.id);
                            
                            return (
                              <div key={comment.id} className={cn("space-y-4", depth > 0 && "ml-4 md:ml-10 mt-4 border-l-2 border-slate-100 pl-4")}>
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex gap-4"
                                >
                                  <div className={cn(
                                    "w-12 h-12 md:w-16 md:h-16 rounded-3xl flex items-center justify-center font-black shrink-0 shadow-inner",
                                    depth > 0 ? "bg-slate-100 text-slate-400 text-sm" : "bg-primary/10 text-primary text-xl"
                                  )}>
                                    {(comment.username || 'U')[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-sm">{comment.username}</span>
                                        {comment.isadmin && (
                                          <div className="bg-blue-500 text-white rounded-full p-0.5 shadow-sm">
                                            <Check size={10} strokeWidth={4} />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-slate-400">
                                        {safeFormatDate(comment.date, 'dd MMM yyyy HH:mm')}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                                    <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => {
                                          setReplyingTo({ commentId: comment.id, username: comment.username });
                                          document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-xs font-bold text-primary hover:underline"
                                      >
                                        Répondre
                                      </button>
                                      <button 
                                        onClick={() => handleLikeComment(selectedArticle.id, comment.id)}
                                        className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-red-500 transition-colors"
                                      >
                                        <Heart size={12} fill={comment.likedby?.includes(currentUser?.uid || '') ? "currentColor" : "none"} /> {comment.likes}
                                      </button>
                                      <button 
                                        onClick={() => handleReportComment(comment.id)}
                                        className="text-[10px] font-bold text-slate-300 hover:text-red-400 transition-colors uppercase tracking-widest flex items-center gap-1"
                                      >
                                        <Flag size={10} /> Signaler
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                                {commentReplies.length > 0 && (
                                  <div className="space-y-4">
                                    {commentReplies.map(reply => processComment(reply, depth + 1))}
                                  </div>
                                )}
                              </div>
                            );
                          };

                          if (topLevelComments.length === 0) {
                            return (
                              <div className="flex gap-4 opacity-50">
                                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                                <div className="flex-1 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold">Jean-Marc Koffi</span>
                                    <span className="text-xs text-slate-400">Exemple</span>
                                  </div>
                                  <p className="text-slate-600">Analyse très pertinente. Le potentiel est là, il manque juste l'accompagnement politique.</p>
                                </div>
                              </div>
                            );
                          }

                          return topLevelComments.map(comment => processComment(comment));
                        };
                        return renderComments(articleComments[selectedArticle.id] || []);
                      })()}

                      {/* Comment Form */}
                      <div id="comment-form" className="pt-6 border-t border-slate-100 space-y-4">
                        {replyingTo && (
                          <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500">
                              En réponse à <span className="font-bold text-primary">@{replyingTo.username}</span>
                            </span>
                            <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600">
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Votre nom..." 
                              value={commentAuthorName}
                              onChange={(e) => setCommentAuthorName(e.target.value)}
                              className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 items-end">
                          <textarea 
                            placeholder={replyingTo ? `Répondre à ${replyingTo.username}...` : "Ajouter un commentaire..."}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            rows={2}
                            className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                          <button 
                            onClick={() => handleAddComment(selectedArticle.id, replyingTo?.commentId)}
                            disabled={!newCommentText.trim() || !commentAuthorName.trim()}
                            className="bg-primary text-white p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
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
                    <ExchangeRatesWidget rates={exchangeRates} />
                    
                    {(selectedArticle.category === 'En Direct' || selectedArticle.tags?.includes('Live')) && (
                      <LiveChat articleId={selectedArticle.id} user={currentUser} isAdmin={isAdminAuthenticated} />
                    )}

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                         <Award size={20} />
                         <span className="font-black text-xs uppercase tracking-widest">Auteur</span>
                      </div>
                      <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => handleAuthorClick(selectedArticle.author)}
                      >
                         <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                           {(selectedArticle.author || 'R')[0]}
                         </div>
                         <div className="flex-1">
                            <div className="font-bold text-sm group-hover:text-primary transition-colors">{selectedArticle.author}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedArticle.authorrole || 'Journaliste'}</div>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleFollowAuthor(selectedArticle.author)}
                        className={cn(
                          "w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                          userFollowedAuthors.has(selectedArticle.author)
                            ? "bg-slate-200 text-slate-500"
                            : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105"
                        )}
                      >
                        {userFollowedAuthors.has(selectedArticle.author) ? 'Suivi' : 'S\'abonner'}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Articles Similaires</h4>
                      {(Array.isArray(adminArticles) ? adminArticles : []).filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category).slice(0, 3).map(article => (
                        <div key={article.id} onClick={() => handleArticleClick(article)} className="cursor-pointer group flex gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img src={optimizeImage(article.image || '', 300)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs leading-tight group-hover:text-primary transition-colors line-clamp-2">{article.title}</h5>
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">{safeFormatDate(article.date, 'dd MMM yyyy')}</span>
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
                currentArticle={selectedArticle}
                articles={adminArticles}
                onArticleClick={handleArticleClick}
                onBookmark={(e, id) => { handleBookmarkArticle(id); }}
                bookmarkedIds={userBookmarkedArticles}
                onAuthorClick={handleAuthorClick}
                categoryIcons={siteSettings?.categories_icons}
              />

              <ArticleCarousel 
                articles={(Array.isArray(visibleArticles) ? visibleArticles : []).filter(a => a.id !== selectedArticle.id)}
                onArticleClick={handleArticleClick}
                onBookmark={(e, id) => { handleBookmarkArticle(id); }}
                bookmarkedIds={userBookmarkedArticles}
                onAuthorClick={handleAuthorClick}
              />
            </motion.div>
          ) : (
            <div className="space-y-12 py-10 max-w-4xl mx-auto">
              <ArticleSkeleton variant="hero" />
              <div className="space-y-6">
                <Skeleton className="w-1/3 h-8 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ArticleSkeleton />
                  <ArticleSkeleton />
                </div>
              </div>
              <button 
                onClick={goHome} 
                className="mx-auto block bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
              >
                Retour à l'accueil
              </button>
            </div>
          )
        ) : currentView === 'search' ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto space-y-12 py-6"
            >
              <div className="space-y-6">
                <button 
                  onClick={goHome} 
                  className="group inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest pl-4"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                  Accueil
                </button>
                
                {/* Minimal Glass Bar */}
                <div className="relative z-50 px-4">
                  <div className="bg-white/80 backdrop-blur-2xl rounded-full p-2 shadow-2xl shadow-slate-200 border border-white flex items-center gap-2 pr-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                      <Search size={22} strokeWidth={3} />
                    </div>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Rechercher un scoop, un pays, un auteur..." 
                      className="flex-1 bg-transparent text-xl font-bold outline-none text-slate-900 px-2 placeholder:text-slate-300"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearching(true);
                        setTimeout(() => setIsSearching(false), 300);
                      }}
                    />
                    <div className="flex items-center gap-2">
                       {searchQuery && (
                         <button 
                          onClick={() => setSearchQuery('')} 
                          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                         >
                           <X size={16} strokeWidth={3} />
                         </button>
                       )}
                       <div className="w-px h-8 bg-slate-100 mx-2" />
                       <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 rounded-full transition-all text-[10px] font-black uppercase tracking-widest",
                          showFilters ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                        <Filter size={14} />
                        Filtres
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pill-shaped Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      className="px-4 overflow-hidden"
                    >
                      <div className="bg-slate-50 rounded-[2.5rem] p-8 mt-4 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Categories Pills */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Catégories</h4>
                               <div className="flex flex-wrap gap-2">
                                  {['Tout', ...(siteSettings?.categories || [])].slice(0, 8).map(c => (
                                    <button
                                      key={c}
                                      onClick={() => setFilterCategory(c === 'Tout' ? '' : c)}
                                      className={cn(
                                        "px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap",
                                        (filterCategory === c || (c === 'Tout' && !filterCategory)) 
                                          ? "bg-slate-900 text-white shadow-lg" 
                                          : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-100"
                                      )}
                                    >
                                      {c}
                                    </button>
                                  ))}
                               </div>
                            </div>

                            {/* Authors Pills */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Auteurs Populaires</h4>
                               <div className="flex flex-wrap gap-2">
                                  {['Tout', 'Koffi', 'Diallo', 'Ouattara', 'Yeboah'].map(a => (
                                    <button
                                      key={a}
                                      onClick={() => setFilterAuthor(a === 'Tout' ? '' : a)}
                                      className={cn(
                                        "px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap",
                                        (filterAuthor === a || (a === 'Tout' && !filterAuthor)) 
                                          ? "bg-primary text-white shadow-lg" 
                                          : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-100"
                                      )}
                                    >
                                      {a}
                                    </button>
                                  ))}
                               </div>
                            </div>

                            {/* Date Toggles */}
                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Date de publication</h4>
                               <div className="flex flex-col gap-2">
                                  {[
                                    { id: '', label: 'Toutes les dates' },
                                    { id: 'today', label: 'Aujourd\'hui' },
                                    { id: 'week', label: 'Cette semaine' },
                                    { id: 'month', label: 'Ce mois' }
                                  ].map(d => (
                                    <button
                                      key={d.id}
                                      onClick={() => setFilterDate(d.id)}
                                      className={cn(
                                        "w-full px-6 py-3 rounded-2xl text-left text-[10px] font-black uppercase transition-all flex items-center justify-between",
                                        filterDate === d.id ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                      )}
                                    >
                                      {d.label}
                                      {filterDate === d.id && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                                    </button>
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                            <p className="text-[9px] font-bold text-slate-400 italic">Combinez les filtres pour affiner vos résultats.</p>
                            <button 
                              onClick={() => {
                                setFilterCategory('');
                                setFilterAuthor('');
                                setFilterDate('');
                                setShowFilters(false);
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                            >
                              Réinitialiser tout
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {searchQuery ? (
                <div className="space-y-8 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                           <h2 className="text-3xl font-black italic tracking-tighter">Résultats</h2>
                           {isSearching ? (
                             <div className="flex gap-1">
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                             </div>
                           ) : (
                             <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black">
                               {searchResults.length}
                             </span>
                           )}
                        </div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Pour "{searchQuery}"</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-full">
                       <button 
                        onClick={() => setSearchViewMode('grid')}
                        className={cn("p-2.5 rounded-full transition-all", searchViewMode === 'grid' ? "bg-white text-slate-900 shadow-md" : "text-slate-400")}
                       >
                          <LayoutGrid size={18} />
                       </button>
                       <button 
                        onClick={() => setSearchViewMode('list')}
                        className={cn("p-2.5 rounded-full transition-all", searchViewMode === 'list' ? "bg-white text-slate-900 shadow-md" : "text-slate-400")}
                       >
                          <LayoutList size={18} />
                       </button>
                    </div>
                  </div>

                  <div className={cn(
                    "grid gap-8",
                    searchViewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                  )}>
                    {displayedSearchResults.map(article => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        variant={searchViewMode === 'grid' ? 'vertical' : 'horizontal'} 
                        onClick={() => handleArticleClick(article)}
                        onBookmark={(e, id) => { handleBookmarkArticle(id); }}
                        isBookmarked={userBookmarkedArticles.has(article.id)}
                        onAuthorClick={handleAuthorClick}
                      />
                    ))}
                  </div>

                  {displayedSearchResults.length < searchResults.length && (
                    <div ref={searchLoadingRef} className={cn(
                        "grid gap-8 py-10",
                        searchViewMode === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                    )}>
                      <ArticleSkeleton variant={searchViewMode === 'grid' ? 'grid' : 'list'} />
                      <ArticleSkeleton variant={searchViewMode === 'grid' ? 'grid' : 'list'} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-12 px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <HistoryIcon size={20} className="text-slate-300" />
                           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Recherches Récentes</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Can 2025', 'Politique Mali', 'Akwaba Africa', 'Élection CI'].map(q => (
                            <button 
                              key={q} 
                              onClick={() => setSearchQuery(q)}
                              className="px-5 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <TrendingUp size={20} className="text-primary" />
                           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Tendances du moment</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['ZLECAf', 'Innovation Abidjan', 'Afrobeat 2026', 'Climat Afrique', 'Économie Numérique', 'Startups Tech'].map(tag => (
                            <button 
                              key={tag} 
                              onClick={() => setSearchQuery(tag)}
                              className="px-6 py-3 bg-primary/5 border border-primary/10 rounded-2xl text-xs font-black text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-50 rounded-[3rem] p-12 text-center space-y-6 border border-slate-100">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <Search size={32} className="text-slate-200" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-black italic">Plus de 50 000 articles</h4>
                        <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto">Découvrez l'Afrique comme vous ne l'avez jamais lue à travers nos archives exclusives.</p>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : currentView === 'profile' && currentUser ? (
            <UserProfileTabs 
              user={currentUser}
              onUpdate={async (updates) => {
                if (currentUser) {
                  await api.updateUserProfile(currentUser.uid, updates);
                  setCurrentUser({ ...currentUser, ...updates });
                }
              }}
              activityLogs={adminLogs}
              articles={adminArticles}
              onArticleClick={handleArticleClick}
              onBookmark={(e, id) => { handleBookmarkArticle(id); }}
              bookmarkedIds={userBookmarkedArticles}
              categoryIcons={siteSettings?.categories_icons}
              playNotificationSound={playNotificationSound}
            />
          ) : currentView === 'donate' ? (
            <motion.div 
              key="donate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto py-12 px-4"
            >
              <div className="flex flex-col lg:flex-row gap-16 items-start">
                  {/* Left Column: Context & Goal */}
                  <div className="lg:w-1/2 space-y-12 lg:sticky lg:top-24">
                    <button 
                      onClick={goHome} 
                      className="group inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
                    >
                      <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                      Retour à l'accueil
                    </button>

                    <div className="space-y-6">
                       <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                          Soutenez la <br/>
                          <span className="text-primary italic">Liberté</span> de <br/>
                          l'information.
                       </h2>
                       <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                          Akwaba Info est un média 100% indépendant. Chaque don nous permet de financer nos reporters sur le terrain et de maintenir notre plateforme sans publicité intrusive.
                       </p>
                    </div>

                    {/* Goal Progress Bento */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8 border border-slate-100">
                       <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Objectif du mois</h4>
                          <span className="text-primary font-black italic">75% atteint</span>
                       </div>
                       <div className="space-y-4">
                          <div className="h-6 bg-white rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-slate-100">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: '75%' }}
                               transition={{ duration: 1.5, ease: "circOut" }}
                               className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full shadow-lg shadow-primary/20 relative"
                             >
                                <div className="absolute inset-0 bg-white/20 African-pattern opacity-30" />
                             </motion.div>
                          </div>
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                             <span>0 FCFA</span>
                             <span className="text-slate-900">1 000 000 FCFA</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                             <TrendingUp size={20} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 leading-tight">PLUS DE 142 DONATEURS ONT DÉJÀ CONTRIBUÉ CE MOIS-CI.</p>
                       </div>
                    </div>
                  </div>

                  {/* Right Column: Donation Form Card */}
                  <div className="lg:w-1/2 w-full">
                    <AnimatePresence mode="wait">
                      {donationSuccess ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 African-pattern opacity-5 pointer-events-none" />
                          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            <Heart size={48} fill="currentColor" className="animate-pulse" />
                            <motion.div 
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute inset-0 border-4 border-primary rounded-full" 
                            />
                          </div>
                          <div className="space-y-4">
                             <h2 className="text-4xl font-black italic tracking-tighter">Générosité Infinie.</h2>
                             <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                Votre contribution de <span className="font-bold text-slate-900">{selectedAmount} FCFA</span> a été enregistrée. Merci de faire partie de l'aventure Akwaba Info.
                             </p>
                          </div>
                          <div className="pt-8 space-y-4">
                             <button 
                               onClick={() => { setDonationSuccess(false); goHome(); }}
                               className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl"
                             >
                               Retour aux actualités
                             </button>
                             <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest italic">Un reçu vous sera envoyé par email</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-12"
                        >
                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2rem] italic">Étape 1 : Le Montant</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {[5000, 10000, 25000, 50000, 100000].map(amount => (
                                <button 
                                  key={amount} 
                                  onClick={() => setSelectedAmount(amount.toString())}
                                  className={cn(
                                    "px-6 py-5 rounded-[2rem] text-sm font-black transition-all flex flex-col items-center gap-1",
                                    selectedAmount === amount.toString() 
                                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                  )}
                                >
                                  <span>{amount.toLocaleString()}</span>
                                  <span className="text-[8px] opacity-70">FCFA</span>
                                </button>
                              ))}
                              <div className="relative">
                                 <input 
                                    type="number" 
                                    placeholder="Autre..." 
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => setSelectedAmount(e.target.value)}
                                    className="w-full h-full bg-slate-50 border border-transparent rounded-[2rem] px-6 text-sm font-black outline-none focus:border-primary transition-all text-center placeholder:text-slate-300"
                                 />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2rem] italic">Étape 2 : Mode de Paiement</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(siteSettings.activepaymentmethods || {}).filter(([_, active]) => active).map(([method]) => (
                                <button 
                                  key={method}
                                  onClick={() => setSelectedPayment(method)}
                                  className={cn(
                                    "group flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] border-2 transition-all aspect-square",
                                    selectedPayment === method
                                      ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                                      : "border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200"
                                  )}
                                >
                                  <div className="p-2 transition-transform group-hover:scale-110">
                                     {getPaymentIcon(method, selectedPayment === method)}
                                  </div>
                                  <span className="text-[8px] font-black uppercase tracking-widest text-center">{getPaymentLabel(method)}</span>
                                </button>
                              ))}
                            </div>

                            <AnimatePresence>
                              {selectedPayment && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden pt-4"
                                >
                                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                                     <div className="absolute inset-0 African-pattern opacity-10 pointer-events-none" />
                                     <div className="text-center space-y-6 relative z-10">
                                        {(() => {
                                          const details = (() => {
                                            switch(selectedPayment) {
                                              case 'paypal': return siteSettings.paymentlinks?.paypal;
                                              case 'stripe': return siteSettings.paymentlinks?.stripe;
                                              case 'flutterwave': return siteSettings.paymentlinks?.flutterwave;
                                              case 'orangeMoney': return siteSettings.orangemoneynumber;
                                              case 'wave': return siteSettings.wavenumber;
                                              case 'mtn': return siteSettings.mtnmoneynumber;
                                              case 'moov': return siteSettings.moovmoneynumber;
                                              default: return "INSTRUCTIONS";
                                            }
                                          })();
                                          
                                          const isUrl = details?.toString().startsWith('http');
                                          
                                          if (isUrl) {
                                            return (
                                              <div className="space-y-6">
                                                <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Paiement Sécurisé via Portail</p>
                                                <a href={details} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                                                  Ouvrir {getPaymentLabel(selectedPayment)} <ExternalLink size={14} />
                                                </a>
                                              </div>
                                            );
                                          }
                                          
                                          return (
                                            <div className="space-y-10">
                                              <div className="space-y-2">
                                                <p className="text-[9px] font-black uppercase text-primary tracking-[0.3em]">Numéro du Receveur</p>
                                                <p className="text-4xl font-black tracking-tighter italic">{details || "00 00 00 00"}</p>
                                              </div>
                                              <div className="space-y-4 text-left">
                                                 <label className="text-[9px] font-black uppercase text-white/40 tracking-widest px-1">ID de Transaction / Référence SMS</label>
                                                 <input 
                                                   type="text"
                                                   placeholder="Collez ici le code de confirmation..."
                                                   value={transactionId}
                                                   onChange={(e) => setTransactionId(e.target.value)}
                                                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-white placeholder:text-white/20"
                                                 />
                                              </div>
                                            </div>
                                          );
                                        })()}
                                     </div>
                                  </div>
                                  
                                  <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      if (!transactionId && !siteSettings.paymentlinks?.[selectedPayment as keyof typeof siteSettings.paymentlinks]?.toString().startsWith('http')) {
                                        alert("Veuillez entrer la référence de transaction.");
                                        return;
                                      }
                                      const amountVal = parseInt(selectedAmount) || 0;
                                      handleConfirmPayment(amountVal, selectedPayment, 'donation', transactionId).then(() => {
                                         confetti({
                                           particleCount: 150,
                                           spread: 70,
                                           origin: { y: 0.6 },
                                           colors: ['#1FA463', '#000000', '#FFCC00']
                                         });
                                         setDonationSuccess(true);
                                         setTransactionId('');
                                      });
                                    }}
                                    className="w-full mt-8 bg-primary text-white py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                                  >
                                    Finaliser mon Don
                                  </motion.button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          <div className="flex items-center gap-4 justify-center grayscale opacity-30 mt-10">
                             <Shield size={20} />
                             <Lock size={20} />
                             <span className="text-[8px] font-black uppercase tracking-widest">Sécurité 256-bit SSL</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              </div>
            </motion.div>
          ) : currentView === 'webtv' ? (
            <motion.div 
              key="webtv"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
            <WebTVView videos={adminWebTV} onVideoClick={async (v) => {
              const mockArticle: Article = {
                  id: v.id,
                  title: v.title,
                  content: v.description,
                  video: v.videourl,
                  image: v.thumbnail,
                  category: v.category,
                  date: v.date,
                  author: "Web TV",
                  views: v.views,
                  likes: 0,
                  slug: v.id,
                  excerpt: v.description.substring(0, 100),
                  readingtime: "5 min",
                  status: 'published'
              };
              handleArticleClick(mockArticle);
            }} />
            </motion.div>
          ) : currentView === 'about' ? (
            <motion.div 
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto py-10 space-y-8"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-4xl font-black">À propos d'Akwaba Info</h2>
              <div className="markdown-body space-y-6">
                <ReactMarkdown>
                  {siteSettings.abouttext || "Akwaba Info est votre source de référence pour l'actualité en Afrique et dans le monde."}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : currentView === 'privacy' ? (
            <motion.div 
              key="privacy" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto py-10 space-y-8"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-4xl font-black">Politique de Confidentialité</h2>
              <div className="markdown-body">
                <ReactMarkdown>{`
## 1. Introduction  
Chez Akwaba Info, la protection de vos données personnelles est une priorité. Cette politique de confidentialité vise à vous informer de manière claire et transparente sur la manière dont nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre site.

## 2. Données collectées  
Nous collectons uniquement les informations nécessaires au bon fonctionnement de nos services, notamment :  
- Les données de navigation (adresse IP, type d’appareil, navigateur, pages consultées)  
- Les informations que vous fournissez volontairement (formulaire de contact, inscription à une newsletter, etc.)  

## 3. Utilisation des données  
Les données collectées sont utilisées pour :  
- Assurer le bon fonctionnement du site  
- Améliorer l’expérience utilisateur  
- Répondre à vos demandes et messages  
- Envoyer des informations ou actualités (si vous y avez consenti)

## 4. Cookies  
Notre site peut utiliser des cookies pour :  
- Faciliter votre navigation  
- Analyser l’audience et les performances du site  

Vous pouvez configurer votre navigateur pour refuser les cookies si vous le souhaitez.

## 5. Partage des données  
Vos données personnelles ne sont ni vendues ni louées. Elles peuvent être partagées uniquement avec des prestataires techniques nécessaires au fonctionnement du site, dans le respect de la confidentialité.

## 6. Sécurité  
Nous mettons en place des mesures de sécurité appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation.

## 7. Vos droits  
Conformément aux réglementations en vigueur, vous disposez des droits suivants :  
- Droit d’accès à vos données  
- Droit de rectification  
- Droit de suppression  
- Droit d’opposition au traitement de vos données  

Pour exercer ces droits, vous pouvez nous contacter.

## 8. Modifications  
Cette politique de confidentialité peut être mise à jour à tout moment. Nous vous recommandons de la consulter régulièrement.

## 9. Contact  
Pour toute question concernant cette politique ou vos données personnelles, vous pouvez nous contacter via les moyens disponibles sur notre site.

---

Dernière mise à jour : Avril 2026
`}</ReactMarkdown>
              </div>
            </motion.div>
          ) : currentView === 'terms' ? (
            <motion.div 
              key="terms" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto py-10 space-y-8"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-4xl font-black">Conditions Générales d’Utilisation (CGU)</h2>
              <div className="markdown-body">
                <ReactMarkdown>{`
## 1. Objet  
Les présentes Conditions Générales d’Utilisation régissent l’accès et l’utilisation du site Akwaba Info.

## 2. Accès au site  
Le site est accessible gratuitement à tout utilisateur disposant d’un accès à Internet. Tous les frais liés à l’accès (connexion, matériel, etc.) sont à la charge de l’utilisateur.

## 3. Contenu  
Les contenus publiés (articles, images, informations) sont fournis à titre informatif. Akwaba Info s’efforce de fournir des informations fiables, mais ne garantit pas leur exactitude ou leur mise à jour en temps réel.

## 4. Propriété intellectuelle  
Tous les contenus du site (textes, images, logo, etc.) sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation est interdite.

## 5. Responsabilité  
L’utilisateur est seul responsable de l’utilisation qu’il fait des informations disponibles sur le site.  
Akwaba Info ne pourra être tenu responsable en cas de dommages directs ou indirects liés à l’utilisation du site.

## 6. Comportement de l’utilisateur  
L’utilisateur s’engage à :  
- Ne pas utiliser le site à des fins illégales  
- Ne pas perturber le bon fonctionnement du site  
- Respecter les autres utilisateurs  

## 7. Liens externes  
Le site peut contenir des liens vers des sites externes. Akwaba Info n’est pas responsable du contenu de ces sites.

## 8. Modification des conditions  
Les présentes conditions peuvent être modifiées à tout moment. Les utilisateurs sont invités à les consulter régulièrement.

## 9. Droit applicable  
Les présentes conditions sont régies par les lois en vigueur dans le pays d’exploitation du site.

## 10. Contact  
Pour toute question concernant les conditions d’utilisation, vous pouvez nous contacter via les moyens disponibles sur le site.

---

Dernière mise à jour : Avril 2026
`}</ReactMarkdown>
              </div>
            </motion.div>
          ) : currentView === 'contact' ? (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto py-10 space-y-12"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black">Contactez-nous</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Une question ? Une suggestion ? Ou vous souhaitez simplement nous dire Akwaba ? Notre équipe est à votre écoute.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <MapIcon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adresse</p>
                        <p className="font-bold">{siteSettings.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                        <p className="font-bold">{siteSettings.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Send size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="font-bold">{siteSettings.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleContactSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Nom complet</label>
                    <input 
                      type="text" 
                      required 
                      value={contactForm.name}
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Message</label>
                    <textarea 
                      required 
                      value={contactForm.message}
                      onChange={e => setContactForm({...contactForm, message: e.target.value})}
                      rows={4} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                      placeholder="Votre message..."
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg shadow-primary/20">ENVOYER</button>
                </form>
              </div>
            </motion.div>
          ) : currentView === 'all-events' ? (
            <motion.div 
              key="all-events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto py-10 space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                    <ArrowLeft size={14} /> Retour à l'accueil
                  </button>
                  <h2 className="text-4xl font-black tracking-tighter">Agenda Complet</h2>
                  <p className="text-slate-500 mt-2">Tous les événements culturels et artistiques</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {visibleEvents.map((event) => (
                  <motion.div 
                    key={event.id}
                    id={`event-card-all-${event.id}`}
                    whileHover={{ y: -10 }}
                    onClick={() => handleEventClick(event)}
                    className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 cursor-pointer group"
                  >
                    <div className="relative overflow-hidden bg-slate-50">
                      {event.image && (
                        <img 
                          id={`event-card-img-all-${event.id}`}
                          src={optimizeImage(event.image, 800, 'contain')} 
                          alt={event.title}
                          className="w-full h-auto"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                          {event.category}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">{safeFormatDate(event.date, 'dd MMMM yyyy')}</span>
                      </div>
                      <h3 className="font-black text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Map size={14} />
                        <span className="text-xs font-bold">{event.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : currentView === 'cookies' ? (
            <motion.div 
              key="cookies" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto py-10 space-y-8"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-4xl font-black">Politique relative aux Cookies</h2>
              <div className="markdown-body">
                <ReactMarkdown>{`
## 1. Introduction  
Le site Akwaba Info utilise des cookies afin d’améliorer votre expérience de navigation et d’analyser l’utilisation du site.

## 2. Qu’est-ce qu’un cookie ?  
Un cookie est un petit fichier texte enregistré sur votre appareil (ordinateur, smartphone, tablette) lors de votre visite sur un site web. Il permet de reconnaître votre appareil et de mémoriser certaines informations.

## 3. Types de cookies utilisés  
Nous utilisons différents types de cookies :  
- Cookies essentiels : nécessaires au bon fonctionnement du site  
- Cookies analytiques : permettent de mesurer l’audience et comprendre l’utilisation du site  
- Cookies de préférence : mémorisent vos choix (langue, paramètres)

## 4. Gestion des cookies  
Vous pouvez à tout moment configurer votre navigateur pour :  
- Accepter tous les cookies  
- Refuser tous les cookies  
- Être informé lorsqu’un cookie est déposé  

Notez que le refus de certains cookies peut affecter le fonctionnement du site.

## 5. Durée de conservation  
Les cookies sont conservés pour une durée limitée, en fonction de leur type, et conformément aux réglementations en vigueur.

## 6. Modification de la politique  
Cette politique peut être modifiée à tout moment afin de rester conforme aux lois et aux évolutions du site.

---

Dernière mise à jour : Avril 2026
`}</ReactMarkdown>
              </div>
            </motion.div>
          ) : currentView === 'admin-login' ? (
            <AdminLogin 
              onLogin={handleAdminLogin} 
            />
          ) : currentView === 'admin' ? (
            !isAuthChecked ? (
              <SplashScreen />
            ) : isAdminAuthenticated ? (
              editingArticle ? (
                <AdminEditor 
                  type="article"
                  categories={siteSettings.categories}
                  countries={siteSettings.countries}
                  themes={siteSettings.categories}
                  data={editingArticle} 
                  onSave={handleSaveArticle} 
                  onCancel={() => setEditingArticle(null)} 
                  allArticles={adminArticles}
                />
              ) : editingEvent ? (
                <AdminEditor 
                  type="event"
                  categories={siteSettings.categories}
                  countries={siteSettings.countries}
                  themes={siteSettings.categories}
                  data={editingEvent} 
                  onSave={handleSaveEvent} 
                  onCancel={() => setEditingEvent(null)} 
                />
              ) : editingLiveBlog ? (
                <LiveBlogEditor 
                  blog={editingLiveBlog}
                  onSave={handleSaveLiveBlog}
                  onCancel={() => setEditingLiveBlog(null)}
                />
              ) : editingWebTV ? (
                <WebTVEditor 
                  video={editingWebTV}
                  categories={siteSettings.categories}
                  onSave={handleSaveWebTV}
                  onCancel={() => setEditingWebTV(null)}
                />
              ) : editingPoll ? (
                <PollEditor 
                  poll={editingPoll}
                  onSave={handleSavePoll}
                  onCancel={() => setEditingPoll(null)}
                />
              ) : editingClassified ? (
                <ClassifiedEditor 
                  classified={editingClassified}
                  onSave={handleSaveClassified}
                  onCancel={() => setEditingClassified(null)}
                />
              ) : editingCulturePost ? (
                <CulturePostEditor 
                  post={editingCulturePost}
                  onSave={handleSaveCulturePost}
                  onCancel={() => setEditingCulturePost(null)}
                />
              ) : editingAuthor ? (
                <AuthorEditor 
                  author={editingAuthor}
                  onSave={handleSaveAuthor}
                  onCancel={() => setEditingAuthor(null)}
                />
              ) : (
                <AdminDashboard 
                  articles={adminArticles}
                  events={adminEvents}
                  classifieds={classifieds}
                  comments={allComments}
                  subscribers={subscribers}
                  mediaLibrary={mediaLibrary}
                  settings={siteSettings}
                  polls={adminPolls}
                  liveBlogs={adminLiveBlogs}
                  webTV={adminWebTV}
                  initialTab={adminActiveTab}
                  onEditArticle={(a) => setEditingArticle(a)}
                  onEditEvent={(e) => setEditingEvent(e)}
                  onEditPoll={(p) => setEditingPoll(p)}
                  onEditLiveBlog={(l) => setEditingLiveBlog(l)}
                  onEditWebTV={(v) => setEditingWebTV(v)}
                  onEditClassified={(c) => setEditingClassified(c)}
                  onCreateArticle={() => setEditingArticle({ id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0] } as any)}
                  onCreateEvent={() => setEditingEvent({ id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0] } as any)}
                  onCreatePoll={() => setEditingPoll({ id: crypto.randomUUID(), startDate: new Date().toISOString().split('T')[0], options: [{id: '1', text: '', votes: 0}, {id: '2', text: '', votes: 0}], active: true } as any)}
                  onCreateLiveBlog={() => setEditingLiveBlog({ id: crypto.randomUUID(), title: '', updates: [], status: 'live', createdat: new Date().toISOString() } as any)}
                  onCreateWebTV={() => setEditingWebTV({ id: crypto.randomUUID(), title: '', description: '', videourl: '', thumbnail: '', category: 'Web TV', date: new Date().toISOString(), views: 0 } as any)}
                  onCreateClassified={() => setEditingClassified({ id: crypto.randomUUID(), title: '', description: '', category: 'divers', location: '', contact: '', date: new Date().toISOString(), status: 'active', userid: currentUser?.uid || 'admin', username: currentUser?.displayname || 'Admin' } as any)}
                  onDeleteArticle={handleDeleteArticle}
                  onDeleteEvent={handleDeleteEvent}
                  onDeletePoll={handleDeletePoll}
                  onDeleteLiveBlog={handleDeleteLiveBlog}
                  onDeleteWebTV={handleDeleteWebTV}
                  onDeleteClassified={handleDeleteClassified}
                  onDeleteComment={handleDeleteComment}
                  onDeleteSubscriber={handleDeleteSubscriber}
                  onDeleteMedia={handleDeleteMediaAsset}
                  onBlockUser={handleBlockUser}
                  onDeleteUser={handleDeleteUser}
                  users={adminUsers}
                  onSaveSettings={handleSaveSettings}
                  onLogout={handleAdminLogout}
                  onBackToHome={() => navigateTo('home')}
                  onSaveAuthor={handleSaveAuthor}
                  authors={adminAuthors}
                  onEditAuthor={(a) => setEditingAuthor(a)}
                  onCreateAuthor={() => setEditingAuthor({ id: crypto.randomUUID(), name: '', role: '', bio: '', image: '', socials: {}, specialties: [] })}
                  onDeleteAuthor={handleDeleteAuthor}
                  culturePosts={adminCulturePosts}
                  onEditCulturePost={(p) => setEditingCulturePost(p)}
                  onCreateCulturePost={() => setEditingCulturePost({ 
                    id: crypto.randomUUID(), 
                    title: '', 
                    excerpt: '', 
                    content: '', 
                    category: 'tradition',
                    author: currentUser?.displayname || 'Admin',
                    date: new Date().toISOString(),
                    views: 0,
                    likes: 0,
                    status: 'draft',
                    createdat: new Date().toISOString()
                  } as any)}
                  onDeleteCulturePost={handleDeleteCulturePost}
                  onValidateTransaction={handleValidateTransaction}
                  onGenerateCode={() => setShowExportModal(true)}
                  setActiveNotification={setActiveNotification}
                  stats={adminStats}
                  currentUser={currentUser}
                  activityLogs={adminLogs}
                />
              )
            ) : (
              <AdminLogin 
                onLogin={handleAdminLogin} 
              />
            )
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showExportModal && (
            <ExportModal 
              articles={adminArticles} 
              events={adminEvents}
              onClose={() => setShowExportModal(false)} 
            />
          )}
        </AnimatePresence>
      </main>

      {!['admin', 'admin-login'].includes(currentView) && (
        <Footer onNavigate={navigateTo} onCategoryClick={handleCategoryClick} categories={categories} />
      )}

      {/* Mobile Bottom Nav */}
      {!['admin', 'admin-login'].includes(currentView) && (
      <nav className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-xl border-t flex items-center justify-around px-4 z-50 bg-white/90 border-slate-200"
      )}>
        <button onClick={goHome} className={cn("flex flex-col items-center gap-1", currentView === 'home' ? "text-primary" : "text-slate-500")}>
          <Home size={20} />
          <span className="text-[10px] font-black uppercase tracking-wider">Accueil</span>
        </button>
        <button onClick={() => navigateTo('search')} className={cn("flex flex-col items-center gap-1", currentView === 'search' ? "text-primary" : "text-slate-500")}>
          <Search size={20} />
          <span className="text-[10px] font-black uppercase tracking-wider">Recherche</span>
        </button>
        <button onClick={() => navigateTo('donate')} className={cn("flex flex-col items-center gap-1", currentView === 'donate' ? "text-primary" : "text-slate-500")}>
          <Heart size={20} />
          <span className="text-[10px] font-black uppercase tracking-wider">Dons</span>
        </button>
        <button 
          onClick={() => currentUser ? navigateTo('profile') : handleUserLogin()} 
          className={cn("flex flex-col items-center gap-1", currentView === 'profile' ? "text-primary" : "text-slate-500")}
        >
          <User size={20} />
          <span className="text-[10px] font-black uppercase tracking-wider">Profil</span>
        </button>
      </nav>
      )}
      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSuccess={handleAuthSuccess}
        setActiveNotification={setActiveNotification}
        isDarkMode={false}
      />
      <NewsletterModal delay={5000} onPrivacyClick={() => navigateTo('privacy')} />
      <AnimatePresence>
        {showPremiumModal && (
          <PremiumModal 
            onClose={() => {
              setShowPremiumModal(false);
              setPaymentInitiated(false);
            }} 
            onUpgrade={handleUpgradePremium}
            price={siteSettings.premiumprice}
            activeMethods={siteSettings.activepaymentmethods}
            settings={siteSettings}
            getPaymentIcon={getPaymentIcon}
            getPaymentLabel={getPaymentLabel}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}



