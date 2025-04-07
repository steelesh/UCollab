import type { User } from "@prisma/client";
import type { Metadata } from "next";

import { NeedType } from "@prisma/client";
import { redirect } from "next/navigation";

import { PostForm } from "~/components/posts/post-form";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { getPostTitle } from "~/features/posts/post.queries";
import { PostService } from "~/features/posts/post.service";
import { prisma } from "~/lib/prisma";
import { withAuth } from "~/security/protected";

type PageProps = {
  readonly params: Promise<{ postId: string }>;
  readonly userId: User["id"];
};

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  const { postId } = await params;
  try {
    const postTitle = await getPostTitle(postId);
    return {
      title: `Edit ${postTitle} | UCollab`,
    };
  } catch {
    return {
      title: "Edit Post | UCollab",
    };
  }
}

async function Page({ userId, params }: PageProps) {
  const { postId } = await params;
  const post = await PostService.getPostById(postId, userId);

  if (!post) {
    return (
      <div className="flex flex-col items-center">
        <p>Post not found.</p>
      </div>
    );
  }

  if (post.createdById !== userId) {
    redirect(`/p/${postId}`);
  }

  const commentCount = await prisma.comment.count({
    where: { postId: post.id },
  });

  const formattedPost = {
    id: post.id,
    needType: post.postNeeds[0]?.needType ?? NeedType.FEEDBACK,
    secondaryNeedType: post.postNeeds[1]?.needType ?? null,
    title: post.title,
    description: post.description,
    technologies: post.technologies.map(tech => tech.name),
    githubRepo: post.githubRepo,
    allowRatings: post.allowRatings,
    allowComments: post.allowComments,
    hasComments: commentCount > 0,
  };

  return (
    <Container className="max-w-5xl">
      <Card variant="glossy" className="p-4 sm:p-8">
        <PostForm post={formattedPost} />
      </Card>
    </Container>
  );
}

export default withAuth(Page);
