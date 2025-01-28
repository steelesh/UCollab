import { PrismaAdapter } from "@auth/prisma-adapter";
import { AvatarSource, OnboardingStep, Role } from "@prisma/client";
import { type NextAuthConfig } from "next-auth";
import { encode } from "next-auth/jwt";
import credentials from "next-auth/providers/credentials";
import microsoftEntraId from "next-auth/providers/microsoft-entra-id";
import { db } from "./src/data/mysql";
import { getRequiredPermission } from "./src/lib/permissions";
import { isDevelopment } from "./src/lib/utils";
import { UserService } from "./src/services/user.service";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers: [
    ...(isDevelopment()
      ? [
          credentials({
            credentials: { userId: {} },
            async authorize(credentials) {
              if (!credentials?.userId) return null;
              return await db.user.findUnique({
                where: { id: credentials.userId as string },
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
      allowDangerousEmailAccountLinking: isDevelopment(),
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (isDevelopment() && account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (isDevelopment() && account?.provider === "credentials") {
        return true;
      }

      if (!profile?.email || !user?.id) return false;

      try {
        const existingUser = await db.user.findFirst({
          where: {
            OR: [
              { azureAdId: profile.sub ?? "" },
              { email: profile.email.toLowerCase() },
            ],
          },
        });

        const nameMatch = profile.name?.match(
          /([^,]+),\s*([^\s(]+)\s*\(([^)]+)\)/,
        );
        const lastName = nameMatch?.[1]?.trim() ?? "";
        const firstName = nameMatch?.[2]?.trim() ?? "";
        const username = nameMatch?.[3]?.trim() ?? "";
        const fullName = `${firstName} ${lastName}`.trim();

        let avatar = await UserService.generateDefaultAvatar(
          existingUser?.id ?? user.id,
        );
        let avatarSource: AvatarSource = AvatarSource.DEFAULT;

        if (account?.access_token) {
          const msAvatar = await UserService.fetchMicrosoftAvatar(
            account.access_token,
            existingUser?.id ?? user.id,
          );
          if (msAvatar) {
            avatar = msAvatar;
            avatarSource = AvatarSource.MICROSOFT;
          }
        }

        if (!existingUser) {
          await db.user.create({
            data: {
              id: user.id,
              email: profile.email.toLowerCase(),
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
          await db.user.update({
            where: { id: existingUser.id },
            data: {
              lastLogin: new Date(),
              azureAdId: profile.sub ?? existingUser.azureAdId,
              avatar,
              avatarSource,
            },
          });

          user.id = existingUser.id;
        }
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        throw new Error("Failed to sign in");
      }
    },
    authorized: async ({ auth, request: { nextUrl } }) => {
      if (!auth?.user) return true;

      const isOnboardingComplete =
        auth.user.onboardingStep === OnboardingStep.COMPLETE;
      const isOnboardingPage = nextUrl.pathname === "/onboarding";
      const isHomePage = nextUrl.pathname === "/";

      if (isHomePage && !isOnboardingComplete) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      const requiredPermission = getRequiredPermission(nextUrl.pathname);
      if (requiredPermission && !isOnboardingComplete) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      if (isOnboardingPage && isOnboardingComplete) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = crypto.randomUUID();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const existingSession = await db.session.findFirst({
          where: { userId: params.token.sub },
        });

        if (existingSession) {
          return existingSession.sessionToken;
        }

        const createdSession = await db.session.create({
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
    signIn: "/",
  },
};
