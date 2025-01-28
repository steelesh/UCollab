import { Prisma } from "@prisma/client";
import { z } from "zod";

export const technologySchema = z.object({
  name: z
    .string()
    .min(1, "Technology name is required")
    .transform((val) => val.toLowerCase().trim()),
  verified: z.boolean().default(false),
}) satisfies z.ZodType<Partial<Prisma.TechnologyCreateInput>>;

export const suggestTechnologySchema = technologySchema.pick({
  name: true,
});

export const updateTechnologySchema =
  technologySchema.partial() satisfies z.ZodType<
    Partial<Prisma.TechnologyUpdateInput>
  >;

export type CreateTechnologyInput = z.infer<typeof technologySchema>;
export type UpdateTechnologyInput = z.infer<typeof updateTechnologySchema>;
export type SuggestTechnologyInput = z.infer<typeof suggestTechnologySchema>;
