import { UserService } from "~/features/users/user.service";
import { AuthenticationError, AuthorizationError, ErrorMessage, Utils } from "~/lib/utils";

type ResourceCheck = {
  ownerId?: string;
};

export async function withServiceAuth<T>(
  requestUserId: string | undefined,
  resourceCheck: ResourceCheck | null,
  action: () => Promise<T>,
): Promise<T> {
  if (!requestUserId) {
    throw new AuthenticationError();
  }

  if (resourceCheck) {
    if (resourceCheck.ownerId && !(await UserService.canAccess(requestUserId, resourceCheck.ownerId))) {
      throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
    }
  }

  try {
    return await action();
  } catch (error) {
    if (error instanceof Utils) {
      throw error;
    }
    if (error instanceof Error) {
      throw new Utils(error.message);
    }
    throw new Utils(ErrorMessage.OPERATION_FAILED);
  }
}
