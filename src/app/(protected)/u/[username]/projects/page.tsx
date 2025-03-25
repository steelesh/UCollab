import Link from 'next/link';
import { withAuth } from '~/security/protected';
import { getCreatedProjects } from '~/features/projects/project.actions';
import type { Project } from '@prisma/client';

export const metadata = {
  title: 'UCollab — My Projects',
};

async function MyProjectsPage() {
  const { success, projects } = (await getCreatedProjects()) as {
    success: boolean;
    projects: Project[];
  };

  if (!success) {
    return <div>Error loading created projects.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {projects.map((project: Project) => (
        <div key={project.id} className="flex w-full max-w-3xl items-center border-b p-4">
          <div className="flex flex-col">
            <Link href={`/p/${project.id}`} className="font-bold hover:underline">
              {project.title}
            </Link>
            <p className="text-muted-foreground text-sm">
              Created: {new Date(project.createdDate).toISOString().split('T')[0]} | Rating: {project.rating}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withAuth(MyProjectsPage);
