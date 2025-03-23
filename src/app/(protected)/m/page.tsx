import { MentorshipGraph } from '~/components/ui/mentorship-graph';
import { getMentorshipGraphData } from '~/features/mentorship/mentorship.action';

export const metadata = {
  title: 'UCollab — Mentorship',
};

export default async function MentorshipPage() {
  const { success, graphData } = (await getMentorshipGraphData()) as {
    success: boolean;
    graphData: {
      nodes: { id: string; value: number; color: string; label: string }[];
      links: { source: string; target: string }[];
    };
  };

  if (!success) {
    return <div>Error loading mentorship graph.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-2xl font-bold select-none">Mentorship</h1>
      <div className="border-muted mt-6 flex w-full max-w-4xl justify-center overflow-hidden border shadow-xl">
        <MentorshipGraph graphData={graphData} />
      </div>
    </div>
  );
}
