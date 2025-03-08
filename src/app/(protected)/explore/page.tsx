import { prisma } from '~/lib/prisma';
import { withAuth } from '~/security/protected';
import Link from 'next/link';
import type { Route } from 'next';

export const metadata = {
  title: 'UCollab — Explore',
};

export async function ExplorePage() {
  const projectsWithUser = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      createdDate: true,
      description: true,
      githubRepo: true,
      postType: true,
    },
  });

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <div className="container mx-auto grid gap-8 px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projectsWithUser.map((project, index) => (
          <div key={index} className="card card-bordered bg-base-300 w-full shadow-xl">
            <div className="card-body">
              <div className="mb-2 flex items-center">
                <div className="avatar mr-4">
                  <div className="w-16 rounded-lg bg-gray-200">
                    <img src="/project.svg" alt="Project" className="w-full" />
                  </div>
                </div>
                <div>
                  <Link href={`/p/${project.id}` as Route} className="font-bold hover:underline">
                    <h2 className="card-title text-lg font-bold">{project.title}</h2>
                  </Link>
                  <span className="text-accent text-sm">
                    {new Date(project.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    <br />
                    <a
                      href={`${project.githubRepo ?? ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-accent font-bold tracking-wider text-white no-underline">
                      GitHub Repo
                    </a>
                  </span>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="badge badge-primary-content badge-outline badge-md">{project.postType}</span>
              </div>
              <p className="text-white">{project.description}</p>
              <div className="divider"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(ExplorePage);
