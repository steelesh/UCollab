import { cookies } from 'next/headers';
import { withAuth } from '~/lib/auth/protected';

export const metadata = {
  title: 'UCollab — Explore',
};

interface Project {
  user?: {
    username: string;
  };
  title: string;
  createdDate: string;
  createdById: string;
  description: string;
  postType: 'CONTRIBUTION' | 'FEEDBACK' | 'DISCUSSION';
  status: string;
  technologies: string[];
  githubRepo?: string;
}

export async function ExplorePage() {
  const cookieHeader = cookies().toString();

  const postsResponse = await fetch(`/api/posts`, {
    headers: { cookie: cookieHeader },
    next: { revalidate: 60 },
  });
  if (!postsResponse.ok) {
    throw new Error('Failed to fetch posts');
  }
  const jsonResponse: { data: Project[]; error: string | null } = await postsResponse.json();
  if (jsonResponse.error) {
    console.error('API Error:', jsonResponse.error);
    return <div>Error fetching posts.</div>;
  }
  const projects = jsonResponse.data;

  const projectsWithUser = await Promise.all(
    projects.map(async (project) => {
      try {
        const userResponse = await fetch(`/api/users/from-id/${project.createdById}`, {
          headers: { cookie: cookieHeader },
          next: { revalidate: 60 },
        });
        if (!userResponse.ok) {
          console.warn(`Failed to fetch user for project ${project.title}`);
          return project;
        }
        const userData = await userResponse.json();
        return { ...project, user: { username: userData.username } };
      } catch (error) {
        console.error(`Error fetching user for project ${project.title}:`, error);
        return project;
      }
    }),
  );

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
                      href={`/${project.user?.username ?? ''}`}
                      className="link link-accent font-bold tracking-wider no-underline">
                      {project.user?.username ?? 'Unknown User'}
                    </a>
                  </span>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <span className="badge badge-primary badge-outline badge-md">{project.postType}</span>
              </div>
              <p className="mb-4 text-white">{project.description}</p>
              <div className="divider mb-4"></div>
              <div className="mb-4">
                <span className="text-sm font-semibold text-white">Technologies:</span>
                <div>
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="badge badge-accent badge-outline badge-sm mr-2 mb-2 font-normal tracking-wider">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(ExplorePage);
