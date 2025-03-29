import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Pagination } from "~/components/ui/pagination";
import { ProjectCard } from "~/components/ui/project-card";
import { getTrendingProjects } from "~/features/projects/project.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — Trending",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ searchParams, userId }: PageProps) {
  const { page = "1", limit = "12" } = await searchParams;
  const { projects, totalCount, currentPage, totalPages, limit: itemsPerPage } = await getTrendingProjects(
    userId,
    Number(page),
    Number(limit),
  );

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "Trending Projects", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Trending Projects</H1>
      </Header>
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
            trendingScore={project.trendingScore}
            watchers={project.watchers}
            comments={project.comments.length}
          />
        ))}
      </div>
      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={itemsPerPage}
          basePath="/p/trending"
          itemName="projects"
          itemsPerPageOptions={[12, 24, 36]}
        />
      )}
    </Container>
  );
}

export default withAuth(Page);
