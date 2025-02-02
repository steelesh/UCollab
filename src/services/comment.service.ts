import { type Comment, type Post, Prisma, type User } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/lib/auth/protected-service';
import { ErrorMessage } from '~/lib/constants';
import {
  AppError,
  AuthorizationError,
  ValidationError,
} from '~/lib/errors/app-error';
import { Permission } from '~/lib/permissions';
import {
  commentFormSchema,
  type CreateCommentData,
  type UpdateCommentData,
} from '~/schemas/comment.schema';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

export const CommentService = {
  async getComments(postId: Post['id'], requestUserId: User['id']) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      return prisma.comment.findMany({
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
        orderBy: { createdDate: 'desc' },
      });
    });
  },

  async getComment(id: Comment['id'], requestUserId: User['id']) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      const comment = await prisma.comment.findUnique({
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
        throw new AppError(ErrorMessage.NOT_FOUND('Comment'));
      }

      return comment;
    });
  },

  async createComment(
    { content, postId }: CreateCommentData,
    requestUserId: User['id'],
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.CREATE_COMMENT,
      async () => {
        try {
          const validatedData = commentFormSchema.parse({ content });

          return await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
              data: {
                content: validatedData.content,
                postId,
                createdById: requestUserId,
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
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new AppError(ErrorMessage.OPERATION_FAILED);
          }
          if (error instanceof z.ZodError) {
            throw new ValidationError(ErrorMessage.VALIDATION_FAILED, error);
          }
          throw error;
        }
      },
    );
  },

  async updateComment(
    { id, content }: UpdateCommentData,
    requestUserId: User['id'],
  ) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const validatedData = commentFormSchema.parse({ content });

        const comment = await prisma.comment.findUnique({
          where: { id },
          select: { id: true, createdById: true },
        });

        if (!comment) {
          throw new AppError(ErrorMessage.NOT_FOUND('Comment'));
        }

        if (
          !(await UserService.canAccessContent(
            requestUserId,
            comment.createdById,
            Permission.UPDATE_ANY_COMMENT,
          ))
        ) {
          throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
        }

        return await prisma.comment.update({
          where: { id },
          select: {
            id: true,
            content: true,
            lastModifiedDate: true,
          },
          data: { content: validatedData.content },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new AppError(ErrorMessage.NOT_FOUND('Comment'));
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
        if (error instanceof z.ZodError) {
          throw new ValidationError(ErrorMessage.VALIDATION_FAILED, error);
        }
        throw error;
      }
    });
  },

  async deleteComment(id: Comment['id'], requestUserId: User['id']) {
    return withServiceAuth(requestUserId, null, async () => {
      const comment = await prisma.comment.findUnique({
        where: { id },
        select: { id: true, createdById: true },
      });

      if (!comment) {
        throw new AppError(ErrorMessage.NOT_FOUND('Comment'));
      }

      if (
        !(await UserService.canAccessContent(
          requestUserId,
          comment.createdById,
          Permission.DELETE_ANY_COMMENT,
        ))
      ) {
        throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
      }

      try {
        await prisma.comment.delete({ where: { id } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new AppError(ErrorMessage.NOT_FOUND('Comment'));
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
        throw error;
      }
    });
  },

  // This is a utility method that doesn't need auth
  async extractMentionedUserIds(content: Comment['content']) {
    try {
      const mentionRegex = /@(\w+)/g;
      const mentions = content.match(mentionRegex) ?? [];

      if (mentions.length === 0) return [];

      const usernames = mentions.map((mention) => mention.substring(1));

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

      return users.map((user) => user.id);
    } catch {
      throw new AppError('Failed to extract mentioned users');
    }
  },

  async verifyCommentOwner(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { createdById: true },
    });
    return comment?.createdById === userId;
  },

  async getPaginatedComments(
    postId: Post['id'],
    requestUserId: User['id'],
    page = 1,
    limit = 20,
  ) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      return prisma.comment.findMany({
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
        orderBy: { createdDate: 'desc' },
      });
    });
  },
};
