import PollDetail from '../../../components/polls/poll-detail';

interface PollPageProps {
  params: {
    id: string;
  };
}

export default function PollPage({ params }: PollPageProps) {
  return (
    <div className="container mx-auto py-12 px-4">
      <PollDetail pollId={params.id} />
    </div>
  );
}