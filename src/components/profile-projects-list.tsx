import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Route } from 'next';
import type { Project } from '~/features/users/user.types';

interface ProfileProjectsListProps {
  projects: Project[];
}

export function ProfileProjectsList({ projects }: ProfileProjectsListProps) {
  return (
    <>
      {projects.length === 0 ? (
        <p className="text-accent-content pt-2 text-sm">No posts available.</p>
      ) : (
        <ul className="space-y-4 py-4">
          {projects.map((project) => (
            <li key={project.id} className="group">
              <Link
                href={`/p/${project.id}` as Route}
                className="bg-base-200/50 hover:bg-base-200 block rounded-lg p-4 transition-colors">
                <p className="line-clamp-2 text-sm font-medium">{project.title}</p>
                <div className="text-base-content/60 mt-2 flex items-center gap-2 text-xs">
                  <time>{formatDistanceToNow(new Date(project.createdDate))} ago</time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
