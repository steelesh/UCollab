import { isDevelopment } from '~/lib/utils';
import { execSync } from 'child_process';

function getPortFromDocker(containerName: string): number | null {
  try {
    const command = `docker port ${containerName}`;
    const output = execSync(command).toString();
    const portMatch = output.match(/0.0.0.0:(\d+)/);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return portMatch ? parseInt(portMatch[1]) : null;
  } catch {
    return null;
  }
}

function getPrismaStudioPort(): number | null {
  try {
    const defaultPort = 5555;

    const command = `curl -s -o /dev/null -w "%{http_code}" http://localhost:${defaultPort}`;
    const status = execSync(command).toString();

    if (status === '200' || status === '404') {
      return defaultPort;
    }

    const netstatCommand = process.platform === 'win32' ? `netstat -ano | findstr :5555` : `netstat -anp | grep :5555`;

    execSync(netstatCommand);
    return defaultPort;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!isDevelopment()) {
    return Response.json({ error: 'Only available in local development' }, { status: 403 });
  }

  const ports = {
    prismaStudio: getPrismaStudioPort(),
    minio: getPortFromDocker('ucollab-minio'),
    redisCommander: getPortFromDocker('ucollab-redis-commander'),
  };

  return Response.json(ports);
}
