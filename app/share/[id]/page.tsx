import PollShare from '../../../components/share/poll-share';

interface SharePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SharePage(props: SharePageProps) {
  const params = await props.params;
  return (
    <div className="container mx-auto py-12 px-4">
      <PollShare pollId={params.id} />
    </div>
  );
}