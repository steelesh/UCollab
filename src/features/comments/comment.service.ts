import type { Comment, Post, User } from "@prisma/client";

import { notFound } from "next/navigation";
import { z } from "zod";

import { NotificationService } from "~/features/notifications/notification.service";
import { prisma } from "~/lib/prisma";
import { ErrorMessage, Utils } from "~/lib/utils";
import { withServiceAuth } from "~/security/protected-service";

export const CommentService = {
  async createComment(data: { content: Comment["content"]; postId: Post["id"] }, requestUserId: User["id"]) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const comment = await prisma.comment.create({
          data: {
            content: data.content,
            createdById: requestUserId,
            postId: data.postId,
          },
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
            post: {
              select: {
                title: true,
                createdById: true,
              },
            },
          },
        });

        await NotificationService.sendCommentNotifications({
          postId: data.postId,
          postTitle: comment.post.title,
          commentId: comment.id,
          postAuthorId: comment.post.createdById,
          commentAuthorId: requestUserId,
          commentAuthorName: comment.createdBy.username,
          content: data.content,
        });

        return comment;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Utils(ErrorMessage.VALIDATION_FAILED);
        }
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async updateComment(data: { id: Comment["id"]; content: Comment["content"] }, requestUserId: User["id"]) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: data.id },
        select: { id: true, createdById: true, postId: true },
      });

      if (!comment)
        notFound();

      return withServiceAuth(requestUserId, { ownerId: comment.createdById }, async () => {
        try {
          return await prisma.comment.update({
            where: { id: data.id },
            data: {
              content: data.content,
              lastModifiedDate: new Date(),
            },
            select: {
              id: true,
              content: true,
              lastModifiedDate: true,
              createdBy: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Utils(ErrorMessage.VALIDATION_FAILED);
          }
          throw new Utils(ErrorMessage.OPERATION_FAILED);
        }
      });
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async deleteComment(id: Comment["id"], requestUserId: User["id"]) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        select: { id: true, createdById: true },
      });

      if (!comment)
        notFound();

      return withServiceAuth(requestUserId, { ownerId: comment.createdById }, async () => {
        try {
          await prisma.comment.delete({ where: { id } });
        } catch (error) {
          if (error instanceof Utils)
            throw error;
          throw new Utils(ErrorMessage.OPERATION_FAILED);
        }
      });
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async createReply(
    data: {
      content: Comment["content"];
      postId: Post["id"];
      parentId: Comment["id"];
    },
    requestUserId: User["id"],
  ) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const comment = await prisma.comment.create({
          data: {
            content: data.content,
            createdById: requestUserId,
            postId: data.postId,
            parentId: data.parentId,
          },
          select: {
            id: true,
            content: true,
            createdDate: true,
            lastModifiedDate: true,
            parentId: true,
            createdBy: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            post: {
              select: {
                title: true,
                createdById: true,
              },
            },
            parent: {
              select: {
                createdById: true,
                createdBy: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        });

        await NotificationService.sendCommentNotifications({
          postId: data.postId,
          postTitle: comment.post.title,
          commentId: comment.id,
          postAuthorId: comment.post.createdById,
          commentAuthorId: requestUserId,
          commentAuthorName: comment.createdBy.username,
          content: data.content,
          parentCommentAuthorId: comment.parent?.createdById,
        });

        return comment;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Utils(ErrorMessage.VALIDATION_FAILED);
        }
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPaginatedComments(postId: Post["id"], requestUserId: User["id"], page = 1, limit = 20) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.comment.findMany({
          where: {
            postId,
            parentId: null,
          },
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
            replies: {
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
              orderBy: { createdDate: "asc" },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async extractMentionedUserIds(content: string): Promise<string[]> {
    try {
      const mentionRegex = /@(\w+)/g;
      const mentions = content.match(mentionRegex) || [];

      const usernames = mentions.map(mention => mention.substring(1));

      if (usernames.length === 0)
        return [];

      const users = await prisma.user.findMany({
        where: {
          username: {
            in: usernames,
          },
        },
        select: {
          id: true,
        },
      });

      return users.map(user => user.id);
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },
};
