import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { MentorshipGraph } from "~/components/ui/mentorship-graph";
import { getMentorshipGraphData } from "~/features/mentorship/mentorship.action";

export const metadata = {
  title: "UCollab — Mentorship",
};

export default async function Page() {
  const { success, graphData } = (await getMentorshipGraphData()) as {
    success: boolean;
    graphData: {
      nodes: { id: string; value: number; color: string; label: string; avatar: string }[];
      links: { source: string; target: string }[];
    };
  };

  if (!success) {
    return <div>Error loading mentorship graph.</div>;
  }

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "Mentorship", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Mentorship</H1>
      </Header>
      <MentorshipGraph graphData={graphData} />
    </Container>
  );
}
