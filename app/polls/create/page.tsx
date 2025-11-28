import CreatePollForm from '../../../components/polls/create-poll-form';
import { createServerSupabase } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Renders the page for creating a new poll.
 * This page displays the CreatePollForm component, allowing users to input poll questions and options.
 */
export default async function CreatePollPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?message=You must be logged in to create a poll');
  }

  return (
    <div className="container mx-auto py-6 px-4 dark:bg-gray-900">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-3xl mx-auto">
        <CreatePollForm />
      </div>
    </div>
  );
}