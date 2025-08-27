'use client';

import { useState, useEffect } from 'react';
import { Poll } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface PollDetailProps {
  pollId: string;
}

export default function PollDetail({ pollId }: PollDetailProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      setIsLoading(true);
      
      // TODO: Implement fetching poll from Supabase
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock poll data
      const mockPoll: Poll = {
        id: pollId,
        question: 'What is your favorite programming language?',
        options: [
          { id: 'opt-1', text: 'JavaScript', votes: 10 },
          { id: 'opt-2', text: 'Python', votes: 8 },
          { id: 'opt-3', text: 'Java', votes: 5 },
          { id: 'opt-4', text: 'C#', votes: 3 },
        ],
        createdBy: 'user-1',
        createdAt: new Date(),
        isActive: true,
      };
      
      setPoll(mockPoll);
      setIsLoading(false);
    };

    fetchPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption || !poll) return;
    
    setIsVoting(true);
    
    // TODO: Implement voting with Supabase
    console.log(`Voting for option ${selectedOption} in poll ${pollId}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local state to reflect vote
    const updatedPoll = { ...poll };
    const optionIndex = updatedPoll.options.findIndex(opt => opt.id === selectedOption);
    
    if (optionIndex !== -1) {
      updatedPoll.options[optionIndex].votes += 1;
      setPoll(updatedPoll);
      setHasVoted(true);
    }
    
    setIsVoting(false);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading poll...</div>;
  }

  if (!poll) {
    return <div className="text-center py-10">Poll not found</div>;
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{poll.question}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Created on {formatDate(poll.createdAt)}
      </p>
      
      <div className="space-y-4">
        {poll.options.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          
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
                <span className="text-gray-600">{option.votes} votes ({percentage}%)</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
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
        <div className="mt-6 text-center text-green-600 font-medium">
          Thank you for voting!
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Total votes: {totalVotes}</p>
      </div>
    </div>
  );
}