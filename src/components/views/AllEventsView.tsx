import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { safeFormatDate, optimizeImage } from '../../lib/utils';
import { Event } from '../../types';

interface AllEventsViewProps {
  goHome: () => void;
  visibleEvents: Event[];
  handleEventClick: (event: Event) => void;
}

export const AllEventsView = ({
  goHome,
  visibleEvents,
  handleEventClick
}: AllEventsViewProps) => {
  return (
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
                <MapPin size={14} />
                <span className="text-xs font-bold">{event.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
