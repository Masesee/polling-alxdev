import PollDetail from '../../../components/polls/poll-detail';
import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

/**
 * Props for the PollPage component.
 * @property params An object containing the poll ID from the URL.
 */
interface PollPageProps {
  params: {
    id: string;
  };
}

/**
 * Renders the detail page for a specific poll.
 * This is a server-side component that fetches poll data, including its options,
 * from Supabase based on the poll ID provided in the URL parameters.
 * @param params An object containing the poll ID.
 * @returns A React component displaying the poll details or a 404 page if the poll is not found.
 */
export default async function PollPage({ params }: PollPageProps) {
  const supabase = createServerSupabase();
  // Fetch poll details along with its options.
  const { data: poll, error } = await supabase
    .from('polls')
    .select('id, question, created_by, created_at, allow_multiple, require_login, expires_at, poll_options ( id, text )')
    .eq('id', params.id)
    .single();

  // If there's an error or no poll data, return a 404 not found page.
  if (error || !poll) {
    notFound();
  }

  // Map the fetched data to a more usable format for the client-side PollDetail component.
  const mapped = {
    id: poll.id as string,
    question: poll.question as string,
    options: (poll.poll_options || []).map((o: any) => ({ id: o.id as string, text: o.text as string, votes: 0 })),
    createdBy: poll.created_by as string,
    createdAt: new Date(poll.created_at as string),
    isActive: true, // This logic might need refinement based on `expires_at`
    // Note: `allow_multiple`, `require_login`, `expires_at` are fetched but not directly mapped here.
    // They should be passed to PollDetail if needed for client-side logic.
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <PollDetail poll={mapped} />
    </div>
  );
}