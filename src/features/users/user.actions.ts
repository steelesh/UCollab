'use server';

import { onboardingSchema } from '~/features/users/user.schema';
import { UserService } from '~/features/users/user.service';
import { auth } from '../../../auth';
import { ErrorMessage, Utils } from '~/lib/utils';
import { Prisma } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';

export async function updateOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);
  const { gradYear, skills, githubProfile, postType } = onboardingSchema.parse({
    gradYear: formData.get('gradYear'),
    skills: formData.get('skills'),
    githubProfile: formData.get('githubProfile'),
    postType: formData.get('postType'),
  });
  try {
    await UserService.completeOnboarding(session.user.id, session.user.id, {
      gradYear,
      skills,
      githubProfile,
      postType,
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
