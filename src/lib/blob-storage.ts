import type { Buffer } from "node:buffer";

import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "~/lib/env";

const blobServiceClient = BlobServiceClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(env.AZURE_STORAGE_CONTAINER_NAME);

export const blobStorage = {
  async uploadProfilePhoto(buffer: Buffer, fileName: string): Promise<string> {
    return this.uploadFile({
      buffer,
      fileName,
      contentType: "image/jpeg",
      folder: "profile-photos",
    });
  },

  async uploadFile({
    buffer,
    fileName,
    contentType = "image/jpeg",
    folder = "",
  }: {
    buffer: Buffer;
    fileName: string;
    contentType?: string;
    folder?: string;
  }): Promise<string> {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;
      const blockBlobClient = containerClient.getBlockBlobClient(key);

      await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: {
          blobContentType: contentType,
          blobCacheControl: "public, max-age=31536000",
        },
      });

      return blockBlobClient.url;
    } catch (error) {
      console.error("Error uploading to blob storage:", error);
      throw error;
    }
  },
};
