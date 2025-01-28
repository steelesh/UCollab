import { Comment as PrismaComment, Post, Prisma, User } from "@prisma/client";
import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters")
    .transform((str) => str.trim()),
  postId: z.string().uuid("Invalid post ID"),
}) satisfies z.ZodType<Partial<Prisma.CommentCreateInput>>;

export const updateCommentSchema = commentSchema
  .partial()
  .omit({ postId: true }) satisfies z.ZodType<
  Partial<Prisma.CommentUpdateInput>
>;

export type CreateCommentInput = z.infer<typeof commentSchema> & {
  postId: Post["id"];
  userId: User["id"];
};

export type UpdateCommentInput = z.infer<typeof updateCommentSchema> & {
  id: PrismaComment["id"];
};
