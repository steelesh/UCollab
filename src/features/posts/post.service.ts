import { Post, Prisma, Technology } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { postSchema, postSelect, CreatePostInput } from '~/features/posts/post.schema';

export const PostService = {
  async getAllPosts(requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          select: postSelect,
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Owner only - creating posts
  async createPost(requestUserId: string, rawData: unknown) {
    return withServiceAuth(requestUserId, { ownerId: requestUserId }, async () => {
      try {
        const data: CreatePostInput = postSchema.parse(rawData);
        let postType: 'CONTRIBUTION' | 'FEEDBACK' | 'DISCUSSION' = 'DISCUSSION';
        if (data.postType === 'CONTRIBUTION') {
          postType = 'CONTRIBUTION';
        } else if (data.postType === 'FEEDBACK') {
          postType = 'FEEDBACK';
        }
        return prisma.$transaction(async (tx) => {
          return tx.post.create({
            data: {
              title: data.title,
              description: data.description,
              postType: postType,
              githubRepo: data.githubRepo,
              // Connect the new post to the user creating it (if needed)
              createdBy: { connect: { id: requestUserId } },
              technologies: {
                create: data.technologies
                  ? data.technologies.split(',').map((s) => ({
                      name: s.trim(),
                      createdBy: { connect: { id: requestUserId } },
                    }))
                  : [],
              },
            },
            select: postSelect,
          });
        });
      } catch (error) {
        console.log(error);
        if (error instanceof Utils) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
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
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
