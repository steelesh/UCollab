import { PrismaClient } from '@prisma/client';
import { env } from '~/lib/env';
import { isDevelopment } from '~/lib/utils';

const createPrismaClient = () =>
  new PrismaClient({
    log: isDevelopment() ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      prisma: {
        url: env.MYSQL_URL,
      },
    },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (isDevelopment()) globalForPrisma.prisma = prisma;
