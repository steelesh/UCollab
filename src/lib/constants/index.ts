import { StatusCodes } from 'http-status-codes';

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = {
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
  PNG: 'image/png',
  WEBP: 'image/webp',
};

export const ErrorCode = {
  AUTHENTICATION: StatusCodes.UNAUTHORIZED,
  AUTHORIZATION: StatusCodes.FORBIDDEN,
  VALIDATION: StatusCodes.BAD_REQUEST,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
} as const;

export const ErrorMessage = {
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  INSUFFICIENT_ROLE: 'Insufficient role',
  MISSING_PERMISSION: (permission: string) => `Missing required permission: ${permission}`,

  VALIDATION_FAILED: 'Validation failed',
  INVALID_INPUT: 'Invalid input provided',

  NOT_FOUND: (resource: string) => `${resource} not found`,
  ALREADY_EXISTS: (resource: string) => `${resource} already exists`,

  OPERATION_FAILED: 'Operation failed',
  SERVER_ERROR: 'Internal server error',

  NOTIFICATION_QUEUE_FAILED: 'Failed to queue notification',
  NOTIFICATION_PREFERENCE_UPDATE_FAILED: 'Failed to update notification preferences',
} as const;
