import type { Post, User } from "@prisma/client";

import { CommentService } from "./comment.service";

export async function getComments(postId: Post["id"], userId: User["id"], page: number, limit: number) {
  const comments = await CommentService.getPaginatedComments(postId, userId, page, limit);
  const totalCount = await CommentService.getCommentCount(postId, userId);

  return {
    comments,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
  };
}
