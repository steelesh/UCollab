"use client";

import { ItemsPerPageSelector } from "~/components/ui/items-per-page-selector";
import {
  ShadcnPagination,
  ShadcnPaginationContent,
  ShadcnPaginationEllipsis,
  ShadcnPaginationItem,
  ShadcnPaginationLink,
  ShadcnPaginationNext,
  ShadcnPaginationPrevious,
} from "~/components/ui/shadcn-pagination";
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

export function Pagination({
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
        <ShadcnPagination>
          <ShadcnPaginationContent>
            <ShadcnPaginationItem>
              <ShadcnPaginationPrevious
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
              </ShadcnPaginationPrevious>
            </ShadcnPaginationItem>
            <ShadcnPaginationItem>
              <ShadcnPaginationLink
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
              </ShadcnPaginationLink>
            </ShadcnPaginationItem>
            {currentPage > 3 && (
              <ShadcnPaginationItem>
                <ShadcnPaginationEllipsis />
              </ShadcnPaginationItem>
            )}
            {currentPage > 2 && currentPage <= totalPages && (
              <ShadcnPaginationItem>
                <ShadcnPaginationLink
                  href={buildPageUrl(currentPage - 1)}
                  onClick={(e) => {
                    if (onPageChange) {
                      e.preventDefault();
                      handlePageClick(currentPage - 1);
                    }
                  }}
                >
                  {currentPage - 1}
                </ShadcnPaginationLink>
              </ShadcnPaginationItem>
            )}
            {currentPage !== 1 && currentPage !== totalPages && (
              <ShadcnPaginationItem>
                <ShadcnPaginationLink
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
                </ShadcnPaginationLink>
              </ShadcnPaginationItem>
            )}
            {currentPage < totalPages - 1 && (
              <ShadcnPaginationItem>
                <ShadcnPaginationLink
                  href={buildPageUrl(currentPage + 1)}
                  onClick={(e) => {
                    if (onPageChange) {
                      e.preventDefault();
                      handlePageClick(currentPage + 1);
                    }
                  }}
                >
                  {currentPage + 1}
                </ShadcnPaginationLink>
              </ShadcnPaginationItem>
            )}
            {currentPage < totalPages - 2 && (
              <ShadcnPaginationItem>
                <ShadcnPaginationEllipsis />
              </ShadcnPaginationItem>
            )}
            {totalPages > 1 && (
              <ShadcnPaginationItem>
                <ShadcnPaginationLink
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
                </ShadcnPaginationLink>
              </ShadcnPaginationItem>
            )}
            <ShadcnPaginationItem>
              <ShadcnPaginationNext
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
              </ShadcnPaginationNext>
            </ShadcnPaginationItem>
          </ShadcnPaginationContent>
        </ShadcnPagination>
      </div>
    </div>
  );
}
