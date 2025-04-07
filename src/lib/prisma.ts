import { PrismaClient } from "@prisma/client";

import { env } from "~/lib/env";

function createPrismaClient() {
  return new PrismaClient({
    log: ["error", "info", "query", "warn"],
    datasources: {
      prisma: {
        url: env.MYSQL_URL,
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
