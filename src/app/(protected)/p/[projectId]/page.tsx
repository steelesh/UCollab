import { withAuth } from '~/security/protected';
import type { User, Project } from '@prisma/client';
import { getProjectTitle, getRealTimeProject, getUserProjectRating } from '~/features/projects/project.queries';
import { ProjectHeader } from '~/components/projects/project-header';
import { ProjectInfo } from '~/components/projects/project-info';
import { ProjectComments } from '~/components/projects/project-comments';
import { Metadata } from 'next';

interface PageProps {
  params: {
    projectId: Project['id'];
  };
  userId: User['id'];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params;
  try {
    const projectTitle = await getProjectTitle(projectId);
    return {
      title: `${projectTitle} | UCollab`,
    };
  } catch {
    return {
      title: 'Project not found | UCollab',
    };
  }
}

async function Page({ params, userId }: PageProps) {
  const { projectId } = await params;
  const project = await getRealTimeProject(projectId, userId);
  const userProjectRating = await getUserProjectRating(projectId, userId);

  if (!project) {
    return (
      <div className="flex flex-col items-center">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <article className="rounded-lg shadow-xl">
        <ProjectHeader title={project.title} projectId={projectId} isOwnProject={project.createdById === userId} />
        <div className="px-8 pt-16 pb-6">
          <ProjectInfo project={project} userId={userId} userProjectRating={userProjectRating} />
          <ProjectComments comments={project.comments} currentUserId={userId} projectId={projectId} />
        </div>
      </article>
    </div>
  );
}

export default withAuth(Page);
