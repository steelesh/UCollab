import { getContainerClient } from "~/config/storage";

export async function uploadProfilePhoto(buffer: Buffer, fileName: string): Promise<string> {
  const containerClient = await getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: 'image/jpeg' }
  });

  return blockBlobClient.url;
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
