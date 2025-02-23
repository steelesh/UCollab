import { prisma } from '~/lib/prisma';
import { withAuth } from '~/auth/protected';

export const metadata = {
  title: 'UCollab — Explore',
};

export async function ExplorePage() {
  const projectsWithUser = await prisma.post.findMany({
    select: {
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
                  <h2 className="card-title text-lg font-bold text-white">{project.title}</h2>
                  <span className="text-accent text-sm">
                    {new Date(project.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    <br />
                    <a
                      href={`/${project.title ?? ''}`}
                      className="link link-accent font-bold tracking-wider no-underline">
                      {project.githubRepo ?? 'No repository'}
                    </a>
                  </span>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="badge badge-primary badge-outline badge-md">{project.postType}</span>
              </div>
              <p className="mb-4 text-white">{project.description}</p>
              <div className="divider mb-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(ExplorePage);
