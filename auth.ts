import { PrismaAdapter } from '@auth/prisma-adapter';
import { AvatarSource, User as PrismaUser, Role, User } from '@prisma/client';
import NextAuth, { DefaultSession, type NextAuthConfig } from 'next-auth';
import { encode } from 'next-auth/jwt';
import microsoftEntraId from 'next-auth/providers/microsoft-entra-id';
import { UserService } from '~/features/users/user.service';
import { prisma } from '~/lib/prisma';

declare module 'next-auth' {
  interface User {
    firstName: PrismaUser['firstName'];
    lastName: PrismaUser['lastName'];
    fullName: PrismaUser['fullName'];
    username: PrismaUser['username'];
    role: PrismaUser['role'];
    avatar: PrismaUser['avatar'];
    avatarSource: PrismaUser['avatarSource'];
    onboardingStep: PrismaUser['onboardingStep'];
  }

  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends User {
    firstName: PrismaUser['firstName'];
    lastName: PrismaUser['lastName'];
    fullName: PrismaUser['fullName'];
    username: PrismaUser['username'];
    role: PrismaUser['role'];
    avatar: PrismaUser['avatar'];
    avatarSource: PrismaUser['avatarSource'];
    onboardingStep: PrismaUser['onboardingStep'];
  }
}

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    microsoftEntraId({
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      authorization: {
        params: {
          scope: 'openid profile email User.Read User.ReadBasic.All',
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
          avatarSource: user.avatarSource,
          onboardingStep: user.onboardingStep,
        },
      };
    },

    async signIn({ user, profile, account }) {
      if (!profile?.email || !user?.id || !profile.sub) return false;

      try {
        await prisma.session.deleteMany({});

        const existingUser = await prisma.user.findFirst({
          where: { azureAdId: profile.sub },
        });

        if (existingUser) {
          user.id = existingUser.id;

          const updateData: Partial<PrismaUser> = {
            lastLogin: new Date(),
          };

          if (existingUser.avatarSource === AvatarSource.MICROSOFT && account?.access_token) {
            const msAvatar = await UserService.fetchMicrosoftAvatar(account.access_token, existingUser.id);
            if (msAvatar) {
              updateData.avatar = msAvatar;
            }
          }

          await prisma.user.update({
            where: { id: existingUser.id },
            data: updateData,
          });

          return true;
        }

        const { firstName, lastName, username, fullName } = parseUserProfile(profile.name);
        const { avatar, avatarSource } = await getUserAvatar(user.id, account?.access_token);

        await createNewUser({
          userId: user.id,
          email: profile.email,
          azureAdId: profile.sub,
          firstName,
          lastName,
          username,
          fullName,
          avatar,
          avatarSource,
        });

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        throw new Error('Failed to sign in');
      }
    },
  },

  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = crypto.randomUUID();

        if (!params.token.sub) {
          throw new Error('No user ID found in token');
        }

        const existingSession = await prisma.session.findFirst({
          where: { userId: params.token.sub },
        });

        if (existingSession) {
          return existingSession.sessionToken;
        }

        const createdSession = await prisma.session.create({
          data: {
            sessionToken: sessionToken,
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        if (!createdSession) {
          throw new Error('Failed to create session');
        }

        return sessionToken;
      }
      return encode(params);
    },
  },
};

function parseUserProfile(profileName: string | null | undefined) {
  const nameMatch = profileName?.match(/([^,]+),\s*([^\s(]+)\s*\(([^)]+)\)/);
  const lastName = nameMatch?.[1]?.trim() ?? '';
  const firstName = nameMatch?.[2]?.trim() ?? '';
  const username = nameMatch?.[3]?.trim() ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return { firstName, lastName, username, fullName };
}

async function getUserAvatar(userId: string, accessToken?: string) {
  let avatar = await UserService.generateDefaultAvatar(userId);
  let avatarSource: AvatarSource = AvatarSource.DEFAULT;

  if (accessToken) {
    const msAvatar = await UserService.fetchMicrosoftAvatar(accessToken, userId);
    if (msAvatar) {
      avatar = msAvatar;
      avatarSource = AvatarSource.MICROSOFT;
    }
  }

  return { avatar, avatarSource };
}

async function createNewUser({
  userId,
  email,
  azureAdId,
  firstName,
  lastName,
  username,
  fullName,
  avatar,
  avatarSource,
}: {
  userId: User['id'];
  email: User['email'];
  azureAdId: User['azureAdId'];
  firstName: User['firstName'];
  lastName: User['lastName'];
  username: User['username'];
  fullName: User['fullName'];
  avatar: User['avatar'];
  avatarSource: User['avatarSource'];
}) {
  return prisma.user.create({
    data: {
      id: userId,
      email,
      azureAdId,
      username,
      fullName,
      firstName,
      lastName,
      avatar,
      avatarSource,
      role: Role.USER,
      notificationPreferences: { create: {} },
    },
  });
}

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
