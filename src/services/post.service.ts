import { Post, Prisma, Technology } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '../data/prisma';
import { withServiceAuth } from '~/lib/auth/protected-service';
import { ErrorMessage } from '~/lib/constants';
import { AppError } from '~/lib/errors/app-error';
import { CreatePostInput, UpdatePostInput, postSelect, updatePostSchema } from '~/schemas/post.schema';

export const PostService = {
  // Authenticated users can view posts
  async getAllPosts(requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          select: postSelect,
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostById(id: Post['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const post = await prisma.post.findUnique({
          where: { id },
          select: {
            ...postSelect,
            createdById: true,
            comments: {
              select: {
                id: true,
                content: true,
                createdDate: true,
                createdBy: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdDate: 'desc' },
            },
          },
        });

        if (!post) notFound();
        return post;
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Owner only - creating posts
  async createPost(data: CreatePostInput, requestUserId: string) {
    return withServiceAuth(requestUserId, { ownerId: data.userId }, async () => {
      try {
        return await prisma.$transaction(async (tx) => {
          const { technologies: techNames, ...postData } = data;

          const verifiedTechs = techNames?.length
            ? await tx.technology.findMany({
                where: {
                  AND: [
                    { verified: true },
                    {
                      name: {
                        in: techNames.map((t) => t.toLowerCase().trim()),
                      },
                    },
                  ],
                },
                select: { name: true },
              })
            : [];

          return tx.post.create({
            data: {
              ...postData,
              createdById: data.userId,
              technologies: verifiedTechs.length ? { connect: verifiedTechs.map(({ name }) => ({ name })) } : undefined,
            },
            select: postSelect,
          });
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new AppError(ErrorMessage.INVALID_INPUT);
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Owner or admin - updating posts
  async updatePost(data: UpdatePostInput, requestUserId: string) {
    const post = await this.getPostById(data.id, requestUserId);
    return withServiceAuth(requestUserId, { ownerId: post.createdById }, async () => {
      try {
        return await prisma.$transaction(async (tx) => {
          const verifiedTechs = data.technologies?.length
            ? await tx.technology.findMany({
                where: {
                  AND: [
                    { verified: true },
                    {
                      name: {
                        in: data.technologies.map((t) => t.toLowerCase().trim()),
                      },
                    },
                  ],
                },
                select: { name: true },
              })
            : [];

          const validatedData = updatePostSchema.parse({
            ...data,
            technologies: verifiedTechs.map((t) => t.name),
          });

          return tx.post.update({
            where: { id: data.id },
            data: validatedData,
            select: postSelect,
          });
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
          throw new AppError(ErrorMessage.INVALID_INPUT);
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Owner or admin - updating post status
  async updatePostStatus(id: Post['id'], status: Post['status'], requestUserId: string) {
    const post = await this.getPostById(id, requestUserId);
    return withServiceAuth(requestUserId, { ownerId: post.createdById }, async () => {
      try {
        return await prisma.post.update({
          where: { id },
          data: { status },
          select: {
            id: true,
            status: true,
            lastModifiedDate: true,
          },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Owner or admin - deleting posts
  async deletePost(id: Post['id'], requestUserId: string) {
    const post = await this.getPostById(id, requestUserId);
    return withServiceAuth(requestUserId, { ownerId: post.createdById }, async () => {
      try {
        await prisma.post.delete({ where: { id } });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Authenticated users - searching and filtering posts
  async searchPosts(query: string, requestUserId: string, page = 1, limit = 20) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          where: {
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
          select: postSelect,
          skip: (page - 1) * limit,
          take: limit,
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostsByUser(userId: string, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          where: { createdById: userId },
          select: postSelect,
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostsByTechnology(techName: string, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          where: {
            technologies: {
              some: { name: techName.toLowerCase().trim() },
            },
          },
          select: postSelect,
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostsByTechnologies(techNames: Technology['name'][], matchAll = false, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          where: {
            technologies: matchAll
              ? {
                  every: {
                    name: { in: techNames.map((t) => t.toLowerCase().trim()) },
                  },
                }
              : {
                  some: {
                    name: { in: techNames.map((t) => t.toLowerCase().trim()) },
                  },
                },
          },
          select: postSelect,
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPaginatedPosts(page = 1, limit = 20, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          select: postSelect,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
