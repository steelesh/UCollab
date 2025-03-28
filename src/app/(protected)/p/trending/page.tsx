import type { Route } from "next";

import Image from "next/image";
import Link from "next/link";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { prisma } from "~/lib/prisma";
import { withAuth } from "~/security/protected";

export const metadata = {
  title: "UCollab — Trending",
};

export const dynamic = "force-dynamic";

async function Page() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      createdDate: true,
      description: true,
      githubRepo: true,
      projectType: true,
      technologies: true,
      rating: true,
    },
  });

  const trendingProjects = projects
    .map((project) => {
      const ageInHours = (Date.now() - new Date(project.createdDate).getTime()) / (1000 * 3600);
      const trendingScore = project.rating / (ageInHours + 2) ** 1.8;
      return { ...project, trendingScore };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore);

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "Trending Projects", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Trending Projects</H1>
      </Header>
      <div className="mx-auto grid grid-cols-1 gap-20 sm:mx-8 md:grid-cols-2 md:gap-14 lg:grid-cols-3 xl:grid-cols-4">
        {trendingProjects.map(project => (
          <Card
            key={project.id}
            className="bg-muted shadow-xl transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110"
          >
            <Image
              src="/images/banner-placeholder.png"
              alt="Project"
              className="h-20 w-full object-cover"
              width={400}
              height={80}
            />
            <CardHeader className="px-4 py-2">
              <div>
                <Link href={`/p/${project.id}` as Route} className="font-bold hover:underline">
                  <CardTitle className="truncate text-lg font-bold">{project.title}</CardTitle>
                </Link>
                <CardDescription className="text-muted-foreground text-sm">
                  {new Date(project.createdDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <br />
                  <a
                    href={project.githubRepo ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-accent font-bold tracking-wider text-white hover:underline"
                  >
                    GitHub Repo
                  </a>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <Badge key={tech.id} className="px-2 py-1">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => {
                      let fillType: "full" | "half" | "empty" = "empty";
                      if (project.rating >= star) {
                        fillType = "full";
                      } else if (project.rating >= star - 0.5) {
                        fillType = "half";
                      }
                      return (
                        <div key={star} className="relative h-5 w-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="absolute inset-0 h-5 w-5 text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.174L12 18.896l-7.336 3.865 1.402-8.174L.132 9.21l8.2-1.192z" />
                          </svg>
                          {fillType !== "empty" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="absolute inset-0 h-5 w-5 text-yellow-400"
                              fill="currentColor"
                            >
                              <defs>
                                {fillType === "half" && (
                                  <clipPath id={`halfClip${star}`}>
                                    <rect x="0" y="0" width="12" height="24" />
                                  </clipPath>
                                )}
                              </defs>
                              <path
                                d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.174L12 18.896l-7.336 3.865 1.402-8.174L.132 9.21l8.2-1.192z"
                                clipPath={fillType === "half" ? `url(#halfClip${star})` : undefined}
                              />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default withAuth(Page);
