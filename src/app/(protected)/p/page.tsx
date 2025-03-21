import { withAuth } from '~/security/protected';
import Link from 'next/link';
import type { Route } from 'next';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import type { User } from '@prisma/client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { getProjects } from '~/features/projects/project.queries';
import { cn } from '~/lib/utils';
import { ItemsPerPageSelector } from '~/components/projects/items-per-page-selector';
import { StarDisplay } from '~/components/ui/star-rating';

export const metadata = {
  title: 'UCollab — Explore',
};

interface PageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
  userId: User['id'];
}

async function Page({ searchParams: searchParamsPromise, userId }: PageProps) {
  const searchParams = await searchParamsPromise;
  const currentPage = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 12;
  const data = await getProjects(currentPage, limit, userId);

  if (!data) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p>Failed to load projects.</p>
      </div>
    );
  }

  const { projects, totalPages, totalCount } = data;
  const itemsPerPageOptions = [12, 24, 48, 96];
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, totalCount);

  return (
    <div className="mx-auto" style={{ maxWidth: 'calc(100vw - 8rem)' }}>
      <div className="mx-auto grid grid-cols-1 gap-20 sm:mx-8 md:grid-cols-2 md:gap-14 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project, index) => (
          <Card
            key={index}
            className="bg-muted shadow-xl transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110">
            <img src="/images/banner-placeholder.png" alt="Project" className="h-20 w-full object-cover" />
            <CardHeader className="px-4 py-2">
              <div>
                <Link href={`/p/${project.id}` as Route} className="font-bold hover:underline">
                  <CardTitle className="truncate text-lg font-bold">{project.title}</CardTitle>
                </Link>
                <CardDescription className="text-muted-foreground text-sm">
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
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech.id} className="px-2 py-1">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2">
                    {project.rating > 0 ? (
                      <StarDisplay rating={project.rating} size="md" />
                    ) : (
                      <span className="text-muted-foreground text-sm">No ratings yet</span>
                    )}
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
      <div className="mt-8 border-t pt-4">
        <div className="flex items-center justify-between px-4">
          <ItemsPerPageSelector
            currentLimit={limit}
            options={itemsPerPageOptions}
            totalCount={totalCount}
            startIndex={startIndex}
            endIndex={endIndex}
          />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? `/p?page=${currentPage - 1}&limit=${limit}` : '#'}
                  className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href={`/p?page=1&limit=${limit}`}
                  className={cn(currentPage === 1 && 'bg-accent text-accent-foreground')}>
                  1
                </PaginationLink>
              </PaginationItem>
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {currentPage > 2 && currentPage <= totalPages && (
                <PaginationItem>
                  <PaginationLink href={`/p?page=${currentPage - 1}&limit=${limit}`}>{currentPage - 1}</PaginationLink>
                </PaginationItem>
              )}
              {currentPage !== 1 && currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href={`/p?page=${currentPage}&limit=${limit}`}
                    className="bg-accent text-accent-foreground">
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink href={`/p?page=${currentPage + 1}&limit=${limit}`}>{currentPage + 1}</PaginationLink>
                </PaginationItem>
              )}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href={`/p?page=${totalPages}&limit=${limit}`}
                    className={cn(currentPage === totalPages && 'bg-accent text-accent-foreground')}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href={currentPage < totalPages ? `/p?page=${currentPage + 1}&limit=${limit}` : '#'}
                  className={cn(currentPage >= totalPages && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Page);
