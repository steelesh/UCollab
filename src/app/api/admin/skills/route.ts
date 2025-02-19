import { withApiAuth } from '~/auth/protected-api';
import { SkillService } from '~/features/skills/skill.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiAuth(null, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    return SkillService.getPendingSkills(userId, page, limit);
  });
}
