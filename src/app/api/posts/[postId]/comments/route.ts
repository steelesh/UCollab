import { withApiAuth } from '~/lib/auth/protected-api';
import { Permission } from '~/lib/permissions';
import { CommentService } from '~/services/comment.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  return withApiAuth(req, Permission.VIEW_POSTS, async (userId) => {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    return CommentService.getPaginatedComments(params.postId, userId, page, limit);
  });
}
