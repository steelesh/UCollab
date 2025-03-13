import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Route } from 'next';
import type { Project } from '@prisma/client';

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
            <li key={project.id} className="group bg-muted rounded-lg">
              <Link href={`/p/${project.id}` as Route} className="block rounded-lg p-4 transition-colors">
                <p className="line-clamp-2 text-sm font-medium hover:underline">{project.title}</p>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
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
