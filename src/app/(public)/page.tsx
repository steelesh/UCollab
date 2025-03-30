import type { Metadata } from "next";

import { DotPattern } from "~/components/magicui/dot-pattern";
import { SignInWrapper } from "~/components/navigation/signin-wrapper";
import { H1, H3 } from "~/components/ui/heading";
import { ProjectCardXs } from "~/components/ui/project-card-xs";
import { getTrendingProjects } from "~/features/projects/project.queries";
import { cn } from "~/lib/utils";
import { auth } from "~/security/auth";

export const metadata: Metadata = {
  title: "UCollab - Home",
  description: "Welcome to UCollab",
};

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    const trendingData = await getTrendingProjects(session.user.id!);
    const trendingProjects = trendingData.projects;

    return (
      <>
        <div className="absolute inset-0 -z-10">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_top,white,transparent)]",
            )}
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center cursor-default select-none">
          <H1 className="mt-12 text-5xl font-medium select-none text-center">
            Welcome back,
            {" "}
            <span className="font-thin">{session.user.username}</span>
            !
          </H1>
          <H3 className="mt-8">Trending Projects</H3>
          {trendingProjects.length > 0
            ? (
                <div className="grid gap-4 lg:grid-cols-2 mt-4">
                  {trendingProjects.map(project => (
                    <ProjectCardXs
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      githubRepo={project.githubRepo}
                      technologies={project.technologies}
                      projectType={project.projectType}
                      user={{
                        username: project.createdBy.username,
                        avatar: project.createdBy.avatar,
                      }}
                      watchers={project.watchers}
                    />
                  ))}
                </div>
              )
            : (
                <p className="mt-4">No trending projects to display.</p>
              )}
          <H3 className="mt-12">Recent Activity</H3>
          <p className="mt-2 text-gray-600">
            Recent activity on your projects will appear here.
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_top,white,transparent)]",
          )}
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mt-12 text-5xl font-extrabold select-none text-center">
          Connect. Innovate. Succeed.
        </h1>
        <p className="mb-18 text-lg font-thin italic select-none mt-2">
          Empowering students through collaboration.
        </p>
        <SignInWrapper />
      </div>
    </>
  );
}
