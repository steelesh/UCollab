import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import SearchBar from "~/components/projects/search-projects";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Pagination } from "~/components/ui/pagination";
import { ProjectCard } from "~/components/ui/project-card";
import { getProjects } from "~/features/projects/project.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — Explore",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ searchParams, userId }: PageProps) {
  const { page = "1", limit = "8" } = await searchParams;
  const { projects, totalCount } = await getProjects(Number(page), Number(limit), userId);

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "All Projects", isCurrent: true },
        ]}
      />
      <Header>
        <H1>All Projects</H1>
      </Header>
      <SearchBar />
      <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            githubRepo={project.githubRepo}
            createdDate={project.createdDate}
            technologies={project.technologies}
            rating={project.rating}
            projectType={project.projectType}
            user={{
              username: project.createdBy.username,
              avatar: project.createdBy.avatar,
            }}
          />
        ))}
      </div>
      {totalCount > 0 && (
        <Pagination
          currentPage={Number(page)}
          totalPages={Math.ceil(totalCount / Number(limit))}
          totalCount={totalCount}
          limit={Number(limit)}
          basePath="/p"
          itemName="projects"
          itemsPerPageOptions={[8, 16, 24]}
        />
      )}
    </Container>
  );
}

export default withAuth(Page);
