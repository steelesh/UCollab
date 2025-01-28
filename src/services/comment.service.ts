import { Comment, Post } from "@prisma/client";
import { db } from "../data/mysql";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema";
import { NotificationService } from "./notification.service";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { UserService } from "./user.service";
import { Permission } from "../lib/permissions";

export const CommentService = {
  async getComments(postId: Post["id"], requestUserId?: string) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view comments");
      }
      return await db.comment.findMany({
        where: { postId },
        select: {
          id: true,
          content: true,
          createdDate: true,
          lastModifiedDate: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch comments: ${error.message}`
          : "Failed to fetch comments",
      );
    }
  },

  async getComment(id: Comment["id"]) {
    try {
      const comment = await db.comment.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          postId: true,
          createdDate: true,
          lastModifiedDate: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              createdById: true,
            },
          },
        },
      });

      if (!comment) {
        notFound();
      }

      return comment;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch comment: ${error.message}`
          : "Failed to fetch comment",
      );
    }
  },

  async createComment(data: CreateCommentInput, requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.CREATE_COMMENT,
        ))
      ) {
        throw new Error("Unauthorized: Cannot create comment");
      }
      return await db.$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            content: data.content,
            postId: data.postId,
            createdById: data.userId,
          },
          select: {
            id: true,
            content: true,
            postId: true,
            createdById: true,
            post: {
              select: {
                title: true,
                createdById: true,
              },
            },
            createdBy: {
              select: {
                username: true,
              },
            },
          },
        });

        await NotificationService.sendCommentNotifications({
          postId: comment.postId,
          postTitle: comment.post.title,
          commentId: comment.id,
          postAuthorId: comment.post.createdById,
          commentAuthorId: comment.createdById,
          commentAuthorName: comment.createdBy.username,
          content: comment.content,
        });

        return comment;
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? `Failed to create comment: ${error.message}`
          : "Failed to create comment",
      );
    }
  },

  async updateComment(data: UpdateCommentInput, requestUserId: string) {
    try {
      const comment = await db.comment.findUnique({
        where: { id: data.id },
        select: { id: true, createdById: true },
      });

      if (!comment) {
        notFound();
      }

      if (
        !(await UserService.canAccessContent(
          requestUserId,
          comment.createdById,
          Permission.UPDATE_ANY_COMMENT,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update comment");
      }

      return await db.comment.update({
        where: { id: data.id },
        select: {
          id: true,
          content: true,
          lastModifiedDate: true,
        },
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to update comment: ${error.message}`
          : "Failed to update comment",
      );
    }
  },

  async deleteComment(id: Comment["id"], requestUserId: string) {
    try {
      const comment = await db.comment.findUnique({
        where: { id },
        select: { id: true, createdById: true },
      });

      if (!comment) {
        notFound();
      }

      if (
        !(await UserService.canAccessContent(
          requestUserId,
          comment.createdById,
          Permission.DELETE_ANY_COMMENT,
        ))
      ) {
        throw new Error("Unauthorized: Cannot delete comment");
      }

      await db.comment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to delete comment: ${error.message}`
          : "Failed to delete comment",
      );
    }
  },

  async extractMentionedUserIds(content: string) {
    try {
      const mentionRegex = /@(\w+)/g;
      const mentions = content.match(mentionRegex) || [];

      if (mentions.length === 0) return [];

      const usernames = mentions.map((mention) => mention.substring(1));

      const users = await db.user.findMany({
        where: {
          username: {
            in: usernames,
          },
        },
        select: {
          id: true,
        },
      });

      return users.map((user) => user.id);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to extract mentioned users: ${error.message}`
          : "Failed to extract mentioned users",
      );
    }
  },

  async getPaginatedComments(
    postId: Post["id"],
    page: number = 1,
    limit: number = 20,
  ) {
    try {
      return await db.comment.findMany({
        where: { postId },
        select: {
          id: true,
          content: true,
          createdDate: true,
          lastModifiedDate: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch paginated comments: ${error.message}`
          : "Failed to fetch paginated comments",
      );
    }
  },
};
