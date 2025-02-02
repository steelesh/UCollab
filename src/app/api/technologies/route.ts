import { TechnologyService } from '~/services/technology.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const popular = searchParams.get('popular') === 'true';

  if (popular) {
    return TechnologyService.getPopularTechnologies(limit);
  }

  if (query) {
    return TechnologyService.searchVerifiedTechnologies(query, limit);
  }

  return TechnologyService.getVerifiedTechnologies();
}
