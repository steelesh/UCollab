import { z } from 'zod';

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .transform((str) => str.trim()),
});

export interface CreateCommentData {
  content: string;
  projectId: string;
}

export interface UpdateCommentData {
  id: string;
  content: string;
  projectId: string;
}

export type CommentFormData = z.infer<typeof commentFormSchema>;
