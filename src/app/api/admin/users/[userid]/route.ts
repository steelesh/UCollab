import { withApiAuth } from '~/lib/auth/protected-api';
import { UserService } from '~/services/user.service';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  return withApiAuth({ adminOnly: true }, async (requestUserId) => {
    return UserService.getAdminUserDetails(params.userId, requestUserId);
  });
}
