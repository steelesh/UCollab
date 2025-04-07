import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Pagination } from "~/components/navigation/pagination";
import { PostCard } from "~/components/posts/post-card";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { getTrendingPosts } from "~/features/posts/post.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — Trending",
};

type PageProps = {
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  readonly userId: User["id"];
};

async function Page({ searchParams, userId }: PageProps) {
  const { page = "1", limit = "12" } = await searchParams;
  const { posts, totalCount, currentPage, totalPages, limit: itemsPerPage } = await getTrendingPosts(
    userId,
    Number(page),
    Number(limit),
  );

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "Trending Posts", isCurrent: true },
        ]}
      />
      <Header>
        <H1>Trending Posts</H1>
      </Header>
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
            trendingScore={post.trendingScore}
            watchers={post.watchers}
            comments={post.comments.length}
          />
        ))}
      </div>
      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          limit={itemsPerPage}
          basePath="/p/trending"
          itemName="posts"
          itemsPerPageOptions={[12, 24, 36]}
        />
      )}
    </Container>
  );
}

export default withAuth(Page);
