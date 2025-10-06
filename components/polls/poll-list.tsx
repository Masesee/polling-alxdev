'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Poll } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import { Spinner } from '../ui/spinner';

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      setIsLoading(true);
      
      try {
        // Fetch actual polls from Supabase
        const response = await fetch('/api/polls');
        const data = await response.json();
        
        if (data.success) {
          setPolls(data.polls || []);
        } else {
          // Handle API error response
          console.error('API error:', data.message);
          setPolls([]);
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
        // If there's an error, set empty polls array
        setPolls([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10 flex flex-col items-center gap-3">
        <Spinner size={24} className="text-blue-600" />
        <p className="text-gray-600 dark:text-gray-300">Loading polls...</p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300 mb-4">No polls created yet.</p>
        <Link href="/polls/create" className="inline-flex items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Create your first poll
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <div 
            key={poll.id} 
            className="rounded-lg p-5 sm:p-6 bg-white dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
          >
            <h3 className="font-semibold text-base sm:text-lg mb-3 dark:text-white line-clamp-2">{poll.question}</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-4">
              <span className="font-medium">{poll.options.length} options</span>
              <span className="mx-2">•</span>
              <span className="font-medium">{poll.options.reduce((sum, option) => sum + option.votes, 0)} votes</span>
            </p>
            <div className="space-y-2.5 mb-5">
              {poll.options.map((option) => (
                <div key={option.id} className="flex justify-between text-xs sm:text-sm dark:text-gray-200">
                  <span className="font-medium truncate mr-2">{option.text}</span>
                  <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">{option.votes} votes</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-400 mb-4">
              Created on {formatDate(poll.createdAt)}
            </p>
            <div className="flex justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
              <Link
                href={`/polls/${poll.id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View Results
              </Link>
              <Link
                href={`/share/${poll.id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Share Poll
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}