import React from 'react';
import { motion } from 'motion/react';
import { Clock, MonitorOff, TrendingUp } from 'lucide-react';
import { WebTV } from '../../types';
import { Badge } from './Badge';
import { optimizeImage, safeFormatDate } from '../../lib/utils';

export const WebTVView = ({ videos, onVideoClick }: { videos: WebTV[], onVideoClick: (v: WebTV) => void }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-5xl font-display font-black tracking-tighter italic">WEB <span className="text-secondary">TV</span></h2>
          <p className="text-slate-500 font-medium">L'actualité décryptée en images et en vidéos.</p>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map(video => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100 group cursor-pointer"
              onClick={() => onVideoClick(video)}
            >
              <div className="relative aspect-video">
                <img 
                  src={optimizeImage(video.thumbnail || '', 800)} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                    <TrendingUp size={32} />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge category={video.category}>{video.category}</Badge>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="font-display font-black text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                {video.description && (
                  <p className="text-slate-500 text-sm line-clamp-2 h-10">{video.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                  <Clock size={14} />
                  <span>{safeFormatDate(video.date, 'dd MMMM yyyy')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dotted border-slate-200">
           <div className="flex flex-col items-center gap-4 opacity-50">
            <MonitorOff size={64} className="text-slate-300" />
            <p className="font-black text-slate-400 uppercase tracking-widest">Aucune vidéo disponible pour le moment</p>
          </div>
        </div>
      )}
    </div>
  );
};
