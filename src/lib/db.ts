import { PrismaClient } from "@prisma/client";
import { env } from "~/lib/env";

const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.VERCEL_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: env.MYSQL_URL,
      }
    },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.VERCEL_ENV !== "production") globalForPrisma.prisma = db;
