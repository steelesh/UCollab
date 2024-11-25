import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";
import { PostService } from "~/services/post.service";
import { postSchema } from "~/schemas/post.schema";
import { z } from "zod";
import { type ApiResponse } from "~/types/api.types";
import { type PostResponse } from "~/types/post.types";

// api route that can return a single post or all posts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PostResponse | PostResponse[]>>
) {

  // auth check
  const session = await getServerAuthSession({ req, res });
  const userId = session?.user?.id;
  if (!userId) {
    return res.status(401).json({ data: null, error: "Unauthorized" });
  }

  // handle GET req
  switch (req.method) {
    case "GET":
      try {
        const posts = await PostService.getAllPosts();
        return res.status(200).json({ data: posts, error: null });
      } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({
          data: null,
          error: "Failed to fetch posts"
        });
      }

    // handle POST req
    case "POST":
      try {
        const validatedData = postSchema.parse(req.body);
        const post = await PostService.createPost(validatedData, userId);
        const postWithCount = {
          ...post,
          _count: {
            comments: 0,
          },
        };
        return res.status(201).json({ data: postWithCount, error: null });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ data: null, error: error });
        }
        console.error("Error creating post:", error);
        return res.status(500).json({
          data: null,
          error: "Failed to create post"
        });
      }

    // only allow GET and POST requests
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({
        data: null,
        error: `Method ${req.method} Not Allowed`
      });
  }
}
