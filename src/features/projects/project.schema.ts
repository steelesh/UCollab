import { z } from 'zod';
import { ProjectType } from '@prisma/client';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  projectType: z.nativeEnum(ProjectType),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  githubRepo: z.string().url({ message: 'Invalid URL' }).optional().nullable(),
});

export const projectRatingSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
});

export type CreateProjectInput = z.infer<typeof projectSchema>;
