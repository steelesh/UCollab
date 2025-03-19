import { ProjectForm } from '~/components/projects/project-form';
import { withAuth } from '~/security/protected';
import { ProjectService } from '~/features/projects/project.service';
import { notFound } from 'next/navigation';
import { Project, User } from '@prisma/client';
import { getProjectTitle } from '~/features/projects/project.queries';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    projectId: Project['id'];
  }>;
  userId: User['id'];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params;
  const projectTitle = await getProjectTitle(projectId);

  return {
    title: `Edit ${projectTitle}`,
  };
}

async function Page({ params, userId }: PageProps) {
  const { projectId } = await params;
  const project = await ProjectService.getProjectById(projectId, userId);

  if (project.createdById !== userId) notFound();

  const initialData = {
    title: project.title,
    description: project.description,
    projectType: project.projectType,
    technologies: project.technologies?.map((t) => t.name),
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
