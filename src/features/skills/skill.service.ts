import { Prisma, Skill } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/security/protected-service';
import { ErrorMessage, Utils } from '~/lib/utils';
import { CreateSkillInput, UpdateSkillInput, skillSelect } from '~/features/skills/skill.schema';

export const SkillService = {
  // Public methods - no auth needed
  async getAllSkills() {
    try {
      return await prisma.skill.findMany({
        where: { verified: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  async searchSkills(query: string, limit = 10) {
    try {
      return await prisma.skill.findMany({
        where: {
          AND: [{ verified: true }, { name: { contains: query.toLowerCase().trim() } }],
        },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
        take: limit,
      });
    } catch {
      throw new Utils(ErrorMessage.OPERATION_FAILED);
    }
  },

  // Admin only - creating verified skills
  async createSkill(data: CreateSkillInput, requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        const existingSkill = await prisma.skill.findUnique({
          where: { name: data.name.toLowerCase().trim() },
          select: { id: true, name: true },
        });

        if (existingSkill) return existingSkill;

        return await prisma.skill.create({
          data: {
            ...data,
            verified: true,
            createdById: requestUserId,
          },
          select: skillSelect,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new Utils(`Skill "${data.name}" already exists`);
          }
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Authenticated users can suggest
  async suggestSkill(data: CreateSkillInput, requestUserId: string) {
    return withServiceAuth(requestUserId, null, async () => {
      try {
        return await prisma.skill.create({
          data: {
            ...data,
            verified: false,
            createdById: requestUserId,
          },
          select: skillSelect,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new Utils(`Skill "${data.name}" already exists`);
          }
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Admin only - updating skills
  async updateSkill(skillId: Skill['id'], data: UpdateSkillInput, requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.skill.update({
          where: { id: skillId },
          data: {
            ...data,
            name: data.name?.toLowerCase().trim(),
          },
          select: skillSelect,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
          if (error.code === 'P2002') {
            throw new Utils(`Skill "${data.name}" already exists`);
          }
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Admin only - deleting skills
  async deleteSkill(skillId: Skill['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        await prisma.skill.delete({ where: { id: skillId } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  // Admin only - viewing pending skills
  async getPendingSkills(requestUserId: string, page = 1, limit = 20) {
    return withServiceAuth(requestUserId, { adminOnly: true }, async () => {
      try {
        return await prisma.skill.findMany({
          where: { verified: false },
          select: skillSelect,
          orderBy: { createdDate: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        });
      } catch {
        throw new Utils(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
