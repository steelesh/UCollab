import { withApiAuth } from '~/lib/auth/protected-api';
import { Permission } from '~/lib/permissions';
import { PostService } from '~/services/post.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  return withApiAuth(req, Permission.VIEW_POSTS, async (userId) => {
    return PostService.getPostById(params.postId, userId);
  });
}
