import { Post, Prisma, Technology } from "@prisma/client";
import { notFound } from "next/navigation";
import { db } from "../data/mysql";
import { withServiceAuth } from "../lib/auth/protected-service";
import { ErrorMessage } from "../lib/constants";
import { AppError, AuthorizationError } from "../lib/errors/app-error";
import { Permission } from "../lib/permissions";
import {
  CreatePostInput,
  UpdatePostInput,
  postSelect,
  updatePostSchema,
} from "../schemas/post.schema";
import { UserService } from "./user.service";

export const PostService = {
  async getAllPosts(requestUserId: string) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      try {
        return await db.post.findMany({
          select: postSelect,
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostById(id: Post["id"], requestUserId: string) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      try {
        const post = await db.post.findUnique({
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
              orderBy: { createdDate: "desc" },
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

  async createPost(data: CreatePostInput, requestUserId: string) {
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

        return await db.$transaction(async (tx) => {
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

          return await db.$transaction(async (tx) => {
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
            if (error.code === "P2025") notFound();
            throw new AppError(ErrorMessage.INVALID_INPUT);
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async updatePostStatus(
    id: Post["id"],
    status: Post["status"],
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

          return await db.post.update({
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
            if (error.code === "P2025") notFound();
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async deletePost(id: Post["id"], requestUserId: string) {
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

          await db.post.delete({ where: { id } });
        } catch (error) {
          if (error instanceof AppError) throw error;
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") notFound();
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async searchPosts(
    query: string,
    requestUserId: string,
    page = 1,
    limit = 20,
  ) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      try {
        return await db.post.findMany({
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
        return await db.post.findMany({
          where: { createdById: userId },
          select: postSelect,
          orderBy: { createdDate: "desc" },
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
        return await db.post.findMany({
          where: {
            technologies: {
              some: { name: techName.toLowerCase().trim() },
            },
          },
          select: postSelect,
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostsByTechnologies(
    techNames: Technology["name"][],
    matchAll: boolean = false,
    requestUserId: string,
  ) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      try {
        return await db.post.findMany({
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
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPaginatedPosts(
    page: number = 1,
    limit: number = 20,
    requestUserId: string,
  ) {
    return withServiceAuth(requestUserId, Permission.VIEW_POSTS, async () => {
      try {
        return await db.post.findMany({
          select: postSelect,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
