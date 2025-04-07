"use client";

import { useSearchParams } from "next/navigation";

import {
  ShadcnPagination,
  ShadcnPaginationContent,
  ShadcnPaginationEllipsis,
  ShadcnPaginationItem,
  ShadcnPaginationLink,
  ShadcnPaginationNext,
  ShadcnPaginationPrevious,
} from "@components/ui/shadcn-pagination";
import { ItemsPerPageSelector } from "~/components/navigation/items-per-page-selector";
import { cn } from "~/lib/utils";

type DataPaginationProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalCount: number;
  readonly limit: number;
  readonly itemsPerPageOptions: number[];
  readonly basePath: string;
  readonly itemName?: string;
  readonly onPageChange?: (page: number) => void;
  readonly onLimitChange?: (limit: number) => void;
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
  const searchParams = useSearchParams();
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, totalCount);

  if (totalCount === 0) {
    return null;
  }

  const buildPageUrl = (page: number) => {
    if (onPageChange) {
      return "#";
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    return `${basePath}?${params.toString()}`;
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
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      params.set("limit", newLimit);
      window.location.href = `${basePath}?${params.toString()}`;
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
