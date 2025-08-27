import CreatePollForm from '../../../components/polls/create-poll-form';

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-6 px-4 dark:bg-gray-900">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-3xl mx-auto">
        <CreatePollForm />
      </div>
    </div>
  );
}