import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, Share2, Ticket, Users, Clock, Info, X, Zap, Smartphone, Mail, User, CheckCircle2 } from 'lucide-react';
import { safeFormatDate, optimizeImage, cn } from '../../lib/utils';
import { Event } from '../../types';
import confetti from 'canvas-confetti';

interface EventDetailViewProps {
  event: Event;
  onBack: () => void;
  onConfirmPayment?: (amount: number, method: string, type: string, reference: string) => Promise<any>;
}

export const EventDetailView = ({ event, onBack, onConfirmPayment }: EventDetailViewProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'success'>('details');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    seats: 1
  });
  const [selectedMethod, setSelectedMethod] = useState('');
  const [transactionRef, setTransactionRef] = useState('');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event.ispaid && event.price && event.price > 0) {
      setBookingStep('payment');
    } else {
      setBookingStep('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedMethod) return;
    if (!transactionRef) {
      alert("Veuillez entrer la référence de transaction.");
      return;
    }

    if (onConfirmPayment) {
      await onConfirmPayment((event.price || 0) * bookingForm.seats, selectedMethod, 'event_ticket', transactionRef);
    }
    
    setBookingStep('success');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1FA463', '#000000', '#FFCC00']
    });
  };

  return (
    <motion.div 
      key="event-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto py-10 space-y-12 px-4"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left: Visual & Details */}
        <div className="lg:w-2/5 space-y-8 lg:sticky lg:top-24">
          <button 
            onClick={onBack} 
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest px-1"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Retour à l'agenda
          </button>
          
          <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200 group">
             <img 
               src={optimizeImage(event.image || '', 1200, 'contain')} 
               alt={event.title}
               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
             <div className="absolute bottom-8 left-8 right-8">
                <div className="flex gap-2 mb-4">
                  <div className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    {event.category}
                  </div>
                  {event.ispaid && (
                    <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                      PAYANT
                    </div>
                  )}
                </div>
                <h1 className="text-white text-3xl font-black italic leading-[1.1] tracking-tighter">{event.title}</h1>
             </div>
          </div>

          <div className="flex justify-center gap-6">
             <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group">
                <Share2 size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Partager</span>
             </button>
             <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors group">
                <Info size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Signaler</span>
             </button>
          </div>
        </div>

        {/* Right: Info & CTA */}
        <div className="lg:w-3/5 space-y-12 pt-8 lg:pt-14 w-full">
           <div className="space-y-12">
             {/* Key Info Bento */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Calendar size={22} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                      <p className="font-black text-xl italic tracking-tight">{safeFormatDate(event.date, 'dd MMMM yyyy')}</p>
                   </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                      <Clock size={22} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heure</p>
                      <p className="font-black text-xl italic tracking-tight">À partir de 19:00</p>
                   </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-3 col-span-2 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                         <MapPin size={28} />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lieu de l'événement</p>
                         <p className="font-black text-2xl italic tracking-tight leading-tight">{event.location}</p>
                      </div>
                   </div>
                </div>
                {event.ispaid && event.price && (
                <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 space-y-3 col-span-2 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                         <Ticket size={28} />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Tarif Unique</p>
                         <p className="font-black text-3xl italic tracking-tighter text-amber-900">{event.price.toLocaleString()} FCFA</p>
                      </div>
                   </div>
                </div>
                )}
             </div>

             <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                   <Users size={16} /> À propos de l'événement
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                  {event.content || "Aucune description détaillée n'est disponible pour cet événement. Veuillez contacter l'organisateur pour plus d'informations."}
                </div>
             </div>

             {/* Participation Card */}
             {!showBookingForm ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden group"
               >
                  <div className="absolute inset-0 African-pattern opacity-10 pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                     <div className="flex-1 space-y-3 text-center md:text-left">
                        <h4 className="text-3xl font-black italic tracking-tighter leading-none">Voulez-vous participer ?</h4>
                        <p className="text-slate-400 font-medium text-sm">
                          {event.ispaid ? "Réservez votre place dès maintenant pour cet événement VIP." : "Inscrivez-vous pour recevoir les rappels et les directions exclusives."}
                        </p>
                     </div>
                     <button 
                       onClick={() => setShowBookingForm(true)}
                       className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shrink-0"
                     >
                        <Ticket size={24} /> {event.ispaid ? 'RÉSERVER MON BILLET' : "S'INSCRIRE"}
                     </button>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white rounded-[3rem] p-8 md:p-12 border-2 border-slate-100 shadow-2xl space-y-8 relative overflow-hidden"
               >
                  <button 
                    onClick={() => { setShowBookingForm(false); setBookingStep('details'); }}
                    className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <AnimatePresence mode="wait">
                    {bookingStep === 'details' ? (
                      <motion.div 
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                         <div className="space-y-2">
                           <h4 className="text-2xl font-black italic tracking-tighter">Votre Réservation</h4>
                           <p className="text-slate-400 text-sm font-medium">Veuillez remplir vos informations pour générer votre pass.</p>
                         </div>

                         <form onSubmit={handleBookingSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nom Complet</label>
                                  <div className="relative">
                                     <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                     <input 
                                       required
                                       type="text" 
                                       value={bookingForm.name}
                                       onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                       placeholder="ex : Jean Koffi"
                                     />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
                                  <div className="relative">
                                     <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                     <input 
                                       required
                                       type="email" 
                                       value={bookingForm.email}
                                       onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                       placeholder="ex : jean@example.com"
                                     />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Téléphone</label>
                                  <div className="relative">
                                     <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                     <input 
                                       required
                                       type="tel" 
                                       value={bookingForm.phone}
                                       onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                       placeholder="ex : +225 07..."
                                     />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre de places</label>
                                  <input 
                                    required
                                    type="number" 
                                    min="1"
                                    max="5"
                                    value={bookingForm.seats}
                                    onChange={e => setBookingForm({...bookingForm, seats: parseInt(e.target.value)})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                  />
                               </div>
                            </div>
                            <button 
                              type="submit"
                              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3"
                            >
                               {event.ispaid ? 'CONTINUER VERS LE PAIEMENT' : 'CONFIRMER MON INSCRIPTION'}
                            </button>
                         </form>
                      </motion.div>
                    ) : bookingStep === 'payment' ? (
                      <motion.div 
                        key="payment"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                         <div className="space-y-2">
                           <h4 className="text-2xl font-black italic tracking-tighter">Paiement Sécurisé</h4>
                           <p className="text-slate-400 text-sm font-medium">Montant total : <span className="text-slate-900 font-black">{(event.price || 0) * bookingForm.seats} FCFA</span></p>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            {['orangeMoney', 'wave', 'mtn', 'moov'].map(method => (
                              <button 
                                key={method}
                                onClick={() => setSelectedMethod(method)}
                                className={cn(
                                  "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3",
                                  selectedMethod === method ? "border-primary bg-primary/5 text-primary scale-[1.02]" : "border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-100"
                                )}
                              >
                                {method === 'orangeMoney' ? <div className="w-10 h-10 bg-[#FF6600] rounded-xl" /> : method === 'wave' ? <div className="w-10 h-10 bg-[#14A8FF] rounded-xl flex items-center justify-center text-white font-black">W</div> : <Smartphone size={24} />}
                                <span className="text-[9px] font-black uppercase tracking-widest">{method.replace('Money', '')}</span>
                              </button>
                            ))}
                         </div>

                         {selectedMethod && (
                           <motion.div 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             className="space-y-6 pt-4"
                           >
                              <div className="bg-slate-900 rounded-3xl p-6 text-white text-center space-y-4">
                                 <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Référence de Paiement</p>
                                 <input 
                                   type="text"
                                   placeholder="Entrez le code de confirmation SMS..."
                                   value={transactionRef}
                                   onChange={e => setTransactionRef(e.target.value)}
                                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-primary transition-all text-white placeholder:text-white/20 text-center"
                                 />
                              </div>
                              <button 
                                onClick={handlePaymentConfirm}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                              >
                                CONFIRMER LE PAIEMENT
                              </button>
                           </motion.div>
                         )}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10 space-y-8"
                      >
                         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <CheckCircle2 size={48} />
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-4xl font-black italic tracking-tighter">Félicitations !</h4>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">
                              Votre réservation pour <span className="font-bold text-slate-900">{event.title}</span> a été confirmée. Vous allez recevoir vos billets par email.
                            </p>
                         </div>
                         <button 
                           onClick={onBack}
                           className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
                         >
                            RETOUR À L'AGENDA
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </motion.div>
             )}

             <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-3">
                {['Culture', 'VIP', 'Abidjan', 'Musique', 'Art'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-colors cursor-default">
                    #{tag}
                  </span>
                ))}
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
