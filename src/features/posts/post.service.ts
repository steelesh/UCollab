import type { Post, User } from "@prisma/client";

import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Buffer } from "node:buffer";
import crypto from "node:crypto";

import { NotificationService } from "~/features/notifications/notification.service";
import { blobStorage } from "~/lib/blob-storage";
import { prisma } from "~/lib/prisma";
import { ErrorMessage, isProjectNeedType, Utils } from "~/lib/utils";
import { withServiceAuth } from "~/security/protected-service";

import type { CreatePostInput } from "./post.schema";
import type { ExplorePageData, ExplorePost, PostDetails } from "./post.types";

export const PostService = {
  async getPostById(id: Post["id"], requestUserId: string): Promise<PostDetails> {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const post = await prisma.post.findUnique({
          where: { id },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            lastModifiedDate: true,
            githubRepo: true,
            createdById: true,
            technologies: true,
            rating: true,
            allowRatings: true,
            allowComments: true,
            bannerImage: true,
            postNeeds: {
              select: {
                id: true,
                needType: true,
                isPrimary: true,
              },
            },
            createdBy: {
              select: {
                username: true,
                avatar: true,
              },
            },
            comments: {
              where: {
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
              orderBy: { createdDate: "desc" },
            },
            watchers: {
              select: {
                id: true,
                userId: true,
                user: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        if (!post)
          notFound();

        const ageInHours = (Date.now() - new Date(post.createdDate).getTime()) / (1000 * 3600);
        const timeDecay = (1 / (ageInHours + 48) ** 1.1) * 100;

        const ratingWeight = 0.7;
        const watcherWeight = 0.2;
        const commentWeight = 0.1;

        const ratingScore = post.rating / 5;
        const nonOwnerWatchers = post.watchers.filter(w => w.userId !== post.createdById);
        const watcherScore = Math.min((nonOwnerWatchers.length) / 10, 1);
        const commentScore = Math.min(post.comments.length / 20, 1);

        const engagementScore
          = (ratingScore * ratingWeight)
            + (watcherScore * watcherWeight)
            + (commentScore * commentWeight);

        const postWithScore = {
          ...post,
          trendingScore: engagementScore * timeDecay,
          watchers: nonOwnerWatchers,
        };

        return postWithScore satisfies PostDetails;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostTitle(id: Post["id"]): Promise<Post["title"]> {
    const post = await prisma.post.findUnique({ where: { id }, select: { title: true } });
    if (!post)
      notFound();
    return post.title;
  },

  async createPost(data: CreatePostInput, requestUserId: User["id"]) {
    return withServiceAuth(requestUserId, { ownerId: requestUserId }, async () => {
      try {
        const isProjectPost = isProjectNeedType(data.needType) || isProjectNeedType(data.secondaryNeedType);

        let bannerImageUrl: string | null = null;
        if (data.bannerImage instanceof File) {
          bannerImageUrl = await this.uploadPostBannerImage(data.bannerImage, requestUserId);
        } else if (typeof data.bannerImage === "string") {
          bannerImageUrl = data.bannerImage;
        } else if (data.bannerImage === null) {
          bannerImageUrl = null;
        }

        const post = await prisma.$transaction(async (tx) => {
          let technologiesConnect = {};
          if (isProjectPost && data.technologies && data.technologies.length > 0) {
            const techNames = data.technologies.map(tech => tech.toLowerCase().trim());
            technologiesConnect = {
              connectOrCreate: techNames.map(name => ({
                where: { name },
                create: { name },
              })),
            };
          }

          const allowRatings = data.allowRatings;

          const postNeeds = [
            { needType: data.needType, isPrimary: true },
          ];

          if (data.secondaryNeedType) {
            postNeeds.push({
              needType: data.secondaryNeedType,
              isPrimary: false,
            });
          }

          const newPost = await tx.post.create({
            data: {
              title: data.title,
              description: data.description,
              githubRepo: isProjectPost ? data.githubRepo : null,
              allowRatings,
              allowComments: data.allowComments,
              bannerImage: bannerImageUrl,
              createdBy: { connect: { id: requestUserId } },
              technologies: technologiesConnect,
              postNeeds: {
                create: postNeeds,
              },
            },
            select: {
              id: true,
              title: true,
              description: true,
              createdDate: true,
              githubRepo: true,
              bannerImage: true,
              technologies: true,
              allowRatings: true,
              allowComments: true,
              postNeeds: true,
            },
          });

          await tx.postWatcher.create({
            data: {
              postId: newPost.id,
              userId: requestUserId,
            },
          });
          return newPost;
        });

        await NotificationService.queueBatchNotifications({
          userIds: [requestUserId],
          type: "POST_UPDATE",
          message: `post "${post.title}" has been created`,
          postId: post.id,
          triggeredById: requestUserId,
        });

        return post;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async deletePost(id: Post["id"], requestUserId: string) {
    const post = await this.getPostById(id, requestUserId);
    return withServiceAuth(requestUserId, { ownerId: post.createdById }, async () => {
      try {
        await this.sendPostUpdateNotification(id, "deleted", requestUserId);
        await prisma.post.delete({ where: { id } });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025")
            notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
  async getPostsByUser(userId: string, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.post.findMany({
          where: { createdById: userId },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            lastModifiedDate: true,
            githubRepo: true,
            createdById: true,
            createdBy: {
              select: {
                username: true,
                avatar: true,
              },
            },
            technologies: true,
            rating: true,
            allowRatings: true,
            allowComments: true,
            postNeeds: {
              select: {
                id: true,
                needType: true,
                isPrimary: true,
              },
            },
            watchers: {
              select: {
                id: true,
                userId: true,
                user: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdDate: "desc",
          },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
  async getPaginatedPosts(
    requestUserId: User["id"],
    filters: { query?: string; postNeeds?: string; minRating?: string; sortBy?: string; sortOrder?: string },
    page = 1,
    limit = 12,
  ): Promise<{ posts: ExplorePost[]; totalCount: number }> {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const { query, postNeeds, minRating, sortBy = "createdDate", sortOrder = "desc" } = filters;
        const where: any = {};

        if (query) {
          where.OR = [
            { title: { search: query } },
            { description: { search: query } },
          ];
        }

        if (postNeeds) {
          where.postNeeds = {
            some: { needType: postNeeds },
          };
        }

        if (minRating) {
          where.rating = { gte: Number(minRating) };
        }

        const orderBy = { [sortBy]: sortOrder };

        const [posts, totalCount] = await Promise.all([
          prisma.post.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            select: {
              id: true,
              title: true,
              createdDate: true,
              description: true,
              githubRepo: true,
              rating: true,
              createdById: true,
              allowRatings: true,
              allowComments: true,
              bannerImage: true,
              postNeeds: {
                select: {
                  id: true,
                  needType: true,
                  isPrimary: true,
                },
              },
              technologies: {
                select: {
                  id: true,
                  name: true,
                },
              },
              createdBy: {
                select: {
                  username: true,
                  avatar: true,
                },
              },
              watchers: {
                select: {
                  id: true,
                  userId: true,
                  user: {
                    select: {
                      username: true,
                      avatar: true,
                    },
                  },
                },
              },
              comments: {
                select: {
                  id: true,
                },
              },
            },
          }),
          prisma.post.count({ where }),
        ]);

        const postsWithScores = posts.map((post) => {
          const ageInHours = (Date.now() - new Date(post.createdDate).getTime()) / (1000 * 3600);
          const timeDecay = (1 / (ageInHours + 48) ** 1.1) * 100;

          const ratingWeight = 0.7;
          const watcherWeight = 0.2;
          const commentWeight = 0.1;

          const ratingScore = post.rating / 5;
          const nonOwnerWatchers = post.watchers.filter(w => w.userId !== post.createdById);
          const watcherScore = Math.min((nonOwnerWatchers.length) / 10, 1);
          const commentScore = Math.min(post.comments.length / 20, 1);

          const engagementScore
            = (ratingScore * ratingWeight)
              + (watcherScore * watcherWeight)
              + (commentScore * commentWeight);

          const trendingScore = engagementScore * timeDecay;
          return {
            ...post,
            trendingScore,
            watchers: nonOwnerWatchers,
          };
        });

        return { posts: postsWithScores satisfies ExplorePost[], totalCount };
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
  async searchTechnologies(query: string, requestUserId: User["id"], limit = 5) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.technology.findMany({
          where: {
            name: {
              startsWith: query.toLowerCase().trim(),
            },
          },
          select: {
            name: true,
          },
          take: limit,
          orderBy: {
            name: "asc",
          },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async updatePost(id: Post["id"], data: CreatePostInput, requestUserId: string) {
    const post = await this.getPostById(id, requestUserId);

    return withServiceAuth(requestUserId, { ownerId: post.createdById }, async () => {
      try {
        const isProjectPost = isProjectNeedType(data.needType) || isProjectNeedType(data.secondaryNeedType);

        let bannerImageUrl = post.bannerImage;
        if (data.bannerImage instanceof File) {
          bannerImageUrl = await this.uploadPostBannerImage(data.bannerImage, requestUserId);
        } else if (typeof data.bannerImage === "string") {
          bannerImageUrl = data.bannerImage;
        } else if (data.bannerImage === null) {
          bannerImageUrl = null;
        }

        return await prisma.$transaction(async (tx) => {
          let techUpdate = {};

          const existingTechs = await tx.post.findUnique({
            where: { id },
            select: {
              technologies: {
                select: { name: true },
              },
            },
          });
          const existingTechNames = existingTechs?.technologies.map(t => t.name) || [];

          if (isProjectPost) {
            const techNames = data.technologies?.map(tech => tech.toLowerCase().trim()) || [];
            const techsToDisconnect = existingTechNames.filter(name => !techNames.includes(name));
            const techsToAdd = techNames.filter(name => !existingTechNames.includes(name));

            techUpdate = {
              disconnect: techsToDisconnect.map(name => ({ name })),
              connectOrCreate: techsToAdd.map(name => ({
                where: { name },
                create: { name },
              })),
            };
          } else {
            if (existingTechNames.length > 0) {
              techUpdate = {
                disconnect: existingTechNames.map(name => ({ name })),
              };
            }
          }

          await tx.postNeed.deleteMany({
            where: {
              posts: {
                some: { id },
              },
            },
          });

          const postNeeds = [
            { needType: data.needType, isPrimary: true },
          ];

          if (data.secondaryNeedType) {
            postNeeds.push({
              needType: data.secondaryNeedType,
              isPrimary: false,
            });
          }

          const updatedPost = await tx.post.update({
            where: { id },
            data: {
              title: data.title,
              description: data.description,
              githubRepo: isProjectPost ? data.githubRepo : null,
              allowRatings: data.allowRatings,
              allowComments: data.allowComments,
              bannerImage: bannerImageUrl,
              technologies: techUpdate,
              postNeeds: {
                create: postNeeds,
              },
            },
            select: {
              id: true,
              title: true,
              description: true,
              createdDate: true,
              githubRepo: true,
              bannerImage: true,
              technologies: true,
              allowRatings: true,
              allowComments: true,
              postNeeds: true,
            },
          });

          await this.sendPostUpdateNotification(id, "updated", requestUserId);

          return updatedPost;
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async watchPost(postId: string, userId: string) {
    return withServiceAuth(userId, null, async () => {
      try {
        const watcher = await prisma.postWatcher.create({
          data: {
            postId,
            userId,
          },
          include: {
            post: {
              select: {
                title: true,
                createdById: true,
              },
            },
            user: {
              select: {
                username: true,
              },
            },
          },
        });

        if (watcher.post.createdById !== userId) {
          await NotificationService.queueBatchNotifications({
            userIds: [watcher.post.createdById],
            type: "POST_UPDATE",
            message: `${watcher.user.username} is now watching "${watcher.post.title}"`,
            postId,
            triggeredById: userId,
          });
        }

        return watcher;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          return null;
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async unwatchPost(postId: string, userId: string) {
    return withServiceAuth(userId, null, async () => {
      try {
        return await prisma.postWatcher.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          return null;
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPostWatchers(postId: string) {
    try {
      return await prisma.postWatcher.findMany({
        where: { postId },
        select: {
          userId: true,
          user: {
            select: {
              username: true,
              notificationPreferences: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async sendPostUpdateNotification(postId: string, action: "updated" | "deleted", requestUserId: string) {
    try {
      const post = await this.getPostById(postId, requestUserId);
      const watchers = await this.getPostWatchers(postId);
      const user = await prisma.user.findUnique({
        where: { id: requestUserId },
        select: { username: true },
      });

      const watcherIds = watchers
        .filter(
          w =>
            w.user.notificationPreferences?.enabled
            && w.user.notificationPreferences?.allowPostUpdates
            && w.userId !== requestUserId,
        )
        .map(w => w.userId);

      if (watcherIds.length > 0 && user) {
        await NotificationService.queueBatchNotifications({
          userIds: watcherIds,
          type: "POST_UPDATE",
          message: `${user.username} has ${action} post "${post.title}"`,
          postId: post.id,
          triggeredById: requestUserId,
        });
      }
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async ratePost(postId: Post["id"], rating: number, requestUserId: User["id"]) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: {
            id: true,
            title: true,
            createdById: true,
            allowRatings: true,
          },
        });

        if (!post) {
          notFound();
        }

        if (post.createdById === requestUserId) {
          throw new Utils(ErrorMessage.INSUFFICIENT_PERMISSIONS);
        }

        if (!post.allowRatings) {
          throw new Utils(ErrorMessage.OPERATION_FAILED);
        }

        const userRating = await prisma.$transaction(async (tx) => {
          const userRating = await tx.postRating.upsert({
            where: {
              postId_userId: {
                postId,
                userId: requestUserId,
              },
            },
            update: {
              rating,
            },
            create: {
              postId,
              userId: requestUserId,
              rating,
            },
          });

          const ratings = await tx.postRating.findMany({
            where: { postId },
            select: { rating: true },
          });

          const averageRating
            = ratings.length > 0
              ? Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
              : 0;

          await tx.post.update({
            where: { id: postId },
            data: { rating: averageRating },
          });

          return userRating;
        });

        if (post.createdById !== requestUserId) {
          const user = await prisma.user.findUnique({
            where: { id: requestUserId },
            select: { username: true },
          });

          if (user && post.createdById) {
            await NotificationService.queueBatchNotifications({
              userIds: [post.createdById],
              type: "RATING",
              message: `${user.username} rated your post "${post.title}" with ${rating} stars`,
              postId,
              triggeredById: requestUserId,
            });
          }
        }

        return userRating;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getUserPostRating(postId: Post["id"], userId: User["id"]) {
    return withServiceAuth(userId, null, async () => {
      try {
        const rating = await prisma.postRating.findUnique({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
          select: { rating: true },
        });

        return rating?.rating ?? 0;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async deleteRating(postId: Post["id"], userId: User["id"]) {
    return withServiceAuth(userId, null, async () => {
      try {
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: { id: true },
        });

        if (!post) {
          notFound();
        }

        return await prisma.$transaction(async (tx) => {
          const deleteResult = await tx.postRating.delete({
            where: {
              postId_userId: {
                postId,
                userId,
              },
            },
          }).catch(() => null);

          const ratings = await tx.postRating.findMany({
            where: { postId },
            select: { rating: true },
          });

          const averageRating = ratings.length > 0
            ? Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
            : 0;

          await tx.post.update({
            where: { id: postId },
            data: { rating: averageRating },
          });

          return deleteResult;
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getUserWatchedPosts(userId: string, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const watchedPosts = await prisma.postWatcher.findMany({
          where: { userId },
          select: {
            post: {
              select: {
                id: true,
                title: true,
                description: true,
                createdDate: true,
                lastModifiedDate: true,
                githubRepo: true,
                createdById: true,
                createdBy: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
                technologies: true,
                rating: true,
                allowRatings: true,
                allowComments: true,
                postNeeds: {
                  select: {
                    id: true,
                    needType: true,
                    isPrimary: true,
                  },
                },
                watchers: {
                  select: {
                    id: true,
                    userId: true,
                    user: {
                      select: {
                        username: true,
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            post: {
              createdDate: "desc",
            },
          },
        });

        return watchedPosts.map(watcher => watcher.post);
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async uploadPostBannerImage(file: File, requestUserId: User["id"]) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const uniqueId = crypto.randomBytes(16).toString("hex");
        const extension = file.name.split(".").pop() ?? "jpg";
        const fileName = `banner_${uniqueId}.${extension}`;

        return blobStorage.uploadBannerImage(buffer, fileName, file.type);
      } catch (error) {
        if (error instanceof Error) {
          throw new Utils(error.message);
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async isPostBookmarked(postId: Post["id"], userId: User["id"]) {
    return withServiceAuth(userId, null, async () => {
      try {
        const bookmark = await prisma.postWatcher.findUnique({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });

        return !!bookmark;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getTrendingPosts(requestUserId: User["id"], page = 1, limit = 12): Promise<ExplorePageData> {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const posts = await prisma.post.findMany({
          where: {
            createdDate: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            id: true,
            title: true,
            createdDate: true,
            description: true,
            githubRepo: true,
            rating: true,
            createdById: true,
            allowRatings: true,
            allowComments: true,
            bannerImage: true,
            postNeeds: {
              select: {
                id: true,
                needType: true,
                isPrimary: true,
              },
            },
            technologies: {
              select: {
                id: true,
                name: true,
              },
            },
            createdBy: {
              select: {
                username: true,
                avatar: true,
              },
            },
            watchers: {
              select: {
                id: true,
                userId: true,
                user: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            comments: {
              select: {
                id: true,
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
        });

        const postsWithScores = posts
          .map((post) => {
            const ageInHours = (Date.now() - new Date(post.createdDate).getTime()) / (1000 * 3600);
            const timeDecay = (1 / (ageInHours + 48) ** 1.1) * 100;

            const ratingWeight = 0.7;
            const watcherWeight = 0.2;
            const commentWeight = 0.1;

            const ratingScore = post.rating / 5;
            const nonOwnerWatchers = post.watchers.filter(w => w.userId !== post.createdById);
            const watcherScore = Math.min((nonOwnerWatchers.length) / 10, 1);
            const commentScore = Math.min(post.comments.length / 20, 1);

            const engagementScore
              = (ratingScore * ratingWeight)
                + (watcherScore * watcherWeight)
                + (commentScore * commentWeight);

            const trendingScore = engagementScore * timeDecay;
            return {
              ...post,
              trendingScore,
              watchers: nonOwnerWatchers,
            };
          })
          .filter(post => post.trendingScore > 0.5)
          .sort((a, b) => b.trendingScore - a.trendingScore);

        const totalFilteredCount = postsWithScores.length;

        return {
          posts: postsWithScores satisfies ExplorePost[],
          totalCount: totalFilteredCount,
          currentPage: page,
          totalPages: Math.ceil(totalFilteredCount / limit),
          limit,
        };
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
