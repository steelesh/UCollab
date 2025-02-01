import { Prisma } from "@prisma/client";
import { z } from "zod";

// Add common select object for reuse
export const skillSelect = {
  id: true,
  name: true,
  verified: true,
  createdDate: true,
  createdBy: {
    select: {
      id: true,
      username: true,
    },
  },
} as const;

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(50, "Skill name must be less than 50 characters")
    .transform((name) => name.toLowerCase().trim()),
  verified: z.boolean().optional(),
  createdById: z.string().optional(),
}) satisfies z.ZodType<Partial<Prisma.SkillCreateInput>>;

export const updateSkillSchema = skillSchema.partial() satisfies z.ZodType<
  Partial<Prisma.SkillUpdateInput>
>;

export type CreateSkillInput = z.infer<typeof skillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
