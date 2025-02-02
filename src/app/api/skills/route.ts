import { SkillService } from '~/services/skill.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  if (query) {
    return SkillService.searchSkills(query, limit);
  }

  return SkillService.getAllSkills();
}
