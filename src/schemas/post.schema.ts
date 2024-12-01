import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  postType: z.enum(["CONTRIBUTION", "FEEDBACK", "DISCUSSION"]),
  technologies: z.array(z.string()).optional(),
  githubRepo: z.string().url().optional(),
  status: z.enum(["OPEN", "CLOSED"]),
});

export type PostSchema = z.infer<typeof postSchema>;
