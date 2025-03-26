import { withAuth } from '~/security/protected';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import type { User, Prisma, ProjectType } from '@prisma/client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { prisma } from '~/lib/prisma';
import { cn } from '~/lib/utils';
import { ItemsPerPageSelector } from '~/components/projects/items-per-page-selector';
import { StarDisplay } from '~/components/ui/star-rating';
import SearchBar from '~/components/projects/search-projects';

export const metadata = {
  title: 'UCollab — Explore',
};

interface PageProps {
  searchParams: Record<string, string | undefined>;
  userId: User['id'];
}

function buildQueryString(searchParams: Record<string, string | undefined>, override: Record<string, string>) {
  const plainParams = Object.fromEntries(
    Object.entries(searchParams).filter(([_, value]) => value !== undefined && value !== ''),
  ) as Record<string, string>;
  const finalParams = { ...plainParams, ...override };
  return new URLSearchParams(finalParams).toString();
}

async function getFilteredProjects(searchParams: Record<string, string | undefined>, _userId: User['id']) {
  const {
    query = '',
    projectType = '',
    minRating = '',
    sortBy = 'createdDate',
    sortOrder = 'desc',
    page = '1',
    limit = '12',
  } = searchParams;

  const where: Prisma.ProjectWhereInput = {};

  if (query) {
    // Always use full-text search.
    where.OR = [{ title: { search: query } }, { description: { search: query } }];
  }

  if (projectType) {
    where.projectType = projectType as ProjectType;
  }

  if (minRating) {
    where.rating = { gte: Number(minRating) };
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const projects = await prisma.project.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
    select: {
      id: true,
      title: true,
      description: true,
      createdDate: true,
      lastModifiedDate: true,
      projectType: true,
      githubRepo: true,
      rating: true,
      technologies: { select: { id: true, name: true } },
    },
  });

  const totalCount = await prisma.project.count({ where });
  const totalPages = Math.ceil(totalCount / limitNumber);

  return { projects, totalCount, totalPages };
}

async function Page({ searchParams, userId }: PageProps) {
  const { projects, totalCount, totalPages } = await getFilteredProjects(searchParams, userId);
  const currentPage = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 12;
  const itemsPerPageOptions = [12, 24, 48, 96];
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, totalCount);

  return (
    <div className="mx-auto" style={{ maxWidth: 'calc(100vw - 8rem)' }}>
      <SearchBar />
      <div className="mx-auto grid grid-cols-1 gap-20 sm:mx-8 md:grid-cols-2 md:gap-14 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="bg-muted shadow-xl transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110">
            <img src="/images/banner-placeholder.png" alt="Project" className="h-20 w-full object-cover" />
            <CardHeader className="px-4 py-2">
              <div>
                <Link href={`/p/${project.id}`} className="font-bold hover:underline">
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
                  href={
                    currentPage > 1 ? `/p?${buildQueryString(searchParams, { page: String(currentPage - 1) })}` : '#'
                  }
                  className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href={`/p?${buildQueryString(searchParams, { page: '1' })}`}
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
                  <PaginationLink href={`/p?${buildQueryString(searchParams, { page: String(currentPage - 1) })}`}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage !== 1 && currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href={`/p?${buildQueryString(searchParams, { page: String(currentPage) })}`}
                    className="bg-accent text-accent-foreground">
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink href={`/p?${buildQueryString(searchParams, { page: String(currentPage + 1) })}`}>
                    {currentPage + 1}
                  </PaginationLink>
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
                    href={`/p?${buildQueryString(searchParams, { page: String(totalPages) })}`}
                    className={cn(currentPage === totalPages && 'bg-accent text-accent-foreground')}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? `/p?${buildQueryString(searchParams, { page: String(currentPage + 1) })}`
                      : '#'
                  }
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
