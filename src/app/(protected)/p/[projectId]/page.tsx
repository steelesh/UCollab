import { withAuth } from '~/security/protected';
import type { User, Project } from '@prisma/client';
import { getProjectTitle, getRealTimeProject } from '~/features/projects/project.queries';
import { ProjectHeader } from './components/project-header';
import { ProjectInfo } from './components/project-info';
import { ProjectComments } from './components/project-comments';
import { Metadata } from 'next';

interface PageProps {
  params: {
    projectId: Project['id'];
  };
  userId: User['id'];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = params;
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
  const { projectId } = params;
  const project = await getRealTimeProject(projectId, userId);

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <article className="bg-base-100 rounded-lg shadow-xl">
        <ProjectHeader title={project.title} projectId={projectId} isOwnProject={project.createdById === userId} />
        <div className="min-w-[500px] px-8 pt-16 pb-6">
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
    </main>
  );
}

export default withAuth(Page);
