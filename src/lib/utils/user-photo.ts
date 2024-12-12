import { put } from '@vercel/blob';

export async function uploadProfilePhoto(buffer: Buffer, fileName: string): Promise<string> {
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const { url } = await put(fileName, blob, {
    access: 'public',
    contentType: 'image/jpeg'
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return url;
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
