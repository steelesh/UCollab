import type { ClassValue } from "clsx";

import { NeedType } from "@prisma/client";
import { clsx } from "clsx";
import { StatusCodes } from "http-status-codes";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = {
  JPEG: "image/jpeg",
  JPG: "image/jpg",
  PNG: "image/png",
  WEBP: "image/webp",
};
export const DEFAULT_POST_BANNER_IMAGE = "https://ucollab.blob.core.windows.net/ucollab-files/post-banners/default-banner.jpg";

export const ErrorCode = {
  AUTHENTICATION: StatusCodes.UNAUTHORIZED,
  AUTHORIZATION: StatusCodes.FORBIDDEN,
  VALIDATION: StatusCodes.BAD_REQUEST,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
} as const;

export const ErrorMessage = {
  AUTHENTICATION_REQUIRED: "Authentication required",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  MISSING_PERMISSION: (permission: string) => `Missing required permission: ${permission}`,

  VALIDATION_FAILED: "Validation failed",
  INVALID_INPUT: "Invalid input provided",

  NOT_FOUND: (resource: string) => `${resource} not found`,
  ALREADY_EXISTS: (resource: string) => `${resource} already exists`,

  OPERATION_FAILED: "Operation failed",
  SERVER_ERROR: "Internal server error",

  NOTIFICATION_QUEUE_FAILED: "Failed to queue notification",
  NOTIFICATION_PREFERENCE_UPDATE_FAILED: "Failed to update notification preferences",
} as const;

export class Utils extends Error {
  constructor(
    message: string = ErrorMessage.SERVER_ERROR,
    public statusCode: number = ErrorCode.SERVER_ERROR,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends Utils {
  constructor(message: string = ErrorMessage.AUTHENTICATION_REQUIRED) {
    super(message, ErrorCode.AUTHENTICATION);
  }
}

export class AuthorizationError extends Utils {
  constructor(message: string = ErrorMessage.INSUFFICIENT_PERMISSIONS) {
    super(message, ErrorCode.AUTHORIZATION);
  }
}

export class ValidationError extends Utils {
  constructor(
    message: string = ErrorMessage.VALIDATION_FAILED,
    public errors?: unknown,
  ) {
    super(message, ErrorCode.VALIDATION);
  }
}

export function handleServerActionError(error: unknown) {
  if (error instanceof Error && error.message === "NEXT_REDIRECT") {
    throw error;
  }
  if (error instanceof Utils)
    throw error;
  throw new Utils(ErrorMessage.OPERATION_FAILED);
}

export const NOTIFICATION_COUNT_CHANGED = "notification-count-changed";
export function emitNotificationCountChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_COUNT_CHANGED));
  }
}

export function isProjectNeedType(type: NeedType | string | null | undefined): boolean {
  return type === NeedType.FEEDBACK || type === NeedType.CONTRIBUTION;
}
