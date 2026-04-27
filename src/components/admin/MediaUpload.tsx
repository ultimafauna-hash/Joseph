import React, { useState, useRef } from 'react';
import { Smartphone, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

export const MediaUpload = ({ 
  value, 
  onChange, 
  placeholder,
  icon: Icon = Smartphone,
  inputClassName = "bg-slate-50"
}: { 
  value: string, 
  onChange: (val: string) => void,
  placeholder?: string,
  icon?: any,
  inputClassName?: string
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await api.uploadFile(file);
      onChange(url);
      alert("✅ Image téléchargée avec succès !");
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(`Erreur d'upload: ${error.message || 'Inconnue'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn("w-full rounded-xl pl-9 pr-4 py-3 text-[10px] outline-none focus:ring-2 focus:ring-primary/10 transition-all", inputClassName)}
          placeholder={placeholder || "https://..."}
        />
      </div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all shadow-lg shadow-slate-900/10 shrink-0",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        {isUploading ? (
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Upload size={14} />
        )}
        {isUploading ? "..." : "📤 Upload"}
      </button>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
