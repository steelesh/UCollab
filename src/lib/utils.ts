import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * merges class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * checks if the current environment is development
 */
export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * checks if the current environment is production
 */
export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * fetcher function for fetching data from api endpoints (e.g. for SWR)
 */
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
