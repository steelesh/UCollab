import Link from 'next/link';
import { format } from 'date-fns';
import type { Route } from 'next';
import type { Project, Technology } from '~/features/projects/project.types';

interface ProjectInfoProps {
  createdDate: Project['createdDate'];
  lastModifiedDate: Project['lastModifiedDate'];
  githubRepo: Project['githubRepo'];
  description: Project['description'];
  technologies: Technology[];
  postType: Project['postType'];
}

export function ProjectInfo({
  createdDate,
  lastModifiedDate,
  githubRepo,
  description,
  technologies,
  postType,
}: ProjectInfoProps) {
  const created = format(new Date(createdDate), 'yyyy-MM-dd');
  const modified = lastModifiedDate ? format(new Date(lastModifiedDate), 'yyyy-MM-dd') : null;
  return (
    <div>
      <div>
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
            <g fill="currentColor">
              <path d="M16 2c.183 0 .355.05.502.135l.033.02c.28.177.465.49.465.845v1h1a3 3 0 0 1 2.995 2.824L21 7v12a3 3 0 0 1-2.824 2.995L18 22H6a3 3 0 0 1-2.995-2.824L3 19V7a3 3 0 0 1 2.824-2.995L6 4h1V3a1 1 0 0 1 .514-.874l.093-.046l.066-.025l.1-.029l.107-.019L8 2q.083 0 .161.013l.122.029l.04.012l.06.023c.328.135.568.44.61.806L9 3v1h6V3a1 1 0 0 1 1-1" />
            </g>
          </svg>
          Created: {created}
        </p>
        {modified && (
          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                <path d="M14 8a2 2 0 0 0-2-2" />
                <path d="M6 8a6 6 0 1 1 12 0c0 4.97-2.686 9-6 9s-6-4.03-6-9m6 9v1a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2" />
              </g>
            </svg>
            Last updated: {modified}
          </p>
        )}
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          Type: {postType.charAt(0).toUpperCase() + postType.slice(1).toLowerCase()}
        </p>
        {githubRepo && (
          <p className="flex items-center gap-1 text-sm">
            <Link href={`${githubRepo}` as Route} target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub Repo
            </Link>
          </p>
        )}
      </div>
      <div className="mt-4">
        <p className="text-md">{description}</p>
      </div>
      {technologies && technologies.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-semibold">Technologies:</p>
          <ul className="list-disc pl-5">
            {technologies.map((tech, idx) => (
              <li key={idx} className="text-sm">
                {tech.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
