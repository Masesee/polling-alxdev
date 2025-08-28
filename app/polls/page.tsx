import PollList from '../../components/polls/poll-list';
import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function PollsPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container mx-auto py-6 px-4 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6 dark:text-white">
          <h1 className="text-2xl font-bold">My Polls</h1>
          <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700">Login</Link>
        </div>
        <div className="text-gray-600 dark:text-gray-300">Please log in to view your polls.</div>
      </div>
    );
  }

  const { data: polls } = await supabase
    .from('polls')
    .select('id, question, created_at, poll_options ( id, text )')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  const mapped = (polls || []).map((p: any) => ({
    id: p.id as string,
    question: p.question as string,
    options: (p.poll_options || []).map((o: any) => ({ id: o.id as string, text: o.text as string, votes: 0 })),
    createdBy: user.id,
    createdAt: new Date(p.created_at as string),
    isActive: true,
  }));

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