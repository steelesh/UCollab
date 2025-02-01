import { ErrorCode, ErrorMessage } from "../constants";

export class AppError extends Error {
  constructor(
    message: string = ErrorMessage.SERVER_ERROR,
    public statusCode: number = ErrorCode.SERVER_ERROR,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = ErrorMessage.AUTHENTICATION_REQUIRED) {
    super(message, ErrorCode.AUTHENTICATION);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = ErrorMessage.INSUFFICIENT_PERMISSIONS) {
    super(message, ErrorCode.AUTHORIZATION);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = ErrorMessage.VALIDATION_FAILED,
    public errors?: unknown,
  ) {
    super(message, ErrorCode.VALIDATION);
  }
}
