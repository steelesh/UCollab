import { Post, Technology, Prisma } from "@prisma/client";
import { db } from "../data/mysql";
import {
  CreatePostInput,
  UpdatePostInput,
  UpdatePostPayload,
  updatePostSchema,
} from "../schemas/post.schema";
import { notFound } from "next/navigation";
import { UserService } from "./user.service";
import { Permission } from "../lib/permissions";

export const PostService = {
  async getAllPosts(requestUserId?: string) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view posts");
      }
      return await db.post.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          lastModifiedDate: true,
          postType: true,
          status: true,
          githubRepo: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch posts: ${error.message}`
          : "Failed to fetch posts",
      );
    }
  },

  async getPostById(id: Post["id"], requestUserId?: string) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view post");
      }
      const post = await db.post.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          lastModifiedDate: true,
          postType: true,
          status: true,
          githubRepo: true,
          createdById: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
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

      if (!post) {
        notFound();
      }

      return post;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch post: ${error.message}`
          : "Failed to fetch post",
      );
    }
  },

  async createPost(data: CreatePostInput, requestUserId: string) {
    try {
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          data.userId,
          Permission.CREATE_POST,
        ))
      ) {
        throw new Error("Unauthorized: Cannot create post");
      }
      return await db.$transaction(async (tx) => {
        const { technologies: techNames, ...postData } = data;

        // Only use verified technologies
        const verifiedTechs = techNames?.length
          ? await tx.technology.findMany({
              where: {
                AND: [
                  { verified: true },
                  {
                    name: { in: techNames.map((t) => t.toLowerCase().trim()) },
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
              ? {
                  connect: verifiedTechs.map(({ name }) => ({ name })),
                }
              : undefined,
          },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            postType: true,
            status: true,
            githubRepo: true,
            technologies: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? `Failed to create post: ${error.message}`
          : "Failed to create post",
      );
    }
  },

  async updatePost(data: UpdatePostInput, requestUserId: string) {
    try {
      const post = await this.getPostById(data.id);
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          post.createdById,
          Permission.UPDATE_ANY_POST,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update post");
      }
      return await db.$transaction(async (tx) => {
        // Only use verified technologies
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

        const validatedData: UpdatePostPayload = updatePostSchema.parse({
          ...data,
          technologies: verifiedTechs.map((t) => t.name),
        });

        return tx.post.update({
          where: { id: data.id },
          data: validatedData,
          select: {
            id: true,
            title: true,
            description: true,
            lastModifiedDate: true,
            postType: true,
            status: true,
            githubRepo: true,
            technologies: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
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
          ? `Failed to update post: ${error.message}`
          : "Failed to update post",
      );
    }
  },

  async deletePost(id: Post["id"], requestUserId: string) {
    try {
      const post = await this.getPostById(id);
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          post.createdById,
          Permission.DELETE_ANY_POST,
        ))
      ) {
        throw new Error("Unauthorized: Cannot delete post");
      }
      await db.post.delete({
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
          ? `Failed to delete post: ${error.message}`
          : "Failed to delete post",
      );
    }
  },

  async getPaginatedPosts(
    page: number = 1,
    limit: number = 20,
    requestUserId?: string,
  ) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view posts");
      }
      return await db.post.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          lastModifiedDate: true,
          postType: true,
          status: true,
          githubRepo: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
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
          ? `Failed to fetch paginated posts: ${error.message}`
          : "Failed to fetch paginated posts",
      );
    }
  },

  async searchPosts(
    query: string,
    requestUserId?: string,
    page = 1,
    limit = 20,
  ) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot search posts");
      }
      return await db.post.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          postType: true,
          status: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
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
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to search posts: ${error.message}`
          : "Failed to search posts",
      );
    }
  },

  async getPostsByUser(userId: string, requestUserId?: string) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view user posts");
      }
      return await db.post.findMany({
        where: { createdById: userId },
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          postType: true,
          status: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch user posts: ${error.message}`
          : "Failed to fetch user posts",
      );
    }
  },

  async getPostsByTechnology(techName: string, requestUserId?: string) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view posts");
      }
      return db.post.findMany({
        where: {
          technologies: {
            some: {
              name: techName,
            },
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          postType: true,
          status: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
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
      throw new Error(
        error instanceof Error
          ? `Failed to fetch posts by technology: ${error.message}`
          : "Failed to fetch posts by technology",
      );
    }
  },

  async getPostsByTechnologies(
    techNames: Technology["name"][],
    matchAll: boolean = false,
    requestUserId?: string,
  ) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view posts");
      }
      return db.post.findMany({
        where: {
          technologies: matchAll
            ? {
                every: {
                  name: { in: techNames },
                },
              }
            : {
                some: {
                  name: { in: techNames },
                },
              },
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          postType: true,
          status: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch posts by technologies: ${error.message}`
          : "Failed to fetch posts by technologies",
      );
    }
  },

  async updatePostStatus(
    id: Post["id"],
    status: Post["status"],
    requestUserId: string,
  ) {
    try {
      const post = await this.getPostById(id);
      if (
        !(await UserService.canAccessContent(
          requestUserId,
          post.createdById,
          Permission.UPDATE_ANY_POST,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update post status");
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
      throw new Error(
        error instanceof Error
          ? `Failed to update post status: ${error.message}`
          : "Failed to update post status",
      );
    }
  },

  async getTrendingPosts(limit: number = 10, requestUserId?: string) {
    try {
      if (
        requestUserId &&
        !(await UserService.hasPermission(requestUserId, Permission.VIEW_POSTS))
      ) {
        throw new Error("Unauthorized: Cannot view trending posts");
      }
      // Get posts with most comments in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return db.post.findMany({
        where: {
          createdDate: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdDate: true,
          postType: true,
          status: true,
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          comments: {
            _count: "desc",
          },
        },
        take: limit,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch trending posts: ${error.message}`
          : "Failed to fetch trending posts",
      );
    }
  },
};
