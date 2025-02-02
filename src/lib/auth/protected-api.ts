import { auth } from '~/lib/auth/auth';
import { UserService } from '~/services/user.service';
import { type NextRequest } from 'next/server';
import { ErrorCode, ErrorMessage } from '../constants';
import { AppError, AuthenticationError, AuthorizationError } from '../errors/app-error';
import { type Permission } from '../permissions';

export async function withApiAuth<T>(
  req: NextRequest,
  permission: Permission | null,
  handler: (userId: string) => Promise<T>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    if (permission) {
      const hasPermission = await UserService.hasPermission(session.user.id, permission);
      if (!hasPermission) {
        throw new AuthorizationError(ErrorMessage.MISSING_PERMISSION(permission));
      }
    }

    const result = await handler(session.user.id);
    return Response.json({
      data: result,
      error: null,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
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
