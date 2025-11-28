import PollList from '../../components/polls/poll-list';
import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PollsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: polls } = await supabase
    .from('polls')
    .select('id, question, created_at, poll_options ( id, text, votes )')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  const mapped = (polls || []).map((p: any) => ({
    id: p.id as string,
    question: p.question as string,
    options: (p.poll_options || []).map((o: any) => ({
      id: o.id as string,
      text: o.text as string,
      votes: o.votes || 0
    })),
    createdBy: user.id,
    createdAt: new Date(p.created_at as string),
    isActive: true,
  }));

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            My Polls
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your active polls
          </p>
        </div>
        <Link
          href="/polls/create"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Poll
        </Link>
      </div>

      <PollList initialPolls={mapped} />
    </div>
  );
}