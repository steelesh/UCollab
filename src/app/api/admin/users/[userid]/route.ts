import { withApiAuth } from '~/auth/protected-api';
import { UserService } from '~/features/users/user.service';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  return withApiAuth({ adminOnly: true }, async (requestUserId) => {
    return UserService.getAdminUserDetails(params.userId, requestUserId);
  });
}
