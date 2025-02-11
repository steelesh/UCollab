'use server';

import { postSchema } from '~/schemas/post.schema';
import { PostService } from '~/services/post.service';
import { auth } from 'auth';
import { ErrorMessage } from '~/lib/constants';
import { AppError } from '~/lib/errors/app-error';
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
    if (error instanceof AppError) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      notFound();
    }
    throw new AppError(ErrorMessage.OPERATION_FAILED);
  }
  redirect('/');
}
