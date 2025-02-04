import { withApiAuth } from '~/lib/auth/protected-api';
import { ProfileService } from '~/services/profile.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiAuth(null, async (userId) => {
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
