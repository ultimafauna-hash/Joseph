import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-slate-200 rounded-xl", className)} />
);

export const SkeletonArticleCard = ({ variant = 'vertical' }: { variant?: 'horizontal' | 'vertical' | 'featured' }) => (
  <div className={cn(
    "bg-white rounded-[40px] overflow-hidden border border-slate-100",
    variant === 'vertical' ? "flex flex-col" : "flex flex-row h-40"
  )}>
    <Skeleton className={cn(
      "bg-slate-100",
      variant === 'vertical' ? "aspect-[4/3] w-full" : "w-1/3 h-full"
    )} />
    <div className="p-6 flex-1 space-y-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const SkeletonArticleDetail = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 w-24 bg-slate-100 rounded-full" />
      <div className="h-12 w-full bg-slate-100 rounded-2xl" />
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-slate-100 rounded-full" />
        <div className="h-4 w-32 bg-slate-100 rounded-full" />
      </div>
    </div>
    <div className="aspect-video w-full bg-slate-100 rounded-[40px]" />
    <div className="space-y-4">
      <div className="h-4 w-full bg-slate-50 rounded-full" />
      <div className="h-4 w-full bg-slate-50 rounded-full" />
      <div className="h-4 w-3/4 bg-slate-50 rounded-full" />
    </div>
  </div>
);
