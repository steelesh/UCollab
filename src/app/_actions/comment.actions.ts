import { auth } from "@/auth";
import { ErrorMessage } from "@/src/lib/constants";
import {
  CreateCommentData,
  UpdateCommentData,
} from "@/src/schemas/comment.schema";
import { CommentService } from "@/src/services/comment.service";

export async function createComment(data: CreateCommentData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return CommentService.createComment(data, session.user.id);
}

export async function updateComment(data: UpdateCommentData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return CommentService.updateComment(data, session.user.id);
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return CommentService.deleteComment(commentId, session.user.id);
}
