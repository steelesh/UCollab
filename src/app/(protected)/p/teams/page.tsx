import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Pagination } from "~/components/navigation/pagination";
import { PostCard } from "~/components/posts/post-card";
import SearchBar from "~/components/posts/search-posts";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { getTeamFormationPosts } from "~/features/posts/post.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — Team Formation",
};

type PageProps = {
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  readonly userId: User["id"];
};

async function Page({ searchParams, userId }: PageProps) {
  const {
    page = "1",
    limit = "8",
    query: rawQuery = "",
    sortBy: rawSortBy = "createdDate",
    sortOrder: rawSortOrder = "desc",
  } = await searchParams;

  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  const sortBy = Array.isArray(rawSortBy) ? rawSortBy[0] : rawSortBy;
  const sortOrder = Array.isArray(rawSortOrder) ? rawSortOrder[0] : rawSortOrder;

  const { posts, totalCount } = await getTeamFormationPosts(
    Number(page),
    Number(limit),
    userId,
    { query, sortBy, sortOrder },
  );

  return (
    <Container>
      <PageBreadcrumb items={[{ label: "Team Formation", isCurrent: true }]} />
      <Header>
        <H1>Team Formation</H1>
      </Header>
      <SearchBar showRatingFilter={false} />
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
            bannerImage={post.bannerImage}
            postNeeds={post.postNeeds}
            user={{
              username: post.createdBy.username,
              avatar: post.createdBy.avatar,
            }}
            isTrending={post.isTrending}
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
          basePath="/p/teams"
          itemName="posts"
          itemsPerPageOptions={[8, 16, 24]}
        />
      )}
    </Container>
  );
}

export default withAuth(Page);
