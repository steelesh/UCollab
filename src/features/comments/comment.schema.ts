import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters")
    .transform(str => str.trim())
    .refine(
      (str) => {
        const textContent = str.replace(/<[^>]*>/g, "").trim();
        return textContent.length > 0;
      },
      {
        message: "Comment cannot be empty",
      },
    ),
  postId: z.string().min(1, "Post ID is required"),
});

export type CommentFormData = z.infer<typeof commentSchema>;
