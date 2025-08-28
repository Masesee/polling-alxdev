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
    await new Promise(resolve => setTimeout(resolve, 500));
    setHasVoted(true);
    setIsVoting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{poll.question}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Created on {formatDate(poll.createdAt)}
      </p>
      <div className="space-y-4">
        {poll.options.map((option) => {
          const votes = option.votes || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          return (
            <div key={option.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {!hasVoted && (
                    <input
                      type="radio"
                      id={option.id}
                      name="poll-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="mr-3"
                    />
                  )}
                  <label htmlFor={option.id} className="font-medium">
                    {option.text}
                  </label>
                </div>
                <span className="text-gray-600">{votes} votes ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
      {!hasVoted && (
        <button
          onClick={handleVote}
          disabled={!selectedOption || isVoting}
          className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVoting ? 'Submitting vote...' : 'Submit Vote'}
        </button>
      )}
      {hasVoted && (
        <div className="mt-6 text-center text-green-600 font-medium">Thank you for voting!</div>
      )}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Total votes: {totalVotes}</p>
      </div>
    </div>
  );
}