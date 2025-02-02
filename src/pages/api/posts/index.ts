'use server';

import { auth } from '~/lib/auth';
import {
  type CreatePostInput,
  type UpdatePostInput,
} from '~/schemas/post.schema';
import { PostService } from '~/services/post.service';
import { type Post } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createPost(data: CreatePostInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const post = await PostService.createPost(
    { ...data, userId: session.user.id },
    session.user.id,
  );

  revalidatePath('/posts');
  revalidatePath(`/profile/${session.user.username}`);
  return post;
}

export async function updatePost(data: UpdatePostInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const post = await PostService.updatePost(data, session.user.id);

  revalidatePath('/posts');
  revalidatePath(`/posts/${data.id}`);
  revalidatePath(`/profile/${session.user.username}`);
  return post;
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  await PostService.deletePost(postId, session.user.id);

  revalidatePath('/posts');
  revalidatePath(`/profile/${session.user.username}`);
}

export async function updatePostStatus(postId: string, status: Post['status']) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not authenticated');

  const post = await PostService.updatePostStatus(
    postId,
    status,
    session.user.id,
  );

  revalidatePath('/posts');
  revalidatePath(`/posts/${postId}`);
  revalidatePath(`/profile/${session.user.username}`);
  return post;
}
