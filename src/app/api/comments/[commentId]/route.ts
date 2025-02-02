import { withApiAuth } from '~/lib/auth/protected-api';
import { Permission } from '~/lib/permissions';
import { CommentService } from '~/services/comment.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { commentId: string } }) {
  return withApiAuth(req, Permission.VIEW_POSTS, async (userId) => {
    return CommentService.getComment(params.commentId, userId);
  });
}
