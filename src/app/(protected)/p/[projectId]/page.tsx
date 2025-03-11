import { withAuth } from '~/security/protected';
import type { User, Project } from '@prisma/client';
import { getProjectTitle, getRealTimeProject } from '~/features/projects/project.queries';
import { ProjectHeader } from '~/components/blocks/projects/project-header';
import { ProjectInfo } from '~/components/blocks/projects/project-info';
import { ProjectComments } from '~/components/blocks/projects/project-comments';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    projectId: Project['id'];
  }>;
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

async function Page({ params, userId }: PageProps & { userId: User['id'] }) {
  const { projectId } = await params;
  const project = await getRealTimeProject(projectId, userId);

  if (!project) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <article className="bg-base-100 rounded-lg shadow-xl">
          <ProjectHeader title={project.title} projectId={projectId} isOwnProject={project.createdById === userId} />
          <div className="px-8 pt-16 pb-6">
            <ProjectInfo
              createdDate={project.createdDate}
              lastModifiedDate={project.lastModifiedDate}
              githubRepo={project.githubRepo}
              description={project.description}
              technologies={project.technologies}
              postType={project.postType}
            />
            <ProjectComments comments={project.comments} currentUserId={userId} projectId={projectId} />
          </div>
        </article>
      </div>
    </div>
  );
}

export default withAuth(Page);
