import { PrismaUser } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            firstName: PrismaUser["firstName"];
            lastName: PrismaUser["lastName"];
            fullName: PrismaUser["fullName"];
            username: PrismaUser["username"];
            role: PrismaUser["role"];
            avatar: PrismaUser["avatar"];
            onboardingStep: PrismaUser["onboardingStep"];
        } & DefaultSession["user"];
    }
}
