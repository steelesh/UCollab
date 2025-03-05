import { z } from 'zod';

export const projectSelect = {
  id: true,
  title: true,
  description: true,
  createdDate: true,
  postType: true,
  githubRepo: true,
} as const;

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  postType: z.string(),
  technologies: z.string(),
  githubRepo: z.string().url({ message: 'Invalid URL' }).optional(),
});

export type CreateProjectInput = z.infer<typeof projectSchema>;
