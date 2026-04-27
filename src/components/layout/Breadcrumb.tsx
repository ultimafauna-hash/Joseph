import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Breadcrumb = ({ items }: { items: { label: string; onClick?: () => void; active?: boolean }[] }) => (
  <nav 
    onWheel={(e) => {
      const container = e.currentTarget;
      container.scrollTo({
        left: container.scrollLeft + e.deltaY,
        behavior: 'auto'
      });
    }}
    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap"
  >
    <button onClick={() => items && items[0] && items[0].onClick && items[0].onClick()} className="hover:text-primary transition-colors flex items-center gap-1 text-slate-900">
      <Home size={10} /> ACCUEIL
    </button>
    {items.slice(1).map((item, i) => (
      <React.Fragment key={i}>
        <ChevronRight size={10} className="shrink-0 text-slate-300" />
        {item.onClick && !item.active ? (
          <button onClick={item.onClick} className="hover:text-primary transition-colors">
            {item.label}
          </button>
        ) : (
          <span className={cn(item.active ? "text-primary px-2 bg-primary/5 rounded-lg py-0.5" : "text-slate-900")}>{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);
