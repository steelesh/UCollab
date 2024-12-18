import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { env } from '~/env';

const s3Client = new S3Client({
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: env.SPACES_SECRET_ACCESS_KEY
  },
  forcePathStyle: false
});

export async function uploadProfilePhoto(buffer: Buffer, fileName: string): Promise<string> {
  try {
    const params = {
      Bucket: env.SPACES_BUCKET_NAME,
      Key: `profile-photos/${fileName}`,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: ObjectCannedACL.public_read
    };

    await s3Client.send(new PutObjectCommand(params));

    return `${env.SPACES_ENDPOINT}/profile-photos/${fileName}`;
  } catch (error) {
    console.error('Error uploading to blob storage:', error);
    throw error;
  }
}

export async function getHighResProfilePhoto(accessToken: string, userId: string): Promise<string | null> {
  try {
    const response = await fetch(
      "https://graph.microsoft.com/v1.0/me/photo/$value",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) return null;

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const fileName = `${userId}-${Date.now()}.jpg`;

    try {
      return await uploadProfilePhoto(buffer, fileName);
    } catch (error) {
      console.error("Error uploading to blob storage:", error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile photo:", error);
    return null;
  }
}
