import { withApiAuth } from '~/lib/auth/protected-api';
import { Permission } from '~/lib/permissions';
import { ProfileService } from '~/services/profile.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiAuth(req, Permission.VIEW_ANY_PROFILE, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const query = searchParams.get('q');

    if (query) {
      return ProfileService.searchProfiles(query, userId, page, limit);
    }

    return ProfileService.getAllProfiles(userId, page, limit);
  });
}
