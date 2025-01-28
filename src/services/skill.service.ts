import { UpdateSkillInput, CreateSkillInput } from "../schemas/skill.schema";
import { db } from "../data/mysql";
import { Skill, Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { UserService } from "./user.service";
import { Permission } from "../lib/permissions";

export const SkillService = {
  async getAllSkills() {
    try {
      return await db.skill.findMany({
        where: { verified: true },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch skills: ${error.message}`
          : "Failed to fetch skills",
      );
    }
  },

  async searchSkills(query: string, limit: number = 10) {
    try {
      return await db.skill.findMany({
        where: {
          AND: [{ verified: true }, { name: { contains: query } }],
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
        take: limit,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to search skills: ${error.message}`
          : "Failed to search skills",
      );
    }
  },

  async createSkill(data: CreateSkillInput, requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.CREATE_SKILL,
        ))
      ) {
        throw new Error("Unauthorized: Cannot create verified skills");
      }

      const existingSkill = await db.skill.findUnique({
        where: { name: data.name },
        select: {
          id: true,
          name: true,
        },
      });

      if (existingSkill) {
        return existingSkill;
      }

      return await db.skill.create({
        data: {
          ...data,
          verified: true,
          createdById: requestUserId,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error(`Skill "${data.name}" already exists`);
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to create skill: ${error.message}`
          : "Failed to create skill",
      );
    }
  },

  async suggestSkill(data: CreateSkillInput, requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.SUGGEST_SKILL,
        ))
      ) {
        throw new Error("Unauthorized: Cannot suggest skills");
      }

      return await db.skill.create({
        data: {
          ...data,
          verified: false,
          createdById: requestUserId,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to suggest skill: ${error.message}`
          : "Failed to suggest skill",
      );
    }
  },

  async updateSkill(
    skillId: Skill["id"],
    data: UpdateSkillInput,
    requestUserId: string,
  ) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.UPDATE_SKILL,
        ))
      ) {
        throw new Error("Unauthorized: Cannot update skills");
      }

      return await db.skill.update({
        where: { id: skillId },
        data: data,
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
        if (error.code === "P2002") {
          throw new Error(`Skill "${data.name}" already exists`);
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to update skill: ${error.message}`
          : "Failed to update skill",
      );
    }
  },

  async deleteSkill(skillId: Skill["id"], requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.DELETE_SKILL,
        ))
      ) {
        throw new Error("Unauthorized: Cannot delete skills");
      }

      return await db.skill.delete({
        where: { id: skillId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          notFound();
        }
      }
      throw new Error(
        error instanceof Error
          ? `Failed to delete skill: ${error.message}`
          : "Failed to delete skill",
      );
    }
  },

  async getPendingSkills(requestUserId: string) {
    try {
      if (
        !(await UserService.hasPermission(
          requestUserId,
          Permission.VIEW_SKILLS,
        ))
      ) {
        throw new Error("Unauthorized: Cannot view pending skills");
      }

      return await db.skill.findMany({
        where: { verified: false },
        select: {
          id: true,
          name: true,
          createdBy: {
            select: {
              username: true,
            },
          },
          createdDate: true,
        },
        orderBy: { createdDate: "desc" },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to fetch pending skills: ${error.message}`
          : "Failed to fetch pending skills",
      );
    }
  },
};
