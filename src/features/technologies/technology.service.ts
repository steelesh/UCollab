import { Project, Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { CreateTechnologyInput, technologySelect } from '~/features/technologies/technology.schema';

export const TechnologyService = {
  async getVerifiedTechnologies() {
    try {
      return await prisma.technology.findMany({
        where: { verified: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async searchVerifiedTechnologies(query: string, limit = 10) {
    try {
      return await prisma.technology.findMany({
        where: {
          AND: [{ verified: true }, { name: { contains: query.toLowerCase().trim() } }],
        },
        select: { id: true, name: true },
        take: limit,
        orderBy: { name: 'asc' },
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  // Admin only - creating verified technologies
  async createTechnology(data: CreateTechnologyInput, requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        const normalizedName = data.name.toLowerCase().trim();
        const existingTechnology = await prisma.technology.findUnique({
          where: { name: normalizedName },
          select: technologySelect,
        });

        if (existingTechnology) return existingTechnology;

        return await prisma.technology.create({
          data: {
            name: normalizedName,
            verified: true,
          },
          select: technologySelect,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new Utils(`Technology "${data.name}" already exists`);
          }
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Admin only - verifying technologies
  async verifyTechnology(id: string, requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.technology.update({
          where: { id },
          data: { verified: true },
          select: technologySelect,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Admin only - viewing pending technologies
  async getPendingTechnologies(requestUserId: string, page = 1, limit = 20) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.technology.findMany({
          where: { verified: false },
          select: technologySelect,
          orderBy: { createdDate: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        });
      } catch {
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Post owner or admin can update technologies
  async updateProjectTechnologies(projectId: Project['id'], technologies: string[], requestUserId: string) {
    return withServiceAuth(requestUserId, { ownerId: projectId }, async () => {
      try {
        return await prisma.$transaction(async (tx) => {
          const project = await tx.project.findUnique({
            where: { id: projectId },
            select: { id: true },
          });

          if (!project) notFound();

          const verifiedTechs = await tx.technology.findMany({
            where: {
              AND: [
                { verified: true },
                {
                  name: { in: technologies.map((t) => t.toLowerCase().trim()) },
                },
              ],
            },
            select: { name: true },
          });

          return tx.project.update({
            where: { id: projectId },
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
          if (error.code === 'P2025') notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Public method - no auth needed
  async getProjectTechnologies(projectId: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
          technologies: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return project?.technologies ?? [];
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },
};
