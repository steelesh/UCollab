import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob";
import { env } from "~/env";

export async function getBlobServiceClient(): Promise<BlobServiceClient> {
  return BlobServiceClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING);
}

export async function getContainerClient(containerName: string = env.AZURE_STORAGE_CONTAINER): Promise<ContainerClient> {
  const blobServiceClient = await getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(containerName);

  if (env.NODE_ENV === "development") {
    await containerClient.createIfNotExists({
      access: 'container'
    });
  }

  return containerClient;
}
