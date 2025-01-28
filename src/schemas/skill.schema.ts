import { Prisma } from "@prisma/client";
import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  verified: z.boolean().optional(),
  createdById: z.string().optional(),
}) satisfies z.ZodType<Partial<Prisma.SkillCreateInput>>;

export const updateSkillSchema = skillSchema.partial() satisfies z.ZodType<
  Partial<Prisma.SkillUpdateInput>
>;

export type CreateSkillInput = z.infer<typeof skillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
