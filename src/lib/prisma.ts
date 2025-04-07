import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";

import { env } from "~/lib/env";

function createPrismaClient() {
  return new PrismaClient({
    log: ["error", "info", "query", "warn"],
    datasources: {
      prisma: {
        url: env.MYSQL_URL,
      },
    },
  }).$extends(
    withOptimize({ apiKey: env.OPTIMIZE_API_KEY }),
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
