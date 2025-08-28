import PollDetail from '../../../components/polls/poll-detail';
import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface PollPageProps {
  params: {
    id: string;
  };
}

export default async function PollPage({ params }: PollPageProps) {
  const supabase = createServerSupabase();
  const { data: poll, error } = await supabase
    .from('polls')
    .select('id, question, created_by, created_at, allow_multiple, require_login, expires_at, poll_options ( id, text )')
    .eq('id', params.id)
    .single();

  if (error || !poll) {
    notFound();
  }

  const mapped = {
    id: poll.id as string,
    question: poll.question as string,
    options: (poll.poll_options || []).map((o: any) => ({ id: o.id as string, text: o.text as string, votes: 0 })),
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