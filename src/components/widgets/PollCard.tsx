import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Poll } from '../../types';
import { cn } from '../../lib/utils';

export const PollCard = ({ poll, onVote, hasVoted }: { poll: Poll, onVote: (pollId: string, optionId: string) => void, hasVoted: boolean }) => {
  if (!poll) return null;
  const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="bg-white border-2 border-primary/10 rounded-[35px] p-8 shadow-2xl space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 bg-primary/10 rounded-bl-[20px] text-primary font-black text-[10px] tracking-widest uppercase">Sondage</div>
      <div className="flex gap-4">
        <div className="p-3 bg-primary rounded-2xl text-white h-fit shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
          <TrendingUp size={24} />
        </div>
        <h3 className="font-display font-black text-xl leading-tight">{poll.question}</h3>
      </div>
      
      <div className="space-y-3">
        {poll.options.map(option => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          return (
            <button 
              key={option.id}
              disabled={hasVoted}
              onClick={() => onVote(poll.id, option.id)}
              className="w-full text-left relative group/opt overflow-hidden rounded-2xl border border-slate-100 hover:border-primary/30 transition-all p-4"
            >
              <div 
                className={cn(
                  "absolute inset-0 transition-all duration-1000",
                  hasVoted ? "bg-primary/5" : "bg-transparent group-hover/opt:bg-slate-50"
                )}
                style={{ width: hasVoted ? `${percentage}%` : '0%' }}
              />
              <div className="relative flex justify-between items-center text-sm">
                <span className={cn("font-bold", hasVoted && "text-primary")}>{option.text}</span>
                {hasVoted && <span className="font-black text-slate-400">{percentage}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      {hasVoted && (
        <p className="text-[10px] text-slate-400 font-bold text-center italic">
          Merci pour votre participation ! ({totalVotes} votes au total)
        </p>
      )}
    </div>
  );
};
