import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import SearchBar from "~/components/posts/search-posts";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Pagination } from "~/components/ui/pagination";
import { PostCard } from "~/components/ui/post-card";
import { getPosts } from "~/features/posts/post.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — Explore",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ searchParams, userId }: PageProps) {
  const {
    page = "1",
    limit = "8",
    query: queryParam = "",
    postNeeds: postNeedsParam = "",
    minRating: minRatingParam = "",
    sortBy: sortByParam = "createdDate",
    sortOrder: sortOrderParam = "desc",
  } = await searchParams;
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam;
  const postNeeds = Array.isArray(postNeedsParam) ? postNeedsParam[0] : postNeedsParam;
  const minRating = Array.isArray(minRatingParam) ? minRatingParam[0] : minRatingParam;
  const sortBy = Array.isArray(sortByParam) ? sortByParam[0] : sortByParam;
  const sortOrder = Array.isArray(sortOrderParam) ? sortOrderParam[0] : sortOrderParam;
  const { posts, totalCount } = await getPosts(
    Number(page),
    Number(limit),
    userId,
    query,
    postNeeds,
    minRating,
    sortBy,
    sortOrder,
  );

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "All Posts", isCurrent: true },
        ]}
      />
      <Header>
        <H1>All Posts</H1>
      </Header>
      <SearchBar />
      <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
        {posts.map(post => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            githubRepo={post.githubRepo}
            createdDate={post.createdDate}
            technologies={post.technologies}
            rating={post.rating}
            allowRatings={post.allowRatings}
            postNeeds={post.postNeeds}
            user={{
              username: post.createdBy.username,
              avatar: post.createdBy.avatar,
            }}
            trendingScore={post.trendingScore}
            watchers={post.watchers}
            comments={post.comments.length}
          />
        ))}
      </div>
      {totalCount > 0 && (
        <Pagination
          currentPage={Number(page)}
          totalPages={Math.ceil(totalCount / Number(limit))}
          totalCount={totalCount}
          limit={Number(limit)}
          basePath="/p"
          itemName="posts"
          itemsPerPageOptions={[8, 16, 24]}
        />
      )}
    </Container>
  );
}

export default withAuth(Page);
