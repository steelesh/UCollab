import { withApiAuth } from '~/auth/protected-api';
import { PostService } from '~/features/posts/post.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  return withApiAuth(null, async (userId) => {
    return PostService.getPostById(params.postId, userId);
  });
}
