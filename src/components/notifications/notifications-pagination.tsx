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

type NotificationsPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
};

export function NotificationsPagination({ currentPage, totalPages, totalCount, limit }: NotificationsPaginationProps) {
  const itemsPerPageOptions = [10, 20, 50, 100];
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, totalCount);

  // Don't render pagination if there are no items
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-4">
      <div className="flex items-center justify-between px-4">
        <ItemsPerPageSelector
          currentLimit={limit}
          options={itemsPerPageOptions}
          totalCount={totalCount}
          startIndex={startIndex}
          endIndex={endIndex}
          basePath="/notifications"
          itemName="notifications"
        />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? `/notifications?page=${currentPage - 1}&limit=${limit}` : "#"}
                className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={`/notifications?page=1&limit=${limit}`}
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
                <PaginationLink href={`/notifications?page=${currentPage - 1}&limit=${limit}`}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage !== 1 && currentPage !== totalPages && (
              <PaginationItem>
                <PaginationLink
                  href={`/notifications?page=${currentPage}&limit=${limit}`}
                  className="bg-accent text-accent-foreground"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink href={`/notifications?page=${currentPage + 1}&limit=${limit}`}>
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
                  href={`/notifications?page=${totalPages}&limit=${limit}`}
                  className={cn(currentPage === totalPages && "bg-accent text-accent-foreground")}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href={currentPage < totalPages ? `/notifications?page=${currentPage + 1}&limit=${limit}` : "#"}
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
