import { Post, Prisma } from "@prisma/client";
import { db } from "../data/mysql";
import {
  CreateTechnologyInput,
  SuggestTechnologyInput,
} from "../schemas/technology.schema";
import { notFound } from "next/navigation";
import { Permission } from "../lib/permissions";
import { UserService } from "./user.service";

export const TechnologyService = {
  async getTechnologies() {
    try {
      return await db.technology.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch technologies: ${error.message}`
          : "Failed to fetch technologies",
      );
    }
  },

  async searchTechnologies(query: string) {
    try {
      return await db.technology.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
        take: 10,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to search technologies: ${error.message}`
          : "Failed to search technologies",
      );
    }
  },

  async createTechnology(data: CreateTechnologyInput, requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.CREATE_TECHNOLOGY,
        ))
      ) {
        throw new Error("Unauthorized: Cannot create verified technologies");
      }

      const normalizedName = data.name.toLowerCase().trim();

      const existingTechnology = await db.technology.findUnique({
        where: { name: normalizedName },
      });

      if (existingTechnology) {
        return existingTechnology;
      }

      return await db.technology.create({
        data: {
          name: normalizedName,
          verified: true,
          createdBy: {
            connect: {
              id: requestUserId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          verified: true,
        },
      });
    } catch {
      throw new Error("Failed to create technology");
    }
  },

  // PUBLIC ENDPOINTS
  async getVerifiedTechnologies() {
    try {
      return await db.technology.findMany({
        where: { verified: true },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });
    } catch {
      throw new Error("Failed to fetch technologies");
    }
  },

  async searchVerifiedTechnologies(query: string) {
    try {
      return await db.technology.findMany({
        where: {
          AND: [
            { verified: true },
            { name: { contains: query.toLowerCase() } },
          ],
        },
        select: {
          id: true,
          name: true,
        },
        take: 10,
        orderBy: { name: "asc" },
      });
    } catch {
      throw new Error("Failed to search technologies");
    }
  },

  // USER ENDPOINTS
  async suggestTechnology(data: SuggestTechnologyInput, userId: string) {
    try {
      const normalizedName = data.name.toLowerCase().trim();

      const existing = await db.technology.findUnique({
        where: { name: normalizedName },
      });

      if (existing) {
        if (existing.verified) {
          return existing;
        }
        throw new Error("Technology already suggested and pending review");
      }

      return await db.technology.create({
        data: {
          name: normalizedName,
          verified: false,
          createdById: userId,
        },
        select: {
          id: true,
          name: true,
          verified: true,
        },
      });
    } catch {
      throw new Error("Failed to suggest technology");
    }
  },

  // ADMIN ENDPOINTS
  async verifyTechnology(id: string, requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.UPDATE_TECHNOLOGY,
        ))
      ) {
        throw new Error("Unauthorized: Cannot verify technologies");
      }

      return await db.technology.update({
        where: { id },
        data: { verified: true },
        select: {
          id: true,
          name: true,
          verified: true,
        },
      });
    } catch {
      throw new Error("Failed to verify technology");
    }
  },

  async getPendingTechnologies(requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.VIEW_TECHNOLOGIES,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view pending technologies");
      }

      return await db.technology.findMany({
        where: { verified: false },
        select: {
          id: true,
          name: true,
          createdDate: true,
          createdBy: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { createdDate: "desc" },
      });
    } catch {
      throw new Error("Failed to fetch pending technologies");
    }
  },

  // Used by PostService
  async updatePostTechnologies(postId: Post["id"], technologies: string[]) {
    try {
      return await db.$transaction(async (tx) => {
        const post = await tx.post.findUnique({
          where: { id: postId },
          select: { id: true },
        });

        if (!post) {
          notFound();
        }

        // Only use verified technologies
        const verifiedTechs = await tx.technology.findMany({
          where: {
            AND: [
              { verified: true },
              { name: { in: technologies.map((t) => t.toLowerCase().trim()) } },
            ],
          },
          select: { name: true },
        });

        return tx.post.update({
          where: { id: postId },
          data: {
            technologies: {
              set: verifiedTechs.map(({ name }) => ({ name })),
            },
          },
          select: {
            id: true,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to update post technologies: ${error.message}`
          : "Failed to update post technologies",
      );
    }
  },

  // For populating the technology checkboxes/dropdown
  async getPopularTechnologies(limit: number = 20) {
    try {
      const technologies = await db.technology.findMany({
        where: { verified: true },
        select: {
          id: true,
          name: true,
          _count: {
            select: { posts: true },
          },
        },
        orderBy: {
          posts: {
            _count: "desc",
          },
        },
        take: limit,
      });

      return technologies.map((tech) => ({
        id: tech.id,
        name: tech.name,
        postCount: tech._count.posts,
      }));
    } catch {
      throw new Error("Failed to fetch popular technologies");
    }
  },

  // For getting technologies of a specific post (to pre-check boxes)
  async getPostTechnologies(postId: string) {
    try {
      const post = await db.post.findUnique({
        where: { id: postId },
        select: {
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return post?.technologies ?? [];
    } catch {
      throw new Error("Failed to fetch post technologies");
    }
  },
};
