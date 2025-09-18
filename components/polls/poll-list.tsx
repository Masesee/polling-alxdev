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
      
      // TODO: Implement fetching polls from Supabase
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPolls: Poll[] = [
        {
          id: '1',
          question: 'What is your favorite programming language?',
          options: [
            { id: '1-1', text: 'JavaScript', votes: 10 },
            { id: '1-2', text: 'Python', votes: 8 },
            { id: '1-3', text: 'Java', votes: 5 },
          ],
          createdBy: 'user-1',
          createdAt: new Date(),
          isActive: true,
        },
        {
          id: '2',
          question: 'Which frontend framework do you prefer?',
          options: [
            { id: '2-1', text: 'React', votes: 12 },
            { id: '2-2', text: 'Vue', votes: 7 },
            { id: '2-3', text: 'Angular', votes: 4 },
          ],
          createdBy: 'user-1',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          isActive: true,
        },
      ];
      
      setPolls(mockPolls);
      setIsLoading(false);
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <div key={poll.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 transition-transform hover:-translate-y-0.5">
            <h3 className="font-medium text-base sm:text-lg mb-2 dark:text-white">{poll.question}</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mb-3 sm:mb-4">
              {poll.options.length} options
              <span className="mx-1">•</span>
              {poll.options.reduce((sum, option) => sum + option.votes, 0)} total votes
            </p>
            <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
              {poll.options.map((option) => (
                <div key={option.id} className="flex justify-between text-xs sm:text-sm dark:text-gray-200">
                  <span>{option.text}</span>
                  <span className="text-gray-600 dark:text-gray-300">{option.votes} votes</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-400 mb-3">
              Created on {formatDate(poll.createdAt)}
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href={`/polls/${poll.id}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                View Results
              </a>
              <a
                href={`/share/${poll.id}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                Share Poll
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}