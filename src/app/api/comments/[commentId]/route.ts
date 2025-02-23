import { withApiAuth } from '~/auth/protected-api';
import { CommentService } from '~/features/comments/comment.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { commentId: string } }) {
  return withApiAuth(null, async (userId) => {
    return CommentService.getComment(params.commentId, userId);
  });
}
