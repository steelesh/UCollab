export interface ServicePorts {
  prismaStudio: number | null;
  minio: number | null;
  redisCommander: number | null;
}

export interface Service {
  name: string;
  getUrl: (ports: ServicePorts) => string | null;
  description: string;
  docs: string;
  purpose: string;
}

export const services: Service[] = [
  {
    name: "Prisma Studio",
    description: "Database management interface for viewing and editing data",
    purpose:
      "Provides a visual interface to manage your database records and relationships",
    docs: "https://www.prisma.io/studio",
    getUrl: (ports) =>
      ports.prismaStudio ? `http://localhost:${ports.prismaStudio}` : null,
  },
  {
    name: "MinIO Console",
    description: "Object storage service for file uploads (S3 compatible)",
    purpose: "Handles file storage and serves as a local alternative to AWS S3",
    docs: "https://min.io/docs/minio/container/index.html",
    getUrl: (ports) => (ports.minio ? `http://localhost:${ports.minio}` : null),
  },
  {
    name: "Redis Commander",
    description: "Redis database interface for caching and queue management",
    purpose: "Helps monitor and manage Redis cache and message queues",
    docs: "https://joeferner.github.io/redis-commander/",
    getUrl: (ports) =>
      ports.redisCommander ? `http://localhost:${ports.redisCommander}` : null,
  },
];
