import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession, type DefaultUser,
  getServerSession,
  type NextAuthOptions
} from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { env } from "~/env";
import { getHighResProfilePhoto } from "~/lib/utils/user-photo";
import { db } from "~/lib/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    AzureADProvider({
      clientId: env.AZURE_AD_CLIENT_ID,
      clientSecret: env.AZURE_AD_CLIENT_SECRET,
      tenantId: env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email User.Read User.ReadBasic.All",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "azure-ad" && profile) {
        try {
          const username = user.email?.split("@")[0] ?? "";
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
            include: {
              accounts: true,
            },
          });
          const profilePhotoUrl = account.access_token
            ? await getHighResProfilePhoto(
              account.access_token,
              existingUser?.id ?? "temp"
            )
            : user.image;
          if (existingUser) {
            if (
              !existingUser.accounts.some((acc) => acc.provider === "azure-ad")
            ) {
              await db.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              });
            }
            await db.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                image: profilePhotoUrl ?? user.image,
                lastLogin: new Date(),
                username,
                azureAdId: profile.sub,
              },
            });
          } else {
            await db.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: profilePhotoUrl ?? user.image,
                username,
                azureAdId: profile.sub,
                allowNotifications: true,
                verifiedEmail: false,
                profile: {
                  create: {
                    bio: "",
                    skills: [],
                    interests: [],
                  },
                },
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                  },
                },
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Sign in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          id: user.id,
          email: user.email,
          username: user.email?.split("@")[0] ?? "",
          image: user.image,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email,
          image: token.image as string,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
