import Link from 'next/link';
import type { Route } from 'next';
import type { Project } from '~/features/users/user.types';

interface ProfileProjectsListProps {
  projects: Project[];
}

export function ProfileProjectsList({ projects }: ProfileProjectsListProps) {
  return (
    <>
      {projects.length === 0 ? (
        <p className="text-accent-content text-sm">No posts available.</p>
      ) : (
        <ul className="list-item py-4 pl-5 text-sm">
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/p/${project.id}` as Route} className="font-bold hover:underline">
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
