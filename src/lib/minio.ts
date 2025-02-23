import { S3Client } from '@aws-sdk/client-s3';
import { env, isDevelopment } from '~/lib/env';

export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: isDevelopment(),
});

const globalForMinio = globalThis as unknown as {
  minioClient: S3Client | undefined;
};

export const minioClient = globalForMinio.minioClient ?? s3Client;

if (isDevelopment()) {
  globalForMinio.minioClient = minioClient;
}
