import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    MYSQL_HOST: z.string().min(1),
    MYSQL_PORT: z.coerce.number(),
    MYSQL_USER: z.string().min(1),
    MYSQL_PASSWORD: z.string().min(1),
    MYSQL_DATABASE: z.string().min(1),
    MYSQL_URL: z.string().url(),
    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_COMMANDER_PORT: z.coerce.number(),
    REDIS_URL: z.string().url(),
    S3_PORT: z.coerce.number(),
    S3_HOST: z.string().min(1),
    S3_ENDPOINT: z.string().url(),
    S3_REGION: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_DEPLOY_ENV: z.enum(['local', 'dev', 'test', 'prod']),
  },
  runtimeEnv: {
    NEXT_PUBLIC_DEPLOY_ENV: process.env.NEXT_PUBLIC_DEPLOY_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_URL: process.env.MYSQL_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_COMMANDER_PORT: process.env.REDIS_COMMANDER_PORT,
    REDIS_URL: process.env.REDIS_URL,
    S3_PORT: process.env.S3_PORT,
    S3_HOST: process.env.S3_HOST,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

export function isDevelopment() {
  return env.NEXT_PUBLIC_DEPLOY_ENV === 'dev';
}

export function isTest() {
  return env.NEXT_PUBLIC_DEPLOY_ENV === 'test';
}

export function isProduction() {
  return env.NEXT_PUBLIC_DEPLOY_ENV === 'prod';
}
