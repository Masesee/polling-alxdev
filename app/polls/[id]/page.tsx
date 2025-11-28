import PollDetail from '../../../components/polls/poll-detail';
import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface PollPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EXAMPLE_POLLS: Record<string, any> = {
  'example-1': {
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
  'example-2': {
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
  'example-3': {
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
};

export default async function PollPage(props: PollPageProps) {
  const params = await props.params;

  // Handle example polls
  if (params.id.startsWith('example-')) {
    const examplePoll = EXAMPLE_POLLS[params.id];
    if (examplePoll) {
      const mapped = {
        id: examplePoll.id,
        question: examplePoll.question,
        options: examplePoll.options,
        createdBy: 'Example User',
        createdAt: new Date(examplePoll.created_at),
        isActive: true,
      };
      return (
        <div className="container mx-auto py-12 px-4">
          <PollDetail poll={mapped} />
        </div>
      );
    }
  }

  const supabase = await createServerSupabase();
  const { data: poll, error } = await supabase
    .from('polls')
    .select('id, question, created_by, created_at, allow_multiple, require_login, expires_at, poll_options ( id, text, votes )')
    .eq('id', params.id)
    .single();

  if (error || !poll) {
    notFound();
  }

  const mapped = {
    id: poll.id as string,
    question: poll.question as string,
    options: (poll.poll_options || []).map((o: any) => ({
      id: o.id as string,
      text: o.text as string,
      votes: o.votes || 0
    })),
    createdBy: poll.created_by as string,
    createdAt: new Date(poll.created_at as string),
    isActive: true,
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <PollDetail poll={mapped} />
    </div>
  );
}