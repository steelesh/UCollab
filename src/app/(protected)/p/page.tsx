import type { Prisma, ProjectType, User } from "@prisma/client";

import Image from "next/image";
import Link from "next/link";

import { ItemsPerPageSelector } from "~/components/projects/items-per-page-selector";
import SearchBar from "~/components/projects/search-projects";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { StarDisplay } from "~/components/ui/star-rating";
import { prisma } from "~/lib/prisma";
import { cn } from "~/lib/utils";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — Explore",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

function buildQueryString(searchParams: { [key: string]: string | string[] | undefined }, override: Record<string, string>) {
  const plainParams = Object.fromEntries(
    Object.entries(searchParams)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string>;
  const finalParams = { ...plainParams, ...override };
  return new URLSearchParams(finalParams).toString();
}

async function getFilteredProjects(searchParams: { [key: string]: string | string[] | undefined }, _userId: User["id"]) {
  try {
    const {
      query = "",
      projectType = "",
      minRating = "",
      sortBy = "createdDate",
      sortOrder = "desc",
      page = "1",
      limit = "12",
    } = searchParams;

    const where: Prisma.ProjectWhereInput = {};

    if (query) {
      const queryStr = Array.isArray(query) ? query[0] : query;
      where.OR = [
        { title: { contains: queryStr } },
        { description: { contains: queryStr } },
      ];
    }

    if (projectType) {
      const typeStr = Array.isArray(projectType) ? projectType[0] : projectType;
      where.projectType = typeStr as ProjectType;
    }

    if (minRating) {
      const ratingStr = Array.isArray(minRating) ? minRating[0] : minRating;
      where.rating = { gte: Number(ratingStr) };
    }

    const pageNumber = Number(Array.isArray(page) ? page[0] : page);
    const limitNumber = Number(Array.isArray(limit) ? limit[0] : limit);
    const sortByStr = (Array.isArray(sortBy) ? sortBy[0] : sortBy) as keyof Prisma.ProjectOrderByWithRelationInput;
    const sortOrderStr = Array.isArray(sortOrder) ? sortOrder[0] : sortOrder;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { [sortByStr]: sortOrderStr },
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
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { projects: [], totalCount: 0, totalPages: 0 };
  }
}

async function Page({ searchParams, userId }: PageProps) {
  const params = await searchParams;
  const { projects, totalCount, totalPages } = await getFilteredProjects(params, userId);
  const currentPage = Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1;
  const limit = Number(Array.isArray(params.limit) ? params.limit[0] : params.limit) || 12;
  const itemsPerPageOptions = [12, 24, 48, 96];
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, totalCount);

  return (
    <div className="mx-auto" style={{ maxWidth: "calc(100vw - 8rem)" }}>
      <SearchBar />
      <div className="mx-auto grid grid-cols-1 gap-20 sm:mx-8 md:grid-cols-2 md:gap-14 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map(project => (
          <Card
            key={project.id}
            className="bg-muted shadow-xl transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-110"
          >
            <Image
              src="/images/banner-placeholder.png"
              alt="Project"
              width={400}
              height={80}
              className="h-20 w-full object-cover"
            />
            <CardHeader className="px-4 py-2">
              <div>
                <Link href={`/p/${project.id}`} className="font-bold hover:underline">
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
                  <div className="mt-2">
                    {project.rating > 0
                      ? (
                          <StarDisplay rating={project.rating} size="md" />
                        )
                      : (
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
                  href={currentPage > 1 ? `/p?${buildQueryString(params, { page: String(currentPage - 1) })}` : "#"}
                  className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href={`/p?${buildQueryString(params, { page: "1" })}`}
                  className={cn(currentPage === 1 && "bg-accent text-accent-foreground")}
                >
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
                  <PaginationLink href={`/p?${buildQueryString(params, { page: String(currentPage - 1) })}`}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage !== 1 && currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href={`/p?${buildQueryString(params, { page: String(currentPage) })}`}
                    className="bg-accent text-accent-foreground"
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
              )}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink href={`/p?${buildQueryString(params, { page: String(currentPage + 1) })}`}>
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
                    href={`/p?${buildQueryString(params, { page: String(totalPages) })}`}
                    className={cn(currentPage === totalPages && "bg-accent text-accent-foreground")}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href={currentPage < totalPages ? `/p?${buildQueryString(params, { page: String(currentPage + 1) })}` : "#"}
                  className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Page);
