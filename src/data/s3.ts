import {
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { env } from '~/lib/env';

interface S3UploadParams {
  buffer: Buffer;
  fileName: string;
  contentType?: string;
  folder?: string;
}

type S3UploadResponse = string;

export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: process.env.NODE_ENV === 'development',
});

function getFileUrl(key: string): string {
  return process.env.NODE_ENV === 'development'
    ? `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${key}`
    : `https://${env.S3_BUCKET_NAME}.${env.S3_ENDPOINT}/${key}`;
}

export const s3 = {
  async uploadProfilePhoto(
    buffer: Buffer,
    fileName: string,
  ): Promise<S3UploadResponse> {
    return this.uploadFile({
      buffer,
      fileName,
      contentType: 'image/jpeg',
      folder: 'profile-photos',
    });
  },

  async uploadFile({
    buffer,
    fileName,
    contentType = 'image/jpeg',
    folder = '',
  }: S3UploadParams): Promise<S3UploadResponse> {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;

      const params = {
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000',
      };

      await s3Client.send(new PutObjectCommand(params));

      return getFileUrl(key);
    } catch (error) {
      console.error('Error uploading to blob storage:', error);
      throw error;
    }
  },

  getFileUrl,

  async setBucketPublicReadAccess(bucketName: string): Promise<void> {
    const publicReadPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(publicReadPolicy),
      }),
    );
  },

  async initializeBucket(): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      try {
        await s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: env.S3_BUCKET_NAME,
            Policy: JSON.stringify({
              Version: '2012-10-17',
              Statement: [
                {
                  Sid: 'PublicRead',
                  Effect: 'Allow',
                  Principal: '*',
                  Action: ['s3:GetObject'],
                  Resource: [`arn:aws:s3:::${env.S3_BUCKET_NAME}/*`],
                },
              ],
            }),
          }),
        );
      } catch (error) {
        throw error;
      }
    }
  },
};

export async function setBucketPublicReadAccess(
  bucketName: string,
): Promise<void> {
  const publicReadPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicRead',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(publicReadPolicy),
    }),
  );
}
