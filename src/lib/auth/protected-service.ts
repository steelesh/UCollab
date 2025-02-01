import { UserService } from "~/services/user.service";
import { ErrorMessage } from "../constants";
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
} from "../errors/app-error";
import { type Permission, hasPermission } from "../permissions";

export async function withServiceAuth<T>(
    requestUserId: string | undefined,
    permission: Permission | null,
    action: () => Promise<T>,
): Promise<T> {
  if (!requestUserId) {
    throw new AuthenticationError();
  }

  if (permission) {
    const userRole = await UserService.getUserRole(requestUserId);

    if (!hasPermission(userRole, permission)) {
      throw new AuthorizationError(ErrorMessage.MISSING_PERMISSION(permission));
    }
  }

  try {
    return await action();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new AppError(error.message);
    }
    throw new AppError(ErrorMessage.OPERATION_FAILED);
  }
}
