import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "~/lib/auth";
import { CommentService } from "~/services/comment.service";
import { commentSchema } from "~/schemas/comment.schema";
import { z } from "zod";
import { type ApiResponse } from "~/types/api.types";
import { type CommentResponse } from "~/types/comment.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CommentResponse | CommentResponse[]>>
) {

  // auth check
  const session = await getServerAuthSession({ req, res });
  const userId = session?.user?.id;
  if (!userId) {
    return res.status(401).json({ data: null, error: "Unauthorized" });
  }

  // extract post id from url
  const { id: postId } = req.query;
  if (typeof postId !== "string") {
    return res.status(400).json({ data: null, error: "Invalid post ID" });
  }

  // handle GET req
  switch (req.method) {
    case "GET":
      try {
        const comments = await CommentService.getComments(postId);
        return res.status(200).json({ data: comments, error: null });
      } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({
          data: null,
          error: "Failed to fetch comments",
        });
      }

    // handle POST req
    case "POST":
      try {
        const validatedData = commentSchema.parse(req.body);
        const comment = await CommentService.createComment(
          validatedData,
          postId,
          userId
        );
        return res.status(201).json({ data: comment, error: null });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ data: null, error: error });
        }
        console.error("Error creating comment:", error);
        return res.status(500).json({
          data: null,
          error: "Failed to create comment",
        });
      }

    // only allow GET and POST requests
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({
        data: null,
        error: `Method ${req.method} Not Allowed`,
      });
  }
}
