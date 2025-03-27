import type { Project, Technology, User } from "@prisma/client";

import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

import { NotificationService } from "~/features/notifications/notification.service";
import { prisma } from "~/lib/prisma";
import { ErrorMessage, Utils } from "~/lib/utils";
import { withServiceAuth } from "~/security/protected-service";

import type { CreateProjectInput } from "./project.schema";
import type { ExploreProject, ProjectDetails } from "./project.types";

export const ProjectService = {
  async getAllProjects(requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            projectType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectById(id: Project["id"], requestUserId: string): Promise<ProjectDetails> {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const project = await prisma.project.findUnique({
          where: { id },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            lastModifiedDate: true,
            projectType: true,
            githubRepo: true,
            createdById: true,
            technologies: true,
            rating: true,
            comments: {
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
              orderBy: { createdDate: "desc" },
            },
          },
        });

        if (!project)
          notFound();
        return project as ProjectDetails;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectTitle(id: Project["id"]): Promise<Project["title"]> {
    const project = await prisma.project.findUnique({ where: { id }, select: { title: true } });
    if (!project)
      notFound();
    return project.title;
  },

  async createProject(data: CreateProjectInput, requestUserId: User["id"]) {
    return withServiceAuth(requestUserId, { ownerId: requestUserId }, async () => {
      try {
        const project = await prisma.$transaction(async (tx) => {
          const techNames = data.technologies.map(tech => tech.toLowerCase().trim());

          const newProject = await tx.project.create({
            data: {
              title: data.title,
              description: data.description,
              projectType: data.projectType,
              githubRepo: data.githubRepo || null,
              createdBy: { connect: { id: requestUserId } },
              technologies: {
                connectOrCreate: techNames.map(name => ({
                  where: { name },
                  create: { name },
                })),
              },
            },
            select: {
              id: true,
              title: true,
              description: true,
              createdDate: true,
              projectType: true,
              githubRepo: true,
              technologies: true,
            },
          });

          await tx.projectWatcher.create({
            data: {
              projectId: newProject.id,
              userId: requestUserId,
            },
          });

          return newProject;
        });

        await NotificationService.queueBatchNotifications({
          userIds: [requestUserId],
          type: "PROJECT_UPDATE",
          message: `project "${project.title}" has been created`,
          projectId: project.id,
          triggeredById: requestUserId,
        });

        return project;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async deleteProject(id: Project["id"], requestUserId: string) {
    const project = await this.getProjectById(id, requestUserId);
    return withServiceAuth(requestUserId, { ownerId: project.createdById }, async () => {
      try {
        await this.sendProjectUpdateNotification(id, "deleted", requestUserId);
        await prisma.project.delete({ where: { id } });
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

  async searchProjects(query: string, requestUserId: string, page = 1, limit = 20) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          where: {
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            projectType: true,
            githubRepo: true,
          },
          skip: (page - 1) * limit,
          take: limit,
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectsByUser(userId: string, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          where: { createdById: userId },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            projectType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectsByTechnology(techName: string, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          where: {
            technologies: {
              some: { name: techName.toLowerCase().trim() },
            },
          },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            projectType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectsByTechnologies(techNames: Technology["name"][], matchAll = false, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          where: {
            technologies: matchAll
              ? {
                  every: {
                    name: { in: techNames.map(t => t.toLowerCase().trim()) },
                  },
                }
              : {
                  some: {
                    name: { in: techNames.map(t => t.toLowerCase().trim()) },
                  },
                },
          },
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            projectType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: "desc" },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPaginatedProjects(page = 1, limit = 12, requestUserId: User["id"]): Promise<ExploreProject[]> {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          orderBy: {
            createdDate: "desc",
          },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            title: true,
            createdDate: true,
            description: true,
            githubRepo: true,
            projectType: true,
            rating: true,
            technologies: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectCount(requestUserId: User["id"]): Promise<number> {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.count();
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

  async updateProject(id: Project["id"], data: CreateProjectInput, requestUserId: string) {
    const project = await this.getProjectById(id, requestUserId);

    return withServiceAuth(requestUserId, { ownerId: project.createdById }, async () => {
      try {
        const updatedProject = await prisma.$transaction(async (tx) => {
          const techNames = data.technologies.map(tech => tech.toLowerCase().trim());

          const existingTechs = await tx.project.findUnique({
            where: { id },
            select: {
              technologies: {
                select: { name: true },
              },
            },
          });

          const existingTechNames = existingTechs?.technologies.map(t => t.name) || [];
          const techsToDisconnect = existingTechNames.filter(name => !techNames.includes(name));
          const techsToAdd = techNames.filter(name => !existingTechNames.includes(name));

          const updatedProject = await tx.project.update({
            where: { id },
            data: {
              title: data.title,
              description: data.description,
              projectType: data.projectType,
              githubRepo: data.githubRepo,
              technologies: {
                disconnect: techsToDisconnect.map(name => ({ name })),
                connectOrCreate: techsToAdd.map(name => ({
                  where: { name },
                  create: { name },
                })),
              },
            },
            select: {
              id: true,
              title: true,
              description: true,
              createdDate: true,
              projectType: true,
              githubRepo: true,
              technologies: true,
            },
          });

          await this.sendProjectUpdateNotification(id, "updated", requestUserId);

          return updatedProject;
        });

        return updatedProject;
      } catch (error) {
        console.error("Project update error:", error);
        if (error instanceof Utils)
          throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async watchProject(projectId: string, userId: string) {
    return withServiceAuth(userId, null, async () => {
      try {
        const watcher = await prisma.projectWatcher.create({
          data: {
            projectId,
            userId,
          },
          include: {
            project: {
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

        if (watcher.project.createdById !== userId) {
          await NotificationService.queueBatchNotifications({
            userIds: [watcher.project.createdById],
            type: "PROJECT_UPDATE",
            message: `${watcher.user.username} is now watching "${watcher.project.title}"`,
            projectId,
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

  async unwatchProject(projectId: string, userId: string) {
    return withServiceAuth(userId, null, async () => {
      try {
        return await prisma.projectWatcher.delete({
          where: {
            projectId_userId: {
              projectId,
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

  async getProjectWatchers(projectId: string) {
    try {
      return await prisma.projectWatcher.findMany({
        where: { projectId },
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

  async sendProjectUpdateNotification(projectId: string, action: "updated" | "deleted", requestUserId: string) {
    try {
      const project = await this.getProjectById(projectId, requestUserId);
      const watchers = await this.getProjectWatchers(projectId);
      const user = await prisma.user.findUnique({
        where: { id: requestUserId },
        select: { username: true },
      });

      const watcherIds = watchers
        .filter(
          w =>
            w.user.notificationPreferences?.enabled
            && w.user.notificationPreferences?.allowProjectUpdates
            && w.userId !== requestUserId,
        )
        .map(w => w.userId);

      if (watcherIds.length > 0 && user) {
        await NotificationService.queueBatchNotifications({
          userIds: watcherIds,
          type: "PROJECT_UPDATE",
          message: `${user.username} has ${action} project "${project.title}"`,
          projectId: project.id,
          triggeredById: requestUserId,
        });
      }
    } catch (error) {
      if (error instanceof Utils)
        throw error;
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async rateProject(projectId: Project["id"], rating: number, requestUserId: User["id"]) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: {
            id: true,
            title: true,
            createdById: true,
          },
        });

        if (!project) {
          notFound();
        }

        if (project.createdById === requestUserId) {
          throw new Utils(ErrorMessage.INSUFFICIENT_PERMISSIONS);
        }

        const userRating = await prisma.$transaction(async (tx) => {
          const userRating = await tx.projectRating.upsert({
            where: {
              projectId_userId: {
                projectId,
                userId: requestUserId,
              },
            },
            update: {
              rating,
            },
            create: {
              projectId,
              userId: requestUserId,
              rating,
            },
          });

          const ratings = await tx.projectRating.findMany({
            where: { projectId },
            select: { rating: true },
          });

          const averageRating
            = ratings.length > 0
              ? Number((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1))
              : 0;

          await tx.project.update({
            where: { id: projectId },
            data: { rating: averageRating },
          });

          return userRating;
        });

        if (project.createdById !== requestUserId) {
          const user = await prisma.user.findUnique({
            where: { id: requestUserId },
            select: { username: true },
          });

          if (user && project.createdById) {
            await NotificationService.queueBatchNotifications({
              userIds: [project.createdById],
              type: "RATING",
              message: `${user.username} rated your project "${project.title}" with ${rating} stars`,
              projectId,
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

  async getUserProjectRating(projectId: Project["id"], userId: User["id"]) {
    return withServiceAuth(userId, null, async () => {
      try {
        const rating = await prisma.projectRating.findUnique({
          where: {
            projectId_userId: {
              projectId,
              userId,
            },
          },
          select: { rating: true },
        });

        return rating?.rating || 0;
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getUserWatchedProjects(userId: string, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const watchedProjects = await prisma.projectWatcher.findMany({
          where: { userId },
          select: {
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                createdDate: true,
                lastModifiedDate: true,
                projectType: true,
                githubRepo: true,
                createdById: true,
                technologies: true,
                rating: true,
              },
            },
          },
          orderBy: {
            project: {
              createdDate: "desc",
            },
          },
        });

        return watchedProjects.map(watcher => watcher.project);
      } catch (error) {
        if (error instanceof Utils)
          throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
