import type { User } from "@prisma/client";

import type { PostDetails } from "~/features/posts/post.types";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Pagination } from "~/components/ui/pagination";
import { PostCardSmall } from "~/components/ui/post-card-sm";
import { getBookmarkedPosts } from "~/features/posts/post.actions";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — My Bookmarks",
};

type PageProps = {
  params: Promise<{ username: User["username"] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { page = "1", limit = "12" } = await searchParams;

  const { success, posts } = (await getBookmarkedPosts()) as unknown as {
    success: boolean;
    posts: PostDetails[];
  };

  if (!success) {
    return <div>Error loading bookmarked posts.</div>;
  }

  return (
    <Container>
      <PageBreadcrumb items={[{ label: "My Bookmarks", isCurrent: true }]} />
      <Header>
        <H1>My Bookmarks</H1>
      </Header>
      <div className="grid gap-4 lg:grid-cols-2">
        {posts.map(post => (
          <PostCardSmall
            key={post.id}
            id={post.id}
            title={post.title}
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
            watchers={post.watchers}
          />
        ))}
      </div>
      <Pagination
        currentPage={Number(page)}
        totalPages={1}
        totalCount={posts.length}
        limit={Number(limit)}
        itemsPerPageOptions={[12, 24, 36, 48]}
        basePath={`/u/${username}/bookmarks`}
        itemName="posts"
      />
    </Container>
  );
}

export default withAuth(Page);
