import { type NextApiRequest, type NextApiResponse } from 'next';
import { auth } from '~/lib/auth';
import { PostService } from '~/services/post.service';
import { postSchema } from '~/schemas/post.schema';
import { z } from 'zod';
import { type ApiResponse } from '~/types/api.types';
import { type PostWithCommentsResponse } from '~/types/post.types';

// api route that can return a specific post
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PostWithCommentsResponse>>,
) {
  // auth check
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return res.status(401).json({ data: null, error: 'Unauthorized' });
  }

  // extract post id from query params
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ data: null, error: 'Invalid post ID' });
  }

  // handle GET req
  switch (req.method) {
    case 'GET':
      try {
        const post = await PostService.getPostById(id, userId);

        if (!post) {
          return res.status(404).json({ data: null, error: 'Post not found' });
        }

        return res.status(200).json({ data: post, error: null });
      } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({
          data: null,
          error: 'Failed to fetch post',
        });
      }

    // handle PUT req
    case 'PUT':
      try {
        const isOwner = await PostService.verifyPostOwner(id, userId);

        if (!isOwner) {
          return res.status(403).json({ data: null, error: 'Forbidden' });
        }

        const validatedData = postSchema.parse(req.body);
        const updatedPost = await PostService.updatePost(validatedData, { id });

        return res.status(200).json({ data: updatedPost, error: null });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ data: null, error: error });
        }
        console.error('Error updating post:', error);
        return res.status(500).json({
          data: null,
          error: 'Failed to update post',
        });
      }

    // handle DELETE req
    case 'DELETE':
      try {
        const isOwner = await PostService.verifyPostOwner(id, userId);

        if (!isOwner) {
          return res.status(403).json({ data: null, error: 'Forbidden' });
        }

        await PostService.deletePost(id, userId);
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({
          data: null,
          error: 'Failed to delete post',
        });
      }

    // only allow GET, PUT, and DELETE requests
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        data: null,
        error: `Method ${req.method} Not Allowed`,
      });
  }
}
