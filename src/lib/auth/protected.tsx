import { OnboardingStep, Role, User } from '@prisma/client';
import { redirect } from 'next/navigation';
import { isDevelopment } from '../utils';
import React from 'react';
import { auth } from 'auth';

type PageProps = Record<string, unknown>;

export function withAuth<P extends PageProps>(
  Component: (props: P & { userId: string }) => Promise<React.ReactElement>,
) {
  return async function AuthComponent(props: P): Promise<React.ReactElement> {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        redirect('/');
      }

      if (session.user.onboardingStep !== OnboardingStep.COMPLETE) {
        redirect('/onboarding');
      }

      return Component({ ...props, userId: session.user.id as User['id'] });
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        throw error;
      }
      console.error('Auth error:', error);
      redirect('/');
    }
  };
}

export function withAdmin<P extends PageProps>(
  Component: (props: P & { userId: string }) => Promise<React.ReactElement>,
) {
  return async function AdminComponent(props: P): Promise<React.ReactElement> {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        redirect('/');
      }

      if (session.user.role !== Role.ADMIN) {
        redirect('/');
      }

      return Component({ ...props, userId: session.user.id as User['id'] });
    } catch {
      redirect('/');
    }
  };
}

export function withOnboarding<P extends PageProps>(
  Component: (props: P & { userId: string }) => Promise<React.ReactElement>,
) {
  return async function OnboardingComponent(props: P): Promise<React.ReactElement> {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        redirect('/');
      }

      if (session.user.onboardingStep === OnboardingStep.COMPLETE) {
        redirect('/');
      }

      return Component({ ...props, userId: session.user.id as User['id'] });
    } catch {
      redirect('/');
    }
  };
}

export function withDevelopment<P extends PageProps>(
  Component: (props: P & { userId: string }) => Promise<React.ReactElement>,
) {
  return async function DevelopmentComponent(props: P): Promise<React.ReactElement> {
    if (!isDevelopment()) {
      redirect('/');
    }

    const session = await auth();
    const userId = session?.user?.id;

    return Component({ ...props, userId: userId as User['id'] });
  };
}
