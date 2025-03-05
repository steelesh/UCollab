'use server';

import { onboardingSchema } from '~/features/users/user.schema';
import { UserService } from '~/features/users/user.service';
import { auth } from '~/security/auth';
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

export async function updateUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);
  const userId = formData.get('userId')?.toString();
  if (!userId) {
    throw new Error('User ID is required');
  }
  const gradYearStr = formData.get('gradYear')?.toString();
  const gradYear = gradYearStr ? parseInt(gradYearStr, 10) : undefined;
  const mentorshipValue = formData.get('mentorship')?.toString();
  const mentorship =
    mentorshipValue === 'MENTOR' || mentorshipValue === 'MENTEE' || mentorshipValue === 'NONE'
      ? (mentorshipValue as 'MENTOR' | 'MENTEE' | 'NONE')
      : undefined;
  const bio = formData.get('bio')?.toString() || undefined;
  const avatarValue = formData.get('avatar');
  const avatar = avatarValue instanceof File && avatarValue.size > 0 ? avatarValue : undefined;
  const allowComments = formData.get('allowComments') === 'on';
  const allowMentions = formData.get('allowMentions') === 'on';
  const allowProjectUpdates = formData.get('allowProjectUpdates') === 'on';
  const allowSystem = formData.get('allowSystem') === 'on';
  const updateUserInput = {
    gradYear,
    mentorship,
    bio,
    avatar,
    notificationPreferences: {
      allowComments,
      allowMentions,
      allowProjectUpdates,
      allowSystem,
    },
  };

  try {
    await UserService.updateUser(userId, updateUserInput, session.user.id);
  } catch (error) {
    if (error instanceof Utils) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      notFound();
    }
    throw new Utils(ErrorMessage.OPERATION_FAILED);
  }
  redirect(`/u/${session.user.username}`);
}
