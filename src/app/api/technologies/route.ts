import { TechnologyService } from '~/features/technologies/technology.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') ?? '10');

  if (query) {
    return TechnologyService.searchVerifiedTechnologies(query, limit);
  }

  return TechnologyService.getVerifiedTechnologies();
}
