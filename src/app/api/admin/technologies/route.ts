import { withApiAuth } from '~/lib/auth/protected-api';
import { Permission } from '~/lib/permissions';
import { TechnologyService } from '~/services/technology.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiAuth(req, Permission.VIEW_TECHNOLOGIES, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    return TechnologyService.getPendingTechnologies(userId, page, limit);
  });
}
