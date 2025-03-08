'use server';

import { auth } from '~/security/auth';
import { revalidatePath } from 'next/cache';
import { CommentService } from './comment.service';
import { commentSchema } from './comment.schema';

export async function createComment(projectId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Authentication required');

  const validatedData = commentSchema.parse({ content, projectId });

  try {
    const comment = await CommentService.createComment(validatedData, session.user.id);
    revalidatePath(`/p/${projectId}`);
    return comment;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create comment');
  }
}

export async function updateComment(commentId: string, content: string, projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Authentication required');

  const validatedData = commentSchema.parse({ content, projectId });

  try {
    await CommentService.updateComment(
      {
        id: commentId,
        content: validatedData.content,
      },
      session.user.id,
    );
    revalidatePath(`/p/${projectId}`);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update comment');
  }
}

export async function deleteComment(commentId: string, projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Authentication required');

  try {
    await CommentService.deleteComment(commentId, session.user.id);
    revalidatePath(`/p/${projectId}`);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete comment');
  }
}
