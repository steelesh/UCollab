import { z } from 'zod';
import { PostType } from '@prisma/client';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  postType: z.nativeEnum(PostType),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  githubRepo: z.string().url({ message: 'Invalid URL' }).optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof projectSchema>;
