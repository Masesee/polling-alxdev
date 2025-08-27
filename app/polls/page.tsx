import PollList from '../../components/polls/poll-list';

export default function PollsPage() {
  return (
    <div className="container mx-auto py-6 px-4 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6 dark:text-white">
        <h1 className="text-2xl font-bold">My Polls</h1>
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