"use client";

import type { NeedType } from "@prisma/client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as R from "remeda";

import { checkPostsCount } from "~/features/posts/post.actions";

type SearchBarProps = {
  showRatingFilter?: boolean;
};

export default function SearchBar({ showRatingFilter = true }: SearchBarProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  const basePath = useMemo(() => {
    if (pathname.startsWith("/p/feedback"))
      return "/p/feedback";
    if (pathname.startsWith("/p/collabs"))
      return "/p/collabs";
    if (pathname.startsWith("/p/trending"))
      return "/p/trending";
    if (pathname.startsWith("/m"))
      return "/m";
    return "/p";
  }, [pathname]);

  const [query, setQuery] = useState(sp.get("query") ?? "");
  const [minRating, setMinRating] = useState(sp.get("minRating") ?? "");
  const [sortBy, setSortBy] = useState(sp.get("sortBy") ?? "createdDate");
  const [sortOrder, setSortOrder] = useState(sp.get("sortOrder") ?? "desc");

  const updateSearch = useCallback(async () => {
    const params = new URLSearchParams(sp.toString());
    const currentQuery = sp.get("query") ?? "";
    const currentMinRating = sp.get("minRating") ?? "";
    const currentSortBy = sp.get("sortBy") ?? "createdDate";
    const currentSortOrder = sp.get("sortOrder") ?? "desc";

    const filtersChanged
      = query !== currentQuery
        || minRating !== currentMinRating
        || sortBy !== currentSortBy
        || sortOrder !== currentSortOrder;

    if (query)
      params.set("query", query);
    else params.delete("query");

    if (showRatingFilter && minRating)
      params.set("minRating", minRating);
    else params.delete("minRating");

    if (sortBy)
      params.set("sortBy", sortBy);
    else params.delete("sortBy");

    if (sortOrder)
      params.set("sortOrder", sortOrder);
    else params.delete("sortOrder");

    const defaultLimit = basePath === "/p/trending" ? "12" : "8";
    if (!params.has("limit")) {
      params.set("limit", defaultLimit);
    }

    if (filtersChanged) {
      params.set("page", "1");
    } else if (!params.has("page")) {
      params.set("page", "1");
    }

    const currentParamsString = sp.toString();
    const newParamsString = params.toString();

    if (currentParamsString === newParamsString)
      return;

    const postNeeds = params.get("postNeeds");

    const result = await checkPostsCount({
      query,
      needType: postNeeds as NeedType,
      minRating: showRatingFilter ? minRating : undefined,
    });

    if (result && result.success && result.totalCount > 0) {
      router.replace(`${basePath}?${newParamsString}`);
    }
  }, [query, minRating, sortBy, sortOrder, router, sp, basePath, showRatingFilter]);

  const debouncedUpdate = useMemo(
    () => R.funnel(updateSearch, { minQuietPeriodMs: 500 }),
    [updateSearch],
  );

  useEffect(() => {
    debouncedUpdate.call();
  }, [debouncedUpdate, query, minRating, sortBy, sortOrder]);

  return (
    <div className="bg-muted mb-8 rounded-xl p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-foreground">
            Search Query
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="bg-background mt-1 block w-full rounded-md border border-input p-2 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {showRatingFilter && (
          <div>
            <label htmlFor="minRating" className="block text-sm font-medium text-foreground">
              Minimum Rating
            </label>
            <select
              id="minRating"
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
              className="bg-background mt-1 block w-full rounded-md border border-input p-2 text-foreground"
            >
              <option value="">Any Rating</option>
              <option value="1">1 Star & up</option>
              <option value="2">2 Stars & up</option>
              <option value="3">3 Stars & up</option>
              <option value="4">4 Stars & up</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-foreground">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-background mt-1 block w-full rounded-md border border-input p-2 text-foreground"
          >
            <option value="createdDate">Creation Date</option>
            <option value="lastModifiedDate">Last Updated Date</option>
          </select>
        </div>
        <div className={`${!showRatingFilter ? "sm:col-span-2" : ""} lg:col-span-1`}>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-foreground">
            Sort Order
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="bg-background mt-1 block w-full rounded-md border border-input p-2 text-foreground"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
