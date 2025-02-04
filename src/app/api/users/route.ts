import { withApiAuth } from '~/lib/auth/protected-api';
import { Permission } from '~/lib/permissions';
import { UserService } from '~/services/user.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiAuth(req, Permission.VIEW_USERS_LIST, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') ?? '5');

    if (query) {
      return UserService.searchUsers(query, userId, limit);
    }

    return UserService.getUsers(userId);
  });
}
