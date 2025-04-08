import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Pagination } from "~/components/navigation/pagination";
import { NeedTypeFilter } from "~/components/posts/need-type-filter";
import { PostCard } from "~/components/posts/post-card";
import SearchBar from "~/components/posts/search-posts";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { getCollaborationPosts } from "~/features/posts/post.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — Project Collaboration",
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
    minRating: rawMinRating = "",
    sortBy: rawSortBy = "createdDate",
    sortOrder: rawSortOrder = "desc",
    postNeeds: rawPostNeeds = "CONTRIBUTION",
  } = await searchParams;

  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
  const minRating = Array.isArray(rawMinRating) ? rawMinRating[0] : rawMinRating;
  const sortBy = Array.isArray(rawSortBy) ? rawSortBy[0] : rawSortBy;
  const sortOrder = Array.isArray(rawSortOrder) ? rawSortOrder[0] : rawSortOrder;
  const postNeeds = (Array.isArray(rawPostNeeds) ? rawPostNeeds[0] : rawPostNeeds) || "CONTRIBUTION";

  const { posts, totalCount } = await getCollaborationPosts(
    Number(page),
    Number(limit),
    userId,
    { query, minRating, sortBy, sortOrder, postNeeds },
  );

  return (
    <Container>
      <PageBreadcrumb items={[{ label: "Project Collaboration", isCurrent: true }]} />
      <Header>
        <H1>Project Collaboration</H1>
      </Header>
      <SearchBar />
      <NeedTypeFilter selectedValue={postNeeds} variant="projects" />
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
          basePath="/p/collabs"
          itemName="posts"
          itemsPerPageOptions={[8, 16, 24]}
        />
      )}
    </Container>
  );
}

export default withAuth(Page);
