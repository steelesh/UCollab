import { UserService } from '~/features/users/user.service';
import { Role } from '@prisma/client';
import { ErrorMessage } from '~/lib/constants';
import { AppError, AuthenticationError, AuthorizationError } from '~/lib/errors/app-error';
import { canAccess } from '~/auth/protected-role';

interface ResourceCheck {
  ownerId?: string;
  adminOnly?: boolean;
}

export async function withServiceAuth<T>(
  requestUserId: string | undefined,
  resourceCheck: ResourceCheck | null,
  action: () => Promise<T>,
): Promise<T> {
  if (!requestUserId) {
    throw new AuthenticationError();
  }

  if (resourceCheck) {
    const userRole = await UserService.getUserRole(requestUserId);

    if (resourceCheck.adminOnly && userRole !== Role.ADMIN) {
      throw new AuthorizationError(ErrorMessage.INSUFFICIENT_ROLE);
    }

    if (resourceCheck.ownerId && !canAccess(requestUserId, resourceCheck.ownerId, userRole)) {
      throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
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
