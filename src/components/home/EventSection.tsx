import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { safeFormatDate, optimizeImage } from '../../lib/utils';
import { Event } from '../../types';

interface EventSectionProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onSeeAll: () => void;
}

export const EventSection = ({
  events,
  onEventClick,
  onSeeAll
}: EventSectionProps) => {
  return (
    <section className="space-y-10 py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Calendar size={20} />
          </div>
          <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter italic">Agenda<span className="text-primary truncate ml-2">Culture & VIP</span></h2>
        </div>
        <button 
          onClick={onSeeAll}
          className="group flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-all"
        >
          Tout Voir <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.slice(0, 4).map((event) => (
          <motion.div 
            key={event.id}
            id={`event-card-${event.id}`}
            whileHover={{ y: -10 }}
            onClick={() => onEventClick(event)}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 cursor-pointer group hover:shadow-2xl transition-all duration-500"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
               <img 
                 src={optimizeImage(event.image || '', 600)} 
                 alt={event.title}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
               <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-lg">
                    {event.category}
                  </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                     <Calendar size={12} /> {safeFormatDate(event.date, 'dd MMMM')}
                  </div>
                  <h3 className="text-white font-black text-lg leading-tight line-clamp-2 italic">{event.title}</h3>
               </div>
            </div>
            <div className="p-6 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{event.location}</span>
              </div>
              <ChevronRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
