import type { User } from "@prisma/client";

import type { PostDetails } from "~/features/posts/post.types";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Pagination } from "~/components/navigation/pagination";
import { PostCardSmall } from "~/components/posts/post-card-sm";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { getBookmarkedPosts } from "~/features/posts/post.actions";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — My Bookmarks",
};

type PageProps = {
  readonly params: Promise<{ username: User["username"] }>;
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  readonly userId: User["id"];
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
            createdDate={post.createdDate}
            technologies={post.technologies}
            rating={post.rating}
            allowRatings={post.allowRatings}
            postNeeds={post.postNeeds}
            bannerImage={post.bannerImage}
            user={{
              username: post.createdBy.username,
              avatar: post.createdBy.avatar,
            }}
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
