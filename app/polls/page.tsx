import PollList from '../../components/polls/poll-list';
import { createServerSupabase } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const EXAMPLE_POLLS = [
  {
    id: 'example-1',
    question: 'What is your favorite programming language?',
    options: [
      { id: '1', text: 'TypeScript', votes: 45 },
      { id: '2', text: 'Python', votes: 32 },
      { id: '3', text: 'Rust', votes: 18 },
      { id: '4', text: 'Go', votes: 12 },
    ],
    created_by: 'example',
    created_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'example-2',
    question: 'Where should we go for the team retreat?',
    options: [
      { id: '1', text: 'Bali', votes: 15 },
      { id: '2', text: 'Swiss Alps', votes: 8 },
      { id: '3', text: 'Kyoto', votes: 12 },
    ],
    created_by: 'example',
    created_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'example-3',
    question: 'Best time for the weekly sync?',
    options: [
      { id: '1', text: 'Monday 10am', votes: 5 },
      { id: '2', text: 'Tuesday 2pm', votes: 8 },
      { id: '3', text: 'Friday 11am', votes: 3 },
    ],
    created_by: 'example',
    created_at: new Date().toISOString(),
    is_active: true,
  },
];

export default async function PollsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let mappedPolls = [];

  if (user) {
    const { data: polls } = await supabase
      .from('polls')
      .select('id, question, created_at, created_by, poll_options ( id, text, votes )')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    mappedPolls = (polls || []).map((p: any) => ({
      id: p.id as string,
      question: p.question as string,
      options: (p.poll_options || []).map((o: any) => ({
        id: o.id as string,
        text: o.text as string,
        votes: o.votes || 0
      })),
      createdBy: p.created_by,
      createdAt: new Date(p.created_at as string),
      isActive: true,
    }));
  } else {
    // Show example polls for guests
    mappedPolls = EXAMPLE_POLLS.map(p => ({
      id: p.id,
      question: p.question,
      options: p.options,
      createdBy: p.created_by,
      createdAt: new Date(p.created_at),
      isActive: p.is_active,
    }));
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {user ? 'My Polls' : 'Example Polls'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user ? 'Manage and track your active polls' : 'Sign in to create your own polls'}
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

      <PollList initialPolls={mappedPolls} />
    </div>
  );
}