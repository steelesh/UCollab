import { type Post, Prisma, type Technology } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/lib/auth/protected-service';
import { ErrorMessage } from '~/lib/constants';
import { AppError, AuthorizationError } from '~/lib/errors/app-error';
import { Permission } from '~/lib/permissions';
import {
  type UpdatePostInput,
  postSelect,
  updatePostSchema,
} from '~/schemas/post.schema';
import { UserService } from './user.service';
import {
  type ZodArray,
  type ZodEffects,
  type ZodNativeEnum,
  type ZodOptional,
  type ZodString,
} from 'zod';

export const PostService = {
  // Read Operations
  async getAllPosts(requestUserId: string) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
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
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
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

  // Create Operations
  async createPost(
    data: {
      title: ZodString['_output'];
      description: ZodString['_output'];
      postType: ZodNativeEnum<{
        CONTRIBUTION: 'CONTRIBUTION';
        FEEDBACK: 'FEEDBACK';
        DISCUSSION: 'DISCUSSION';
      }>['_output'];
      status: ZodNativeEnum<{ OPEN: 'OPEN'; CLOSED: 'CLOSED' }>['_output'];
      technologies?: ZodOptional<
        ZodEffects<ZodArray<ZodString>, string[]>
      >['_output'];
      githubRepo?: ZodOptional<ZodString>['_output'];
      userId: string;
    },
    requestUserId: string,
  ) {
    return withServiceAuth(requestUserId, Permission.CREATE_POST, async () => {
      try {
        if (
          !(await UserService.canAccessContent(
            requestUserId,
            data.userId,
            Permission.CREATE_POST,
          ))
        ) {
          throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
        }

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
              technologies: verifiedTechs.length
                ? { connect: verifiedTechs.map(({ name }) => ({ name })) }
                : undefined,
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

  // Update Operations
  async updatePost(data: UpdatePostInput, requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.UPDATE_ANY_POST,
      async () => {
        try {
          const post = await this.getPostById(data.id, requestUserId);

          if (
            !(await UserService.canAccessContent(
              requestUserId,
              post.createdById,
              Permission.UPDATE_ANY_POST,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          return await prisma.$transaction(async (tx) => {
            const verifiedTechs = data.technologies?.length
              ? await tx.technology.findMany({
                  where: {
                    AND: [
                      { verified: true },
                      {
                        name: {
                          in: data.technologies.map((t) =>
                            t.toLowerCase().trim(),
                          ),
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
      },
    );
  },

  async updatePostStatus(
    id: Post['id'],
    status: Post['status'],
    requestUserId: string,
  ) {
    return withServiceAuth(
      requestUserId,
      Permission.UPDATE_ANY_POST,
      async () => {
        try {
          const post = await this.getPostById(id, requestUserId);

          if (
            !(await UserService.canAccessContent(
              requestUserId,
              post.createdById,
              Permission.UPDATE_ANY_POST,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

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
      },
    );
  },

  // Delete Operations
  async deletePost(id: Post['id'], requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.DELETE_ANY_POST,
      async () => {
        try {
          const post = await this.getPostById(id, requestUserId);

          if (
            !(await UserService.canAccessContent(
              requestUserId,
              post.createdById,
              Permission.DELETE_ANY_POST,
            ))
          ) {
            throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
          }

          await prisma.post.delete({ where: { id } });
        } catch (error) {
          if (error instanceof AppError) throw error;
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') notFound();
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  // Search & Filter Operations
  async searchPosts(
    query: string,
    requestUserId: string,
    page = 1,
    limit = 20,
  ) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      try {
        return await prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
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
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
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
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
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

  async getPostsByTechnologies(
    techNames: Technology['name'][],
    matchAll = false,
    requestUserId: string,
  ) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
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

  async verifyPostOwner(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { createdById: true },
    });

    if (!post) {
      return false;
    }

    return post.createdById === userId;
  },

  async getPaginatedPosts(page = 1, limit = 20, requestUserId: string) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
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
