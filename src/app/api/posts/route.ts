import { withApiAuth } from '~/auth/protected-api';
import { PostService } from '~/features/posts/post.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiAuth(null, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const query = searchParams.get('q');
    const tech = searchParams.get('tech');
    const authorId = searchParams.get('authorId');

    if (query) {
      return PostService.searchPosts(query, userId, page, limit);
    }

    if (tech) {
      return PostService.getPostsByTechnology(tech, userId);
    }

    if (authorId) {
      return PostService.getPostsByUser(authorId, userId);
    }

    return PostService.getPaginatedPosts(page, limit, userId);
  });
}
