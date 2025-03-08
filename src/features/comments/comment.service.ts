import { Comment, Project, User } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { notFound } from 'next/navigation';
import { Prisma } from '@prisma/client';

export const CommentService = {
  async createComment(data: { content: Comment['content']; projectId: Project['id'] }, requestUserId: User['id']) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const comment = await prisma.comment.create({
          data: {
            content: data.content,
            createdById: requestUserId,
            projectId: data.projectId,
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
          },
        });

        return comment;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Utils(ErrorMessage.VALIDATION_FAILED);
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          notFound();
        }
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async updateComment(data: { id: Comment['id']; content: Comment['content'] }, requestUserId: User['id']) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: data.id },
        select: { id: true, createdById: true, projectId: true },
      });

      if (!comment) notFound();

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
      if (error instanceof Utils) throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async deleteComment(id: Comment['id'], requestUserId: User['id']) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        select: { id: true, createdById: true },
      });

      if (!comment) notFound();

      return withServiceAuth(requestUserId, { ownerId: comment.createdById }, async () => {
        try {
          await prisma.comment.delete({ where: { id } });
        } catch (error) {
          if (error instanceof Utils) throw error;
          throw new Utils(ErrorMessage.OPERATION_FAILED);
        }
      });
    } catch (error) {
      if (error instanceof Utils) throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async getPaginatedComments(projectId: Project['id'], requestUserId: User['id'], page = 1, limit = 20) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.comment.findMany({
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
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
