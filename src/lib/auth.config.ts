import { PrismaAdapter } from "@auth/prisma-adapter";
import { AvatarSource, Role } from "@prisma/client";
import { type NextAuthConfig } from "next-auth";
import { encode } from "next-auth/jwt";
import credentials from "next-auth/providers/credentials";
import microsoftEntraId from "next-auth/providers/microsoft-entra-id";
import { prisma } from "~/lib/prisma";
import { isLocalEnv } from "~/lib/utils";
import { UserService } from "~/services/user.service";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    ...(isLocalEnv()
        ? [
          credentials({
            credentials: { userId: {} },
            async authorize(credentials) {
              if (!credentials?.userId) return null;
              return prisma.user.findUnique({
                where: {id: credentials.userId as string},
              });
            },
          }),
        ]
        : []),
    microsoftEntraId({
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email User.Read User.ReadBasic.All",
        },
      },
      allowDangerousEmailAccountLinking: isLocalEnv(),
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (isLocalEnv() && account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user && user) {
        session.user.role = user.role;
        session.user.username = user.username;
        session.user.profile = user.profile;
      }
      return session;
    },
    async signIn({ user, profile, account }) {
      if (isLocalEnv() && account?.provider === "credentials") return true;

      if (!profile?.email || !user?.id || !profile.sub) return false;

      try {
        await prisma.session.deleteMany({});

        const existingUser = await prisma.user.findFirst({
          where: { azureAdId: profile.sub },
        });

        if (existingUser) {
          user.id = existingUser.id;
        }

        const nameMatch = profile.name?.match(
            /([^,]+),\s*([^\s(]+)\s*\(([^)]+)\)/,
        );
        const lastName = nameMatch?.[1]?.trim() ?? "";
        const firstName = nameMatch?.[2]?.trim() ?? "";
        const username = nameMatch?.[3]?.trim() ?? "";
        const fullName = `${firstName} ${lastName}`.trim();

        let avatar = await UserService.generateDefaultAvatar(user.id);
        let avatarSource: AvatarSource = AvatarSource.DEFAULT;

        if (account?.access_token) {
          const msAvatar = await UserService.fetchMicrosoftAvatar(
              account.access_token,
              user.id,
          );
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
              azureAdId: profile.sub ?? "",
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
        console.error("Sign in error:", error);
        throw new Error("Failed to sign in");
      }
    },
  },

  jwt: {
    encode: async function (params) {
      if (!params.token) {
        params.token = {};
      }

      if (params.token.credentials) {
        const sessionToken = crypto.randomUUID();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
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
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }

      return encode(params);
    },
  },

  pages: {
    signIn: isLocalEnv() ? "/u" : "/",
  },
};
