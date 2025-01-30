"use server";

import { auth } from "@/auth";
import {
  CreateCommentData,
  UpdateCommentData,
} from "@/src/schemas/comment.schema";
import { CommentService } from "@/src/services/comment.service";
import { revalidatePath } from "next/cache";

export async function createComment(data: CreateCommentData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const comment = await CommentService.createComment(data, session.user.id);
  revalidatePath(`/posts/${data.postId}`);
  return comment;
}

export async function updateComment(data: UpdateCommentData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const comment = await CommentService.updateComment(data, session.user.id);
  revalidatePath(`/posts/${data.postId}`);
  return comment;
}

export async function deleteComment(commentId: string, postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await CommentService.deleteComment(commentId, session.user.id);
  revalidatePath(`/posts/${postId}`);
}
