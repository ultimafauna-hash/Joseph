import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeFormatDate = (dateStr: any, formatStr: string = 'dd MMM yyyy') => {
  if (!dateStr) return 'Date inconnue';
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    return format(date, formatStr, { locale: fr });
  } catch (e) {
    console.error("Format date error:", e, dateStr);
    return 'Format invalide';
  }
};

export function optimizeImage(url: string | undefined, width: number = 800, fit: 'crop' | 'contain' | 'max' = 'crop') {
  if (!url) return '';
  if (url.includes('unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', '75');
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', fit);
      if (fit === 'crop') {
        urlObj.searchParams.set('crop', 'faces,focalpoint');
      } else {
        urlObj.searchParams.delete('crop');
      }
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }
  return url;
}

export function getYoutubeId(url: string | undefined) {
  if (!url) return null;
  // Robust regex for various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  
  const id = (match && match[2].length === 11) ? match[2] : null;
  
  // If not matched by regex, try to see if it's just the ID
  if (!id && url.length === 11 && !url.includes('/') && !url.includes('.')) {
    return url;
  }
  
  return id;
}

export const playNotificationSound = (type: 'info' | 'urgent' | 'message' | 'payment' = 'info') => {
  const soundUrls = {
    info: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    urgent: 'https://www.soundjay.com/buttons/sounds/button-10.mp3',
    message: 'https://www.soundjay.com/communication/sounds/pda-text-1.mp3',
    payment: 'https://www.soundjay.com/misc/sounds/cash-register-05.mp3'
  };
  const audio = new Audio(soundUrls[type] || soundUrls.info);
  audio.volume = 0.3;
  audio.play().catch(e => console.warn("Audio play blocked by browser:", e));
};

// State persistence helpers
export const safeStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch { return null; }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch { /* Ignore */ }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch { /* Ignore */ }
  }
};

export const safeSession = {
  get: (key: string) => {
    try {
      return sessionStorage.getItem(key);
    } catch { return null; }
  },
  set: (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch { /* Ignore */ }
  }
};
