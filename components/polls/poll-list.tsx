'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Poll } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface PollListProps {
  initialPolls: Poll[];
}

const EXAMPLE_POLLS: Poll[] = [
  {
    id: 'example-1',
    question: 'What is your favorite programming language?',
    options: [
      { id: '1', text: 'TypeScript', votes: 45 },
      { id: '2', text: 'Python', votes: 32 },
      { id: '3', text: 'Rust', votes: 18 },
      { id: '4', text: 'Go', votes: 12 },
    ],
    createdBy: 'example',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: 'example-2',
    question: 'Where should we go for the team retreat?',
    options: [
      { id: '1', text: 'Bali', votes: 15 },
      { id: '2', text: 'Swiss Alps', votes: 8 },
      { id: '3', text: 'Kyoto', votes: 12 },
    ],
    createdBy: 'example',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: 'example-3',
    question: 'Best time for the weekly sync?',
    options: [
      { id: '1', text: 'Monday 10am', votes: 5 },
      { id: '2', text: 'Tuesday 2pm', votes: 8 },
      { id: '3', text: 'Friday 11am', votes: 3 },
    ],
    createdBy: 'example',
    createdAt: new Date(),
    isActive: true,
  },
];

export default function PollList({ initialPolls }: PollListProps) {
  const [polls] = useState<Poll[]>(initialPolls);
  const isEmpty = polls.length === 0;
  const displayPolls = isEmpty ? EXAMPLE_POLLS : polls;

  return (
    <div className="space-y-8 animate-slide-up">
      {isEmpty && (
        <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 text-center mb-8">
          <h3 className="text-lg font-semibold text-primary mb-2">No polls yet</h3>
          <p className="text-muted-foreground mb-4">
            Here are some examples of what your polls will look like. Click on any example to see the details!
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayPolls.map((poll, index) => (
          <Link
            key={poll.id}
            href={`/polls/${poll.id}`}
            className={`group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${isEmpty
                ? 'bg-muted/30 border border-dashed border-border opacity-70 hover:opacity-100 hover:border-primary/50'
                : 'glass hover:shadow-xl hover:shadow-primary/5 border border-border/50'
              }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {isEmpty && (
              <div className="absolute -top-3 -right-3 rotate-12 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md border border-yellow-200 shadow-sm z-10">
                EXAMPLE
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {poll.question}
              </h3>

              <div className="space-y-3 mb-6">
                {poll.options.slice(0, 3).map((option) => {
                  const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);
                  const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;

                  return (
                    <div key={option.id} className="relative">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-muted-foreground truncate max-w-[70%]">{option.text}</span>
                        <span className="text-muted-foreground">{percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${isEmpty ? 'bg-gray-400' : 'bg-primary'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {poll.options.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    + {poll.options.length - 3} more options
                  </p>
                )}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-sm">
              <span className="text-muted-foreground text-xs">
                {isEmpty ? 'Just now' : formatDate(poll.createdAt)}
              </span>

              <div className="flex gap-3">
                <span className="font-medium text-primary hover:text-primary/80 transition-colors">
                  View
                </span>
                {!isEmpty && (
                  <span className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Share
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}