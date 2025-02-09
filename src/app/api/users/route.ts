import { withApiAuth } from '~/lib/auth/protected-api';
import { UserService } from '~/services/user.service';
import { NextRequest } from 'next/server';

const USERS_PER_PAGE = 12;

export async function GET(req: NextRequest) {
  return withApiAuth(null, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') ?? '0');
    const limit = parseInt(searchParams.get('limit') ?? String(USERS_PER_PAGE));

    if (query) {
      return UserService.searchUsers(query, userId, limit);
    }

    if (searchParams.has('page')) {
      const users = await UserService.getPaginatedUsers(page, limit, userId);

      if (page === 0) {
        return users.sort((a, b) => {
          if (a.id === userId) return -1;
          if (b.id === userId) return 1;
          return b.createdDate.getTime() - a.createdDate.getTime();
        });
      }

      return users;
    }

    return UserService.getUsers(userId);
  });
}
