import { Prisma } from "@prisma/client";
import { z } from "zod";

export const profileSchema = z.object({
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .nullable()
    .optional(),
  gradYear: z
    .number()
    .min(2000, "Graduation year must be after 2000")
    .max(2100, "Graduation year must be before 2100")
    .nullable()
    .optional(),
  skills: z.array(z.string()).optional(),
}) satisfies z.ZodType<Partial<Omit<Prisma.ProfileCreateInput, "skills">>>;

export const updateProfileSchema = profileSchema.partial().transform((data) => {
  const transformed: Partial<Prisma.ProfileUpdateInput> = {
    ...data,
    skills: data.skills
      ? {
          connect: data.skills.map((name) => ({
            name: name.toLowerCase().trim(),
          })),
        }
      : undefined,
  };
  return transformed;
});

export type CreateProfileInput = z.infer<typeof profileSchema>;
export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
export type UpdateProfilePayload = z.output<typeof updateProfileSchema>;
