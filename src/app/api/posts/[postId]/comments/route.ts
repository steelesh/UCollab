import { withApiAuth } from '~/lib/auth/protected-api';
import { CommentService } from '~/services/comment.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  return withApiAuth(null, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    return CommentService.getPaginatedComments(params.postId, userId, page, limit);
  });
}
