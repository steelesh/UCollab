import { Prisma, type Skill } from '@prisma/client';
import { notFound } from 'next/navigation';
import { prisma } from '~/lib/prisma';
import { withServiceAuth } from '~/lib/auth/protected-service';
import { ErrorMessage } from '~/lib/constants';
import { AppError } from '~/lib/errors/app-error';
import { Permission } from '~/lib/permissions';
import {
  type CreateSkillInput,
  type UpdateSkillInput,
  skillSelect,
} from '~/schemas/skill.schema';

export const SkillService = {
  // Public Operations
  async getAllSkills() {
    try {
      return await prisma.skill.findMany({
        where: { verified: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  async searchSkills(query: string, limit = 10) {
    try {
      return await prisma.skill.findMany({
        where: {
          AND: [
            { verified: true },
            { name: { contains: query.toLowerCase().trim() } },
          ],
        },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
        take: limit,
      });
    } catch {
      throw new AppError(ErrorMessage.OPERATION_FAILED);
    }
  },

  // Protected Operations
  async createSkill(data: CreateSkillInput, requestUserId: string) {
    return withServiceAuth(requestUserId, Permission.CREATE_SKILL, async () => {
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
            throw new AppError(`Skill "${data.name}" already exists`);
          }
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async suggestSkill(data: CreateSkillInput, requestUserId: string) {
    return withServiceAuth(
      requestUserId,
      Permission.SUGGEST_SKILL,
      async () => {
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
              throw new AppError(`Skill "${data.name}" already exists`);
            }
          }
          throw new AppError(ErrorMessage.OPERATION_FAILED);
        }
      },
    );
  },

  async updateSkill(
    skillId: Skill['id'],
    data: UpdateSkillInput,
    requestUserId: string,
  ) {
    return withServiceAuth(requestUserId, Permission.UPDATE_SKILL, async () => {
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
            throw new AppError(`Skill "${data.name}" already exists`);
          }
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async deleteSkill(skillId: Skill['id'], requestUserId: string) {
    return withServiceAuth(requestUserId, Permission.DELETE_SKILL, async () => {
      try {
        await prisma.skill.delete({ where: { id: skillId } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') notFound();
        }
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },

  async getPendingSkills(requestUserId: string, page = 1, limit = 20) {
    return withServiceAuth(requestUserId, Permission.VIEW_SKILLS, async () => {
      try {
        return await prisma.skill.findMany({
          where: { verified: false },
          select: skillSelect,
          orderBy: { createdDate: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        });
      } catch {
        throw new AppError(ErrorMessage.OPERATION_FAILED);
      }
    });
  },
};
