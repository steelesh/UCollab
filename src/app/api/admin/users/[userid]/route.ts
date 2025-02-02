import { withApiAuth } from '~/lib/auth/protected-api';
import { Permission } from '~/lib/permissions';
import { UserService } from '~/services/user.service';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  return withApiAuth(_req, Permission.VIEW_USERS, async (requestUserId) => {
    return UserService.getAdminUserDetails(params.userId, requestUserId);
  });
}
