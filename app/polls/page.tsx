'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PollList from '../../components/polls/poll-list';
import { useAuth } from '@/lib/context/auth-context';

export default function PollsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="text-center py-10 dark:text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6 dark:text-white">
        <h1 className="text-2xl font-bold">{user.user_metadata?.full_name ? `${user.user_metadata.full_name}'s Polls` : `My Polls for ${user.email}`}</h1>
        <a
          href="/polls/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-sm font-medium"
        >
          Create New Poll
        </a>
      </div>
      <PollList />
    </div>
  );
}