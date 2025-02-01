import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function isTest() {
  return process.env.NODE_ENV === "test";
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
