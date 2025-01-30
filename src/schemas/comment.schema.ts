import { z } from "zod";

// Form validation schema (what users actually input)
export const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters")
    .transform((str) => str.trim()),
});

// Service input types (internal use)
export type CreateCommentData = {
  content: string;
  postId: string;
};

export type UpdateCommentData = {
  id: string;
  content: string;
  postId: string;
};

// Form data type
export type CommentFormData = z.infer<typeof commentFormSchema>;
