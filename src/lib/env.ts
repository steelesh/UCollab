/* eslint-disable node/no-process-env */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1).nullish(),
    AUTH_URL: z.string().url().nullish(),
    MYSQL_URL: z.string().url().nullish(),
    AZURE_STORAGE_CONNECTION_STRING: z.string().min(1).nullish(),
    AZURE_STORAGE_CONTAINER_NAME: z.string().min(1).nullish(),
    AUTH_MICROSOFT_ENTRA_ID_TENANT: z.string().min(1).nullish(),
    AUTH_MICROSOFT_ENTRA_ID_ID: z.string().min(1).nullish(),
    AUTH_MICROSOFT_ENTRA_ID_SECRET: z.string().min(1).nullish(),
    AUTH_MICROSOFT_ENTRA_ID_ISSUER: z.string().url().nullish(),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    MYSQL_URL: process.env.MYSQL_URL,
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
    AUTH_MICROSOFT_ENTRA_ID_TENANT: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT,
    AUTH_MICROSOFT_ENTRA_ID_ID: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    AUTH_MICROSOFT_ENTRA_ID_SECRET: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    AUTH_MICROSOFT_ENTRA_ID_ISSUER: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
