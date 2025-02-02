import { env } from './env';

/**
 * checks if the current environment is local
 */
export function isLocalEnv() {
  return env.NEXT_PUBLIC_DEPLOY_ENV === 'local';
}

/**
 * checks if the current environment is dev
 */
export function isDevEnv() {
  return env.NEXT_PUBLIC_DEPLOY_ENV === 'dev';
}

/**
 * checks if the current environment is test
 */
export function isTestEnv() {
  return env.NEXT_PUBLIC_DEPLOY_ENV === 'test';
}

/**
 * checks if the current environment is prod
 */
export function isProdEnv() {
  return env.NEXT_PUBLIC_DEPLOY_ENV === 'prod';
}

/**
 * fetcher function for fetching data from api endpoints (e.g. for SWR)
 */
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
