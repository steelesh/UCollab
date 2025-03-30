"use client";

import type { NeedType } from "@prisma/client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as R from "remeda";

import { checkPostsCount } from "~/features/posts/post.actions";

export default function SearchBar() {
  const router = useRouter();
  const sp = useSearchParams();

  const [query, setQuery] = useState(sp.get("query") || "");
  const [postNeeds, setPostNeeds] = useState(sp.get("postNeeds") || "");
  const [minRating, setMinRating] = useState(sp.get("minRating") || "");
  const [sortBy, setSortBy] = useState(sp.get("sortBy") || "createdDate");
  const [sortOrder, setSortOrder] = useState(sp.get("sortOrder") || "desc");

  const updateSearch = useCallback(async () => {
    const params = new URLSearchParams();
    if (query)
      params.set("query", query);
    if (postNeeds)
      params.set("postNeeds", postNeeds);
    if (minRating)
      params.set("minRating", minRating);
    if (sortBy)
      params.set("sortBy", sortBy);
    if (sortOrder)
      params.set("sortOrder", sortOrder);

    const currentFilter = {
      query: sp.get("query") || "",
      postNeeds: sp.get("postNeeds") || "",
      minRating: sp.get("minRating") || "",
      sortBy: sp.get("sortBy") || "createdDate",
      sortOrder: sp.get("sortOrder") || "desc",
    };

    const filtersChanged
      = query !== currentFilter.query
        || postNeeds !== currentFilter.postNeeds
        || minRating !== currentFilter.minRating
        || sortBy !== currentFilter.sortBy
        || sortOrder !== currentFilter.sortOrder;

    if (filtersChanged) {
      params.set("page", "1");
    } else {
      params.set("page", sp.get("page") || "1");
    }

    const newParamsString = params.toString();

    const currentParamsString = sp.toString();

    const result = await checkPostsCount({ query, needType: postNeeds as NeedType, minRating });
    if (result && result.success && result.totalCount > 0 && currentParamsString !== newParamsString) {
      router.replace(`/p?${newParamsString}`);
    }
  }, [query, postNeeds, minRating, sortBy, sortOrder, router, sp]);

  const funnel = useMemo(() => R.funnel(updateSearch, { minQuietPeriodMs: 500 }), [updateSearch]);

  useEffect(() => {
    funnel.call();
  }, [funnel, query, postNeeds, minRating, sortBy, sortOrder]);

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
        <div>
          <label htmlFor="postNeeds" className="block text-sm font-medium text-foreground">
            Post Needs
          </label>
          <select
            id="postNeeds"
            value={postNeeds}
            onChange={e => setPostNeeds(e.target.value)}
            className="bg-background mt-1 block w-full rounded-md border border-input p-2 text-foreground"
          >
            <option value="">All</option>
            <option value="FEEDBACK">Feedback</option>
            <option value="CONTRIBUTION">Contribution</option>
            <option value="DEVELOPER_AVAILABLEK">Developer Available</option>
            <option value="SEEKING_MENTOR">Seeking Mentor</option>
            <option value="MENTOR_AVAILABLE">Mentor Available</option>
            <option value="TEAM_FORMATION">Team Formation</option>
          </select>
        </div>
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
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
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
