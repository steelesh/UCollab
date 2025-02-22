'use server';

import { postSchema } from '~/features/posts/post.schema';
import { PostService } from '~/features/posts/post.service';
import { auth } from '~/security/auth';
import { ErrorMessage, Utils } from '~/lib/utils';
import { Prisma } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);
  const { title, postType, description, technologies, githubRepo } = postSchema.parse({
    title: formData.get('title'),
    postType: formData.get('postType'),
    description: formData.get('description'),
    technologies: formData.get('technologies'),
    githubRepo: formData.get('githubRepo'),
  });
  try {
    await PostService.createPost(session.user.id, {
      title,
      postType,
      description,
      githubRepo,
      technologies,
    });
  } catch (error) {
    if (error instanceof Utils) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      notFound();
    }
    throw new Utils(ErrorMessage.OPERATION_FAILED);
  }
  redirect('/');
}
