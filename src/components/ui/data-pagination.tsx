"use client";

import { ItemsPerPageSelector } from "~/components/projects/items-per-page-selector";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { cn } from "~/lib/utils";

type DataPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  itemsPerPageOptions: number[];
  basePath: string;
  itemName?: string;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
};

export function DataPagination({
  currentPage,
  totalPages,
  totalCount,
  limit,
  itemsPerPageOptions,
  basePath,
  itemName = "items",
  onPageChange,
  onLimitChange,
}: DataPaginationProps) {
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, totalCount);

  if (totalCount === 0) {
    return null;
  }

  const buildPageUrl = (page: number) => {
    if (onPageChange) {
      return "#";
    }
    return `${basePath}?page=${page}&limit=${limit}`;
  };

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    if (onLimitChange) {
      onLimitChange(Number(newLimit));
    } else {
      window.location.href = `${basePath}?page=1&limit=${newLimit}`;
    }
  };

  return (
    <div className="mt-8 border-t pt-4">
      <div className="flex items-center justify-between px-4">
        <ItemsPerPageSelector
          currentLimit={limit}
          options={itemsPerPageOptions}
          totalCount={totalCount}
          startIndex={startIndex}
          endIndex={endIndex}
          basePath={basePath}
          itemName={itemName}
          onValueChange={handleLimitChange}
        />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={buildPageUrl(currentPage - 1)}
                onClick={(e) => {
                  if (onPageChange) {
                    e.preventDefault();
                    handlePageClick(currentPage - 1);
                  }
                }}
                className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={buildPageUrl(1)}
                onClick={(e) => {
                  if (onPageChange) {
                    e.preventDefault();
                    handlePageClick(1);
                  }
                }}
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
                <PaginationLink
                  href={buildPageUrl(currentPage - 1)}
                  onClick={(e) => {
                    if (onPageChange) {
                      e.preventDefault();
                      handlePageClick(currentPage - 1);
                    }
                  }}
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage !== 1 && currentPage !== totalPages && (
              <PaginationItem>
                <PaginationLink
                  href={buildPageUrl(currentPage)}
                  onClick={(e) => {
                    if (onPageChange) {
                      e.preventDefault();
                      handlePageClick(currentPage);
                    }
                  }}
                  className="bg-accent text-accent-foreground"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href={buildPageUrl(currentPage + 1)}
                  onClick={(e) => {
                    if (onPageChange) {
                      e.preventDefault();
                      handlePageClick(currentPage + 1);
                    }
                  }}
                >
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
                  href={buildPageUrl(totalPages)}
                  onClick={(e) => {
                    if (onPageChange) {
                      e.preventDefault();
                      handlePageClick(totalPages);
                    }
                  }}
                  className={cn(currentPage === totalPages && "bg-accent text-accent-foreground")}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href={buildPageUrl(currentPage + 1)}
                onClick={(e) => {
                  if (onPageChange) {
                    e.preventDefault();
                    handlePageClick(currentPage + 1);
                  }
                }}
                className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
