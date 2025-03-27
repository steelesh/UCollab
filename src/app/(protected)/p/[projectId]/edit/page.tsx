import type { User } from "@prisma/client";
import type { Metadata } from "next";

import { ProjectForm } from "~/components/projects/project-form";
import { getProjectTitle } from "~/features/projects/project.queries";
import { ProjectService } from "~/features/projects/project.service";
import { withAuth } from "~/security/protected";

type PageProps = {
  params: Promise<{ projectId: string }>;
  userId: User["id"];
};

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }): Promise<Metadata> {
  const { projectId } = await params;
  try {
    const projectTitle = await getProjectTitle(projectId);
    return {
      title: `Edit ${projectTitle} | UCollab`,
    };
  } catch {
    return {
      title: "Edit Project | UCollab",
    };
  }
}

async function Page({ userId, params }: PageProps) {
  const { projectId } = await params;
  const project = await ProjectService.getProjectById(projectId, userId);

  if (!project) {
    return (
      <div className="flex flex-col items-center">
        <p>Project not found.</p>
      </div>
    );
  }

  const initialData = {
    title: project.title,
    description: project.description,
    projectType: project.projectType,
    technologies: project.technologies?.map(t => t.name),
    githubRepo: project.githubRepo,
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="mb-6 text-center text-3xl font-bold">Edit Project</h2>
      <ProjectForm initialData={initialData} projectId={projectId} />
    </div>
  );
}

export default withAuth(Page);
