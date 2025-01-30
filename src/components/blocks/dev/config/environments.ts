export interface EnvironmentInfo {
  name: string;
  description: string;
  url: string;
  color: string;
  services: string[];
  command: string;
  envFile: string;
}

export const environments: Record<string, EnvironmentInfo> = {
  local: {
    name: "Local Development",
    description: "Local development environment with hot-reload",
    url: "localhost:3000",
    color: "text-blue-500",
    services: ["MySQL", "MinIO", "Redis"],
    command: "npm run dev:local",
    envFile: ".env",
  },
  dev: {
    name: "Development",
    description: "Development environment mirroring dev.ucollab.xyz",
    url: "dev.ucollab.xyz",
    color: "text-green-500",
    services: ["MySQL", "MinIO", "Redis"],
    command: "npm run dev:dev",
    envFile: ".env.development",
  },
  test: {
    name: "Testing",
    description: "Testing environment mirroring test.ucollab.xyz",
    url: "test.ucollab.xyz",
    color: "text-yellow-500",
    services: ["MySQL", "MinIO", "Redis"],
    command: "npm run dev:test",
    envFile: ".env.test",
  },
  prod: {
    name: "Production",
    description: "Production environment mirroring ucollab.xyz",
    url: "ucollab.xyz",
    color: "text-red-500",
    services: ["MySQL", "MinIO", "Redis"],
    command: "npm run dev:prod",
    envFile: ".env.production",
  },
};
