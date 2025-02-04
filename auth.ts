import { PrismaAdapter } from '@auth/prisma-adapter';
import { AvatarSource, User as PrismaUser, Role } from '@prisma/client';
import NextAuth, { DefaultSession, type NextAuthConfig } from 'next-auth';
import { encode } from 'next-auth/jwt';
import microsoftEntraId from 'next-auth/providers/microsoft-entra-id';
import { prisma } from '~/data/prisma';
import { UserService } from '~/services/user.service';

declare module 'next-auth' {
  interface Session {
    user: {
      firstName: PrismaUser['firstName'];
      lastName: PrismaUser['lastName'];
      fullName: PrismaUser['fullName'];
      username: PrismaUser['username'];
      role: PrismaUser['role'];
      avatar: PrismaUser['avatar'];
      onboardingStep: PrismaUser['onboardingStep'];
    } & DefaultSession['user'];
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
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user = { ...session.user, ...user };
      }
      return session;
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
        }

        const nameMatch = profile.name?.match(/([^,]+),\s*([^\s(]+)\s*\(([^)]+)\)/);
        const lastName = nameMatch?.[1]?.trim() ?? '';
        const firstName = nameMatch?.[2]?.trim() ?? '';
        const username = nameMatch?.[3]?.trim() ?? '';
        const fullName = `${firstName} ${lastName}`.trim();

        let avatar = await UserService.generateDefaultAvatar(user.id);
        let avatarSource: AvatarSource = AvatarSource.DEFAULT;

        if (account?.access_token) {
          const msAvatar = await UserService.fetchMicrosoftAvatar(account.access_token, user.id);
          if (msAvatar) {
            avatar = msAvatar;
            avatarSource = AvatarSource.MICROSOFT;
          }
        }

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id,
              email: profile.email,
              azureAdId: profile.sub ?? '',
              username,
              fullName,
              firstName,
              lastName,
              avatar,
              avatarSource,
              role: Role.USER,
              profile: { create: {} },
              NotificationPreferences: { create: {} },
            },
          });
        } else {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              lastLogin: new Date(),
              avatar,
              avatarSource,
            },
          });
        }

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

  pages: {
    signIn: '/',
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
