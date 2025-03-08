import { Project, Prisma, Technology, User } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { CreateProjectInput } from './project.schema';
import { ProjectDetails } from './project.types';

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
            postType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectById(id: Project['id'], requestUserId: string): Promise<ProjectDetails> {
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
            postType: true,
            githubRepo: true,
            createdById: true,
            technologies: true,
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
              orderBy: { createdDate: 'desc' },
            },
          },
        });

        if (!project) notFound();
        return project as ProjectDetails;
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectTitle(id: Project['id']): Promise<Project['title']> {
    const project = await prisma.project.findUnique({ where: { id }, select: { title: true } });
    if (!project) notFound();
    return project.title;
  },

  async createProject(data: CreateProjectInput, requestUserId: User['id']) {
    return withServiceAuth(requestUserId, { ownerId: requestUserId }, async () => {
      try {
        return prisma.$transaction(async (tx) => {
          const techNames = data.technologies.map((tech) => tech.toLowerCase().trim());

          return tx.project.create({
            data: {
              title: data.title,
              description: data.description,
              postType: data.postType,
              githubRepo: data.githubRepo || null,
              createdBy: { connect: { id: requestUserId } },
              technologies: {
                connectOrCreate: techNames.map((name) => ({
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
              postType: true,
              githubRepo: true,
              technologies: true,
            },
          });
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async deleteProject(id: Project['id'], requestUserId: string) {
    const project = await this.getProjectById(id, requestUserId);
    return withServiceAuth(requestUserId, { ownerId: project.createdById }, async () => {
      try {
        await prisma.project.delete({ where: { id } });
      } catch (error) {
        if (error instanceof Utils) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
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
            postType: true,
            githubRepo: true,
          },
          skip: (page - 1) * limit,
          take: limit,
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
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
            postType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
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
            postType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectsByTechnologies(techNames: Technology['name'][], matchAll = false, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
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
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            postType: true,
            githubRepo: true,
          },
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPaginatedProjects(page = 1, limit = 20, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          select: {
            id: true,
            title: true,
            description: true,
            createdDate: true,
            postType: true,
            githubRepo: true,
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

  async searchTechnologies(query: string, requestUserId: User['id'], limit = 5) {
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
            name: 'asc',
          },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async updateProject(id: Project['id'], data: CreateProjectInput, requestUserId: string) {
    const project = await this.getProjectById(id, requestUserId);

    return withServiceAuth(requestUserId, { ownerId: project.createdById }, async () => {
      try {
        const techNames = data.technologies.map((tech) => tech.toLowerCase().trim());

        return await prisma.$transaction(async (tx) => {
          const existingTechs = await tx.project.findUnique({
            where: { id },
            select: {
              technologies: {
                select: { name: true },
              },
            },
          });

          const existingTechNames = existingTechs?.technologies.map((t) => t.name) || [];
          const techsToDisconnect = existingTechNames.filter((name) => !techNames.includes(name));
          const techsToAdd = techNames.filter((name) => !existingTechNames.includes(name));

          return tx.project.update({
            where: { id },
            data: {
              title: data.title,
              description: data.description,
              postType: data.postType,
              githubRepo: data.githubRepo,
              technologies: {
                disconnect: techsToDisconnect.map((name) => ({ name })),
                connectOrCreate: techsToAdd.map((name) => ({
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
              postType: true,
              githubRepo: true,
              technologies: true,
            },
          });
        });
      } catch (error) {
        console.error('Project update error:', error);
        if (error instanceof Utils) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
