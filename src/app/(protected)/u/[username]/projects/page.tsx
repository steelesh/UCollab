import type { User } from "@prisma/client";

import type { ProjectDetails } from "~/features/projects/project.types";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Pagination } from "~/components/ui/pagination";
import { ProjectCardSmall } from "~/components/ui/project-card-sm";
import { getCreatedProjects } from "~/features/projects/project.actions";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — My Projects",
};

type PageProps = {
  params: Promise<{ username: User["username"] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { page = "1", limit = "12" } = await searchParams;

  const { success, projects } = (await getCreatedProjects()) as unknown as {
    success: boolean;
    projects: ProjectDetails[];
  };

  if (!success) {
    return <div>Error loading created projects.</div>;
  }

  return (
    <Container>
      <PageBreadcrumb items={[{ label: "My Projects", isCurrent: true }]} />
      <Header>
        <H1>My Projects</H1>
      </Header>
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map(project => (
          <ProjectCardSmall
            key={project.id}
            id={project.id}
            title={project.title}
            githubRepo={project.githubRepo}
            createdDate={project.createdDate}
            technologies={project.technologies}
            rating={project.rating}
            projectType={project.projectType}
            user={{
              username: project.createdBy.username,
              avatar: project.createdBy.avatar,
            }}
            watchers={project.watchers}
          />
        ))}
      </div>
      <Pagination
        currentPage={Number(page)}
        totalPages={1}
        totalCount={projects.length}
        limit={Number(limit)}
        itemsPerPageOptions={[12, 24, 36, 48]}
        basePath={`/u/${username}/projects`}
        itemName="projects"
      />
    </Container>
  );
}

export default withAuth(Page);
