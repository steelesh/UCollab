import { Project, Prisma, Technology } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { projectSchema, projectSelect, CreateProjectInput } from '~/features/projects/project.schema';

export const projectService = {
  async getAllProjects(requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          select: projectSelect,
          orderBy: { createdDate: 'desc' },
        });
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getProjectById(id: Project['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        const project = await prisma.project.findUnique({
          where: { id },
          select: {
            ...projectSelect,
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

        if (!project) notFound();
        return project;
      } catch (error) {
        if (error instanceof Utils) throw error;
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Owner only - creating posts
  async createProject(requestUserId: string, rawData: unknown) {
    return withServiceAuth(requestUserId, { ownerId: requestUserId }, async () => {
      try {
        const data: CreateProjectInput = projectSchema.parse(rawData);
        let postType: 'CONTRIBUTION' | 'FEEDBACK' | 'DISCUSSION' = 'DISCUSSION';
        if (data.postType === 'CONTRIBUTION') {
          postType = 'CONTRIBUTION';
        } else if (data.postType === 'FEEDBACK') {
          postType = 'FEEDBACK';
        }
        return prisma.$transaction(async (tx) => {
          return tx.project.create({
            data: {
              title: data.title,
              description: data.description,
              postType: postType,
              githubRepo: data.githubRepo,
              createdBy: { connect: { id: requestUserId } },
              technologies: {
                create: data.technologies
                  ? data.technologies.split(',').map((s) => ({
                      name: s.trim(),
                    }))
                  : [],
              },
            },
            select: projectSelect,
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

  // Authenticated users - searching and filtering posts
  async searchProjects(query: string, requestUserId: string, page = 1, limit = 20) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.project.findMany({
          where: {
            OR: [{ title: { contains: query } }, { description: { contains: query } }],
          },
          select: projectSelect,
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
          select: projectSelect,
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
          select: projectSelect,
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
          select: projectSelect,
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
          select: projectSelect,
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
