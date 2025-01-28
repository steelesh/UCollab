import { z } from "zod";
import { PostType, PostStatus, Prisma, User, Post } from "@prisma/client";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters"),
  postType: z.nativeEnum(PostType),
  technologies: z
    .array(z.string())
    .max(10, "Maximum of 10 technologies allowed")
    .transform((techs) => techs.map((t) => t.toLowerCase().trim()))
    .optional(),
  githubRepo: z.string().url("Invalid GitHub URL").optional(),
  status: z.nativeEnum(PostStatus),
}) satisfies z.ZodType<Partial<Omit<Prisma.PostCreateInput, "technologies">>>;

export const updatePostSchema = postSchema.partial().transform((data) => {
  const transformed: Partial<Prisma.PostUpdateInput> = {
    ...data,
    technologies: data.technologies
      ? {
          set: data.technologies.map((name) => ({
            name: name.toLowerCase().trim(),
          })),
        }
      : undefined,
  };
  return transformed;
});

export type CreatePostInput = z.infer<typeof postSchema> & {
  userId: User["id"];
};
export type UpdatePostInput = z.input<typeof updatePostSchema> & {
  id: Post["id"];
};
export type UpdatePostPayload = z.output<typeof updatePostSchema>;
