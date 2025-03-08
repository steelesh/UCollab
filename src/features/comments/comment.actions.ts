'use server';

import { auth } from '~/security/auth';
import { revalidatePath } from 'next/cache';
import { CommentService } from './comment.service';
import { commentSchema } from './comment.schema';
import { Comment, Project } from '@prisma/client';

export async function createComment(projectId: Project['id'], content: Comment['content']) {
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

export async function updateComment(commentId: Comment['id'], content: Comment['content'], projectId: Project['id']) {
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

export async function deleteComment(commentId: Comment['id'], projectId: Project['id']) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Authentication required');

  try {
    await CommentService.deleteComment(commentId, session.user.id);
    revalidatePath(`/p/${projectId}`);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete comment');
  }
}

export async function createReply(projectId: string, parentId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Authentication required');

  const validatedData = commentSchema.parse({ content, projectId });

  try {
    const comment = await CommentService.createReply({ ...validatedData, parentId }, session.user.id);
    revalidatePath(`/p/${projectId}`);
    return comment;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create reply');
  }
}
