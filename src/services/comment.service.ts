import { db } from "~/config/db";
import { type CreateCommentInput, type UpdateCommentInput } from "~/types/comment.types";

const includeUser = {
  createdBy: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
} as const;

export const CommentService = {
  async getComments(postId: string) {
    return db.comment.findMany({
      where: { postId },
      include: includeUser,
      orderBy: { createdDate: "desc" },
    });
  },

  async getComment(id: string) {
    return db.comment.findUnique({
      where: { id },
      include: includeUser,
    });
  },

  async createComment(data: CreateCommentInput, postId: string, userId: string) {
    return db.comment.create({
      data: {
        ...data,
        postId,
        createdById: userId,
      },
      include: includeUser,
    });
  },

  async updateComment(id: string, data: UpdateCommentInput) {
    return db.comment.update({
      where: { id },
      data,
      include: includeUser,
    });
  },

  async deleteComment(id: string) {
    return db.comment.delete({ where: { id } });
  },

  async verifyCommentOwner(commentId: string, userId: string) {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { createdById: true },
    });
    return comment?.createdById === userId;
  },
};
