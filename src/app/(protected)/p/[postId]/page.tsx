import type { Post, User } from "@prisma/client";
import type { Metadata } from "next";

import { formatDate } from "date-fns";
import { ArrowUpRight, Github, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PostActions } from "~/components/posts/post-actions";
import { PostBookmark } from "~/components/posts/post-bookmark";
import { PostComments } from "~/components/posts/post-comments";
import { PostRating } from "~/components/posts/post-rating";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1, H2 } from "~/components/ui/heading";
import { Muted } from "~/components/ui/muted";
import { PostNeedsBadges } from "~/components/ui/post-badges";
import { Section } from "~/components/ui/section";
import { TechnologyIcon } from "~/components/ui/technology-icon";
import { getComments } from "~/features/comments/comment.queries";
import { getPostTitle, getRealTimePost, getUserPostRating, isPostBookmarked } from "~/features/posts/post.queries";
import { DEFAULT_POST_BANNER_IMAGE } from "~/lib/utils";
import { withAuth } from "~/security/protected";

type PageProps = {
  readonly params: Promise<{ postId: Post["id"] }>;
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  readonly userId: User["id"];
};

export async function generateMetadata({ params }: { params: Promise<{ postId: Post["id"] }> }): Promise<Metadata> {
  const { postId } = await params;
  try {
    const postTitle = await getPostTitle(postId);
    return {
      title: `${postTitle} | UCollab`,
    };
  } catch {
    return {
      title: "Post not found | UCollab",
    };
  }
}

async function Page({ params, searchParams, userId }: PageProps) {
  const { postId } = await params;
  const { page = "1", limit = "30" } = await searchParams;
  const post = await getRealTimePost(postId, userId);
  const userPostRating = await getUserPostRating(postId, userId);
  const isBookmarked = await isPostBookmarked(postId, userId);
  const isTrending = post.trendingScore > 0.5;
  const { comments, totalPages, currentPage, totalCount, limit: commentLimit } = await getComments(
    postId,
    userId,
    Number(page),
    Number(limit),
  );

  return (
    <Container className="max-w-3xl">
      <div className="mb-4 md:mb-6">
        <Link
          href="/p"
          className="group flex items-center gap-1 md:gap-1.5 text-sm md:text-base text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 w-fit"
        >
          <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 -rotate-135 mr-0.5" />
          <span>Back</span>
        </Link>
      </div>
      <Header>
        {post.postNeeds.length > 0 && (
          <div className="mb-6">
            <PostNeedsBadges
              needs={post.postNeeds}
              className="flex flex-wrap gap-3"
              size="lg"
            />
          </div>
        )}
        <H1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6">{post.title}</H1>
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          {post.createdBy && (
            <Link
              href={`/u/${post.createdBy.username}`}
              className="group flex items-center gap-1.5 md:gap-2 hover:text-foreground transition-colors duration-200"
            >
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src={post.createdBy.avatar} alt={post.createdBy.username} />
              </Avatar>
              <div>
                <div className="font-medium text-sm md:text-base">{post.createdBy.username}</div>
                <Muted className="text-[10px] md:text-xs">
                  {formatDate(post.createdDate, "MMM dd, yyyy")}
                </Muted>
              </div>
            </Link>
          )}
          {post.createdById === userId && (
            <div className="ml-auto">
              <PostActions
                postId={postId}
                isOwnPost={true}
                isBookmarked={isBookmarked}
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 my-4 py-4 border-t border-b border-border/30 text-sm text-muted-foreground">
          {post.allowRatings && (
            <div className="flex items-center gap-1.5">
              {isTrending && (
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              )}
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 stroke-background stroke-[1.5px]" />
              <span className="text-xs md:text-sm">{post.rating > 0 ? post.rating.toFixed(1) : "Not rated"}</span>
            </div>
          )}
          {!post.allowRatings && isTrending && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              <span className="text-xs md:text-sm">Trending</span>
            </div>
          )}
          {post.createdById !== userId && (
            <div className="ml-auto">
              <PostBookmark
                postId={postId}
                initialBookmarked={isBookmarked}
              />
            </div>
          )}
        </div>
      </Header>
      <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden mb-6 md:mb-10">
        <Image
          src={post.bannerImage ?? DEFAULT_POST_BANNER_IMAGE}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      <div className="space-y-8 md:space-y-12">
        <Section>
          <H2>Description</H2>
          <Muted className="text-base md:text-lg leading-relaxed">
            {post.description}
          </Muted>
          {post.githubRepo && (
            <Link
              href={post.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-md bg-[#f6f8fa] border border-[#d0d7de] text-[#24292f] hover:bg-[#f3f4f6] dark:bg-[#21262d] dark:border-[#30363d] dark:text-white dark:hover:bg-[#30363d] transition-colors text-sm md:text-base mt-6 md:mt-8"
            >
              <Github className="w-4 h-4 md:w-5 md:h-5" />
              <span>View on GitHub</span>
            </Link>
          )}
        </Section>
        {post.technologies && post.technologies.length > 0 && (
          <Section>
            <H2>Technologies</H2>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {post.technologies.map(tech => (
                <Badge key={tech.id} variant="glossy" className="py-1 md:py-2 px-2 md:px-3 text-sm md:text-base">
                  <TechnologyIcon name={tech.name} colored />
                  <span className="ml-1">{tech.name}</span>
                </Badge>
              ))}
            </div>
          </Section>
        )}
        {post.allowRatings && post.createdById !== userId && (
          <Section className="border-t border-border/30 pt-6 md:pt-8">
            <H2>Rate this Post</H2>
            <PostRating
              postId={postId}
              initialRating={post.rating}
              userRating={userPostRating}
            />
          </Section>
        )}
        {post.allowComments && (
          <Section className="border-t border-border/30 pt-6 md:pt-8">
            <H2 className="text-xl md:text-2xl mb-3 md:mb-4 flex items-center gap-2">
              Comments
              {/* */}
              <span className="text-sm md:text-base font-normal text-muted-foreground">
                (
                {totalCount}
                )
              </span>
            </H2>
            <PostComments
              comments={comments}
              currentUserId={userId}
              postId={postId}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              limit={commentLimit}
            />
          </Section>
        )}
      </div>
    </Container>
  );
}

export default withAuth(Page);
