'use client';

import { useMemo, useState } from 'react';
import { Poll, PollOption } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface PollDetailProps {
  poll: Poll;
}

export default function PollDetail({ poll }: PollDetailProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const totalVotes = useMemo(() => poll.options.reduce((sum: number, option: PollOption) => sum + (option.votes || 0), 0), [poll.options]);

  const handleVote = async () => {
    if (!selectedOption) return;
    setIsVoting(true);
    // TODO: Implement voting server action
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    setHasVoted(true);
    setIsVoting(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="glass rounded-3xl p-8 sm:p-10 shadow-xl shadow-primary/5">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
            Active Poll
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight mb-4">
            {poll.question}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Created by {poll.createdBy}</span>
            <span>•</span>
            <span>{formatDate(poll.createdAt)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {poll.options.map((option) => {
            const votes = option.votes || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            const isSelected = selectedOption === option.id;

            return (
              <div
                key={option.id}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${hasVoted
                    ? 'border-border bg-muted/30'
                    : isSelected
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer'
                  }`}
                onClick={() => !hasVoted && setSelectedOption(option.id)}
              >
                {/* Progress Bar Background */}
                {hasVoted && (
                  <div
                    className="absolute inset-0 bg-primary/10 transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-4">
                    {!hasVoted && (
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/50'
                        }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    )}
                    <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {option.text}
                    </span>
                  </div>

                  {hasVoted && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">{percentage}%</span>
                      <span className="text-xs text-muted-foreground">({votes} votes)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!hasVoted ? (
          <div className="mt-8 pt-6 border-t border-border/50">
            <button
              onClick={handleVote}
              disabled={!selectedOption || isVoting}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {isVoting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Vote...
                </span>
              ) : (
                'Submit Vote'
              )}
            </button>
          </div>
        ) : (
          <div className="mt-8 pt-6 border-t border-border/50 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Thanks for voting!</h3>
            <p className="text-muted-foreground mb-6">
              Your vote has been recorded. Total votes: <span className="font-semibold text-foreground">{totalVotes + 1}</span>
            </p>
            <button
              onClick={() => setHasVoted(false)}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Vote again (demo only)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}