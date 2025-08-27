import CreatePollForm from '../../../components/polls/create-poll-form';

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center">
        <CreatePollForm />
      </div>
    </div>
  );
}