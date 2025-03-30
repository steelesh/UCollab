"use server";

import type { Comment, Post } from "@prisma/client";

import { revalidatePath } from "next/cache";

import { auth } from "~/security/auth";

import { commentSchema } from "./comment.schema";
import { CommentService } from "./comment.service";

export async function createComment(postId: Post["id"], content: Comment["content"]) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("Authentication required");

  const validatedData = commentSchema.parse({ content, postId });

  try {
    const comment = await CommentService.createComment(validatedData, session.user.id);
    revalidatePath(`/p/${postId}`);
    return comment;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create comment");
  }
}

export async function updateComment(commentId: Comment["id"], content: Comment["content"], postId: Post["id"]) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("Authentication required");

  const validatedData = commentSchema.parse({ content, postId });

  try {
    await CommentService.updateComment(
      {
        id: commentId,
        content: validatedData.content,
      },
      session.user.id,
    );
    revalidatePath(`/p/${postId}`);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update comment");
  }
}

export async function deleteComment(commentId: Comment["id"], postId: Post["id"]) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("Authentication required");

  try {
    await CommentService.deleteComment(commentId, session.user.id);
    revalidatePath(`/p/${postId}`);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete comment");
  }
}

export async function createReply(postId: string, parentId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error("Authentication required");

  const validatedData = commentSchema.parse({ content, postId });

  try {
    const comment = await CommentService.createReply({ ...validatedData, parentId }, session.user.id);
    revalidatePath(`/p/${postId}`);
    return comment;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create reply");
  }
}
