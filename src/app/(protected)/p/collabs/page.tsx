import { prisma } from '~/lib/prisma';
import { withAuth } from '~/security/protected';
import Link from 'next/link';
import type { Route } from 'next';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export const metadata = {
  title: 'UCollab — Collaboration',
};

export async function CollaborationPage() {
  const projectsWithUser = await prisma.project.findMany({
    where: {
      projectType: 'CONTRIBUTION',
    },
    orderBy: {
      createdDate: 'desc',
    },
    select: {
      id: true,
      title: true,
      createdDate: true,
      description: true,
      githubRepo: true,
      projectType: true,
    },
  });

  return (
    <div className="absolute inset-0 overflow-x-hidden overflow-y-auto py-24">
      <div className="mx-auto" style={{ maxWidth: 'calc(100vw - 8rem)' }}>
        <div className="mx-auto grid grid-cols-1 gap-20 sm:mx-8 md:grid-cols-2 md:gap-14 lg:grid-cols-3 xl:grid-cols-4">
          {projectsWithUser.map((project, index) => (
            <Card
              key={index}
              className="bg-muted shadow-xl transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110">
              <img src="/images/banner-placeholder.png" alt="Project" className="h-20 w-full object-cover" />
              <CardHeader className="px-4 py-2">
                <div>
                  <Link href={`/p/${project.id}` as Route} className="font-bold hover:underline">
                    <CardTitle className="truncate text-lg font-bold">{project.title}</CardTitle>
                  </Link>
                  <CardDescription className="text-secondary text-sm">
                    {new Date(project.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    <br />
                    <a
                      href={project.githubRepo ?? ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-accent font-bold tracking-wider text-white hover:underline">
                      GitHub Repo
                    </a>
                    <Badge className="mt-4 flex items-center justify-between">{project.projectType}</Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(CollaborationPage);
