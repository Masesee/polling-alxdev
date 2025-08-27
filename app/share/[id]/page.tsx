import PollShare from '../../../components/share/poll-share';

interface SharePageProps {
  params: {
    id: string;
  };
}

export default function SharePage({ params }: SharePageProps) {
  return (
    <div className="container mx-auto py-12 px-4">
      <PollShare pollId={params.id} />
    </div>
  );
}