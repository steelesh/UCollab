import { UserService } from '~/features/users/user.service';
import { Role } from '@prisma/client';
import { ErrorCode, ErrorMessage, Utils, AuthenticationError, AuthorizationError } from '~/lib/utils';
import { auth } from '../../auth';

interface ResourceCheck {
  ownerId?: string;
  adminOnly?: boolean;
}

export async function withApiAuth<T>(resourceCheck: ResourceCheck | null, handler: (userId: string) => Promise<T>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    if (resourceCheck) {
      const userRole = await UserService.getUserRole(session.user.id);

      if (resourceCheck.adminOnly && userRole !== Role.ADMIN) {
        throw new AuthorizationError(ErrorMessage.INSUFFICIENT_ROLE);
      }

      if (resourceCheck.ownerId && session.user.id !== resourceCheck.ownerId && userRole !== Role.ADMIN) {
        throw new AuthorizationError(ErrorMessage.INSUFFICIENT_PERMISSIONS);
      }
    }

    const result = await handler(session.user.id);
    return Response.json({
      data: result,
      error: null,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Utils) {
      return Response.json(
        {
          data: null,
          error: error.message,
        },
        {
          status: error.statusCode,
        },
      );
    }

    return Response.json(
      {
        data: null,
        error: ErrorMessage.SERVER_ERROR,
      },
      {
        status: ErrorCode.SERVER_ERROR,
      },
    );
  }
}
