import PollList from '../../components/polls/poll-list';

export default function PollsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Polls</h1>
        <a
          href="/polls/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create New Poll
        </a>
      </div>
      <PollList />
    </div>
  );
}