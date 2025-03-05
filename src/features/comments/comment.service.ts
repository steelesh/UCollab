import { Comment, Prisma, Project, User } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils, ValidationError } from '~/lib/utils';
import { commentFormSchema, type CreateCommentData, type UpdateCommentData } from '~/features/comments/comment.schema';

export const CommentService = {
  async getComments(projectId: Project['id'], requestUserId: User['id']) {
    return withServiceAuth(requestUserId, null, async () => {
      return prisma.comment.findMany({
        where: { projectId },
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
        orderBy: { createdDate: 'desc' },
      });
    });
  },

  async getComment(id: Comment['id'], requestUserId: User['id']) {
    return withServiceAuth(requestUserId, null, async () => {
      const comment = await prisma.comment.findUnique({
        where: { id },
        select: {
          id: true,
          content: true,
          projectId: true,
          createdDate: true,
          lastModifiedDate: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              createdById: true,
            },
          },
        },
      });

      if (!comment) {
        throw new Utils(ErrorMessage.NOT_FOUND('Comment'));
      }

      return comment;
    });
  },

  // Authenticated users can create comments
  async createComment({ content, projectId }: CreateCommentData, requestUserId: User['id']) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const validatedData = commentFormSchema.parse({ content });

        return await prisma.$transaction(async (tx) => {
          // await NotificationService.sendCommentNotifications({
          //   postId: comment.postId,
          //   postTitle: comment.post.title,
          //   commentId: comment.id,
          //   postAuthorId: comment.post.createdById,
          //   commentAuthorId: comment.createdById,
          //   commentAuthorName: comment.createdBy.username,
          //   content: comment.content,
          // });

          return tx.comment.create({
            data: {
              content: validatedData.content,
              projectId,
              createdById: requestUserId,
            },
            select: {
              id: true,
              content: true,
              projectId: true,
              createdById: true,
              project: {
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
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new Utils(ErrorMessage.OPERATION_FAILED);
        }
        if (error instanceof z.ZodError) {
          throw new ValidationError(ErrorMessage.VALIDATION_FAILED, error);
        }
        throw error;
      }
    });
  },

  // Owner or admin can update comments
  async updateComment({ id, content }: UpdateCommentData, requestUserId: User['id']) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        select: { id: true, createdById: true },
      });

      if (!comment) {
        throw new Utils(ErrorMessage.NOT_FOUND('Comment'));
      }

      return withServiceAuth(requestUserId, { ownerId: comment.createdById }, async () => {
        const validatedData = commentFormSchema.parse({ content });

        return prisma.comment.update({
          where: { id },
          select: {
            id: true,
            content: true,
            lastModifiedDate: true,
          },
          data: { content: validatedData.content },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Utils(ErrorMessage.NOT_FOUND('Comment'));
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
      if (error instanceof z.ZodError) {
        throw new ValidationError(ErrorMessage.VALIDATION_FAILED, error);
      }
      throw error;
    }
  },

  // Owner or admin can delete comments
  async deleteComment(id: Comment['id'], requestUserId: User['id']) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        select: { id: true, createdById: true },
      });

      if (!comment) {
        throw new Utils(ErrorMessage.NOT_FOUND('Comment'));
      }

      return withServiceAuth(requestUserId, { ownerId: comment.createdById }, async () => {
        await prisma.comment.delete({ where: { id } });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Utils(ErrorMessage.NOT_FOUND('Comment'));
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
      throw error;
    }
  },

  // Public utility method
  async extractMentionedUserIds(content: Comment['content']) {
    try {
      const mentionRegex = /@(\w+)/g;
      const mentions = content.match(mentionRegex) || [];

      if (mentions.length === 0) return [];

      const usernames = mentions.map((mention) => mention.substring(1));

      const users = await prisma.user.findMany({
        where: { username: { in: usernames } },
        select: { id: true },
      });

      return users.map((user) => user.id);
    } catch {
      throw new Utils('Failed to extract mentioned users');
    }
  },

  // Authenticated users can view paginated comments
  async getPaginatedComments(projectId: Project['id'], requestUserId: User['id'], page = 1, limit = 20) {
    return withServiceAuth(requestUserId, null, async () => {
      return prisma.comment.findMany({
        where: { projectId },
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
        orderBy: { createdDate: 'desc' },
      });
    });
  },
};
